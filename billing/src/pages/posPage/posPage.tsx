import React, { useEffect, useState } from 'react';
import 'daisyui/dist/full.css'; // Import DaisyUI and Tailwind
import './css/style.css'; // Import custom CSS

interface Item {
  id: number;
  name: string;
  price: number;
  qty?: number;
}

const PosPage: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); // Dark mode as default
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [drinks] = useState<Item[]>([
    { id: 0, name: "Still Water", price: 1 },
    { id: 1, name: "Sparkling Water", price: 1.10 },
    { id: 2, name: "Espresso", price: 1.20 },
    { id: 3, name: "Cappuccino", price: 1.30 },
    { id: 4, name: "Tea", price: 1.90 },
    { id: 5, name: "Hot Chocolate", price: 2.10 },
    { id: 6, name: "Coke", price: 2.00 },
    { id: 7, name: "Orange Juice", price: 1.90 }
  ]);

  const [order, setOrder] = useState<Item[]>([]);
  const [totOrders, setTotOrders] = useState(0);
  const [activeTab, setActiveTab] = useState<'items'>('items'); // State for active tab

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

  const removeOneEntity = (item: Item) => {
    const updatedOrder = order.map((i) => {
      if (i.id === item.id) {
        i.qty = (i.qty || 0) - 1;
      }
      return i;
    }).filter((i) => i.qty && i.qty > 0);
    setOrder(updatedOrder);
  };

  const removeItem = (item: Item) => {
    const updatedOrder = order.filter((i) => i.id !== item.id);
    setOrder(updatedOrder);
  };

  const getTotal = () => {
    return order.reduce((total, i) => total + (i.price * (i.qty || 1)), 0);
  };

  const clearOrder = () => {
    setOrder([]);
  };

  const checkout = () => {
    alert(`${getDate()} - Order Number: ${totOrders + 1}\n\nOrder amount: $${getTotal().toFixed(2)}\n\nPayment received. Thanks.`);
    clearOrder();
    setTotOrders(totOrders + 1);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme); // Set theme
  }, [theme]);

  const filteredDrinks = drinks.filter(drink =>
    drink.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Navbar with Dark/Light Mode Toggle */}
      <div className="navbar bg-base-200 rounded-lg">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Selvam broilers POS Demo</a>
        </div>
        <div className="flex-none">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
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
            <span>Total Orders: <span className="badge badge-primary">{totOrders}</span></span>
          </div>

          <div className="overflow-auto max-h-64 mt-4">
            {order.length === 0 && <div className="text-warning">Nothing ordered yet!</div>}

            <table className="table w-full bg-base-100 rounded-box">
              <thead>
                <tr>
                  <th>Qty</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item) => (
                  <tr key={item.id} className="hover">
                    <td className="text-center">
                      <span className="badge badge-info">{item.qty}</span>
                    </td>
                    <td>{item.name}</td>
                    <td className="text-center">
                      <span className="badge badge-success">₹{(item.price * (item.qty || 1)).toFixed(2)}</span>
                    </td>
                    <td className="flex justify-center space-x-1">
                      <button className="btn btn-xs btn-success" onClick={() => addToOrder(item, 1)}>+</button>
                      <button className="btn btn-xs btn-warning" onClick={() => removeOneEntity(item)}>-</button>
                      <button className="btn btn-xs btn-error" onClick={() => removeItem(item)}>X</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {order.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Total: ₹{getTotal().toFixed(2)}</h3>
              <div className="buttons mt-2">
                <button className="btn btn-outline btn-secondary mr-2" onClick={clearOrder}>Clear</button>
                <button className="btn btn-primary" onClick={checkout}>Checkout</button>
              </div>
            </div>
          )}
        </div>

        <div className="box">
          <div className="tabs tabs-boxed">
            <a
              className={`tab ${activeTab === 'items' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('items')}
            >
              Items
            </a>
          </div>

          {/* Search bar */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search for items..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Display filtered items with price */}
          <div className="flex flex-wrap gap-2 mt-2">
            {filteredDrinks.map((drink) => (
              <button
                className="btn btn-primary btn-pos btn-marginTop"
                key={drink.id}
                onClick={() => addToOrder(drink, 1)}
              >
                {drink.name} - ₹{drink.price.toFixed(2)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosPage;
