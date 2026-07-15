import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dashboardApi from '../services/dashboardApi';
import toast from 'react-hot-toast';

// Hook to fetch all dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardApi.getStats,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes to prevent unnecessary heavy calculations
  });
};

// Hook to log adherence (e.g., clicking "Mark as Taken")
export const useLogAdherence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: dashboardApi.logAdherence,
    onSuccess: () => {
      toast.success('Medication logged successfully');
      // Invalidate dashboard stats so it recalculates completion percentage
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      // Also invalidate today's timeline if we have a separate query for it
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to log medication');
    }
  });
};
