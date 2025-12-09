'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rentalService } from '@/services/rentalService'
import { Rental } from '@/types'
import toast from 'react-hot-toast'

export const useRentals = (params?: { page?: number; size?: number; status?: string }) => {
  return useQuery({
    queryKey: ['rentals', params],
    queryFn: () => rentalService.getAll(params),
  })
}

export const useRental = (id: number) => {
  return useQuery({
    queryKey: ['rental', id],
    queryFn: () => rentalService.getById(id),
    enabled: !!id,
  })
}

export const useCreateRental = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (rental: Partial<Rental>) => rentalService.create(rental),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Rental created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create rental')
    },
  })
}

export const useUpdateRental = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, rental }: { id: number; rental: Partial<Rental> }) =>
      rentalService.update(id, rental),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
      toast.success('Rental updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update rental')
    },
  })
}
