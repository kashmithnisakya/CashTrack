import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { Expense, ListExpensesRequest, ListExpensesResponse, DeleteExpenseRequest } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

interface UseExpensesOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseExpensesReturn {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchExpenses: (skip?: number, limit?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
}

export function useExpenses(options: UseExpensesOptions = {}): UseExpensesReturn {
  const { limit = 10, autoFetch = true } = options;
  const { toast } = useToast();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchExpenses = useCallback(async (skip = 0, fetchLimit = limit) => {
    setLoading(true);
    setError(null);

    try {
      const params: ListExpensesRequest = {
        skip,
        limit: fetchLimit
      };

      const response: ListExpensesResponse = await apiService.listExpenses(params);
      
      if (response.status === 200) {
        const newExpenses = response.reports;
        
        if (skip === 0) {
          // Fresh fetch - replace all expenses
          setExpenses(newExpenses);
        } else {
          // Load more - append to existing expenses
          setExpenses(prev => [...prev, ...newExpenses]);
        }
        
        // Update pagination state
        setHasMore(newExpenses.length === fetchLimit);
        setTotalCount(skip + newExpenses.length);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch expenses';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, toast]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchExpenses(expenses.length, limit);
  }, [fetchExpenses, expenses.length, hasMore, loading, limit]);

  const refresh = useCallback(async () => {
    await fetchExpenses(0, limit);
  }, [fetchExpenses, limit]);

  const deleteExpense = useCallback(async (expenseId: string) => {
    try {
      const params: DeleteExpenseRequest = {
        expense_id: expenseId
      };

      const response = await apiService.deleteExpense(params);
      
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Expense deleted successfully",
          variant: "default",
        });
        // Note: Dashboard will handle refreshing all data
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to delete expense';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Failed to delete expense:', err);
      throw err; // Re-throw so Dashboard can handle the error
    }
  }, [toast]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchExpenses();
    }
  }, [fetchExpenses, autoFetch]);

  return {
    expenses,
    loading,
    error,
    totalCount,
    hasMore,
    fetchExpenses,
    loadMore,
    refresh,
    deleteExpense
  };
}