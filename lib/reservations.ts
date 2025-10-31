"use server";

import { cookies } from "next/headers";
import { endpoints } from "./config";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export interface Reservation {
  id: number;
  userId: number;
  parkingSlotId: number;
  parkingLotId: number;
  status: ReservationStatus;
  startTime: string;
  endTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  userId: number;
  parkingLotId: number;
  startTime: string;
  endTime: string;
}

export interface ParkingSlot {
  id: number;
  slotNumber: string;
  type: "REGULAR" | "DISABLED" | "MOTORCYCLE" | "ELECTRIC";
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  parkingLotId: number;
  floor?: string;
  section?: string;
}

/**
 * Get authentication token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value || null;
}

/**
 * Get all reservations
 */
export async function getAllReservations(): Promise<{
  success: boolean;
  data?: Reservation[];
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.reservations.getAll, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch reservations" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Get current user ID from cookie
 */
export async function getCurrentUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("user_id");

  if (!userIdCookie?.value) {
    return null;
  }

  const userId = parseInt(userIdCookie.value, 10);
  return isNaN(userId) ? null : userId;
}

/**
 * Get a single reservation by ID
 */
export async function getReservationById(reservationId: number): Promise<{
  success: boolean;
  data?: Reservation;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(
      endpoints.reservations.getById(reservationId),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch reservation" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Create a new reservation
 */
export async function createReservation(
  data: CreateReservationRequest,
): Promise<{
  success: boolean;
  data?: Reservation;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    console.log("Creating reservation with data:", data);

    const response = await fetch(endpoints.reservations.create, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Reservation response status:", response.status);

    if (response.ok) {
      const responseData = await response.json();
      console.log("Reservation created successfully:", responseData);
      return { success: true, data: responseData };
    } else {
      const errorText = await response.text();
      console.error("Reservation error response:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to create reservation" };
      }

      return {
        success: false,
        error:
          errorData.message ||
          errorData.error ||
          "Failed to create reservation",
      };
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Cancel a reservation
 */
export async function cancelReservation(reservationId: number): Promise<{
  success: boolean;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.reservations.cancel(reservationId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to cancel reservation" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Get parking slots by parking lot ID
 */
export async function getParkingSlotsByLot(parkingLotId: number): Promise<{
  success: boolean;
  data?: ParkingSlot[];
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(
      endpoints.parkingSlots.getByParkingLot(parkingLotId),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch parking slots" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error fetching parking slots:", error);
    return { success: false, error: "Network error" };
  }
}
