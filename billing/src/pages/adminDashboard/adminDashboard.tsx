import React, { useEffect, useState } from 'react';
import { fetchAllOrders } from '../../service/service'; // Adjust the import path as necessary
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

interface Order {
  date: string;
  totalAmount: string;
}

interface Orders {
  [key: string]: Order;
}

const Dashboard = () => {
  const [yearlyData, setYearlyData] = useState<Record<string, number>>({});
  const [yearlyOrderCount, setYearlyOrderCount] = useState<Record<string, number>>({});
  const [monthlyData, setMonthlyData] = useState<Record<string, number>>({});
  const [dailyData, setDailyData] = useState<Record<string, number>>({});
  const [pieChartData, setPieChartData] = useState<Record<string, number>>({});
  const [currentChart, setCurrentChart] = useState<'yearly' | 'monthly' | 'daily'>('yearly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders: Orders = await fetchAllOrders();
        const { yearlyData, yearlyOrderCount, monthlyData, dailyData, pieChartData } = processOrdersData(orders);
        setYearlyData(yearlyData);
        setYearlyOrderCount(yearlyOrderCount);
        setMonthlyData(monthlyData);
        setDailyData(dailyData);
        setPieChartData(pieChartData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []);

  const processOrdersData = (orders: Orders) => {
    const yearlyData: Record<string, number> = {};
    const yearlyOrderCount: Record<string, number> = {};
    const monthlyData: Record<string, number> = {};
    const dailyData: Record<string, number> = {};
    const pieChartData: Record<string, number> = {};

    for (const orderId in orders) {
      const order = orders[orderId];
      const date = new Date(order.date.split('/').reverse().join('-'));

      const year = date.getFullYear();
      const month = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const day = `${month}-${String(date.getDate()).padStart(2, '0')}`;

      if (!yearlyData[year]) yearlyData[year] = 0;
      if (!yearlyOrderCount[year]) yearlyOrderCount[year] = 0;
      if (!monthlyData[month]) monthlyData[month] = 0;
      if (!dailyData[day]) dailyData[day] = 0;
      if (!pieChartData[order.totalAmount]) pieChartData[order.totalAmount] = 0;

      yearlyData[year] += parseFloat(order.totalAmount);
      yearlyOrderCount[year] += 1;
      monthlyData[month] += parseFloat(order.totalAmount);
      dailyData[day] += parseFloat(order.totalAmount);
      pieChartData[order.totalAmount] += 1;
    }

    return { yearlyData, yearlyOrderCount, monthlyData, dailyData, pieChartData };
  };

  const renderChart = (data: Record<string, number>, label: string, orderCount?: Record<string, number>) => {
    return (
      <Bar
        data={{
          labels: Object.keys(data),
          datasets: [{
            label: label,
            data: Object.values(data),
            backgroundColor: 'rgba(0, 0, 255, 0.2)', // Blue color
            borderColor: 'rgba(0, 0, 255, 1)', // Blue color
            borderWidth: 1
          }]
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: orderCount ? `Order Count: ${Object.values(orderCount).reduce((a, b) => a + b, 0)}` : ''
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }}
        height={200}
        width={400}
      />
    );
  };

  const renderPieChart = (data: Record<string, number>) => {
    return (
      <Pie
        data={{
          labels: Object.keys(data),
          datasets: [{
            label: 'Order Distribution',
            data: Object.values(data),
            backgroundColor: Object.keys(data).map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`),
            borderColor: Object.keys(data).map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
            borderWidth: 1
          }]
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Order Distribution by Amount'
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }}
        height={200}
        width={400}
      />
    );
  };

  return (
    <div>
      <h1>Orders Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={() => setCurrentChart('yearly')}>Yearly Orders</button>
        <button onClick={() => setCurrentChart('monthly')}>Monthly Orders</button>
        <button onClick={() => setCurrentChart('daily')}>Daily Orders</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {currentChart === 'yearly' && renderChart(yearlyData, 'Yearly Orders', yearlyOrderCount)}
        {currentChart === 'monthly' && renderChart(monthlyData, 'Monthly Orders')}
        {currentChart === 'daily' && renderChart(dailyData, 'Daily Orders')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {renderPieChart(pieChartData)}
      </div>
    </div>
  );
};

export default Dashboard;