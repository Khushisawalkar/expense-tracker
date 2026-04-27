import React, { useState } from 'react';

const INIT_CARDS = [
  { id: 1, holder: 'Alex Morgan', number: '**** **** **** 4582', expiry: '09/27', type: 'Visa',       gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)', accent: '#00e5a0', balance: 12450.00 },
  { id: 2, holder: 'Alex Morgan', number: '**** **** **** 9134', expiry: '03/26', type: 'Mastercard', gradient: 'linear-gradient(135deg, #2d1b69, #11998e)', accent: '#7c5cfc', balance:  5830.50 },
  { id: 3, holder: 'Alex Morgan', number: '**** **** **** 2271', expiry: '12/28', type: 'Amex',       gradient: 'linear-gradient(135deg, #1a0533, #4a1942)', accent: '#ff9f40', balance:  6281.50 },
];

export default function Cards() {
  const [cards, setCards]     = useState(INIT_CARDS);
  const [selected, setSelected] = useState(INIT_CARDS[0]);
  const [showModal, setShowModal] = useState(false);

  const RECENT = [
    { name: 'Apple Store',    amt: -1299, date: 'Apr 22', icon: '🍎' },
    { name: 'Delta Airlines', amt: -450,  date: 'Apr 18', icon: '✈️' },
    { name: 'Salary Credit',  amt: 6500,  date: 'Apr 15', icon: '💰' },
    { name: 'Whole Foods',    amt: -89,   date: 'Apr 10', icon: '🛒' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Cards</div>
        <button className="btn-add" onClick={() => setShowModal(true)}>＋ Add Card</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
        {/* Cards grid */}
        <div>
          <div className="cards-grid" style={{ marginBottom: 20 }}>
            {cards.map(card => (
              <div
                key={card.id}
                className="credit-card"
                style={{ background: card.gradient, border: selected.id === card.id ? `2px solid ${card.accent}` : '2px solid transparent' }}
                onClick={() => setSelected(card)}
              >
                <div className="card-dots" />
                <div className="card-chip">💳</div>
                <div className="card-number" style={{ color: 'rgba(255,255,255,0.85)' }}>{card.number}</div>
                <div className="card-bottom">
                  <div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 2 }}>CARD HOLDER</div>
                    <div className="card-holder">{card.holder}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="card-expiry-label">EXPIRES</div>
                    <div className="card-expiry">{card.expiry}</div>
                  </div>
                </div>
                <div className="card-brand">{card.type === 'Visa' ? '💠' : card.type === 'Mastercard' ? '🔴' : '🟡'}</div>
              </div>
            ))}
          </div>

          {/* Selected card details */}
          <div className="panel">
            <div className="panel-title" style={{ marginBottom: 14 }}>Card Details — {selected.type}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                { label: 'Balance',    value: `$${selected.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
                { label: 'Card Type',  value: selected.type },
                { label: 'Expires',    value: selected.expiry },
              ].map(i => (
                <div key={i.label}>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>{i.label}</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{i.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent card transactions */}
        <div className="panel">
          <div className="panel-title" style={{ marginBottom: 14 }}>Recent Activity</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{selected.number}</div>
          {RECENT.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="tx-avatar">{r.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.date}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'Space Mono', fontSize: 13, fontWeight: 600, color: r.amt < 0 ? 'var(--text-primary)' : 'var(--accent-green)' }}>
                {r.amt < 0 ? '-' : '+'}${Math.abs(r.amt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Card</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-field">
              <div className="modal-label">Card Number (last 4)</div>
              <input className="modal-input" placeholder="e.g. 1234" maxLength={4} />
            </div>
            <div className="modal-field">
              <div className="modal-label">Card Type</div>
              <select className="modal-select">
                <option>Visa</option><option>Mastercard</option><option>Amex</option>
              </select>
            </div>
            <div className="modal-field">
              <div className="modal-label">Expiry Date</div>
              <input className="modal-input" placeholder="MM/YY" />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={() => setShowModal(false)}>Add Card</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
