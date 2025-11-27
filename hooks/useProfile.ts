"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  getProfileById,
  getProfileByUserId,
  getProfileByDocument,
  updateProfile as updateProfileServer,
  createProfile as createProfileServer,
  updateNotifications as updateNotificationsServer,
  updateDisabilityStatus as updateDisabilityStatusServer,
  type ProfileData,
  type UpdateProfileRequest,
  type CreateProfileRequest,
  type UserData,
} from "@/lib/profiles";

export interface UseProfileReturn {
  profile: ProfileData | null;
  user: UserData | null;
  isLoading: boolean;
  isUpdating: boolean;
  isCreating: boolean;
  profileNotFound: boolean;
  fetchProfile: (profileId: number) => Promise<boolean>;
  fetchProfileByUserId: (userId: number) => Promise<boolean>;
  fetchProfileByDocument: (dni: string) => Promise<boolean>;
  updateProfile: (profileId: number, data: UpdateProfileRequest) => Promise<boolean>;
  createProfile: (data: CreateProfileRequest) => Promise<boolean>;
  updateNotifications: (profileId: number, enabled: boolean) => Promise<boolean>;
  updateDisabilityStatus: (userId: number, enabled: boolean) => Promise<boolean>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);

  const fetchProfile = useCallback(async (profileId: number) => {
    setIsLoading(true);
    try {
      const result = await getProfileById(profileId);

      if (result.success && result.data) {
        setProfile(result.data);
        return true;
      } else {
        toast.error("Error al cargar el perfil");
        console.error("Error fetching profile:", result.error);
        return false;
      }
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
    setProfileNotFound(false);
    try {
      // Get user email from cookie instead of API call
      const userEmailCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_email='))
        ?.split('=')[1];

      // Set user data from cookie
      if (userEmailCookie) {
        setUser({
          id: userId,
          email: decodeURIComponent(userEmailCookie),
          roles: [], // We don't store roles in cookie, but we can fetch if needed
        });
      } else {
        console.warn("No user_email cookie found");
        setUser(null);
      }

      // Fetch profile data
      const profileResult = await getProfileByUserId(userId);

      // Handle profile data
      if (profileResult.success && profileResult.data) {
        setProfile(profileResult.data);
        return true;
      } else if (profileResult.notFound) {
        setProfileNotFound(true);
        setProfile(null);
        return true; // Not an error, just profile doesn't exist
      } else {
        toast.error("Error al cargar el perfil del usuario");
        console.error("Error fetching profile by user ID:", profileResult.error);
        return false;
      }
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
      const result = await getProfileByDocument(dni);

      if (result.success && result.data) {
        setProfile(result.data);
        return true;
      } else {
        toast.error("Error al buscar perfil por documento");
        console.error("Error fetching profile by document:", result.error);
        return false;
      }
    } catch (error) {
      toast.error("Error al buscar perfil por documento");
      console.error("Error fetching profile by document:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfileFunc = useCallback(
    async (profileId: number, data: UpdateProfileRequest) => {
      setIsUpdating(true);
      try {
        const result = await updateProfileServer(profileId, data);

        if (result.success && result.data) {
          setProfile(result.data);
          toast.success("Perfil actualizado exitosamente");
          return true;
        } else {
          toast.error("Error al actualizar el perfil");
          console.error("Error updating profile:", result.error);
          return false;
        }
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

  const createProfileFunc = useCallback(async (data: CreateProfileRequest) => {
    setIsCreating(true);
    try {
      const result = await createProfileServer(data);

      if (result.success && result.data) {
        setProfile(result.data);
        toast.success("Perfil creado exitosamente");
        return true;
      } else {
        toast.error("Error al crear el perfil");
        console.error("Error creating profile:", result.error);
        return false;
      }
    } catch (error) {
      toast.error("Error al crear el perfil");
      console.error("Error creating profile:", error);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateNotificationsFunc = useCallback(
    async (profileId: number, enabled: boolean) => {
      try {
        const result = await updateNotificationsServer(profileId, enabled);

        if (result.success) {
          setProfile((prev: ProfileData | null) => (prev ? { ...prev, notificationsEnabled: enabled } : null));
          toast.success(
            enabled
              ? "Notificaciones activadas"
              : "Notificaciones desactivadas",
          );
          return true;
        } else {
          toast.error("Error al actualizar las notificaciones");
          console.error("Error updating notifications:", result.error);
          return false;
        }
      } catch (error) {
        toast.error("Error al actualizar las notificaciones");
        console.error("Error updating notifications:", error);
        return false;
      }
    },
    [],
  );

  const updateDisabilityStatusFunc = useCallback(
    async (userId: number, enabled: boolean) => {
      try {
        const result = await updateDisabilityStatusServer(userId, enabled);

        if (result.success && result.data) {
          setProfile((prev: ProfileData | null) => (prev ? { ...prev, disability: enabled } : null));
          toast.success(
            enabled
              ? "Estado de discapacidad activado"
              : "Estado de discapacidad desactivado",
          );
          return true;
        } else {
          toast.error("Error al actualizar el estado de discapacidad");
          console.error("Error updating disability status:", result.error);
          return false;
        }
      } catch (error) {
        toast.error("Error al actualizar el estado de discapacidad");
        console.error("Error updating disability status:", error);
        return false;
      }
    },
    [],
  );

  return {
    profile,
    user,
    isLoading,
    isUpdating,
    isCreating,
    profileNotFound,
    fetchProfile,
    fetchProfileByUserId,
    fetchProfileByDocument,
    updateProfile: updateProfileFunc,
    createProfile: createProfileFunc,
    updateNotifications: updateNotificationsFunc,
    updateDisabilityStatus: updateDisabilityStatusFunc,
  };
}
