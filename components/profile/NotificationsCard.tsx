"use client";

import { Bell, BellOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface NotificationsCardProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function NotificationsCard({ enabled, onToggle }: NotificationsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {enabled ? (
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
            checked={enabled}
            onCheckedChange={onToggle}
            aria-label="Toggle notifications"
          />
        </div>
      </CardContent>
    </Card>
  );
}