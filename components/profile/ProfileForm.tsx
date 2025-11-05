"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, CreditCard } from "lucide-react";

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

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isCreateMode?: boolean;
}

export function ProfileForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isCreateMode = false,
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      countryCode: "+51",
      phoneNumber: "",
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    await onSubmit(data);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      form.reset(defaultValues);
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {isCreateMode ? "Crear Perfil" : "Información Personal"}
        </CardTitle>
        <CardDescription>
          {isCreateMode
            ? "Completa tu información personal para continuar"
            : "Actualiza tus datos personales y de contacto"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="profile-form"
          onSubmit={form.handleSubmit(handleSubmit)}
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
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              {isSubmitting
                ? (isCreateMode ? "Creando..." : "Guardando...")
                : (isCreateMode ? "Crear Perfil" : "Guardar Cambios")
              }
            </Button>
            {!isCreateMode && (
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}