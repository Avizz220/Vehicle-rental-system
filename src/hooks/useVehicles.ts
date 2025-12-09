'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vehicleService } from '@/services/vehicleService'
import { Vehicle } from '@/types'
import toast from 'react-hot-toast'

export const useVehicles = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleService.getAll(params),
  })
}

export const useVehicle = (id: number) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getById(id),
    enabled: !!id,
  })
}

export const useCreateVehicle = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (vehicle: Partial<Vehicle>) => vehicleService.create(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Vehicle created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create vehicle')
    },
  })
}

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, vehicle }: { id: number; vehicle: Partial<Vehicle> }) =>
      vehicleService.update(id, vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Vehicle updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update vehicle')
    },
  })
}

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => vehicleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Vehicle deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete vehicle')
    },
  })
}
