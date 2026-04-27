import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';
import Cards from './pages/Cards';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

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
        <Header />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
