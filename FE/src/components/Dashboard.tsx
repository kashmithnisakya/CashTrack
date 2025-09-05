import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CashTrackLogo } from "@/components/CashTrackLogo";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2,
  LogOut
} from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseChart } from "./ExpenseChart";

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
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      title: "Grocery Shopping",
      amount: 85.50,
      category: "Food",
      date: "2024-01-15",
      type: "expense"
    },
    {
      id: "2",
      title: "Salary",
      amount: 3500.00,
      category: "Income",
      date: "2024-01-01",
      type: "income"
    },
    {
      id: "3",
      title: "Coffee",
      amount: 4.50,
      category: "Food",
      date: "2024-01-14",
      type: "expense"
    }
  ]);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

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

  const cancelEdit = () => {
    setEditingExpense(null);
    setShowExpenseForm(false);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Chart */}
          <Card className="shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold gradient-text">Wealth Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart expenses={expenses} />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-2xl font-bold gradient-text">Transaction History</CardTitle>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => {
                  setEditingExpense(null);
                  setShowExpenseForm(true);
                }}
                className="bg-gradient-wealth shadow-wealth hover:shadow-hover transition-all duration-500 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Transaction
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="group flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-muted/30 to-muted/50 hover:from-muted/50 hover:to-muted/70 border border-border/50 hover:border-primary/30 transition-all duration-300">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{expense.title}</h4>
                        <Badge 
                          variant={expense.type === "income" ? "default" : "destructive"}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            expense.type === "income" 
                              ? 'bg-success/20 text-success border-success/30' 
                              : 'bg-warning/20 text-warning border-warning/30'
                          }`}
                        >
                          {expense.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">{new Date(expense.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-2xl font-bold ${
                        expense.type === "income" ? 'text-success' : 'text-warning'
                      }`}>
                        {expense.type === "income" ? '+' : '-'}${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => startEdit(expense)}
                          className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit className="w-5 h-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {expenses.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-semibold mb-2">No transactions yet</p>
                    <p className="text-lg">Start your wealth journey by adding your first transaction</p>
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
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
}