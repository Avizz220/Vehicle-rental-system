'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerService } from '@/services/customerService'
import { Customer } from '@/types'
import toast from 'react-hot-toast'

export const useCustomers = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.getAll(params),
  })
}

export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  })
}

export const useCreateCustomer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (customer: Partial<Customer>) => customerService.create(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create customer')
    },
  })
}

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, customer }: { id: number; customer: Partial<Customer> }) =>
      customerService.update(id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update customer')
    },
  })
}

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete customer')
    },
  })
}
