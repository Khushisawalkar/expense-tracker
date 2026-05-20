export function processAnalytics(transactions) {
    if (!transactions || transactions.length === 0) {
        return {
            categoryData: [],
            cashFlow: [],
            insights: [],
            totalExpenses: 0,
            totalIncome: 0
        };
    }

    // 1. Group by month
    const monthlyData = {};
    const categoryTotals = {};
    const categoryMonthlyTotals = {}; // { category: { month: amount } }

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(tx => {
        // Assume tx.date is "YYYY-MM-DD"
        const date = new Date(tx.date);
        const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { month: monthYear, income: 0, expense: 0, timestamp: date.getTime() };
        }

        if (tx.amount > 0) {
            monthlyData[monthYear].income += tx.amount;
            totalIncome += tx.amount;
        } else {
            const expAmount = Math.abs(tx.amount);
            monthlyData[monthYear].expense += expAmount;
            totalExpenses += expAmount;

            // Category aggregation
            const cat = tx.category || 'Other';
            categoryTotals[cat] = (categoryTotals[cat] || 0) + expAmount;

            if (!categoryMonthlyTotals[cat]) categoryMonthlyTotals[cat] = {};
            categoryMonthlyTotals[cat][monthYear] = (categoryMonthlyTotals[cat][monthYear] || 0) + expAmount;
        }
    });

    // Sort cash flow by date
    const cashFlow = Object.values(monthlyData).sort((a, b) => a.timestamp - b.timestamp);
    const sortedMonths = cashFlow.map(c => c.month);
    
    // Formatting category data for DonutChart
    const palette = ['#7c5cfc', '#00e5a0', '#3b5bdb', '#ff6b6b', '#fca311', '#4ecdc4', '#ff9f1c'];
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    const categoryData = sortedCategories.map(([label, amount], i) => ({
        label,
        amount,
        pct: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        color: palette[i % palette.length]
    }));

    // Generate Insights
    const insights = [];
    const currentMonth = cashFlow[cashFlow.length - 1]?.month;
    
    if (cashFlow.length >= 2) {
        // Trend Forecasting (next month prediction based on simple moving average of last 3 months)
        const recentMonths = cashFlow.slice(-3);
        const avgExpense = recentMonths.reduce((sum, m) => sum + m.expense, 0) / recentMonths.length;
        insights.push({
            id: 'forecast',
            type: 'forecast',
            title: 'Spending Forecast',
            text: `Based on recent trends, projected expenses for next month are $${avgExpense.toFixed(2)}.`,
            icon: '🔮',
            color: '#3b5bdb'
        });

        // Overall month-over-month
        const prevMonth = cashFlow[cashFlow.length - 2];
        const currMonthData = cashFlow[cashFlow.length - 1];
        if (currMonthData.expense > prevMonth.expense) {
            const diff = currMonthData.expense - prevMonth.expense;
            const pct = (diff / prevMonth.expense) * 100;
            if (pct > 5) {
                 insights.push({
                    id: 'mom-alert',
                    type: 'alert',
                    title: 'Increased Spending',
                    text: `Your expenses this month are up ${pct.toFixed(1)}% compared to last month.`,
                    icon: '📈',
                    color: '#ff6b6b'
                });
            }
        } else if (currMonthData.expense < prevMonth.expense) {
            const diff = prevMonth.expense - currMonthData.expense;
            const pct = (diff / prevMonth.expense) * 100;
            if (pct > 5) {
                insights.push({
                   id: 'mom-success',
                   type: 'success',
                   title: 'Great Job!',
                   text: `Your expenses are down ${pct.toFixed(1)}% compared to last month.`,
                   icon: '🎉',
                   color: '#00e5a0'
               });
           }
        }
    }

    // Anomaly Detection per Category
    if (currentMonth) {
        sortedCategories.forEach(([cat, total]) => {
            const history = sortedMonths.slice(0, -1).map(m => categoryMonthlyTotals[cat]?.[m] || 0);
            const currentSpend = categoryMonthlyTotals[cat]?.[currentMonth] || 0;
            
            if (history.length > 0) {
                const avg = history.reduce((a,b) => a+b, 0) / history.length;
                if (avg > 0 && currentSpend > avg * 1.5) { // 50% higher than average
                    const diffPct = ((currentSpend - avg) / avg) * 100;
                    insights.push({
                        id: `anomaly-${cat}`,
                        type: 'anomaly',
                        title: 'Spending Anomaly Detected',
                        text: `${cat} spending is unusually high (${diffPct.toFixed(0)}% above average of $${avg.toFixed(2)}).`,
                        icon: '⚠️',
                        color: '#fca311'
                    });
                }
            }
        });
    }

    // Top Category Insight
    if (categoryData.length > 0) {
        const topCat = categoryData[0];
        insights.push({
            id: 'top-cat',
            type: 'summary',
            title: 'High-Impact Lever',
            text: `${topCat.label} is ${topCat.pct}% of your expenses. Modifying this has the highest ROI.`,
            icon: '💡',
            color: '#7c5cfc'
        });
    }

    // Ensure we have at least some dummy cash flow if < 2 items, for the chart to render well
    let finalCashFlow = cashFlow.map(c => ({ month: c.month, amount: c.expense }));
    if (finalCashFlow.length === 1) {
        finalCashFlow.unshift({ month: 'Prev', amount: 0 });
    } else if (finalCashFlow.length === 0) {
        finalCashFlow = [{ month: 'Jan', amount: 0 }, { month: 'Feb', amount: 0 }];
    }

    return {
        categoryData,
        cashFlow: finalCashFlow,
        insights,
        totalExpenses,
        totalIncome
    };
}
