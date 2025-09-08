import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { Profile, UpdateProfileRequest } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

interface UseProfileOptions {
  autoFetch?: boolean;
}

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileRequest) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProfile(options: UseProfileOptions = {}): UseProfileReturn {
  const { autoFetch = true } = options;
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getProfile();
      
      if (response.status === 200 && response.reports && response.reports.length > 0) {
        setProfile(response.reports[0]);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch profile';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateProfile = useCallback(async (profileData: UpdateProfileRequest) => {
    try {
      setLoading(true);
      const response = await apiService.updateProfile(profileData);
      
      if (response.status === 200 && response.reports && response.reports.length > 0) {
        setProfile(response.reports[0].profile);
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
          variant: "default",
        });
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to update profile';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Failed to update profile:', err);
      throw err; // Re-throw so components can handle the error
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refresh = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
  }, [fetchProfile, autoFetch]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    refresh
  };
}