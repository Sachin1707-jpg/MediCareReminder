import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import medicineApi from '../services/medicineApi';
import toast from 'react-hot-toast';

// Hook for fetching a list of medicines (with pagination & filters)
export const useMedicines = (params) => {
  return useQuery({
    queryKey: ['medicines', params],
    queryFn: () => medicineApi.getMedicines(params),
    keepPreviousData: true, // Smoother pagination
  });
};

// Hook for fetching a single medicine
export const useMedicine = (id) => {
  return useQuery({
    queryKey: ['medicine', id],
    queryFn: () => medicineApi.getMedicine(id),
    enabled: !!id, // Only run if ID exists
  });
};

// Hook for creating a medicine
export const useCreateMedicine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: medicineApi.createMedicine,
    onSuccess: () => {
      toast.success('Medicine added successfully!');
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add medicine');
    }
  });
};

// Hook for updating a medicine
export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: medicineApi.updateMedicine,
    onSuccess: (data, variables) => {
      toast.success('Medicine updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      queryClient.invalidateQueries({ queryKey: ['medicine', variables.id] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update medicine');
    }
  });
};

// Hook for deleting a medicine
export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: medicineApi.deleteMedicine,
    onSuccess: () => {
      toast.success('Medicine deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete medicine');
    }
  });
};
