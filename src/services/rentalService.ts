import { apiClient } from './api'
import { Rental, ApiResponse, PaginatedResponse } from '@/types'

export const rentalService = {
  getAll: async (params?: {
    page?: number
    size?: number
    status?: string
  }): Promise<PaginatedResponse<Rental>> => {
    const { data } = await apiClient.get('/rentals', { params })
    return data
  },

  getById: async (id: number): Promise<Rental> => {
    const { data } = await apiClient.get(`/rentals/${id}`)
    return data
  },

  create: async (rental: Partial<Rental>): Promise<Rental> => {
    const { data } = await apiClient.post('/rentals', rental)
    return data
  },

  update: async (id: number, rental: Partial<Rental>): Promise<Rental> => {
    const { data } = await apiClient.put(`/rentals/${id}`, rental)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/rentals/${id}`)
  },

  returnVehicle: async (id: number, actualReturnDate: string): Promise<Rental> => {
    const { data } = await apiClient.post(`/rentals/${id}/return`, {
      actualReturnDate,
    })
    return data
  },

  calculateCost: async (
    vehicleId: number,
    startDate: string,
    endDate: string
  ): Promise<number> => {
    const { data } = await apiClient.post('/rentals/calculate-cost', {
      vehicleId,
      startDate,
      endDate,
    })
    return data
  },
}
