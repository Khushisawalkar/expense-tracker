import React, { useState } from 'react';

const INIT_BUDGETS = [
  { id: 1, cat: 'Groceries',    icon: '🛒', spent: 400,  total: 500,  color: '#00e5a0', period: 'Monthly' },
  { id: 2, cat: 'Entertainment',icon: '🎬', spent: 250,  total: 300,  color: '#7c5cfc', period: 'Monthly' },
  { id: 3, cat: 'Shopping',     icon: '🛍', spent: 120,  total: 400,  color: '#3b5bdb', period: 'Monthly' },
  { id: 4, cat: 'Transport',    icon: '🚗', spent: 80,   total: 200,  color: '#ff9f40', period: 'Monthly' },
  { id: 5, cat: 'Utilities',    icon: '⚡', spent: 130,  total: 150,  color: '#ff5c7c', period: 'Monthly' },
  { id: 6, cat: 'Dining Out',   icon: '🍽', spent: 160,  total: 250,  color: '#00bcd4', period: 'Monthly' },
];

export default function Budgets() {
  const [budgets, setBudgets] = useState(INIT_BUDGETS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ cat: '', total: '', spent: '' });

  const totalBudget = budgets.reduce((s, b) => s + b.total, 0);
  const totalSpent  = budgets.reduce((s, b) => s + b.spent, 0);

  const handleAdd = () => {
    if (!form.cat || !form.total) return;
    setBudgets(prev => [...prev, {
      id: Date.now(), cat: form.cat, icon: '💰',
      spent: parseFloat(form.spent) || 0,
      total: parseFloat(form.total),
      color: '#00e5a0', period: 'Monthly'
    }]);
    setShowModal(false);
    setForm({ cat: '', total: '', spent: '' });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Budgets</div>
        <button className="btn-add" onClick={() => setShowModal(true)}>＋ New Budget</button>
      </div>

      {/* Overview */}
      <div className="panel" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Total Budget Used</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Space Mono', letterSpacing: -1, marginTop: 4 }}>
              ${totalSpent.toLocaleString()} <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>/ ${totalBudget.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'Space Mono' }}>
              {Math.round((totalSpent/totalBudget)*100)}%
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>used this month</div>
          </div>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${(totalSpent/totalBudget)*100}%`, background: 'var(--accent-green)' }} />
        </div>
      </div>

      <div className="budgets-grid">
        {budgets.map(b => {
          const pct = Math.min(100, Math.round((b.spent / b.total) * 100));
          const over = b.spent > b.total;
          return (
            <div className="budget-card" key={b.id}>
              <div className="budget-card-top">
                <div>
                  <div className="budget-card-name">{b.cat}</div>
                  <div className="budget-card-period">{b.period}</div>
                </div>
                <div className="budget-card-icon" style={{ background: b.color + '22' }}>
                  {b.icon}
                </div>
              </div>
              <div className="budget-pct" style={{ color: over ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {pct}%
              </div>
              <div className="budget-bar-thick">
                <div style={{ height: '100%', width: `${pct}%`, background: over ? 'var(--accent-red)' : b.color, borderRadius: 6, transition: 'width 0.6s ease' }} />
              </div>
              <div className="budget-amounts">
                <span>${b.spent} spent</span>
                <span>${b.total} budget</span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">New Budget</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-field">
              <div className="modal-label">Category Name</div>
              <input className="modal-input" placeholder="e.g. Groceries" value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))} />
            </div>
            <div className="modal-field">
              <div className="modal-label">Budget Limit ($)</div>
              <input className="modal-input" type="number" placeholder="500" value={form.total} onChange={e => setForm(p => ({ ...p, total: e.target.value }))} />
            </div>
            <div className="modal-field">
              <div className="modal-label">Already Spent ($)</div>
              <input className="modal-input" type="number" placeholder="0" value={form.spent} onChange={e => setForm(p => ({ ...p, spent: e.target.value }))} />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={handleAdd}>Create Budget</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
