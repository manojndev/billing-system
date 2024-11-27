import React, { useEffect, useState } from 'react';
import AdminPage from '../adminpageitem/adminPageItem';
import OrderList from '../adminorderspage/ordersPage';
import Dashboard from '../adminDashboard/adminDashboard';
import StoresPage from '../adminstore/adminStore';
const Admin: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    console.log(`Theme set to ${theme}:`, document.documentElement.getAttribute('data-theme'));
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button onClick={() => setSelectedTab('home')} className="text-gray-700 hover:text-gray-900">Dashboard</button>
              <button onClick={() => setSelectedTab('orders')} className="text-gray-700 hover:text-gray-900">Orders</button>
              <button onClick={() => setSelectedTab('items')} className="text-gray-700 hover:text-gray-900">Items</button>
              <button onClick={() => setSelectedTab('store')} className="text-gray-700 hover:text-gray-900">Branch</button>

            </div>
            {/* <button onClick={toggleTheme} className="btn btn-sm btn-primary">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button> */}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {selectedTab === 'home' && <div><Dashboard/></div>}
        {selectedTab === 'orders' && <div><OrderList/></div>}
        {selectedTab === 'items' && <AdminPage />}
        {selectedTab === 'store' && <StoresPage />}

      </main>
    </div>
  );
};

export default Admin;