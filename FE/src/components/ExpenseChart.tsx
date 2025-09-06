import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Expense } from "./Dashboard";

interface ExpenseChartProps {
  expenses: Expense[];
}

// Modern gradient color palette
const EXPENSE_COLORS = [
  '#F59E0B', // Amber
  '#EF4444', // Red  
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const [activeView, setActiveView] = useState<'trends' | 'categories' | 'comparison'>('trends');

  // Separate income and expenses
  const incomeData = expenses.filter(e => e.type === "income");
  const expenseData = expenses.filter(e => e.type === "expense");
  
  // Group expenses by category
  const expensesByCategory = expenseData.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: EXPENSE_COLORS[index % EXPENSE_COLORS.length]
  }));

  // Create monthly trend data (last 4 months for compactness)
  const last4Months = Array.from({ length: 4 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (3 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      income: incomeData
        .filter(e => new Date(e.date).getMonth() === date.getMonth())
        .reduce((sum, e) => sum + e.amount, 0),
      expenses: expenseData
        .filter(e => new Date(e.date).getMonth() === date.getMonth())
        .reduce((sum, e) => sum + e.amount, 0),
    };
  });

  const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomeData.reduce((sum, e) => sum + e.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-lg opacity-20"></div>
          <div className="relative w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">No Data to Visualize</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Add transactions to see insights</p>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-slate-700 dark:text-slate-300 font-semibold mb-2 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {entry.name}: <span className="font-bold">${entry.value.toFixed(2)}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <Button
            variant={activeView === 'trends' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('trends')}
            className={`text-xs font-semibold transition-all duration-300 ${
              activeView === 'trends' 
                ? 'bg-white dark:bg-slate-700 shadow-sm' 
                : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Trends
          </Button>
          <Button
            variant={activeView === 'categories' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('categories')}
            className={`text-xs font-semibold transition-all duration-300 ${
              activeView === 'categories' 
                ? 'bg-white dark:bg-slate-700 shadow-sm' 
                : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <PieChartIcon className="w-3 h-3 mr-1" />
            Categories
          </Button>
          <Button
            variant={activeView === 'comparison' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('comparison')}
            className={`text-xs font-semibold transition-all duration-300 ${
              activeView === 'comparison' 
                ? 'bg-white dark:bg-slate-700 shadow-sm' 
                : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Compare
          </Button>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Balance</p>
          <p className={`text-sm font-bold ${totalIncome - totalExpenses >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            ${(totalIncome - totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart Content */}
      <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4">
        {activeView === 'trends' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">4-Month Financial Trends</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Income</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Expenses</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={last4Months} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" opacity={0.2} />
                <XAxis dataKey="month" stroke="currentColor" className="text-slate-600 dark:text-slate-400" fontSize={11} />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400" fontSize={11} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fill="url(#incomeGradient)" name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="#F59E0B" strokeWidth={2} fill="url(#expenseGradient)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeView === 'categories' && pieData.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Expense Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.slice(0, 5).map((item, index) => {
                  const percentage = ((item.value / totalExpenses) * 100).toFixed(1);
                  return (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">${item.value.toFixed(2)}</p>
                        <p className="text-xs text-slate-500">{percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeView === 'comparison' && (
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Income vs Expenses</h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={last4Months} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" opacity={0.2} />
                <XAxis dataKey="month" stroke="currentColor" className="text-slate-600 dark:text-slate-400" fontSize={11} />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400" fontSize={11} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#10B981" name="Income" radius={[2, 2, 0, 0]} />
                <Bar dataKey="expenses" fill="#F59E0B" name="Expenses" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}