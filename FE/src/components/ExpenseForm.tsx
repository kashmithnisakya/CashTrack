import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { Expense } from "./Dashboard";

interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (expense: Omit<Expense, "id">) => void;
  onCancel: () => void;
}

const categories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Healthcare",
  "Education",
  "Income",
  "Other"
];

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(expense.date);
      setType(expense.type);
    } else {
      // Set default date to today
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !amount || !category || !date) {
      return;
    }

    onSubmit({
      title,
      amount: parseFloat(amount),
      category,
      date,
      type
    });

    // Reset form
    setTitle("");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split('T')[0]);
    setType("expense");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-2xl font-bold gradient-text">
            {expense ? "Edit Transaction" : "Create New Transaction"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="hover:bg-destructive/10 hover:text-destructive rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold text-foreground/80">Transaction Type</Label>
              <Select value={type} onValueChange={(value: "expense" | "income") => setType(value)}>
                <SelectTrigger className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="expense" className="rounded-lg font-medium">💸 Expense</SelectItem>
                  <SelectItem value="income" className="rounded-lg font-medium">💰 Income</SelectItem>
                </SelectContent>
              </Select>
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

            <div className="flex gap-4 pt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                size="lg"
                className="flex-1 h-12 rounded-xl font-semibold"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant={type === 'income' ? 'success' : 'wealth'} 
                size="lg"
                className="flex-1 h-12 rounded-xl font-bold"
              >
                {expense ? "💾 Update" : "✨ Create"} Transaction
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}