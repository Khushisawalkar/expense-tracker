import React, { useState } from 'react';
import { registerUser } from '../api';

export default function Register({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser({ username, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('username', res.username);
      setAuth(true);
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
      <form onSubmit={handleSubmit} className="auth-card" style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)', width: '400px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text-main)', textAlign: 'center' }}>Create Account</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '24px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px' }} />
        <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--accent-primary)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Sign Up</button>
        <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)' }}>Already have an account? <span onClick={() => setAuth(false)} style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>Log in</span></p>
      </form>
    </div>
  );
}
