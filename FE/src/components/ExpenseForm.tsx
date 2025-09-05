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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-glow border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {expense ? "Edit Transaction" : "Add New Transaction"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: "expense" | "income") => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter transaction title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="hero" className="flex-1">
                {expense ? "Update" : "Add"} Transaction
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}