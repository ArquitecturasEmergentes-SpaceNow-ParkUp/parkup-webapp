"use server";

import { cookies } from "next/headers";
import { endpoints } from "./config";

export interface ProfileData {
  id?: number;
  userId: number;
  firstName: string;
  lastName: string;
  dni: string;
  countryCode: string;
  phoneNumber: string;
  notificationsEnabled?: boolean;
  disability?: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  dni: string;
  countryCode: string;
  phoneNumber: string;
}

export interface CreateProfileRequest extends UpdateProfileRequest {
  userId: number;
}

export interface UserData {
  id: number;
  email: string;
  roles: string[];
  disability?: boolean;
}

/**
 * Get authentication token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value || null;
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

  return parseInt(userIdCookie.value, 10);
}

/**
 * Get profile by ID
 */
export async function getProfileById(profileId: number): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.profiles.getById(profileId), {
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
        .catch(() => ({ message: "Failed to fetch profile" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Get profile by user ID
 */
export async function getProfileByUserId(userId: number): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
  notFound?: boolean;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Fetch both profile and user data in parallel
    const [profileResponse, userResponse] = await Promise.all([
      fetch(endpoints.profiles.getByUserId(userId), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
      fetch(endpoints.users.getById(userId), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
    ]);

    // Get disability status from user endpoint
    let disability = false;
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log("👤 User data from backend:", userData);
      disability = userData.disability ?? false;
    }

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log("📋 Profile data from backend:", profileData);
      // Merge disability from user into profile data
      return { success: true, data: { ...profileData, disability } };
    } else if (profileResponse.status === 404) {
      return { success: false, notFound: true, error: "Profile not found" };
    } else {
      const errorData = await profileResponse
        .json()
        .catch(() => ({ message: "Failed to fetch profile" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error fetching profile by user ID:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Get profile by document
 */
export async function getProfileByDocument(dni: string): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.profiles.getByDocument(dni), {
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
        .catch(() => ({ message: "Failed to fetch profile by document" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error fetching profile by document:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Update profile
 */
export async function updateProfile(
  profileId: number,
  data: UpdateProfileRequest,
): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.profiles.update(profileId), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (response.ok) {
      const updatedData = await response.json();
      return { success: true, data: updatedData };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to update profile" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Create profile
 */
export async function createProfile(data: CreateProfileRequest): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.profiles.create, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (response.ok) {
      const newData = await response.json();
      return { success: true, data: newData };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create profile" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error creating profile:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Update notifications
 */
export async function updateNotifications(
  profileId: number,
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
    const response = await fetch(endpoints.profiles.updateNotifications(profileId), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationsEnabled: enabled }),
      cache: "no-store",
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to update notifications" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error updating notifications:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Update disability status
 */
export async function updateDisabilityStatus(
  userId: number,
  enabled: boolean,
): Promise<{
  success: boolean;
  data?: UserData;
  error?: string;
}> {
  const token = await getAuthToken();

  console.log("🔧 updateDisabilityStatus called with:", { userId, enabled });
  console.log("🔧 Token present:", !!token);

  if (!token) {
    console.error("❌ No authentication token found");
    return { success: false, error: "Not authenticated" };
  }

  try {
    const url = endpoints.users.updateDisability(userId);
    console.log("🔧 Calling endpoint:", url);
    console.log("🔧 Request body:", JSON.stringify({ disability: enabled }));

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ disability: enabled }),
      cache: "no-store",
    });

    console.log("🔧 Response status:", response.status);

    if (response.ok) {
      const updatedUser = await response.json();
      console.log("✅ Success response:", updatedUser);
      return { success: true, data: updatedUser };
    } else {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      
      let errorData: { message?: string };
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to update disability status" };
      }
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("❌ Network error updating disability status:", error);
    return { success: false, error: "Network error" };
  }
}

export async function getUserById(userId: number): Promise<{
  success: boolean;
  data?: UserData;
  error?: string;
}> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(endpoints.users.getById(userId), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data: {
        id: data.id,
        email: data.email,
        roles: data.roles,
      }};
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch user" }));
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Network error" };
  }
}