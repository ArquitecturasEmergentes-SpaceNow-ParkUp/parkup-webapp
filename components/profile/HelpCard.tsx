"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HelpCardProps {
  onContactSupport?: () => void;
}

export function HelpCard({ onContactSupport }: HelpCardProps) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-base">¿Necesitas ayuda?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Si tienes problemas para actualizar tu perfil, contacta a
          nuestro equipo de soporte.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onContactSupport}
        >
          Contactar Soporte
        </Button>
      </CardContent>
    </Card>
  );
}