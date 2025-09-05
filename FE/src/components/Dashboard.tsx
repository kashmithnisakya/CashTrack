import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import logoIcon from "@/assets/logo-icon.png";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-elegant">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="CashTrack" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-primary-foreground">CashTrack</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-primary-foreground text-right">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm opacity-90">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                ${balance.toFixed(2)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {balance >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-secondary" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 text-destructive" />
                )}
                {balance >= 0 ? 'Positive' : 'Negative'} balance
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Spending Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart expenses={expenses} />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button 
                variant="hero" 
                size="sm"
                onClick={() => {
                  setEditingExpense(null);
                  setShowExpenseForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{expense.title}</h4>
                        <Badge variant={expense.type === "income" ? "default" : "destructive"}>
                          {expense.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${expense.type === "income" ? 'text-secondary' : 'text-destructive'}`}>
                        {expense.type === "income" ? '+' : '-'}${expense.amount.toFixed(2)}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(expense)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {expenses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No transactions yet</p>
                    <p className="text-sm">Add your first expense to get started</p>
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