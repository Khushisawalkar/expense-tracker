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

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setAuth(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAuth(false);
  };

  if (auth === 'register') return <Register setAuth={setAuth} />;
  if (!auth) return <Login setAuth={setAuth} />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'analytics': return <Analytics />;
      case 'budgets': return <Budgets />;
      case 'cards': return <Cards />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-root">
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
