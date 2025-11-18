"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParkingMap } from "@/components/reservations";
import { InteractiveMapEditor } from "@/components/admin/InteractiveMapEditor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  initialLayout: string;
  parkingLotId?: number;
  mapId: number | null;
  saveAction: (formData: FormData) => Promise<void>;
  importAction: (formData: FormData) => Promise<void>;
}

export function AdminMapEditorClient({ initialLayout, parkingLotId, mapId, saveAction, importAction }: Props) {
  const [layoutText, setLayoutText] = useState(initialLayout);
  const [codesText, setCodesText] = useState("");
  const [showInteractiveEditor, setShowInteractiveEditor] = useState(false);
  const router = useRouter();

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
      parkingLotId: parkingLotId || 0,
    }));
  }, [parsedLayout, parkingLotId]);

  const handleInteractiveLayoutChange = (newLayout: any[]) => {
    setLayoutText(JSON.stringify(newLayout, null, 2));
  };

  const handleInteractiveSave = async (layout: any[]) => {
    const formData = new FormData();
    formData.set('layout', JSON.stringify(layout));
    try {
      await saveAction(formData);
      toast.success('Mapa guardado exitosamente');
      setLayoutText(JSON.stringify(layout, null, 2));
      router.refresh();
    } catch (e: any) {
      const message = e?.message || 'Error al guardar el mapa';
      toast.error(message);
    }
  };

  // Handler to save JSON layout via server action but showing toast in UI
  const handleJsonSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    // Client-side validation: layout must be array of rows with slots
    const parsed = parsedLayout;
    const isValidLayout = (obj: any): boolean => {
      if (!Array.isArray(obj)) return false;
      for (const r of obj) {
        if (typeof r !== "object" || !r.row || !Array.isArray(r.slots)) return false;
      }
      return true;
    };
    if (!isValidLayout(parsed)) {
      toast.error("Formato de layout inválido. Usa filas y grupos 'slots' en el JSON.");
      return;
    }

    try {
      await saveAction(formData);
      toast.success('Mapa guardado exitosamente');
      router.refresh();
    } catch (err: any) {
      const message = err?.message || 'Error al guardar el mapa';
      toast.error(message);
    }
  };

  const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await importAction(formData);
      toast.success('Importado correctamente');
      router.refresh();
    } catch (err: any) {
      const message = err?.message || 'Error al importar';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toggle between editors */}
      <div className="flex gap-4">
        <Button
          variant={!showInteractiveEditor ? 'default' : 'outline'}
          onClick={() => setShowInteractiveEditor(false)}
        >
          Editor JSON
        </Button>
        <Button
          variant={showInteractiveEditor ? 'default' : 'outline'}
          onClick={() => setShowInteractiveEditor(true)}
        >
          Editor Interactivo
        </Button>
      </div>

      {showInteractiveEditor ? (
        <InteractiveMapEditor
          initialLayout={parsedLayout}
          onLayoutChange={handleInteractiveLayoutChange}
          onSave={handleInteractiveSave}
        />
      ) : (
        <>
          <form onSubmit={handleJsonSave} className="space-y-4">
            <Label htmlFor="layout">Layout JSON</Label>
            <Textarea id="layout" name="layout" value={layoutText} onChange={(e) => setLayoutText(e.target.value)} className="min-h-40" />
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={!parkingLotId}>Guardar Layout</Button>
              {!mapId && <span className="text-sm text-muted-foreground">No hay mapa asignado al parking lot. Al enviar se creará uno.</span>}
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
        </>
      )}

      <form onSubmit={handleImport} className="space-y-4">
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

