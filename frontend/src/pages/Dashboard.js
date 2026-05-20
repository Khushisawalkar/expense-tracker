import React, { useState, useEffect } from 'react';
import { getAllExpenses } from '../api';
import { processAnalytics } from '../utils/analytics';

// ── SVG CASH FLOW CHART ──────────────────────────────────
function CashFlowChart({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;
  const W = 560, H = 180, PAD = 20;
  const max = Math.max(...data.map(d => d.amount), 1);
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1 || 1)) * (W - PAD * 2);
    const y = H - PAD - (d.amount / max) * (H - PAD * 2);
    return `${x},${y}`;
  });
  const areaPath = `M ${pts[0]} ${pts.slice(1).map(p => 'L ' + p).join(' ')} L ${560 - PAD},${H} L ${PAD},${H} Z`;
  const linePath  = `M ${pts[0]} ${pts.slice(1).map(p => 'L ' + p).join(' ')}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#00e5a0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00e5a0" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* grid lines */}
      {[0.25, 0.5, 0.75].map(r => (
        <line key={r} x1={PAD} y1={H - PAD - r*(H-PAD*2)} x2={W-PAD} y2={H - PAD - r*(H-PAD*2)}
          stroke="#2a3441" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      <path d={areaPath} fill="url(#grad)" />
      <path d={linePath}  fill="none" stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* dots */}
      {pts.map((p, i) => {
        const [x, y] = p.split(',');
        return <circle key={i} cx={x} cy={y} r="4" fill="#00e5a0" stroke="#0d1117" strokeWidth="2" />;
      })}
      {/* x labels */}
      {data.map((d, i) => {
        const x = PAD + (i / (data.length - 1 || 1)) * (W - PAD * 2);
        return <text key={i} x={x} y={H + 4} textAnchor="middle" fill="#4a5568" fontSize="11" fontFamily="DM Sans">{d.month}</text>;
      })}
    </svg>
  );
}

// ── DONUT CHART ──────────────────────────────────────────
function DonutChart({ total, slices }) {
  if (!slices || slices.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#8b96a5' }}>No expenses to display</div>;
  }
  const R = 60, CX = 80, CY = 80, stroke = 22;
  const circ = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div>
      <div className="donut-wrap">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#1a2130" strokeWidth={stroke} />
          {slices.map((s, i) => {
            const dash = (s.pct / 100) * circ;
            const gap  = circ - dash;
            const el = (
              <circle key={i} cx={CX} cy={CY} r={R}
                fill="none" stroke={s.color} strokeWidth={stroke}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                style={{ transform: 'rotate(-90deg)', transformOrigin: `${CX}px ${CY}px` }}
              />
            );
            offset += dash;
            return el;
          })}
          <text x={CX} y={CY - 6} textAnchor="middle" fill="#e8edf3" fontSize="18" fontWeight="700" fontFamily="Space Mono">
            ${(total/1000).toFixed(1)}k
          </text>
          <text x={CX} y={CY + 14} textAnchor="middle" fill="#8b96a5" fontSize="11" fontFamily="DM Sans">Total</text>
        </svg>
      </div>
      <div className="spending-legend">
        {slices.slice(0, 4).map(s => (
          <div className="legend-row" key={s.label}>
            <div className="legend-left">
              <span className="legend-dot" style={{ background: s.color }} />
              <span style={{ maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
            <span className="legend-pct">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ───────────────────────────────────────
export default function Dashboard({ transactions = [] }) {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    balanceChange: 0,
    incomeChange: 0,
    expenseChange: 0,
    cashFlow: [],
    categoryData: [],
    insights: []
  });
  const [chartTab, setChartTab] = useState('6M');
  const [transfer, setTransfer] = useState({ amount: '', recipient: '' });
  const [uniqueRecipients, setUniqueRecipients] = useState([]);

  useEffect(() => {
    let income = 0;
    let expense = 0;
    const recSet = new Set();

    transactions.forEach(tx => {
      if (tx.amount > 0) income += tx.amount;
      else expense += Math.abs(tx.amount);
      if (tx.recipient && tx.recipient.trim() !== '') recSet.add(tx.recipient);
    });

    setUniqueRecipients(Array.from(recSet));

    const analytics = processAnalytics(transactions);

    setSummary({
      totalBalance: income - expense,
      monthlyIncome: income,
      monthlyExpenses: expense,
      balanceChange: 0,
      incomeChange: 0,
      expenseChange: 0,
      cashFlow: analytics.cashFlow,
      categoryData: analytics.categoryData,
      insights: analytics.insights
    });
  }, [transactions]);

  const fmt = (n) => `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
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

  const recentTxs = transactions.slice(0, 4);

  return (
    <div>
      {/* API status pill */}
      <div className="api-status">
        <div className="api-dot connected" />
        Live Real-Time Connection Active
      </div>

      {/* ── STAT CARDS ── */}
      <div className="stat-cards">
        {[
          { label: 'Total Balance',     value: fmt(summary.totalBalance),    change: summary.balanceChange,  icon: '💰', up: summary.totalBalance >= 0 },
          { label: 'Monthly Income',    value: fmt(summary.monthlyIncome),   change: summary.incomeChange,   icon: '📈', up: summary.monthlyIncome >= 0 },
          { label: 'Monthly Expenses',  value: fmt(summary.monthlyExpenses), change: summary.expenseChange,  icon: '📤', up: summary.monthlyExpenses > 0 },
        ].map(c => (
          <div className="stat-card" key={c.label}>
            <div className="stat-label">
              {c.label}
              <div className="stat-icon">{c.icon}</div>
            </div>
            <div className="stat-value">{c.value}</div>
            <span className={`stat-badge ${c.up ? 'up' : 'down'}`}>
              {c.up ? '▲' : '▼'} {Math.abs(c.change)}%
            </span>
            <span className="stat-badge-label">vs last month</span>
          </div>
        ))}
      </div>

      {/* ── MIDDLE ROW ── */}
      <div className="dashboard-grid">
        {/* Cash Flow */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Cash Flow Overview</span>
            <div className="chart-tabs">
              {['6M', '1Y', 'ALL'].map(t => (
                <button key={t} className={`chart-tab ${chartTab === t ? 'active' : ''}`} onClick={() => setChartTab(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="chart-area" style={{ height: 220 }}>
            <CashFlowChart data={summary.cashFlow} />
          </div>
        </div>

        {/* Spending */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Spending</span>
            <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>···</span>
          </div>
          <DonutChart total={summary.monthlyExpenses} slices={summary.categoryData} />
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="tx-section">
        {/* Transactions */}
        <div className="panel">
          <div className="tx-header">
            <span className="panel-title">Recent Transactions</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-filter">⚡ Filter</button>
              <button className="btn-view">View All</button>
            </div>
          </div>
          <div className="tx-table-head">
            <span>Transaction Details</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {recentTxs.length === 0 && <div className="loading">No recent transactions.</div>}
          {recentTxs.map(tx => (
            <div className="tx-row" key={tx.id}>
              <div className="tx-details">
                <div className="tx-avatar">{getIcon(tx.category)}</div>
                <div>
                  <div className="tx-name">{tx.title}</div>
                  <div className="tx-cat">
                    {tx.category} 
                    {tx.recipient && ` • To: ${tx.recipient}`}
                    {tx.location && ` • At: ${tx.location}`}
                  </div>
                </div>
              </div>
              <div className="tx-date">{tx.date}</div>
              <div className={`tx-amount ${tx.amount < 0 ? 'neg' : 'pos'}`}>
                {tx.amount < 0 ? '-' : '+'}{fmt(tx.amount)}
              </div>
              <div>
                <span className="tx-status completed">Completed</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Quick Transfer */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Quick Transfer</span>
            </div>
            <div className="quick-transfer">
              <div>
                <div className="input-label">Amount</div>
                <div className="input-field">
                  <input
                    type="number"
                    placeholder="$0.00"
                    value={transfer.amount}
                    onChange={e => setTransfer(p => ({ ...p, amount: e.target.value }))}
                  />
                  <span className="currency-label">USD</span>
                </div>
              </div>
              <div>
                <div className="input-label">Send to</div>
                <div className="input-field">
                  <input 
                    list="recipients" 
                    placeholder="Type or select recipient..." 
                    value={transfer.recipient} 
                    onChange={e => setTransfer(p => ({ ...p, recipient: e.target.value }))}
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                  />
                  <datalist id="recipients">
                    {uniqueRecipients.map(r => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>
                </div>
              </div>
              <button
                className="btn-send"
                onClick={() => {
                  if (transfer.amount && transfer.recipient) {
                    alert(`Sent $${transfer.amount} to ${transfer.recipient}! (Connect backend to make real)`);
                    setTransfer({ amount: '', recipient: '' });
                  }
                }}
              >
                Send Money
              </button>
            </div>
          </div>

          {/* Actionable Insights */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Actionable Insights</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              {summary.insights.length === 0 && (
                <div style={{ color: '#8b96a5', fontSize: 13, textAlign: 'center', padding: '1rem 0' }}>
                  Add more transactions to generate insights.
                </div>
              )}
              {summary.insights.map(insight => (
                <div key={insight.id} style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8, border: `1px solid ${insight.color}20` }}>
                  <div style={{ fontSize: 20 }}>{insight.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: insight.color, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{insight.title}</div>
                    <div style={{ color: '#e8edf3', fontSize: 13, lineHeight: 1.4 }}>{insight.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
