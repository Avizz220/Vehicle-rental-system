import { apiClient } from './api'
import { Vehicle, ApiResponse, PaginatedResponse } from '@/types'

export const vehicleService = {
  getAll: async (params?: {
    page?: number
    size?: number
    category?: string
    status?: string
  }): Promise<PaginatedResponse<Vehicle>> => {
    const { data } = await apiClient.get('/vehicles', { params })
    return data
  },

  getById: async (id: number): Promise<Vehicle> => {
    const { data } = await apiClient.get(`/vehicles/${id}`)
    return data
  },

  create: async (vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const { data } = await apiClient.post('/vehicles', vehicle)
    return data
  },

  update: async (id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const { data } = await apiClient.put(`/vehicles/${id}`, vehicle)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`)
  },

  search: async (query: string): Promise<Vehicle[]> => {
    const { data } = await apiClient.get('/vehicles/search', {
      params: { q: query },
    })
    return data
  },

  getAvailable: async (startDate: string, endDate: string): Promise<Vehicle[]> => {
    const { data } = await apiClient.get('/vehicles/available', {
      params: { startDate, endDate },
    })
    return data
  },
}
