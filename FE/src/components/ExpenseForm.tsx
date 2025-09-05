import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { apiService } from '@/services/api';
import { ExpenseRequest } from '@/types/api';
import type { Expense } from "./Dashboard";

interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (expense: Omit<Expense, "id">) => void;
  onCancel: () => void;
  onExpenseAdded?: () => void; // Callback for when expense is successfully added
  defaultType?: "expense" | "income"; // Default transaction type
}

const categories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Healthcare",
  "Education",
  "Other"
];

export function ExpenseForm({ expense, onSubmit, onCancel, onExpenseAdded, defaultType = "expense" }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"expense" | "income">(defaultType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(expense.date);
      setType(expense.type);
    } else {
      // Set default date to today and use default type
      setDate(new Date().toISOString().split('T')[0]);
      setType(defaultType);
    }
  }, [expense, defaultType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!title || !amount || !category || !date) {
      setError('All fields are required');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      // If this is a new expense (not editing), call the API
      if (!expense && type === 'expense') {
        const expenseRequest: ExpenseRequest = {
          amount: amountNum,
          category,
          date: new Date(date).toISOString(),
          description: title // Using title as description
        };

        console.log('📝 Adding expense via API:', expenseRequest);
        const response = await apiService.addExpense(expenseRequest);
        console.log('✅ Expense added successfully:', response);

        // Call success callback
        if (onExpenseAdded) {
          onExpenseAdded();
        }
      } else {
        // For editing or income, use the existing mock functionality
        onSubmit({
          title,
          amount: amountNum,
          category,
          date,
          type
        });
      }

      // Reset form
      setTitle("");
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split('T')[0]);
      setType("expense");
      
      onCancel(); // Close the form

    } catch (error: unknown) {
      console.error('❌ Error adding expense:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add expense. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-2xl font-bold gradient-text">
            {expense ? "Edit Transaction" : `Add New ${type === 'income' ? 'Income' : 'Expense'}`}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="hover:bg-destructive/10 hover:text-destructive rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold text-foreground/80">Transaction Type</Label>
              <Select value={type} onValueChange={(value: "expense" | "income") => setType(value)} disabled={!expense}>
                <SelectTrigger className={`h-12 rounded-xl border-2 focus:border-primary transition-all duration-300 ${!expense ? 'opacity-75 cursor-not-allowed' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="expense" className="rounded-lg font-medium">💸 Expense</SelectItem>
                  <SelectItem value="income" className="rounded-lg font-medium">💰 Income</SelectItem>
                </SelectContent>
              </Select>
              {!expense && (
                <p className="text-xs text-muted-foreground">
                  Transaction type is locked based on the button you clicked
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-foreground/80">Transaction Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Grocery Shopping, Salary, Coffee"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold text-foreground/80">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300 text-lg font-semibold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold text-foreground/80">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="rounded-lg font-medium">
                      {cat === 'Food' && '🍽️'} {cat === 'Transportation' && '🚗'} 
                      {cat === 'Entertainment' && '🎬'} {cat === 'Shopping' && '🛍️'} 
                      {cat === 'Bills' && '📄'} {cat === 'Healthcare' && '🏥'} 
                      {cat === 'Education' && '📚'} {cat === 'Income' && '💰'} 
                      {cat === 'Other' && '📦'} {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold text-foreground/80">Transaction Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                size="lg"
                className="flex-1 h-12 rounded-xl font-semibold"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant={type === 'income' ? 'success' : 'wealth'} 
                size="lg"
                className="flex-1 h-12 rounded-xl font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
                    {type === 'income' ? 'Adding Income...' : 'Adding Expense...'}
                  </>
                ) : (
                  <>{expense ? "💾 Update" : "✨ Add"} {expense ? 'Transaction' : (type === 'income' ? 'Income' : 'Expense')}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}