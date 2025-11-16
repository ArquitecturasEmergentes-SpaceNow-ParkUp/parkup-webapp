"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

import { login, type LoginResult } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Por favor ingresa un email válido"),
  password: z.string().min(1, "La contraseña es requerida").min(6, "La contraseña debe tener al menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleTogglePassword = () => setShowPassword((p) => !p);

  async function onSubmit(data: LoginFormValues) {
    console.log("onSubmit called with:", data);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      console.log("Calling login action...");
      const result: LoginResult = await login(formData);
      console.log("Login result:", result);

      if (result.success) {
        console.log("Login successful, redirecting to:", result.redirectTo);
        toast.success("Welcome back!", {
          description: `Redirecting to your ${result.isAdmin ? "admin panel" : "dashboard"}...`,
        });

        // Refresh router to recognize new cookies, then redirect
        router.refresh();
        router.push(result.redirectTo);
      } else {
        console.error("Login error:", result.error);
        toast.error("Login failed", {
          description: result.error,
        });
        form.setError("root", {
          message: result.error,
        });
      }
    } catch (error) {
      console.error("Exception during login:", error);
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
            <p className="text-lg text-white/85 leading-relaxed max-w-lg">Optimiza reservas, gestiona estacionamientos y mantén el control de tu operación desde un solo lugar.</p>
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
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Panel Operativo ParkUp</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">Gestiona estacionamientos, reservas y reportes técnicos.</p>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm font-medium text-foreground">Correo electrónico o Usuario *</Label>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <Input {...field} id="login-email" type="email" placeholder="Correo electrónico o Usuario" autoComplete="email" aria-invalid={fieldState.invalid} className="h-10 text-sm" />
                    {fieldState.error && (
                      <p id="login-email-error" className="text-xs text-destructive mt-1" role="alert">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-sm font-medium text-foreground">Contraseña *</Label>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <div className="relative">
                      <Input {...field} id="login-password" type={showPassword ? "text" : "password"} placeholder="Contraseña" autoComplete="current-password" aria-invalid={fieldState.invalid} className="h-10 text-sm pr-10" />
                      <button type="button" onClick={handleTogglePassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldState.error && (
                      <p id="login-password-error" className="text-xs text-destructive mt-1" role="alert">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Controller
                  name="rememberMe"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox id="remember-me" checked={field.value} onCheckedChange={field.onChange} className="h-4 w-4" />
                  )}
                />
                <Label htmlFor="remember-me" className="text-xs font-normal cursor-pointer text-foreground">Recordarme</Label>
              </div>
              <Link href="/forgot-password" className="text-xs font-medium text-[#ff6b6b] hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>

            {form.formState.errors.root && (
              <div className="p-2.5 rounded-sm bg-destructive/10 border border-destructive/20" role="alert">
                <p className="text-xs text-destructive">{form.formState.errors.root.message}</p>
              </div>
            )}

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full h-10 text-sm font-semibold tracking-wide mt-6 rounded-sm">
              {form.formState.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                "INICIAR SESIÓN"
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/50">
            ¿No tienes una cuenta? <Link href="/register" className="font-medium text-primary hover:underline">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
import { useState } from "react";
