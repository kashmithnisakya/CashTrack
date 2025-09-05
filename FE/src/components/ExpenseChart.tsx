import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { Expense } from "./Dashboard";

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Group expenses by category
  const expensesByCategory = expenses
    .filter(e => e.type === "expense")
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  // Monthly spending data (simplified for demo)
  const monthlyData = [
    { month: 'Jan', expenses: expenses.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0) },
    { month: 'Feb', expenses: 0 },
    { month: 'Mar', expenses: 0 },
    { month: 'Apr', expenses: 0 },
  ];

  if (pieData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No expense data to display
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div>
        <h4 className="text-sm font-medium mb-4">Expenses by Category</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div>
        <h4 className="text-sm font-medium mb-4">Monthly Overview</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Expenses']} />
            <Bar dataKey="expenses" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}