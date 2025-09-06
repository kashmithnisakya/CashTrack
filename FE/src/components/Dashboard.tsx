import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CashTrackLogo } from "@/components/CashTrackLogo";
import { 
  Plus, 
  Minus,
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2,
  LogOut,
  RefreshCw
} from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { IncomeForm } from "./IncomeForm";
import { ExpenseChart } from "./ExpenseChart";
import { useExpenses } from "@/hooks/use-expenses";
import { useIncomes } from "@/hooks/use-incomes";
import { Expense as ApiExpense, Income as ApiIncome } from "@/types/api";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: "expense" | "income";
}

interface DashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const { 
    expenses: apiExpenses, 
    loading: expensesLoading, 
    error: expensesError, 
    refresh: refreshExpenses 
  } = useExpenses({ limit: 20 });

  const { 
    incomes: apiIncomes, 
    loading: incomesLoading, 
    error: incomesError, 
    refresh: refreshIncomes 
  } = useIncomes({ limit: 20 });

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Convert API data to local format and combine expenses and incomes
  const expenses: Expense[] = [
    ...apiExpenses.map(apiExpense => ({
      id: apiExpense.expense_id,
      title: apiExpense.description,
      amount: apiExpense.amount,
      category: apiExpense.category,
      date: new Date(apiExpense.date).toISOString().split('T')[0],
      type: "expense" as const
    })),
    ...apiIncomes.map(apiIncome => ({
      id: apiIncome.income_id,
      title: apiIncome.description,
      amount: apiIncome.amount,
      category: "Income", // Set default category for income
      date: new Date(apiIncome.date).toISOString().split('T')[0],
      type: "income" as const
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first

  const loading = expensesLoading || incomesLoading;
  const error = expensesError || incomesError;

  const totalIncome = expenses
    .filter(e => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses
    .filter(e => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleAddExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses([newExpense, ...expenses]);
    setShowExpenseForm(false);
  };

  const handleEditExpense = (expense: Omit<Expense, "id">) => {
    if (editingExpense) {
      setExpenses(expenses.map(e => 
        e.id === editingExpense.id 
          ? { ...expense, id: editingExpense.id }
          : e
      ));
      setEditingExpense(null);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const startEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const refresh = async () => {
    await Promise.all([refreshExpenses(), refreshIncomes()]);
  };

  const handleExpenseAdded = () => {
    // Refresh expenses after adding a new expense
    console.log('💸 Expense successfully added to backend! Refreshing lists...');
    refresh();
    setShowExpenseForm(false);
  };

  const handleIncomeAdded = () => {
    // Refresh incomes after adding new income
    console.log('💰 Income successfully added to backend! Refreshing lists...');
    refresh();
    setShowIncomeForm(false);
  };

  const openExpenseForm = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const openIncomeForm = () => {
    setShowIncomeForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900/20 transition-all duration-500">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90 backdrop-blur-xl"></div>
        <div className="relative container mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <CashTrackLogo 
                  size={52} 
                  variant="full"
                  className="text-4xl text-white drop-shadow-2xl"
                />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl opacity-50"></div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-white/95 tracking-tight">Dashboard</h1>
                <p className="text-white/70 text-sm">Manage your financial future</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"></div>
                <div className="relative text-white text-right">
                  <p className="font-bold text-lg tracking-wide">{user.name}</p>
                  <p className="text-sm text-white/80 font-medium">{user.email}</p>
                </div>
              </div>
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="lg"
                onClick={onLogout}
                className="bg-white/15 hover:bg-white/25 border-white/30 hover:border-white/40 text-white backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Portfolio Balance Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 group cursor-pointer transform hover:-translate-y-2">
            <div className={`absolute inset-0 bg-gradient-to-br ${balance >= 0 ? 'from-emerald-400/10 via-green-400/5 to-teal-400/10' : 'from-red-400/10 via-orange-400/5 to-pink-400/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
            <CardHeader className="relative flex flex-row items-center justify-between pb-6 pt-8">
              <div>
                <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Portfolio Balance</CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${balance >= 0 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-pink-500'} animate-pulse`}></div>
                  <span className={`text-xs font-semibold ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {balance >= 0 ? 'GROWING' : 'DEFICIT'}
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${balance >= 0 ? 'from-emerald-400 to-green-500' : 'from-red-400 to-pink-500'} rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500`}></div>
                <div className={`relative w-12 h-12 bg-gradient-to-r ${balance >= 0 ? 'from-emerald-400 to-green-500' : 'from-red-400 to-pink-500'} rounded-full flex items-center justify-center shadow-lg`}>
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative pt-0 pb-8">
              <div className={`text-4xl font-black mb-4 bg-gradient-to-r ${balance >= 0 ? 'from-emerald-600 to-green-600' : 'from-red-600 to-pink-600'} bg-clip-text text-transparent`}>
                ${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center text-sm font-bold">
                {balance >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                )}
                <span className={balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                  {balance >= 0 ? 'Wealth Growing' : 'Needs Attention'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Income Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 dark:from-slate-800 dark:via-emerald-900/20 dark:to-green-900/20 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 group cursor-pointer transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-green-400/5 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative flex flex-row items-center justify-between pb-6 pt-8">
              <div>
                <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Total Income</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">ACTIVE</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative pt-0 pb-8">
              <div className="text-4xl font-black mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                Revenue Stream Active
              </p>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 dark:from-slate-800 dark:via-orange-900/20 dark:to-amber-900/20 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 group cursor-pointer transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-amber-400/5 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative flex flex-row items-center justify-between pb-6 pt-8">
              <div>
                <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Total Expenses</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">TRACKING</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative pt-0 pb-8">
              <div className="text-4xl font-black mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
                Cost Management
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Chart */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 dark:from-slate-800 dark:via-slate-700 dark:to-indigo-900/20 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 via-purple-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative pb-8 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Wealth Analytics
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Track your financial growth</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <ExpenseChart expenses={expenses} />
            </CardContent>
          </Card>

          {/* Income Section */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50/50 to-teal-50/30 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-green-400/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative flex flex-row items-center justify-between pb-8 pt-8">
              <div>
                <CardTitle className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Income Stream
                </CardTitle>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm font-bold">💰 Revenue Sources</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => refreshIncomes()}
                  disabled={incomesLoading}
                  className="hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${incomesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  size="sm"
                  onClick={openIncomeForm}
                  className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Income
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {incomesLoading && apiIncomes.length === 0 && (
                  <div className="text-center py-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                      <RefreshCw className="relative w-16 h-16 mx-auto mb-4 text-emerald-400 animate-spin" />
                    </div>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">Loading incomes...</p>
                    <p className="text-emerald-500 dark:text-emerald-500 text-sm">Fetching your revenue data</p>
                  </div>
                )}
                
                {incomesError && apiIncomes.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-red-400 opacity-60" />
                    <p className="text-red-600 dark:text-red-400 font-bold mb-3">Failed to load incomes</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => refreshIncomes()}
                      className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try again
                    </Button>
                  </div>
                )}
                
                {!incomesLoading && !incomesError && apiIncomes.map((income) => (
                  <div key={income.income_id} className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50/80 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-emerald-950/30 border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/10 transform hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                          <h4 className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-base">{income.description}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-semibold">{new Date(income.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="relative">
                          <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            +${income.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {!incomesLoading && !incomesError && apiIncomes.length === 0 && (
                  <div className="text-center py-12">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-10"></div>
                      <DollarSign className="relative w-16 h-16 mx-auto text-emerald-400 opacity-60" />
                    </div>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-2">No income streams yet</p>
                    <p className="text-emerald-500 dark:text-emerald-500 text-sm mb-4">Start building your wealth by adding income sources</p>
                    <Button 
                      onClick={openIncomeForm}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Income
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expenses Section */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/50 to-yellow-50/30 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-amber-400/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative flex flex-row items-center justify-between pb-8 pt-8">
              <div>
                <CardTitle className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  Expense Tracking
                </CardTitle>
                <p className="text-orange-700 dark:text-orange-300 text-sm font-bold">💸 Cost Management</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => refreshExpenses()}
                  disabled={expensesLoading}
                  className="hover:bg-orange-100 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${expensesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  size="sm"
                  onClick={openExpenseForm}
                  className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 font-bold"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {expensesLoading && apiExpenses.length === 0 && (
                  <div className="text-center py-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                      <RefreshCw className="relative w-16 h-16 mx-auto mb-4 text-orange-400 animate-spin" />
                    </div>
                    <p className="text-orange-600 dark:text-orange-400 font-bold">Loading expenses...</p>
                    <p className="text-orange-500 dark:text-orange-500 text-sm">Fetching your spending data</p>
                  </div>
                )}
                
                {expensesError && apiExpenses.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-red-400 opacity-60" />
                    <p className="text-red-600 dark:text-red-400 font-bold mb-3">Failed to load expenses</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => refreshExpenses()}
                      className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try again
                    </Button>
                  </div>
                )}
                
                {!expensesLoading && !expensesError && apiExpenses.map((expense) => (
                  <div key={expense.expense_id} className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/80 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-orange-950/30 border border-orange-200/50 dark:border-orange-700/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-500 hover:shadow-lg hover:shadow-orange-500/10 transform hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-pulse"></div>
                          <h4 className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-base">{expense.description}</h4>
                          <Badge 
                            variant="outline"
                            className="px-2 py-1 text-xs bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-700 font-semibold"
                          >
                            {expense.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-semibold">{new Date(expense.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="relative">
                          <span className="text-xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            -${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {!expensesLoading && !expensesError && apiExpenses.length === 0 && (
                  <div className="text-center py-12">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-10"></div>
                      <DollarSign className="relative w-16 h-16 mx-auto text-orange-400 opacity-60" />
                    </div>
                    <p className="text-orange-600 dark:text-orange-400 font-bold text-lg mb-2">No expenses tracked yet</p>
                    <p className="text-orange-500 dark:text-orange-500 text-sm mb-4">Start monitoring your spending patterns</p>
                    <Button 
                      onClick={openExpenseForm}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                    >
                      <Minus className="w-4 h-4 mr-2" />
                      Add First Expense
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onCancel={() => setShowExpenseForm(false)}
          onExpenseAdded={handleExpenseAdded}
        />
      )}

      {/* Income Form Modal */}
      {showIncomeForm && (
        <IncomeForm
          onCancel={() => setShowIncomeForm(false)}
          onIncomeAdded={handleIncomeAdded}
        />
      )}
    </div>
  );
}