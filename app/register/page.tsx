"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

import { signup } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Por favor ingresa un email válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una mayúscula, una minúscula y un número"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await signup(formData);

      if (result?.success) {
        toast.success("Account created!", {
          description: "Please login with your credentials",
        });
        setTimeout(() => router.push("/login"), 1500);
      } else if (result?.error) {
        toast.error("Registration failed", {
          description: result.error,
        });
        form.setError("root", {
          message: result.error,
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later",
      });
    }
  }

  return (
    <main className="flex min-h-screen">
      <div
        className="hidden lg:flex lg:w-2/3 relative overflow-hidden"
        style={{
          backgroundImage: "url('/login_img.webp')",
          backgroundColor: "rgba(22, 5, 172, 0.8)",
          backgroundBlendMode: "luminosity",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div className="relative z-10 flex flex-col justify-center px-16 py-20 text-white w-full">
          <div className="space-y-10 max-w-2xl">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold leading-[1.1] text-white tracking-tight">Conectamos tu parking al futuro</h1>
              <div className="w-20 h-1 bg-white/30 rounded-full" />
            </div>
            <p className="text-2xl font-semibold text-white/95 leading-snug">Acceso exclusivo para tu equipo</p>
            <p className="text-lg text-white/85 leading-relajado max-w-lg">Optimiza reservas, gestiona estacionamientos y mantén el control de tu operación desde un solo lugar.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 lg:w-1/3 flex items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <Image src="/logo_app.webp" alt="ParkUp Logo" width={80} height={80} priority className="object-contain drop-shadow-sm" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Crear cuenta</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">Ingresa tu información para crear tu cuenta y comenzar a gestionar tus estacionamientos.</p>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="register-email" className="text-sm font-semibold text-foreground block mb-1.5">Correo electrónico <span className="text-destructive font-bold">*</span></Label>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Input {...field} id="register-email" type="email" placeholder="Correo electrónico" autoComplete="email" aria-invalid={fieldState.invalid} className="h-11 text-sm border-2 focus:border-primary transition-colors" />
                    {fieldState.error && (
                      <p id="register-email-error" className="text-xs text-destructive mt-1.5" role="alert">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="register-password" className="text-sm font-semibold text-foreground block mb-1.5">Contraseña <span className="text-destructive font-bold">*</span></Label>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Input {...field} id="register-password" type={showPassword ? "text" : "password"} placeholder="Contraseña" autoComplete="new-password" aria-invalid={fieldState.invalid} className="h-11 text-sm border-2 focus:border-primary transition-colors pr-10" />
                      <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldState.error && (
                      <p id="register-password-error" className="text-xs text-destructive mt-1.5" role="alert">{fieldState.error.message}</p>
                    )}
                    <p id="register-password-hint" className="text-xs text-muted-foreground mt-1.5">Mínimo 8 caracteres con mayúsculas, minúsculas y números</p>
                  </div>
                )}
              />
            </div>

            {form.formState.errors.root && (
              <div className="p-3 rounded-sm bg-destructive/10 border border-destructive/20" role="alert">
                <p className="text-xs text-destructive">{form.formState.errors.root.message}</p>
              </div>
            )}

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full h-11 text-sm font-semibold tracking-wide mt-8 rounded-sm">
              {form.formState.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                "CREAR CUENTA"
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/50">
            ¿Ya tienes una cuenta? <Link href="/login" className="font-medium text-primary hover:underline">Inicia sesión aquí</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
