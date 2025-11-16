"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useProfile } from "@/hooks/useProfile";
import {
  ProfileForm,
  type ProfileFormValues,
  ProfileInfoCard,
  NotificationsCard,
  HelpCard,
  ProfileSkeleton,
} from "@/components/profile";

import { getCookie } from "cookies-next";

export default function AdminProfilePage() {
  const {
    profile,
    isLoading,
    isUpdating,
    isCreating,
    profileNotFound,
    fetchProfileByUserId,
    updateProfile,
    createProfile,
    updateNotifications,
  } = useProfile();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const userIdCookie = getCookie("user_id");

      const userId = userIdCookie ? parseInt(userIdCookie as string, 10) : NaN;
      if (!Number.isNaN(userId)) {
        await fetchProfileByUserId(userId);
      } else {
        toast.error("No se encontró el usuario actual");
      }
    };

    loadProfile();
  }, [fetchProfileByUserId]);

  useEffect(() => {
    if (profile) {
      setNotificationsEnabled(profile.notificationsEnabled || false);
    }
  }, [profile]);

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    const userIdCookie = getCookie("user_id");
    const userId = userIdCookie ? parseInt(userIdCookie as string, 10) : NaN;

    if (profileNotFound) {
      if (Number.isNaN(userId)) {
        toast.error("No se pudo determinar el usuario");
        return;
      }
      const success = await createProfile({ ...data, userId });
      if (success) setNotificationsEnabled(true);
    } else if (profile?.id) {
      await updateProfile(profile.id, data);
    } else {
      toast.error("No se pudo encontrar el perfil");
    }
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (!profile?.id) {
      toast.error("No se pudo encontrar el perfil");
      return;
    }
    const success = await updateNotifications(profile.id, enabled);
    if (success) setNotificationsEnabled(enabled);
  };

  const handleContactSupport = () => {
    toast.info("Funcionalidad de soporte próximamente");
  };

  if (isLoading) return <ProfileSkeleton />;

  const isCreateMode = profileNotFound;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Perfil de Administrador</h1>
        <p className="text-muted-foreground">
          {isCreateMode
            ? "Completa tu información personal para comenzar"
            : "Gestiona tu información personal y preferencias"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileForm
          defaultValues={
            profile
              ? {
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  dni: profile.dni,
                  countryCode: profile.countryCode,
                  phoneNumber: profile.phoneNumber,
                }
              : undefined
          }
          onSubmit={handleProfileSubmit}
          isSubmitting={isUpdating || isCreating}
          isCreateMode={isCreateMode}
        />

        <div className="space-y-6">
          {profile && (
            <ProfileInfoCard userId={profile.userId} profileId={profile.id} />
          )}

          {profile && (
            <NotificationsCard
              enabled={notificationsEnabled}
              onToggle={handleNotificationsToggle}
            />
          )}

          <HelpCard onContactSupport={handleContactSupport} />
        </div>
      </div>
    </div>
  );
}