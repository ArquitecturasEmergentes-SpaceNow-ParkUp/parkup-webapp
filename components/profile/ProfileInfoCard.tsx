"use client";

import { Mail } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProfileInfoCardProps {
  userId?: number;
  profileId?: number;
}

export function ProfileInfoCard({ userId, profileId }: ProfileInfoCardProps) {
  // Get email directly from cookie for now
  const userEmailCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_email='))
    ?.split('=')[1];

  let userEmail = userEmailCookie ? decodeURIComponent(userEmailCookie) : null;

  // If no email in cookie but we have userId=1, show demo email
  if (!userEmail && userId === 1) {
    userEmail = "diegorafaelcisnerostafur@gmail.com";
  }

  console.log("ProfileInfoCard - userEmailCookie:", userEmailCookie);
  console.log("ProfileInfoCard - userEmail:", userEmail);
  console.log("ProfileInfoCard - userId:", userId);

  return (
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
            {userEmail || "No disponible"}
          </p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            ID de Usuario
          </p>
          <p className="text-sm font-mono">{userId || "N/A"}</p>
        </div>
        {profileId && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                ID de Perfil
              </p>
              <p className="text-sm font-mono">{profileId}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}