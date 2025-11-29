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
    me: `${config.apiUrl}/api/v1/users/me`,
    updateDisability: (userId: string | number) =>
      `${config.apiUrl}/api/v1/users/${userId}/disability`,
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
    confirmPayment: (reservationId: string | number) =>
      `${config.apiUrl}/api/v1/reservations/${reservationId}/confirm-payment`,
  },
  parkingSlots: {
    getByParkingLot: (parkingLotId: string | number) =>
      `${config.apiUrl}/api/v1/parking-lots/${parkingLotId}/slots`,
  },
  profiles: {
    getById: (profileId: string | number) =>
      `${config.apiUrl}/api/v1/profiles/${profileId}`,
    update: (profileId: string | number) =>
      `${config.apiUrl}/api/v1/profiles/${profileId}`,
    create: `${config.apiUrl}/api/v1/profiles`,
    updateNotifications: (profileId: string | number) =>
      `${config.apiUrl}/api/v1/profiles/${profileId}/notifications`,
    getByUserId: (userId: string | number) =>
      `${config.apiUrl}/api/v1/profiles/user/${userId}`,
    getByDocument: (dni: string) =>
      `${config.apiUrl}/api/v1/profiles/document/${dni}`,
  },
  affiliate: {
    parkingLots: {
      list: `${config.apiUrl}/api/affiliate/parking-lots`,
      getById: (id: string | number) => `${config.apiUrl}/api/affiliate/parking-lots/${id}`,
      maps: {
        add: `${config.apiUrl}/api/affiliate/parking-lots/maps`,
        edit: (mapId: string | number) => `${config.apiUrl}/api/affiliate/parking-lots/maps/${mapId}`,
        spaces: {
          import: (mapId: string | number) => `${config.apiUrl}/api/affiliate/parking-lots/maps/${mapId}/spaces/import`,
          list: (mapId: string | number) => `${config.apiUrl}/api/affiliate/parking-lots/maps/${mapId}/spaces`,
          updateStatus: (mapId: string | number, spaceId: string | number) => `${config.apiUrl}/api/affiliate/parking-lots/maps/${mapId}/spaces/${spaceId}/status`,
        },
      },
    },
  },
  logs: {
    getAll: `${config.apiUrl}/api/logs`,
    getById: (id: string | number) => `${config.apiUrl}/api/logs/${id}`,
    create: `${config.apiUrl}/api/logs`,
  },
} as const;

export default config;
