import React from 'react';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: '⊞' },
  { id: 'transactions', label: 'Transactions', icon: '⇄' },
  { id: 'analytics',   label: 'Analytics',    icon: '📊' },
  { id: 'budgets',     label: 'Budgets',      icon: '🎯' },
  { id: 'cards',       label: 'Cards',        icon: '💳' },
  { id: 'settings',    label: 'Settings',     icon: '⚙' },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">💹</div>
        <span className="logo-text">FinTrack</span>
      </div>

      {NAV.map(n => (
        <div
          key={n.id}
          className={`nav-item ${activePage === n.id ? 'active' : ''}`}
          onClick={() => setActivePage(n.id)}
        >
          <span className="nav-icon">{n.icon}</span>
          {n.label}
        </div>
      ))}

      <div className="sidebar-upgrade">
        <div className="upgrade-title">Upgrade to Pro</div>
        <div className="upgrade-desc">Get advanced analytics and unlimited virtual cards.</div>
        <button className="btn-upgrade">View Plans</button>
      </div>
    </div>
  );
}
