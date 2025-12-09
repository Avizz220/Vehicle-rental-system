import { apiClient } from './api'
import { Customer, ApiResponse, PaginatedResponse } from '@/types'

export const customerService = {
  getAll: async (params?: {
    page?: number
    size?: number
  }): Promise<PaginatedResponse<Customer>> => {
    const { data } = await apiClient.get('/customers', { params })
    return data
  },

  getById: async (id: number): Promise<Customer> => {
    const { data } = await apiClient.get(`/customers/${id}`)
    return data
  },

  create: async (customer: Partial<Customer>): Promise<Customer> => {
    const { data } = await apiClient.post('/customers', customer)
    return data
  },

  update: async (id: number, customer: Partial<Customer>): Promise<Customer> => {
    const { data } = await apiClient.put(`/customers/${id}`, customer)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/customers/${id}`)
  },

  search: async (query: string): Promise<Customer[]> => {
    const { data } = await apiClient.get('/customers/search', {
      params: { q: query },
    })
    return data
  },
}
