import React, { useEffect } from 'react';
import logo from './logo.svg';
// import './App.css';
import { fetchWelcomeStart } from './redux/slices/initial/initialslice';
import { useDispatch } from 'react-redux';
import PosPage from './pages/posPage/posPage';
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWelcomeStart());
  }, [dispatch]); // Add dispatch to dependency array

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <PosPage></PosPage>
      summa
    </div>
  );
}

export default App;