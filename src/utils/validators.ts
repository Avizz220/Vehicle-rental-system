export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export const validateLicensePlate = (plate: string): boolean => {
  return plate.length >= 3 && plate.length <= 10
}

export const validateLicenseNumber = (license: string): boolean => {
  return license.length >= 5 && license.length <= 20
}

export const validatePostalCode = (code: string): boolean => {
  return code.length >= 4 && code.length <= 10
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
