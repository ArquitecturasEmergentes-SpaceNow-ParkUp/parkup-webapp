"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParkingMap } from "@/components/reservations";

interface Props {
  initialLayout: string;
  parkingLotId: number;
  mapId: number | null;
  saveAction: (formData: FormData) => Promise<void>;
  importAction: (formData: FormData) => Promise<void>;
}

export function AdminMapEditorClient({ initialLayout, parkingLotId, mapId, saveAction, importAction }: Props) {
  const [layoutText, setLayoutText] = useState(initialLayout);
  const [codesText, setCodesText] = useState("");

  const parsedLayout: any[] = useMemo(() => {
    try {
      const v = JSON.parse(layoutText);
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, [layoutText]);

  const previewSlots = useMemo(() => {
    const ids: string[] = [];
    parsedLayout.forEach((row: any) => {
      if (Array.isArray(row.slots)) {
        row.slots.forEach((g: any) => {
          if (!g.gap && Array.isArray(g.ids)) {
            g.ids.forEach((id: string) => ids.push(id));
          }
        });
      }
    });
    return ids.map((id) => ({
      id,
      slotNumber: id,
      status: "AVAILABLE" as const,
      type: "REGULAR" as const,
      parkingSlotId: 0,
      parkingLotId,
    }));
  }, [parsedLayout, parkingLotId]);

  return (
    <div className="space-y-8">
      <form action={saveAction} className="space-y-4">
        <Label htmlFor="layout">Layout JSON</Label>
        <Textarea id="layout" name="layout" value={layoutText} onChange={(e) => setLayoutText(e.target.value)} className="min-h-40" />
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={!mapId}>Guardar Layout</Button>
          {!mapId && <span className="text-sm text-muted-foreground">No hay mapa asignado al parking lot</span>}
        </div>
      </form>

      <div>
        <Label>Vista previa</Label>
        <div className="mt-2">
          <ParkingMap
            slots={previewSlots}
            onSlotSelect={() => {}}
            selectedSlotId={null}
            showOnlyAvailable={false}
            onToggleShowOnlyAvailable={() => {}}
          />
        </div>
      </div>

      <form action={importAction} className="space-y-4">
        <Label htmlFor="codes">Importar espacios (separados por coma, espacio o salto de línea)</Label>
        <Input id="codes" name="codes" value={codesText} onChange={(e) => setCodesText(e.target.value)} placeholder="A1, A2, B1, B2" />
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={!mapId}>Importar Espacios</Button>
          {!mapId && <span className="text-sm text-muted-foreground">No hay mapa asignado para importar espacios</span>}
        </div>
      </form>
    </div>
  );
}

