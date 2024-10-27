import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../../service/service';
import './OrdersPage.css'; // Import the CSS file

interface OrderItem {
  customQuantity: string;
  id: string;
  name: string;
  price: number;
  qty: number;
  taxPercentage: number;
  unit: string;
}

interface Order {
  date: string; // Format: DD/MM/YYYY
  items: OrderItem[];
  orderNumber: number;
  totalAmount: string;
}

interface Orders {
  [key: string]: Order;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Orders>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    fetchOrders()
      .then((data) => {
        setOrders(data as Orders);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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