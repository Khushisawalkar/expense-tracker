import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    type: "expense",
    date: "",
  });

  const fetchData = async () => {
    const res = await axios.get(API);
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API, form);
    fetchData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchData();
  };

  const income = expenses
    .filter(e => e.type === "income")
    .reduce((acc, e) => acc + e.amount, 0);

  const expense = expenses
    .filter(e => e.type === "expense")
    .reduce((acc, e) => acc + e.amount, 0);

  const balance = income - expense;

  return (
    <div style={{ background:"#0f172a", minHeight:"100vh", color:"white", padding:"20px" }}>

      <h1 style={{ fontSize:"32px", marginBottom:"20px" }}>💰 Expense Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div style={{ display:"flex", gap:"20px", marginBottom:"30px" }}>
        <Card title="Balance" value={balance} />
        <Card title="Income" value={income} />
        <Card title="Expense" value={expense} />
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom:"30px" }}>
        <input placeholder="Title" onChange={(e)=>setForm({...form,title:e.target.value})}/>
        <input placeholder="Category" onChange={(e)=>setForm({...form,category:e.target.value})}/>
        <input type="number" placeholder="Amount" onChange={(e)=>setForm({...form,amount:e.target.value})}/>
        
        <select onChange={(e)=>setForm({...form,type:e.target.value})}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input type="date" onChange={(e)=>setForm({...form,date:e.target.value})}/>
        <button>Add</button>
      </form>

      {/* TRANSACTIONS */}
      <h2>Transactions</h2>

      {expenses.map((e) => (
        <div key={e.id} style={{
          display:"flex",
          justifyContent:"space-between",
          background:"#1e293b",
          padding:"15px",
          borderRadius:"10px",
          margin:"10px 0"
        }}>
          <div>
            <b>{e.title}</b> ({e.category})
          </div>

          <div>
            ₹{e.amount} [{e.type}]
            <button onClick={()=>handleDelete(e.id)}> ❌ </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background:"background: "linear-gradient(135deg, #0f172a, #312e81)"",
      padding:"20px",
      borderRadius:"12px",
      width:"200px"
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize:"24px" }}>₹{value}</p>
    </div>
  );
}

export default App;