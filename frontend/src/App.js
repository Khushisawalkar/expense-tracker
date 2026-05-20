import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';
import Cards from './pages/Cards';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import { useWebSocket } from './hooks/useWebSocket';
import { getAllExpenses } from './api';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setAuth(true);
      setToken(savedToken);
    }
  }, []);

  // Fetch initial data once on login
  useEffect(() => {
    if (auth) {
      getAllExpenses()
        .then(data => setTransactions(data))
        .catch(() => {});
    } else {
      setTransactions([]); // clear on logout
    }
  }, [auth]);

  // Handle Real-Time WebSocket Events
  useWebSocket(token, (event) => {
    const { action, payload } = event;
    if (action === 'ADD') {
      setTransactions(prev => [payload, ...prev.filter(t => t.id !== payload.id)]); // deduplicate just in case
    } else if (action === 'UPDATE') {
      setTransactions(prev => prev.map(t => t.id === payload.id ? payload : t));
    } else if (action === 'DELETE') {
      setTransactions(prev => prev.filter(t => t.id !== payload));
    }
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setAuth(false);
  };

  if (auth === 'register') return <Register setAuth={setAuth} />;
  if (!auth) return <Login setAuth={setAuth} setToken={setToken} />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard transactions={transactions} />;
      case 'transactions': return <Transactions transactions={transactions} />;
      case 'analytics': return <Analytics />;
      case 'budgets': return <Budgets />;
      case 'cards': return <Cards />;
      default: return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <div className="app-root">
      <Toaster />
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-area">
        <Header logout={logout} />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
