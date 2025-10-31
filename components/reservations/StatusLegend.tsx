"use client";

import { Badge } from "@/components/ui/badge";

interface StatusLegendProps {
  className?: string;
}

export function StatusLegend({ className = "" }: StatusLegendProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Badge variant="outline" className="gap-2 px-3 py-1.5">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm font-medium">Disponible</span>
      </Badge>
      <Badge variant="outline" className="gap-2 px-3 py-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-sm font-medium">Ocupado</span>
      </Badge>
      <Badge variant="outline" className="gap-2 px-3 py-1.5">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="text-sm font-medium">Reservado</span>
      </Badge>
    </div>
  );
}
