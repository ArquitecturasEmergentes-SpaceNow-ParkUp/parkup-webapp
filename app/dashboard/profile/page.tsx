"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { User, Phone, Mail, CreditCard, Bell, BellOff } from "lucide-react";

import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  lastName: z
    .string()
    .min(1, "El apellido es requerido")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  dni: z
    .string()
    .min(1, "El DNI es requerido")
    .min(8, "El DNI debe tener al menos 8 caracteres")
    .max(20, "El DNI no puede exceder 20 caracteres")
    .regex(/^[A-Z0-9]+$/i, "El DNI solo puede contener letras y números"),
  countryCode: z
    .string()
    .min(1, "El código de país es requerido")
    .regex(/^\+\d{1,4}$/, "Formato inválido (ej: +51)"),
  phoneNumber: z
    .string()
    .min(1, "El número de teléfono es requerido")
    .min(6, "El número debe tener al menos 6 dígitos")
    .max(15, "El número no puede exceder 15 dígitos")
    .regex(/^\d+$/, "El número solo puede contener dígitos"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const {
    profile,
    isLoading,
    isUpdating,
    fetchProfileByUserId,
    updateProfile,
    updateNotifications,
  } = useProfile();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      countryCode: "+51",
      phoneNumber: "",
    },
  });

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      // TODO: Get actual user ID from authentication context
      const userId = 1; // Replace with actual user ID from auth
      await fetchProfileByUserId(userId);
    };

    loadProfile();
  }, [fetchProfileByUserId]);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        dni: profile.dni,
        countryCode: profile.countryCode,
        phoneNumber: profile.phoneNumber,
      });
      setNotificationsEnabled(profile.notificationsEnabled || false);
    }
  }, [profile, form]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(form.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!profile?.id) {
      toast.error("No se pudo encontrar el perfil");
      return;
    }

    const success = await updateProfile(profile.id, data);

    if (success) {
      setHasChanges(false);
      form.reset(data);
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

  const handleCancel = () => {
    if (profile) {
      form.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        dni: profile.dni,
        countryCode: profile.countryCode,
        phoneNumber: profile.phoneNumber,
      });
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>
              Actualiza tus datos personales y de contacto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="profile-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FieldGroup>
                {/* First Name */}
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstName">Nombre</FieldLabel>
                      <Input
                        {...field}
                        id="firstName"
                        type="text"
                        placeholder="Ingresa tu nombre"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>
                        Tu nombre tal como aparece en tu documento de identidad
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Last Name */}
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
                      <Input
                        {...field}
                        id="lastName"
                        type="text"
                        placeholder="Ingresa tu apellido"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>
                        Tu apellido tal como aparece en tu documento de
                        identidad
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* DNI */}
                <Controller
                  name="dni"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="dni"
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        DNI / Documento de Identidad
                      </FieldLabel>
                      <Input
                        {...field}
                        id="dni"
                        type="text"
                        placeholder="Ej: 12345678"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>
                        Tu número de documento de identidad
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Phone Number */}
                <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                  <Controller
                    name="countryCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="countryCode">Código</FieldLabel>
                        <Input
                          {...field}
                          id="countryCode"
                          type="text"
                          placeholder="+51"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="phoneNumber"
                          className="flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          Número de Teléfono
                        </FieldLabel>
                        <Input
                          {...field}
                          id="phoneNumber"
                          type="tel"
                          placeholder="987654321"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <FieldDescription>
                  Tu número de contacto para notificaciones importantes
                </FieldDescription>
              </FieldGroup>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={!hasChanges || isUpdating}
                  className="flex-1 sm:flex-initial"
                >
                  {isUpdating ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!hasChanges || isUpdating}
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Información de Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm">
                  {profile?.userId
                    ? `user${profile.userId}@parkup.com`
                    : "No disponible"}
                </p>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  ID de Usuario
                </p>
                <p className="text-sm font-mono">{profile?.userId || "N/A"}</p>
              </div>
              {profile?.id && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      ID de Perfil
                    </p>
                    <p className="text-sm font-mono">{profile.id}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {notificationsEnabled ? (
                  <Bell className="h-5 w-5" />
                ) : (
                  <BellOff className="h-5 w-5" />
                )}
                Notificaciones
              </CardTitle>
              <CardDescription>
                Gestiona tus preferencias de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Notificaciones Push</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe alertas sobre tus reservas
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationsToggle}
                  aria-label="Toggle notifications"
                />
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base">¿Necesitas ayuda?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Si tienes problemas para actualizar tu perfil, contacta a
                nuestro equipo de soporte.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contactar Soporte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
