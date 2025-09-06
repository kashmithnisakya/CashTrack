import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { apiService } from '@/services/api';
import { IncomeRequest } from '@/types/api';

interface IncomeFormProps {
  onCancel: () => void;
  onIncomeAdded?: () => void;
}

export function IncomeForm({ onCancel, onIncomeAdded }: IncomeFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set default date to today
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!description || !amount || !date) {
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
      const incomeRequest: IncomeRequest = {
        amount: amountNum,
        date: new Date(date).toISOString(),
        description: description
      };

      console.log('📝 Adding income via API:', incomeRequest);
      const response = await apiService.addIncome(incomeRequest);
      console.log('✅ Income added successfully:', response);

      // Call success callback
      if (onIncomeAdded) {
        onIncomeAdded();
      }

      // Reset form
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().split('T')[0]);
      
      onCancel(); // Close the form

    } catch (error: unknown) {
      console.error('❌ Error adding income:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add income. Please try again.';
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
            Add New Income
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="hover:bg-destructive/10 hover:text-destructive rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-foreground/80">Income Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="e.g., Salary, Freelance, Investment Returns"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <Label htmlFor="date" className="text-sm font-semibold text-foreground/80">Income Date</Label>
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
                variant="success"
                size="lg"
                className="flex-1 h-12 rounded-xl font-bold bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
                    Adding Income...
                  </>
                ) : (
                  <>💰 Add Income</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}