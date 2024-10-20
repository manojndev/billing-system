import React, { useEffect, useState } from 'react';
import 'daisyui/dist/full.css';
import './css/style.css';
import { fetchAllItems, getOrderCount, insertOrder } from '../../service/service';

interface Item {
  id: string;
  name: string;
  price: number;
  qty?: number;
  customQuantity?: 'yes' | 'no';
  predefinedQuantities?: number[];
  unit?: string;
  taxPercentage?: number;
}

const PosPage: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'garden'>('garden');
  const [searchTerm, setSearchTerm] = useState('');
  const [drinks, setItems] = useState<Item[]>([]);

  const [order, setOrder] = useState<Item[]>([]);
  const [totOrders, setTotOrders] = useState(0);
  const [activeTab, setActiveTab] = useState<'items'>('items');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [customQty, setCustomQty] = useState(1);
  const [inputMode, setInputMode] = useState<'quantity' | 'price'>('quantity');
  const [customPrice, setCustomPrice] = useState(0);
  const [counterLoading, setCounterLoading] = useState(true);

  const getDate = () => {
    const today = new Date();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const addToOrder = (item: Item, qty: number) => {
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
      let qty = customQty;
      if (inputMode === 'price' && selectedItem.price > 0) {
        qty = customPrice / selectedItem.price;
      }

      addToOrder(selectedItem, qty);
      setShowModal(false);
      setCustomQty(1);
      setCustomPrice(0);
      setSelectedItem(null);
      setInputMode('quantity');
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
    return order.reduce((total, i) => total + (i.price * (i.qty || 1)), 0);
  };

  const getTotalWithTax = () => {
    return order.reduce((total, i) => {
      const itemTotal = i.price * (i.qty || 1);
      const taxAmount = i.taxPercentage ? (itemTotal * i.taxPercentage) / 100 : 0;
      return total + itemTotal + taxAmount;
    }, 0);
  };

  const clearOrder = () => {
    setOrder([]);
  };

  const checkout = () => {
    const orderData = {
      date: getDate(),
      orderNumber: totOrders + 1,
      items: order,
      totalAmount: getTotalWithTax().toFixed(2),
    };

    insertOrder(orderData)
      .then(() => {
        alert(
          `${orderData.date} - Order Number: ₹${orderData.orderNumber}\n\nOrder amount: ₹${orderData.totalAmount}\n\nPayment received. Thanks.`
        );
        clearOrder();
        setTotOrders(totOrders + 1);
      })
      .catch((error) => {
        console.error("Failed to insert order:", error);
        alert("Failed to process order. Please try again.");
      });
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

  const filteredDrinks = drinks.filter((drink) =>
    drink.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                onChange={(e) => setCustomQty(Number(e.target.value))}
              />
            ) : (
              <input
                type="number"
                min="1"
                className="input input-bordered w-full mt-4"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
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
            <span>Order Summary</span>
            <span>Today: {getDate()}</span>
            <span>
              Total Orders: <span className="badge badge-primary">{totOrders}</span>
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
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item) => (
                  <tr key={item.id} className="hover">
                    <td>{item.name}</td>
                    <td className="text-center">₹{item.price.toFixed(2)}</td>
                    <td className="text-center">
                      <span className="badge badge-info">{item.qty?.toFixed(2)}</span>
                    </td>
                    <td className="text-center">₹{(item.price * (item.qty || 1)).toFixed(2)}</td>
                    <td className="flex justify-center space-x-1">
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
            Total: ₹{getTotalWithTax().toFixed(2)}
          </div>
          <div className="flex justify-between mt-4">
            <button className="btn btn-danger" onClick={clearOrder}>
              Clear Order
            </button>
            <button className="btn btn-success" onClick={checkout} disabled={order.length === 0}>
              Checkout
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
            {filteredDrinks.map((drink) => (
              <div key={drink.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{drink.name}</h2>
                  <p>Price: ₹{drink.price.toFixed(2)}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleItemClick(drink)}
                  >
                    {drink.customQuantity === 'yes' ? 'Custom Qty' : 'Add to Order'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosPage;