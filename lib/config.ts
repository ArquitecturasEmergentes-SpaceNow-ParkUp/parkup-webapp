/**
 * Application Configuration
 * Centralized configuration management for environment variables
 */

const config = {
  /**
   * Backend API Base URL
   * Should be set in .env.local as NEXT_PUBLIC_API_URL
   */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",

  /**
   * Environment
   */
  nodeEnv: process.env.NODE_ENV || "development",

  /**
   * Check if running in production
   */
  isProduction: process.env.NODE_ENV === "production",

  /**
   * Check if running in development
   */
  isDevelopment: process.env.NODE_ENV === "development",
} as const;

/**
 * API Endpoints builder
 */
export const endpoints = {
  auth: {
    login: `${config.apiUrl}/api/v1/authentication/login`,
    register: `${config.apiUrl}/api/v1/authentication/register`,
  },
  users: {
    getById: (userId: string | number) =>
      `${config.apiUrl}/api/v1/users/${userId}`,
  },
  recognitionUnits: {
    getAll: `${config.apiUrl}/api/v1/recognition-units`,
    getById: (unitId: string | number) =>
      `${config.apiUrl}/api/v1/recognition-units/${unitId}`,
    create: `${config.apiUrl}/api/v1/recognition-units`,
    update: (unitId: string | number) =>
      `${config.apiUrl}/api/v1/recognition-units/${unitId}`,
    delete: (unitId: string | number) =>
      `${config.apiUrl}/api/v1/recognition-units/${unitId}`,
    barrierControl: (unitId: string | number) =>
      `${config.apiUrl}/api/v1/recognition-units/${unitId}/barrier`,
    autoEntryExit: (unitId: string | number) =>
      `${config.apiUrl}/api/v1/recognition-units/${unitId}/auto-entry-exit`,
  },
  reservations: {
    getAll: `${config.apiUrl}/api/v1/reservations`,
    getById: (reservationId: string | number) =>
      `${config.apiUrl}/api/v1/reservations/${reservationId}`,
    create: `${config.apiUrl}/api/v1/reservations`,
    update: (reservationId: string | number) =>
      `${config.apiUrl}/api/v1/reservations/${reservationId}`,
    cancel: (reservationId: string | number) =>
      `${config.apiUrl}/api/v1/reservations/${reservationId}/cancel`,
  },
  parkingSlots: {
    getByParkingLot: (parkingLotId: string | number) =>
      `${config.apiUrl}/api/v1/parking-lots/${parkingLotId}/slots`,
  },
} as const;

export default config;
