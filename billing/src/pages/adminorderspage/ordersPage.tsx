import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../../service/service';
import './OrdersPage.css'; // Import the CSS file

import { OrderItem,Order,Orders } from './order.dto';


const OrdersPage = () => {
  const [orders, setOrders] = useState<Orders>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [lastOrderKey, setLastOrderKey] = useState<string | null>(null);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((data: Orders) => {
        setOrders(data);
        setLoading(false);
        const keys = Object.keys(data);
        if (keys.length > 0) {
          setLastOrderKey(keys[keys.length - 1]);
        }
        setHasMoreOrders(keys.length === 40);
      })
      .catch((err: any) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const loadMoreOrders = () => {
    if (!hasMoreOrders) return;

    fetchOrders(40, lastOrderKey)
      .then((data: Orders) => {
        setOrders((prevOrders) => ({ ...prevOrders, ...data }));
        const keys = Object.keys(data);
        if (keys.length > 0) {
          setLastOrderKey(keys[keys.length - 1]);
        }
        setHasMoreOrders(keys.length === 40);
      })
      .catch((err: any) => {
        setError(err.message);
      });
  };

  const handleRowClick = (orderId: string) => {
    setSelectedOrder(orders[orderId]);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(event.target.value);
  };

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredOrders = Object.keys(orders).filter((orderId) => {
    const orderDate = parseDate(orders[orderId].date);
    const filterDateObj = filterDate ? parseDate(filterDate) : null;
    return !filterDate || orderDate.toDateString() === filterDateObj?.toDateString();
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="mb-4">
        <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700">
          Filter by Date:
        </label>
        <input
          type="date"
          id="filterDate"
          value={filterDate}
          onChange={handleDateChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          {filteredOrders.map((orderId) => (
            <div
              key={orderId}
              className="card bg-base-100 shadow-md p-4 cursor-pointer zoom-card"
              onClick={() => handleRowClick(orderId)}
            >
              <div className="card-body">
                <p>Order Number: {orders[orderId].orderNumber}</p>
                <p>Date: {orders[orderId].date}</p>
                <p>Total Amount: {orders[orderId].totalAmount}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMoreOrders && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={loadMoreOrders}
        >
          Load More
        </button>
      )}

      {selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Order Details</h2>
            <p>Order Number: {selectedOrder.orderNumber}</p>
            <p>Date: {selectedOrder.date}</p>
            <p>Total Amount: {selectedOrder.totalAmount}</p>
            <h3 className="text-lg font-semibold mt-4">Items</h3>
            <ul className="list-disc pl-5">
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.qty} {item.unit} @ {item.price} each
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;