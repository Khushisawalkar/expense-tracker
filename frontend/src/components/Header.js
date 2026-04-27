import React from 'react';

export default function Header() {
  return (
    <div className="header">
      <div className="header-title">Dashboard</div>
      <div className="header-right">
        <div className="search-bar">
          <span>🔍</span>
          <input placeholder="Search transactions, cards..." />
        </div>
        <div className="notif-btn">🔔</div>
        <div className="user-badge">
          <div className="user-avatar">AM</div>
          <div className="user-info">
            <div className="user-name">Alex Morgan</div>
            <div className="user-plan">Pro Member</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>▾</span>
        </div>
      </div>
    </div>
  );
}
