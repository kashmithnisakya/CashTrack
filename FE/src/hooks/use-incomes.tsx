import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { Income, ListIncomesRequest, ListIncomesResponse, DeleteIncomeRequest } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

interface UseIncomesOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseIncomesReturn {
  incomes: Income[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchIncomes: (skip?: number, limit?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  deleteIncome: (incomeId: string) => Promise<void>;
}

export function useIncomes(options: UseIncomesOptions = {}): UseIncomesReturn {
  const { limit = 10, autoFetch = true } = options;
  const { toast } = useToast();
  
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchIncomes = useCallback(async (skip = 0, fetchLimit = limit) => {
    setLoading(true);
    setError(null);

    try {
      const params: ListIncomesRequest = {
        skip,
        limit: fetchLimit
      };

      const response: ListIncomesResponse = await apiService.listIncomes(params);
      
      if (response.status === 200) {
        const newIncomes = response.reports;
        
        if (skip === 0) {
          // Fresh fetch - replace all incomes
          setIncomes(newIncomes);
        } else {
          // Load more - append to existing incomes
          setIncomes(prev => [...prev, ...newIncomes]);
        }
        
        // Update pagination state
        setHasMore(newIncomes.length === fetchLimit);
        setTotalCount(skip + newIncomes.length);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch incomes';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Failed to fetch incomes:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, toast]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchIncomes(incomes.length, limit);
  }, [fetchIncomes, incomes.length, hasMore, loading, limit]);

  const refresh = useCallback(async () => {
    await fetchIncomes(0, limit);
  }, [fetchIncomes, limit]);

  const deleteIncome = useCallback(async (incomeId: string) => {
    try {
      const params: DeleteIncomeRequest = {
        income_id: incomeId
      };

      const response = await apiService.deleteIncome(params);
      
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Income deleted successfully",
          variant: "default",
        });
        // Note: Dashboard will handle refreshing all data
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to delete income';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Failed to delete income:', err);
      throw err; // Re-throw so Dashboard can handle the error
    }
  }, [toast]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchIncomes();
    }
  }, [fetchIncomes, autoFetch]);

  return {
    incomes,
    loading,
    error,
    totalCount,
    hasMore,
    fetchIncomes,
    loadMore,
    refresh,
    deleteIncome
  };
}