import { useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EXPENSE");

  const addTransaction = () => {
    if (!amount) return;

    const newTx = {
      id: Date.now(),
      amount: Number(amount),
      type,
    };

    setTransactions([newTx, ...transactions]);
    setAmount("");
  };

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="container">
      <h1>💰 Expense Tracker</h1>

      <div className="card">
        <h2>Balance: ₹{income - expense}</h2>
        <div className="summary">
          <p className="income">Income: ₹{income}</p>
          <p className="expense">Expense: ₹{expense}</p>
        </div>
      </div>

      <div className="card">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        <button onClick={addTransaction}>Add</button>
      </div>

      <div className="card">
        <h3>Transactions</h3>
        {transactions.map((t) => (
          <div key={t.id} className={`tx ${t.type}`}>
            ₹{t.amount} ({t.type})
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;