import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";

const API = "http://localhost:8080/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [budget, setBudget] = useState(5000);

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

  const income = expenses.filter(e => e.type==="income").reduce((a,e)=>a+e.amount,0);
  const expense = expenses.filter(e => e.type==="expense").reduce((a,e)=>a+e.amount,0);

  // FILTER
  const filteredExpenses = filter === "all"
    ? expenses
    : expenses.filter(e => e.type === filter);

  // CATEGORY DATA
  const categoryData = Object.values(
    expenses.reduce((acc, e) => {
      if (!acc[e.category]) acc[e.category] = { name: e.category, value: 0 };
      acc[e.category].value += e.amount;
      return acc;
    }, {})
  );

  // BAR DATA
  const barData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense }
  ];

  // MONTHLY TREND
  const monthlyData = Object.values(
    expenses.reduce((acc, e) => {
      const month = e.date?.slice(0, 7);
      if (!acc[month]) acc[month] = { name: month, value: 0 };
      acc[month].value += e.amount;
      return acc;
    }, {})
  );

  return (
    <div style={{padding:"20px",background:"#0f172a",color:"white",minHeight:"100vh"}}>

      <h1>💰 Advanced Expense Dashboard</h1>

      {/* FILTER + BUDGET */}
      <div style={{display:"flex",gap:"20px",margin:"20px 0"}}>
        <select onChange={(e)=>setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="number"
          placeholder="Set Budget"
          onChange={(e)=>setBudget(e.target.value)}
        />
      </div>

      {/* BUDGET STATUS */}
      <h3>
        Budget: ₹{budget} | Used: ₹{expense} |
        {expense > budget ? " ⚠️ Over Budget" : " ✅ Safe"}
      </h3>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
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

      {/* CHARTS */}
      <div style={{display:"flex",gap:"40px",marginTop:"30px"}}>

        <PieChart width={250} height={250}>
          <Pie data={categoryData} dataKey="value">
            {categoryData.map((_, i) => (
              <Cell key={i} fill={["#3b82f6","#22c55e","#ef4444","#facc15"][i % 4]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        <BarChart width={250} height={250} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>

        <LineChart width={300} height={250} data={monthlyData}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip/>
          <Line type="monotone" dataKey="value" stroke="#22c55e"/>
        </LineChart>

      </div>

      {/* TRANSACTIONS */}
      <h2 style={{marginTop:"30px"}}>Recent Transactions</h2>

      {filteredExpenses.map(e => (
        <div key={e.id} style={{
          display:"flex",
          justifyContent:"space-between",
          background:"#1e293b",
          padding:"10px",
          margin:"10px 0",
          borderRadius:"8px"
        }}>
          <div>{e.title} ({e.category})</div>
          <div>₹{e.amount} [{e.type}]</div>
        </div>
      ))}

    </div>
  );
}

export default App;