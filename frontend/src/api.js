// ─── API SERVICE ───────────────────────────────────────────
// All backend calls live here. Change BASE_URL to match your Spring Boot port.
// Spring Boot default: http://localhost:8080

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// helper: fetch + parse JSON, throw on error
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
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

// ── AUTH ─────────────────────────────────────────────────
export const loginUser      = (data) => apiFetch('/auth/login',    { method: 'POST', body: JSON.stringify(data) });
export const registerUser   = (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const changePassword = (data) => apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(data) });

// ── SUMMARY ──────────────────────────────────────────────
// Summary is now calculated dynamically on the frontend.
