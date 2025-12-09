export interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  category: VehicleCategory
  status: VehicleStatus
  dailyRate: number
  mileage: number
  fuelType: FuelType
  transmission: TransmissionType
  seats: number
  color: string
  licensePlate: string
  imageUrl?: string
  features: string[]
  createdAt: string
  updatedAt: string
}

export enum VehicleCategory {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  SPORTS = 'SPORTS',
  LUXURY = 'LUXURY',
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED',
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum TransmissionType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  address: string
  city: string
  postalCode: string
  country: string
  createdAt: string
  updatedAt: string
}

export interface Rental {
  id: number
  vehicle: Vehicle
  customer: Customer
  startDate: string
  endDate: string
  actualReturnDate?: string
  status: RentalStatus
  totalCost: number
  depositAmount: number
  additionalCharges: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export enum RentalStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Payment {
  id: number
  rental: Rental
  amount: number
  paymentDate: string
  paymentMethod: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  notes?: string
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
