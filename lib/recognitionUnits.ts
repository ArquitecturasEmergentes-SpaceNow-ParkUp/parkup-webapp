"use server";

import { cookies } from "next/headers";
import { endpoints } from "./config";

export interface RecognitionUnit {
  id: string;
  identifier: string;
  location: "ENTRANCE" | "EXIT";
  affiliateId: number;
  parkingLotId: number;
  description: string;
  status?: "ACTIVE" | "INACTIVE";
  autoEntryExit?: boolean;
  barrierOpen?: boolean;
  name?: string; // Legacy field for backward compatibility
}

export interface CreateRecognitionUnitData {
  identifier: string;
  location: "ENTRANCE" | "EXIT";
  affiliateId: number;
  parkingLotId: number;
  description: string;
}

export interface UpdateRecognitionUnitData {
  identifier?: string;
  location?: "ENTRANCE" | "EXIT";
  affiliateId?: number;
  parkingLotId?: number;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
}

/**
 * Get authentication token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value || null;
}

/**
 * Get all recognition units
 */
export async function getAllRecognitionUnits(): Promise<{
  success: boolean;
  data?: RecognitionUnit[];
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.recognitionUnits.getAll, {
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
        .catch(() => ({ message: "Failed to fetch recognition units" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error fetching recognition units:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Get a single recognition unit by ID
 */
export async function getRecognitionUnitById(unitId: string): Promise<{
  success: boolean;
  data?: RecognitionUnit;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.recognitionUnits.getById(unitId), {
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
        .catch(() => ({ message: "Failed to fetch recognition unit" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error fetching recognition unit:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Create a new recognition unit
 */
export async function createRecognitionUnit(
  data: CreateRecognitionUnitData,
): Promise<{
  success: boolean;
  data?: RecognitionUnit;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.recognitionUnits.create, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create recognition unit" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error creating recognition unit:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Update a recognition unit
 */
export async function updateRecognitionUnit(
  unitId: string,
  data: UpdateRecognitionUnitData,
): Promise<{
  success: boolean;
  data?: RecognitionUnit;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.recognitionUnits.update(unitId), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to update recognition unit" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error updating recognition unit:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Delete a recognition unit
 */
export async function deleteRecognitionUnit(unitId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.recognitionUnits.delete(unitId), {
      method: "DELETE",
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
        .catch(() => ({ message: "Failed to delete recognition unit" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error deleting recognition unit:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Control barrier (open/close)
 */
export async function controlBarrier(
  unitId: string,
  open: boolean,
): Promise<{
  success: boolean;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(
      endpoints.recognitionUnits.barrierControl(unitId),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ open }),
      },
    );

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to control barrier" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error controlling barrier:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Toggle auto entry/exit
 */
export async function toggleAutoEntryExit(
  unitId: string,
  enabled: boolean,
): Promise<{
  success: boolean;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(
      endpoints.recognitionUnits.autoEntryExit(unitId),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      },
    );

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to toggle auto entry/exit" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error toggling auto entry/exit:", error);
    return { success: false, error: "Network error" };
  }
}
