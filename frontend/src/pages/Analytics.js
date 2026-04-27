import React from 'react';

const BAR_DATA = [
  { month: 'Jan', income: 7200, expense: 2800 },
  { month: 'Feb', income: 6800, expense: 3100 },
  { month: 'Mar', income: 7500, expense: 2600 },
  { month: 'Apr', income: 8000, expense: 3300 },
  { month: 'May', income: 7900, expense: 2900 },
  { month: 'Jun', income: 8240, expense: 3120 },
];

function BarChart({ data }) {
  const max = Math.max(...data.flatMap(d => [d.income, d.expense]));
  const W = 520, H = 160, barW = 28, gap = 14;
  const groupW = barW * 2 + gap;
  const totalW = data.length * (groupW + 20);

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="chart-svg">
      {data.map((d, i) => {
        const x = 10 + i * (groupW + 20);
        const incH = (d.income / max) * H;
        const expH = (d.expense / max) * H;
        return (
          <g key={d.month}>
            <rect x={x} y={H - incH} width={barW} height={incH} rx="4" fill="#00e5a0" opacity="0.8" />
            <rect x={x + barW + gap} y={H - expH} width={barW} height={expH} rx="4" fill="#7c5cfc" opacity="0.8" />
            <text x={x + barW} y={H + 18} textAnchor="middle" fill="#4a5568" fontSize="11" fontFamily="DM Sans">{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Analytics() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Analytics</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['1M','3M','6M','1Y'].map(t => (
            <button key={t} className={`filter-chip ${t === '6M' ? 'active' : ''}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="analytics-grid">
        {[
          { label: 'Total Income',    value: '$49,443.00', change: '+8.2%', up: true,  color: 'var(--accent-green)' },
          { label: 'Total Expenses',  value: '$17,820.00', change: '-3.1%', up: false, color: 'var(--accent-red)' },
          { label: 'Net Savings',     value: '$31,623.00', change: '+14.5%',up: true,  color: 'var(--accent-purple)' },
          { label: 'Savings Rate',    value: '63.9%',      change: '+2.1%', up: true,  color: '#3b5bdb' },
        ].map(s => (
          <div className="panel" key={s.label}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 6 }}>{s.label}</div>
            <div className="big-stat" style={{ color: s.color }}>{s.value}</div>
            <span className={`stat-badge ${s.up ? 'up' : 'down'}`}>{s.change} vs last period</span>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-header">
          <span className="panel-title">Income vs Expenses</span>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span><span style={{ color: 'var(--accent-green)' }}>■</span> Income</span>
            <span><span style={{ color: 'var(--accent-purple)' }}>■</span> Expenses</span>
          </div>
        </div>
        <div style={{ height: 200 }}>
          <BarChart data={BAR_DATA} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-title" style={{ marginBottom: 16 }}>Spending Breakdown</div>
        {[
          { cat: 'Housing',       amt: 1400, pct: 45, color: '#7c5cfc' },
          { cat: 'Food & Dining', amt: 936,  pct: 30, color: '#00e5a0' },
          { cat: 'Entertainment', amt: 780,  pct: 25, color: '#3b5bdb' },
          { cat: 'Transport',     amt: 4,    pct: 0,  color: '#ff5c7c' },
        ].map(r => (
          <div className="budget-row" key={r.cat}>
            <div className="budget-row-top">
              <span className="budget-cat">{r.cat}</span>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{r.pct}%</span>
                <span className="budget-amt">${r.amt}</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${r.pct}%`, background: r.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
