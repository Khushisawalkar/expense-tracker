import React, { useState, useEffect } from 'react';
import { getAllExpenses, addExpense, deleteExpense, MOCK_TRANSACTIONS } from '../api';

const CATEGORIES = ['All', 'Income', 'Groceries', 'Entertainment', 'Transport', 'Shopping', 'Utilities'];

export default function Transactions() {
  const [txs, setTxs]           = useState(MOCK_TRANSACTIONS);
  const [filter, setFilter]     = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState({ name: '', category: 'Groceries', amount: '', date: '', type: 'expense' });
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    getAllExpenses()
      .then(data => setTxs(data))
      .catch(() => {}); // use mock
  }, []);

  const filtered = filter === 'All' ? txs : txs.filter(t => t.category === filter);

  const handleAdd = async () => {
    if (!form.name || !form.amount) return;
    const amt = form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount));
    const newTx = {
      name: form.name,
      category: form.category,
      amount: amt,
      date: form.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'completed',
      icon: form.type === 'expense' ? '💸' : '💵',
    };
    try {
      setLoading(true);
      const saved = await addExpense(newTx);
      setTxs(prev => [saved, ...prev]);
    } catch {
      // offline: add locally
      setTxs(prev => [{ ...newTx, id: Date.now() }, ...prev]);
    } finally {
      setLoading(false);
      setShowModal(false);
      setForm({ name: '', category: 'Groceries', amount: '', date: '', type: 'expense' });
    }
  };

  const handleDelete = async (id) => {
    try { await deleteExpense(id); } catch {}
    setTxs(prev => prev.filter(t => t.id !== id));
  };

  const fmt = (n) => `${n < 0 ? '-' : '+'}$${Math.abs(n).toFixed(2)}`;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Transactions</div>
        <button className="btn-add" onClick={() => setShowModal(true)}>＋ Add Transaction</button>
      </div>

      {/* Filter chips */}
      <div className="filters-row">
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {/* Table */}
      <div className="panel">
        <div className="tx-table-head">
          <span>Transaction Details</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {filtered.length === 0 && <div className="loading">No transactions found.</div>}
        {filtered.map(tx => (
          <div className="tx-row" key={tx.id} style={{ cursor: 'default' }}>
            <div className="tx-details">
              <div className="tx-avatar">{tx.icon || '💳'}</div>
              <div>
                <div className="tx-name">{tx.name}</div>
                <div className="tx-cat">{tx.category}</div>
              </div>
            </div>
            <div className="tx-date">{tx.date}</div>
            <div className={`tx-amount ${tx.amount < 0 ? 'neg' : 'pos'}`}>{fmt(tx.amount)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`tx-status ${tx.status}`}>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</span>
              <button
                onClick={() => handleDelete(tx.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, padding: '2px 6px' }}
                title="Delete"
              >✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add Transaction</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-field">
              <div className="modal-label">Type</div>
              <select className="modal-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="modal-field">
              <div className="modal-label">Name</div>
              <input className="modal-input" placeholder="e.g. Netflix, Salary..." value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>

            <div className="modal-field">
              <div className="modal-label">Category</div>
              <select className="modal-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {['Groceries','Entertainment','Transport','Shopping','Utilities','Income'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <div className="modal-label">Amount ($)</div>
              <input className="modal-input" type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
            </div>

            <div className="modal-field">
              <div className="modal-label">Date</div>
              <input className="modal-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={handleAdd} disabled={loading}>{loading ? 'Saving...' : 'Add Transaction'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
