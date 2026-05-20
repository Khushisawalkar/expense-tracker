import React, { useState } from 'react';
import { changePassword } from '../api';

export default function Header({ logout }) {
  const username = localStorage.getItem('username') || 'User';
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword({ oldPassword, newPassword });
      alert(res.message || 'Password changed successfully!');
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      alert('Failed to change password: ' + err.message);
    }
  };

  return (
    <div className="header">
      <div className="header-title">Dashboard</div>
      <div className="header-right">
        <div className="search-bar">
          <span>🔍</span>
          <input placeholder="Search transactions, cards..." />
        </div>
        <div className="notif-btn">🔔</div>
        <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="user-avatar">{username.substring(0, 2).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{username}</div>
            <div className="user-plan" onClick={() => setShowPasswordModal(true)} style={{ cursor: 'pointer', color: 'var(--accent-primary)' }}>Change Password</div>
          </div>
          <button onClick={logout} style={{ marginLeft: '16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
      
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleChangePassword} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', width: '300px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Change Password</h3>
            <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px' }} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" style={{ flex: 1, padding: '8px', background: 'var(--accent-primary)', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
              <button type="button" onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: '8px', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
