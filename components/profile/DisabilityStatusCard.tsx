"use client";

import { useState, useRef } from "react";
import { Accessibility, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DisabilityStatusCardProps {
    enabled: boolean;
    userId: number;
    onToggle: (userId: number, enabled: boolean) => Promise<void>;
}

export function DisabilityStatusCard({
    enabled,
    userId,
    onToggle,
}: DisabilityStatusCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleToggle = async (checked: boolean) => {
        console.log("🔄 DisabilityStatusCard.handleToggle called:", { checked, currentEnabled: enabled });
        
        if (checked && !enabled) {
            // If trying to enable, we need verification first if not already verified
            // For this implementation, we assume if they are enabling it, they need to go through the process
            // unless they are already enabled (which is handled by the 'enabled' prop)
            // But if they disable it, they can just disable it.
            // If they want to re-enable, do they need to upload again?
            // Let's assume for now that if they disable it, they need to verify again to re-enable.
            // Or maybe we just show the upload UI if it's currently disabled.
            console.log("🔄 Skipping - need verification flow to enable");
            return;
        }

        setIsLoading(true);
        try {
            console.log("🔄 Calling onToggle with:", { userId, checked });
            await onToggle(userId, checked);
            console.log("🔄 onToggle completed successfully");
        } catch (error) {
            console.error("Error toggling disability status:", error);
            toast.error("Error al actualizar el estado");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("📁 File selected for verification:", file.name);

        // Simulate verification process
        setVerificationStatus("verifying");
        setIsVerifying(true);

        // Simulate network delay for verification
        setTimeout(async () => {
            setVerificationStatus("success");
            setIsVerifying(false);
            toast.success("Documento verificado correctamente. Solicitud aceptada.");

            // Automatically enable status after success
            setIsLoading(true);
            try {
                console.log("📁 Calling onToggle to enable disability status after verification");
                await onToggle(userId, true);
                console.log("📁 onToggle completed - disability should now be enabled");
            } catch (error) {
                console.error("Error enabling status after verification:", error);
                toast.error("Error al activar el estado");
                setVerificationStatus("error");
            } finally {
                setIsLoading(false);
            }
        }, 2000);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5" />
                    Estado de Discapacidad
                </CardTitle>
                <CardDescription>
                    Gestiona tu estado de discapacidad para acceder a espacios reservados
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="disability-mode" className="flex flex-col space-y-1">
                        <span>Activar estado de discapacidad</span>
                        <span className="font-normal text-xs text-muted-foreground">
                            Requiere verificación de documento (CONADIS)
                        </span>
                    </Label>
                    <Switch
                        id="disability-mode"
                        checked={enabled}
                        onCheckedChange={handleToggle}
                        disabled={isLoading || !enabled} // Disable switch if not enabled (must use upload flow)
                    />
                </div>

                {!enabled && (
                    <div className="rounded-md border border-dashed p-4 text-center">
                        {verificationStatus === "idle" && (
                            <div className="space-y-3">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-muted p-2">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        Sube tu carnet de CONADIS
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Para activar esta función, necesitamos verificar tu documento.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={triggerFileInput}
                                    disabled={isVerifying}
                                >
                                    Seleccionar archivo
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={handleFileSelect}
                                />
                            </div>
                        )}

                        {verificationStatus === "verifying" && (
                            <div className="flex flex-col items-center justify-center space-y-3 py-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm font-medium">Verificando documento...</p>
                                <p className="text-xs text-muted-foreground">
                                    Esto puede tomar unos segundos
                                </p>
                            </div>
                        )}

                        {verificationStatus === "success" && (
                            <div className="flex flex-col items-center justify-center space-y-3 py-4">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                                <p className="text-sm font-medium text-green-600">
                                    ¡Verificación exitosa!
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Tu estado ha sido actualizado.
                                </p>
                            </div>
                        )}

                        {verificationStatus === "error" && (
                            <div className="flex flex-col items-center justify-center space-y-3 py-4">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                                <p className="text-sm font-medium text-destructive">
                                    Error en la verificación
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setVerificationStatus("idle")}
                                >
                                    Intentar nuevamente
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {enabled && (
                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                    Estado Verificado
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                                    Tienes acceso a los espacios de estacionamiento reservados para personas con discapacidad.
                                </p>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs text-green-800 dark:text-green-300 mt-2 underline"
                                    onClick={() => handleToggle(false)}
                                >
                                    Desactivar estado
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
