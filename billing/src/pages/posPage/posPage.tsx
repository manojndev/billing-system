import React, { useEffect, useState } from 'react';
import 'daisyui/dist/full.css';
import './css/style.css';
import { fetchAllItems, getOrderCount, insertOrder } from '../../service/service';
import moment from 'moment-timezone';
import { sendPrintJob } from '../../service/printService'; // Import the sendPrintJob function

interface Item {
  id: string;
  name: string;
  priceExcludingTax?: number; // Change price to priceExcludingTax
  qty?: number;
  customQuantity?: 'yes' | 'no';
  predefinedQuantities?: number[];
  unit?: string;
  taxPercentage?: number;
}

interface PrintItem {
  name: string;
  qty: number;
  price: number;
  gst: number;
  amount_with_gst: number;
}

interface PrintJob {
  items: PrintItem[];
  total: number;
}

const ITEMS_PER_PAGE = 25;

const PosPage: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'garden'>('garden');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [order, setOrder] = useState<Item[]>([]);
  const [totOrders, setTotOrders] = useState(0);
  const [activeTab, setActiveTab] = useState<'items'>('items');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [customQty, setCustomQty] = useState<string>('');
  const [inputMode, setInputMode] = useState<'quantity' | 'price'>('quantity');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [counterLoading, setCounterLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [countdown, setCountdown] = useState(60); // Countdown timer in seconds
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const getTimestamp = () => {
    return new Date().toISOString();
  };

  const getFormattedTimestamp = () => {
    return moment().tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss A');
  };

  const addToOrder = (item: Item, qty: number) => {
    if (qty <= 0) return; // Prevent adding zero quantity

    const updatedOrder = [...order];
    const existingItem = updatedOrder.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 0) + qty;
    } else {
      item.qty = qty;
      updatedOrder.push(item);
    }
    setOrder(updatedOrder);
  };

  const handleItemClick = (item: Item) => {
    if (item.customQuantity === 'yes') {
      setSelectedItem(item);
      setShowModal(true);
    } else {
      addToOrder(item, 1);
    }
  };

  const handleConfirmQty = () => {
    if (selectedItem) {
      let qty = parseFloat(customQty);
      if (inputMode === 'price' && selectedItem.priceExcludingTax && selectedItem.priceExcludingTax > 0) {
        qty = parseFloat(customPrice) / selectedItem.priceExcludingTax;
      }

      if (qty > 0) {
        addToOrder(selectedItem, qty);
        setShowModal(false);
        setCustomQty('');
        setCustomPrice('');
        setSelectedItem(null);
        setInputMode('quantity');
      }
    }
  };

  const removeOneEntity = (item: Item) => {
    const updatedOrder = order
      .map((i) => {
        if (i.id === item.id) {
          i.qty = (i.qty || 0) - 1;
        }
        return i;
      })
      .filter((i) => i.qty && i.qty > 0);
    setOrder(updatedOrder);
  };

  const removeItem = (item: Item) => {
    const updatedOrder = order.filter((i) => i.id !== item.id);
    setOrder(updatedOrder);
  };

  const getTotal = () => {
    return order.reduce((total, i) => {
      const itemTotal = (i.priceExcludingTax || 0) * (i.qty || 1);
      const taxAmount = itemTotal * ((i.taxPercentage || 0) / 100);
      return total + itemTotal + taxAmount;
    }, 0);
  };

  const clearOrder = () => {
    setOrder([]);
  };

  const checkout = () => {
    setIsCheckoutLoading(true);
    const orderData = {
      date: getTimestamp(),
      orderNumber: totOrders + 1,
      items: order,
      totalAmount: getTotal().toFixed(2),
    };

    insertOrder(orderData)
      .then(() => {
        setTotOrders(totOrders + 1);
        // Map order items to print items
        const printItems: PrintItem[] = order.map((item) => ({
          name: item.name,
          qty: item.qty || 0,
          price: item.priceExcludingTax || 0,
          gst: item.taxPercentage || 0,
          amount_with_gst: ((item.priceExcludingTax || 0) * (item.qty || 1) * (1 + (item.taxPercentage || 0) / 100)),
        }));

        // Create print job
        const printJob: PrintJob = {
          items: printItems,
          total: parseFloat(orderData.totalAmount),
        };

        // Send print job
        return sendPrintJob(printJob);
      })
      .catch((error) => {
        console.error("Failed to insert order:", error);
        alert("Failed to process order. Please try again.");
      })
      .finally(() => {
        setIsCheckoutLoading(false);
      });
  };

  const startNewBill = () => {
    clearOrder();
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    getOrderCount()
      .then((count) => {
        setTotOrders(count + 1);
      })
      .finally(() => {
        setCounterLoading(false);
      });

    fetchAllItems().then((val) => {
      console.log("sam valton", val);
      setItems(val);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && showModal) {
        handleConfirmQty();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showModal, selectedItem, customQty, customPrice, inputMode]);

  return (
    <div className="container mx-auto p-4">
      {counterLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Enter Quantity or Price for {selectedItem?.name}</h3>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Quantity</span>
                <input
                  type="radio"
                  name="inputMode"
                  className="radio checked:bg-blue-500"
                  checked={inputMode === 'quantity'}
                  onChange={() => setInputMode('quantity')}
                />
              </label>
              <label className="label cursor-pointer">
                <span className="label-text">Price</span>
                <input
                  type="radio"
                  name="inputMode"
                  className="radio checked:bg-blue-500"
                  checked={inputMode === 'price'}
                  onChange={() => setInputMode('price')}
                />
              </label>
            </div>

            {inputMode === 'quantity' ? (
              <input
                type="number"
                min="1"
                className="input input-bordered w-full mt-4"
                value={customQty}
                onChange={(e) => setCustomQty(e.target.value)}
              />
            ) : (
              <input
                type="number"
                min="1"
                className="input input-bordered w-full mt-4"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
              />
            )}

            {selectedItem?.predefinedQuantities && (
              <div className="mt-4">
                {selectedItem.predefinedQuantities.map((quantity) => (
                  <button
                    key={quantity}
                    className="btn btn-outline mr-2"
                    onClick={() => {
                      addToOrder(selectedItem, quantity);
                      setShowModal(false);
                    }}
                  >
                    {quantity} {selectedItem.unit}
                  </button>
                ))}
              </div>
            )}

            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleConfirmQty}>
                OK
              </button>
              <button className="btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="navbar bg-base-200 rounded-lg">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Selvam broilers POS Demo</a>
        </div>
        <div className="flex-none">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setTheme(theme === 'dark' ? 'garden' : 'dark')}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="box">
          <div className="text-info flex justify-between">
            <span className="font-bold text-black">Order Summary</span>
            <span className="font-bold text-black">Today: {getFormattedTimestamp()}</span>
            <span className="font-bold text-black">
              Total Orders: <span className="badge badge-primary">{totOrders+1}</span>
            </span>
          </div>

          <div className="overflow-auto max-h-64 mt-4">
            {order.length === 0 && <div className="text-warning">Nothing ordered yet!</div>}

            <table className="table w-full bg-base-100 rounded-box">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Tax %</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item) => (
                  <tr key={item.id} className="hover">
                    <td>{item.name}</td>
                    <td className="text-center">₹{item.priceExcludingTax?.toFixed(2) || 'N/A'}</td>
                    <td className="text-center">
                      <span className="badge badge-info">
                        {item.qty?.toFixed(2)} {item.unit}
                      </span>
                    </td>
                    <td className="text-center">{item.taxPercentage || 0}%</td>
                    <td className="text-center">₹{((item.priceExcludingTax || 0) * (item.qty || 1) * (1 + (item.taxPercentage || 0) / 100)).toFixed(2)}</td>
                    <td className="flex justify-center space-x-1">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => addToOrder(item, 1)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => removeOneEntity(item)}
                      >
                        -
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => removeItem(item)}>
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xl font-bold text-right mt-4">
            Total: ₹{getTotal().toFixed(2)}
          </div>
          <div className="flex justify-between mt-4">
            <button className="btn btn-primary" onClick={startNewBill}>
              <span className="text-xl">+</span> New Bill
            </button>

            <button className="btn btn-success" onClick={checkout} disabled={order.length === 0 || isCheckoutLoading}>
              {isCheckoutLoading ? 'Processing...' : 'Print'}
            </button>
          </div>
        </div>

        <div className="box">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search Items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {currentItems.map((item) => (
              <button
                key={item.id}
                className="btn btn-outline"
                onClick={() => handleItemClick(item)}
              >
                {item.name} - ₹{item.priceExcludingTax?.toFixed(2) || 'N/A'}
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">

      </div>
    </div>
  );
};

export default PosPage;