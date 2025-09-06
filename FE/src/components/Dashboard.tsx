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
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background transition-colors duration-500">
      {/* Header */}
      <header className="bg-gradient-primary shadow-elegant backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <CashTrackLogo 
              size={48} 
              variant="full"
              className="text-3xl text-primary-foreground drop-shadow-lg"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-primary-foreground text-right">
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-sm opacity-80">{user.email}</p>
            </div>
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="lg"
              onClick={onLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className={`shadow-premium hover:shadow-hover transition-all duration-500 border-0 ${balance >= 0 ? 'wealth-glow' : 'shadow-card'} group cursor-pointer`}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-muted-foreground">Portfolio Balance</CardTitle>
              <div className="relative">
                <DollarSign className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold mb-2 ${balance >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center text-sm font-medium">
                {balance >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-2 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-2 text-destructive" />
                )}
                <span className={balance >= 0 ? 'text-success' : 'text-destructive'}>
                  {balance >= 0 ? 'Growing Wealth' : 'Needs Attention'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-premium hover:shadow-hover transition-all duration-500 border-0 success-glow group cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-muted-foreground">Monthly Income</CardTitle>
              <div className="relative">
                <TrendingUp className="h-6 w-6 text-success group-hover:text-success-light transition-colors" />
                <div className="absolute -inset-2 bg-success/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success mb-2">
                ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm font-medium text-success/80">
                Revenue Stream Active
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-premium hover:shadow-hover transition-all duration-500 border-0 group cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-muted-foreground">Monthly Expenses</CardTitle>
              <div className="relative">
                <TrendingDown className="h-6 w-6 text-warning group-hover:text-warning-light transition-colors" />
                <div className="absolute -inset-2 bg-warning/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-warning mb-2">
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm font-medium text-warning/80">
                Cost Management
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Chart */}
          <Card className="shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold gradient-text">Wealth Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart expenses={expenses} />
            </CardContent>
          </Card>

          {/* Income Section */}
          <Card className="shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-2xl font-bold gradient-text text-success">Income</CardTitle>
              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => refreshIncomes()}
                  disabled={incomesLoading}
                  className="hover:bg-primary/10"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${incomesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={openIncomeForm}
                  className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 shadow-lg hover:shadow-success/25 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {incomesLoading && apiIncomes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-50 animate-spin" />
                    <p className="text-sm font-semibold">Loading incomes...</p>
                  </div>
                )}
                
                {incomesError && apiIncomes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-destructive">Failed to load incomes</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => refreshIncomes()}
                      className="mt-2"
                    >
                      Try again
                    </Button>
                  </div>
                )}
                
                {!incomesLoading && !incomesError && apiIncomes.map((income) => (
                  <div key={income.income_id} className="group flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-success/5 to-success/10 hover:from-success/10 hover:to-success/15 border border-success/20 hover:border-success/40 transition-all duration-300">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm group-hover:text-success transition-colors">{income.description}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(income.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-success">
                        +${income.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {!incomesLoading && !incomesError && apiIncomes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold">No income yet</p>
                    <p className="text-xs">Add your first income</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expenses Section */}
          <Card className="shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-2xl font-bold gradient-text text-warning">Expenses</CardTitle>
              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => refreshExpenses()}
                  disabled={expensesLoading}
                  className="hover:bg-primary/10"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${expensesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  variant="wealth" 
                  size="sm"
                  onClick={openExpenseForm}
                  className="bg-gradient-wealth shadow-wealth hover:shadow-hover transition-all duration-300"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {expensesLoading && apiExpenses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-50 animate-spin" />
                    <p className="text-sm font-semibold">Loading expenses...</p>
                  </div>
                )}
                
                {expensesError && apiExpenses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-destructive">Failed to load expenses</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => refreshExpenses()}
                      className="mt-2"
                    >
                      Try again
                    </Button>
                  </div>
                )}
                
                {!expensesLoading && !expensesError && apiExpenses.map((expense) => (
                  <div key={expense.expense_id} className="group flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-warning/5 to-warning/10 hover:from-warning/10 hover:to-warning/15 border border-warning/20 hover:border-warning/40 transition-all duration-300">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm group-hover:text-warning transition-colors">{expense.description}</h4>
                        <Badge 
                          variant="outline"
                          className="px-2 py-0 text-xs bg-warning/10 text-warning border-warning/30"
                        >
                          {expense.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(expense.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-warning">
                        -${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {!expensesLoading && !expensesError && apiExpenses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold">No expenses yet</p>
                    <p className="text-xs">Add your first expense</p>
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