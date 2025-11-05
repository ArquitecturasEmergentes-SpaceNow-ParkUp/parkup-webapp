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

export default function ProfilePage() {
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

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      // Get actual user ID from cookie
      const userIdCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_id='))
        ?.split('=')[1];

      console.log('All cookies:', document.cookie);
      console.log('userIdCookie:', userIdCookie);

      if (!userIdCookie) {
        console.log('No user_id cookie found, using fallback userId = 1');
        // Fallback to userId = 1 for now
        await fetchProfileByUserId(1);
        return;
      }

      const userId = parseInt(userIdCookie, 10);
      console.log('Parsed userId:', userId);
      await fetchProfileByUserId(userId);
    };

    loadProfile();
  }, [fetchProfileByUserId]);

  // Update notifications state when profile loads
  useEffect(() => {
    if (profile) {
      setNotificationsEnabled(profile.notificationsEnabled || false);
    }
  }, [profile]);

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    // Get actual user ID from cookie
    const userIdCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_id='))
      ?.split('=')[1];

    let userId = 1; // fallback
    if (userIdCookie) {
      userId = parseInt(userIdCookie, 10);
    }

    if (profileNotFound) {
      // Create new profile
      const success = await createProfile({
        ...data,
        userId,
      });
      if (success) {
        // Profile created successfully, notifications will be enabled by default
        setNotificationsEnabled(true);
      }
    } else if (profile?.id) {
      // Update existing profile
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
    if (success) {
      setNotificationsEnabled(enabled);
    }
  };

  const handleContactSupport = () => {
    // TODO: Implement contact support functionality
    toast.info("Funcionalidad de soporte próximamente");
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const isCreateMode = profileNotFound;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          {isCreateMode
            ? "Completa tu información personal para comenzar"
            : "Gestiona tu información personal y preferencias"
          }
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile Form */}
        <ProfileForm
          defaultValues={profile ? {
            firstName: profile.firstName,
            lastName: profile.lastName,
            dni: profile.dni,
            countryCode: profile.countryCode,
            phoneNumber: profile.phoneNumber,
          } : undefined}
          onSubmit={handleProfileSubmit}
          isSubmitting={isUpdating || isCreating}
          isCreateMode={isCreateMode}
        />

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Profile Info Card - only show if profile exists */}
          {profile && (
            <ProfileInfoCard
              userId={profile.userId}
              profileId={profile.id}
            />
          )}

          {/* Notifications Card - only show if profile exists */}
          {profile && (
            <NotificationsCard
              enabled={notificationsEnabled}
              onToggle={handleNotificationsToggle}
            />
          )}

          {/* Help Card */}
          <HelpCard onContactSupport={handleContactSupport} />
        </div>
      </div>
    </div>
  );
}
