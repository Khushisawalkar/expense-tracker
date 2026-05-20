import React, { useState, useEffect } from 'react';
import { getAllExpenses, addExpense, updateExpense, deleteExpense } from '../api';

const CATEGORIES = ['All', 'Income', 'Groceries', 'Entertainment', 'Transport', 'Shopping', 'Utilities'];

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', recipient: '', location: '', category: 'Groceries', amount: '', date: '', type: 'expense' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllExpenses()
      .then(data => setTxs(data))
      .catch(() => {});
  }, []);

  const filtered = filter === 'All' ? txs : txs.filter(t => t.category === filter);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ title: '', recipient: '', location: '', category: 'Groceries', amount: '', date: '', type: 'expense' });
    setShowModal(true);
  };

  const openEditModal = (tx) => {
    setEditingId(tx.id);
    setForm({
      title: tx.title || '',
      recipient: tx.recipient || '',
      location: tx.location || '',
      category: tx.category || 'Groceries',
      amount: Math.abs(tx.amount),
      date: tx.date || '',
      type: tx.amount < 0 ? 'expense' : 'income'
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.amount) return;
    const amt = form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount));
    const txData = {
      title: form.title,
      recipient: form.recipient,
      location: form.location,
      category: form.category,
      amount: amt,
      date: form.date || new Date().toISOString().split('T')[0],
    };
    try {
      setLoading(true);
      if (editingId) {
        const saved = await updateExpense(editingId, txData);
        setTxs(prev => prev.map(t => t.id === editingId ? saved : t));
      } else {
        const saved = await addExpense(txData);
        setTxs(prev => [saved, ...prev]);
      }
    } catch {
      alert("Failed to save transaction to database");
    } finally {
      setLoading(false);
      setShowModal(false);
      setEditingId(null);
      setForm({ title: '', recipient: '', location: '', category: 'Groceries', amount: '', date: '', type: 'expense' });
    }
  };

  const handleDelete = async (id) => {
    try { await deleteExpense(id); } catch {}
    setTxs(prev => prev.filter(t => t.id !== id));
  };

  const fmt = (n) => `${n < 0 ? '-' : '+'}$${Math.abs(n).toFixed(2)}`;
  const getIcon = (cat) => {
    switch(cat) {
      case 'Income': return '💼';
      case 'Groceries': return '🛒';
      case 'Entertainment': return '📺';
      case 'Transport': return '🚗';
      case 'Shopping': return '🛍️';
      case 'Utilities': return '⚡';
      default: return '💳';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Transactions</div>
        <button className="btn-add" onClick={openAddModal}>＋ Add Transaction</button>
      </div>

      <div className="filters-row">
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="panel">
        <div className="tx-table-head">
          <span>Transaction Details</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Actions</span>
        </div>
        {filtered.length === 0 && <div className="loading" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No transactions found for this account. Add some to get started!</div>}
        {filtered.map(tx => (
          <div className="tx-row" key={tx.id} style={{ cursor: 'default' }}>
            <div className="tx-details">
              <div className="tx-avatar">{getIcon(tx.category)}</div>
              <div>
                <div className="tx-name">{tx.title}</div>
                <div className="tx-cat">
                  <span style={{color: 'var(--accent-primary)', fontWeight: 'bold'}}>{tx.category}</span>
                  {tx.recipient && ` • To: ${tx.recipient}`}
                  {tx.location && ` • At: ${tx.location}`}
                </div>
              </div>
            </div>
            <div className="tx-date">{tx.date}</div>
            <div className={`tx-amount ${tx.amount < 0 ? 'neg' : 'pos'}`}>{fmt(tx.amount)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => openEditModal(tx)}
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: 12, padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold' }}
              >Edit</button>
              <button
                onClick={() => handleDelete(tx.id)}
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#ff4d4f', cursor: 'pointer', fontSize: 12, padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}
                title="Delete"
              >✕</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)} style={{backdropFilter: 'blur(8px)'}}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', width: '480px' }}>
            <div className="modal-header">
              <div className="modal-title" style={{ fontSize: '1.25rem', color: 'var(--accent-primary)' }}>
                {editingId ? '✏️ Edit Transaction' : '✨ New Transaction'}
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div className="modal-field" style={{ flex: 1, marginBottom: 0 }}>
                <div className="modal-label">Type</div>
                <select className="modal-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="modal-field" style={{ flex: 1, marginBottom: 0 }}>
                <div className="modal-label">Amount ($)</div>
                <input className="modal-input" type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)', background: 'var(--bg-main)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div className="modal-field">
              <div className="modal-label">Title / Item</div>
              <input className="modal-input" placeholder="e.g. Netflix, Salary..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)' }} />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div className="modal-field" style={{ flex: 1, marginBottom: 0 }}>
                <div className="modal-label">Recipient Name (Optional)</div>
                <input className="modal-input" placeholder="e.g. John Doe, Amazon" value={form.recipient} onChange={e => setForm(p => ({ ...p, recipient: e.target.value }))} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)' }} />
              </div>
              <div className="modal-field" style={{ flex: 1, marginBottom: 0 }}>
                <div className="modal-label">Location / Spent At (Optional)</div>
                <input className="modal-input" placeholder="e.g. New York, Online" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div className="modal-field" style={{ flex: 1, marginBottom: 0 }}>
                <div className="modal-label">Category</div>
                <select className="modal-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                  {['Groceries','Entertainment','Transport','Shopping','Utilities','Income'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field" style={{ flex: 1, marginBottom: 0 }}>
                <div className="modal-label">Date</div>
                <input className="modal-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button className="btn-cancel" onClick={() => setShowModal(false)} style={{ color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>Cancel</button>
              <button className="btn-confirm" onClick={handleSave} disabled={loading} style={{ background: 'linear-gradient(90deg, var(--accent-primary) 0%, #00c689 100%)', color: '#000', fontWeight: 'bold' }}>
                {loading ? 'Saving...' : (editingId ? 'Save Changes ✓' : 'Add Transaction ➔')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
