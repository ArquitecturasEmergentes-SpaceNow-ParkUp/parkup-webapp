"use server";

import { cookies } from "next/headers";
import { endpoints } from "./config";

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value || null;
}

export interface ParkingLotSummary {
  id: number;
  name: string;
  address?: string;
}

export interface ParkingLotMap {
  id: number;
  parkingLotId: number;
  layoutJson: string;
  totalSpaces?: number;
  disabilitySpaces?: number;
  status?: string;
}

export interface ParkingSpaceItem {
  id: number;
  code: string;
  disability: boolean;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
}

export async function listParkingLots(): Promise<{ success: boolean; data?: ParkingLotSummary[]; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Not authenticated" };
  try {
    const res = await fetch(endpoints.affiliate.parkingLots.list, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ message: "Failed to fetch parking lots" }));
      return { success: false, error: e.message };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function getParkingLotById(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Not authenticated" };
  try {
    const res = await fetch(endpoints.affiliate.parkingLots.getById(id), {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ message: "Failed to fetch parking lot" }));
      return { success: false, error: e.message };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function addParkingLotMap(payload: { parkingLotId: number; layoutJson: string; totalSpaces?: number; disabilitySpaces?: number }): Promise<{ success: boolean; data?: ParkingLotMap; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Not authenticated" };
  try {
    const res = await fetch(endpoints.affiliate.parkingLots.maps.add, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ message: "Failed to add map" }));
      return { success: false, error: e.message };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function editParkingLotMap(mapId: number, payload: { parkingLotId: number; newLayoutJson: string; newTotalSpaces?: number; newDisabilitySpaces?: number }): Promise<{ success: boolean; data?: ParkingLotMap; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Not authenticated" };
  try {
    const res = await fetch(endpoints.affiliate.parkingLots.maps.edit(mapId), {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, mapId }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ message: "Failed to edit map" }));
      return { success: false, error: e.message };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function importParkingSpaces(mapId: number, items: { code: string; disability: boolean }[]): Promise<{ success: boolean; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Not authenticated" };
  try {
    const res = await fetch(endpoints.affiliate.parkingLots.maps.spaces.import(mapId), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mapId, items }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ message: "Failed to import spaces" }));
      return { success: false, error: e.message };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function listParkingSpacesByMap(mapId: number): Promise<{ success: boolean; data?: ParkingSpaceItem[]; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Not authenticated" };
  try {
    const res = await fetch(endpoints.affiliate.parkingLots.maps.spaces.list(mapId), {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ message: "Failed to fetch spaces" }));
      return { success: false, error: e.message };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function updateParkingSpaceStatus(mapId: number, spaceId: number, status: "AVAILABLE" | "OCCUPIED" | "RESERVED"): Promise<{ success: boolean; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Not authenticated" };
  try {
    const res = await fetch(endpoints.affiliate.parkingLots.maps.spaces.updateStatus(mapId, spaceId), {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ message: "Failed to update status" }));
      return { success: false, error: e.message };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

