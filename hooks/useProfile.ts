"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { endpoints } from "@/lib/config";

export interface ProfileData {
  id?: number;
  userId: number;
  firstName: string;
  lastName: string;
  dni: string;
  countryCode: string;
  phoneNumber: string;
  notificationsEnabled?: boolean;
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

export interface UseProfileReturn {
  profile: ProfileData | null;
  isLoading: boolean;
  isUpdating: boolean;
  isCreating: boolean;
  fetchProfile: (profileId: number) => Promise<boolean>;
  fetchProfileByUserId: (userId: number) => Promise<boolean>;
  fetchProfileByDocument: (dni: string) => Promise<boolean>;
  updateProfile: (profileId: number, data: UpdateProfileRequest) => Promise<boolean>;
  createProfile: (data: CreateProfileRequest) => Promise<boolean>;
  updateNotifications: (profileId: number, enabled: boolean) => Promise<boolean>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchProfile = useCallback(async (profileId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoints.profiles.getById(profileId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
      return true;
    } catch (error) {
      toast.error("Error al cargar el perfil");
      console.error("Error fetching profile:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfileByUserId = useCallback(async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoints.profiles.getByUserId(userId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile by user ID");
      }

      const data = await response.json();
      setProfile(data);
      return true;
    } catch (error) {
      toast.error("Error al cargar el perfil del usuario");
      console.error("Error fetching profile by user ID:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfileByDocument = useCallback(async (dni: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoints.profiles.getByDocument(dni), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile by document");
      }

      const data = await response.json();
      setProfile(data);
      return true;
    } catch (error) {
      toast.error("Error al buscar perfil por documento");
      console.error("Error fetching profile by document:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (profileId: number, data: UpdateProfileRequest) => {
      setIsUpdating(true);
      try {
        const response = await fetch(endpoints.profiles.update(profileId), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        toast.success("Perfil actualizado exitosamente");
        return true;
      } catch (error) {
        toast.error("Error al actualizar el perfil");
        console.error("Error updating profile:", error);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  const createProfile = useCallback(async (data: CreateProfileRequest) => {
    setIsCreating(true);
    try {
      const response = await fetch(endpoints.profiles.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      const newProfile = await response.json();
      setProfile(newProfile);
      toast.success("Perfil creado exitosamente");
      return true;
    } catch (error) {
      toast.error("Error al crear el perfil");
      console.error("Error creating profile:", error);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateNotifications = useCallback(
    async (profileId: number, enabled: boolean) => {
      try {
        const response = await fetch(
          endpoints.profiles.updateNotifications(profileId),
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ notificationsEnabled: enabled }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update notifications");
        }

        setProfile((prev) => (prev ? { ...prev, notificationsEnabled: enabled } : null));
        toast.success(
          enabled
            ? "Notificaciones activadas"
            : "Notificaciones desactivadas",
        );
        return true;
      } catch (error) {
        toast.error("Error al actualizar las notificaciones");
        console.error("Error updating notifications:", error);
        return false;
      }
    },
    [],
  );

  return {
    profile,
    isLoading,
    isUpdating,
    isCreating,
    fetchProfile,
    fetchProfileByUserId,
    fetchProfileByDocument,
    updateProfile,
    createProfile,
    updateNotifications,
  };
}
