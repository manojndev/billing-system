import React, { useEffect } from 'react';
import logo from './logo.svg';
// import './App.css';
import { fetchWelcomeStart } from './redux/slices/items/itemslice';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './pages/adminpage/adminPage';
import PosPage from './pages/posPage/posPage';
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWelcomeStart());
  }, [dispatch]); // Add dispatch to dependency array

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<PosPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>

    
  );
}

export default App;