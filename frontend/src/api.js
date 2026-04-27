// ─── API SERVICE ───────────────────────────────────────────
// All backend calls live here. Change BASE_URL to match your Spring Boot port.
// Spring Boot default: http://localhost:8080

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// helper: fetch + parse JSON, throw on error
async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── EXPENSES ─────────────────────────────────────────────
export const getAllExpenses  = ()         => apiFetch('/expenses');
export const addExpense      = (data)     => apiFetch('/expenses',      { method: 'POST',   body: JSON.stringify(data) });
export const updateExpense   = (id, data) => apiFetch(`/expenses/${id}`, { method: 'PUT',    body: JSON.stringify(data) });
export const deleteExpense   = (id)       => apiFetch(`/expenses/${id}`, { method: 'DELETE' });

// ── SUMMARY ──────────────────────────────────────────────
// Expected response: { totalBalance, monthlyIncome, monthlyExpenses, cashFlow: [...] }
export const getSummary = () => apiFetch('/summary');

// ── MOCK DATA (used when backend is offline) ──────────────
export const MOCK_TRANSACTIONS = [
  { id: 1, name: 'Netflix Subscription', category: 'Entertainment', date: 'Oct 24, 2023', amount: -15.99,   status: 'completed', icon: '📺' },
  { id: 2, name: 'Upwork Escrow Inc.',   category: 'Income',         date: 'Oct 22, 2023', amount: 1250.00,  status: 'completed', icon: '💼' },
  { id: 3, name: 'Whole Foods Market',   category: 'Groceries',      date: 'Oct 21, 2023', amount: -142.50,  status: 'pending',   icon: '🛒' },
  { id: 4, name: 'Uber Rides',           category: 'Transport',      date: 'Oct 20, 2023', amount: -24.20,   status: 'completed', icon: '🚗' },
  { id: 5, name: 'Salary Deposit',       category: 'Income',         date: 'Oct 15, 2023', amount: 6500.00,  status: 'completed', icon: '🏦' },
  { id: 6, name: 'Amazon Shopping',      category: 'Shopping',       date: 'Oct 12, 2023', amount: -89.99,   status: 'completed', icon: '📦' },
  { id: 7, name: 'Spotify',             category: 'Entertainment',  date: 'Oct 10, 2023', amount: -9.99,    status: 'completed', icon: '🎵' },
  { id: 8, name: 'Electric Bill',        category: 'Utilities',      date: 'Oct 5, 2023',  amount: -120.00,  status: 'completed', icon: '⚡' },
];

export const MOCK_SUMMARY = {
  totalBalance:     24562.00,
  monthlyIncome:    8240.50,
  monthlyExpenses:  3120.00,
  balanceChange:    12.5,
  incomeChange:     4.2,
  expenseChange:    -1.5,
  cashFlow: [
    { month: 'Jan', amount: 4200 },
    { month: 'Feb', amount: 3800 },
    { month: 'Mar', amount: 5100 },
    { month: 'Apr', amount: 4700 },
    { month: 'May', amount: 6200 },
    { month: 'Jun', amount: 8100 },
  ],
};
