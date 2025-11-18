import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { listParkingLots, getParkingLotById, editParkingLotMap, importParkingSpaces, addParkingLotMap } from "@/lib/parkingLots";
import { revalidatePath } from "next/cache";
import parkingLayoutData from "@/data/parking-layout.json";
import { AdminMapEditorClient } from "@/components/admin/AdminMapEditorClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function MapEditorPage({ searchParams }: { searchParams?: { parkingLotId?: string } }) {
  const lots = await listParkingLots();
  const lot = lots.success && lots.data && lots.data.length > 0 ? lots.data[0] : null;
  // Read selection from query string (server-side). If provided, prefer user selection.
  // In some Next.js versions `searchParams` may be a Promise; unwrap it safely.
  const resolvedSearchParams =
    searchParams && typeof (searchParams as any)?.then === "function" ? await searchParams : searchParams;

  const selectedParkingLotId = resolvedSearchParams?.parkingLotId
    ? Number(resolvedSearchParams.parkingLotId)
    : (lot ? lot.id : undefined);
  let initialLayout = JSON.stringify(parkingLayoutData);
  let mapId: number | null = null;
  const parkingLotId = selectedParkingLotId as number | undefined;
  const lotDetail = parkingLotId ? await getParkingLotById(parkingLotId) : null;
  if (lotDetail && lotDetail.success && lotDetail.data && Array.isArray(lotDetail.data.maps) && lotDetail.data.maps.length > 0) {
    const maps = lotDetail.data.maps as any[];
    const m = maps[maps.length - 1];
    mapId = m.id;
    if (m.layoutJson) initialLayout = m.layoutJson;
  }

  async function saveLayout(formData: FormData) {
    "use server";
    const content = formData.get("layout") as string;
    const targetMapId = mapId;
    const computeTotals = (jsonText: string): { totalSpaces: number; disabilitySpaces: number } => {
      try {
        const rows = JSON.parse(jsonText) as any[];
        let total = 0;
        rows.forEach((row) => {
          if (Array.isArray(row?.slots)) {
            row.slots.forEach((g: any) => {
              if (!g?.gap && Array.isArray(g?.ids)) total += g.ids.length;
            });
          }
        });
        return { totalSpaces: total, disabilitySpaces: 0 };
      } catch {
        // If JSON is invalid, return zero counts so `editParkingLotMap` and
        // `addParkingLotMap` receive numeric values rather than `undefined`.
        return { totalSpaces: 0, disabilitySpaces: 0 };
      }
    };
    const totals = computeTotals(content);
    // Ensure we pass numbers to the API; TS sometimes widens to `number | undefined`.
    const totalSpaces = totals.totalSpaces ?? 0;
    const disabilitySpaces = totals.disabilitySpaces ?? 0;
    if (!parkingLotId) throw new Error("No parking lot selected");
    const lotId = parkingLotId;

    if (targetMapId) {
      const res = await editParkingLotMap(targetMapId, { parkingLotId: lotId, newLayoutJson: content, newTotalSpaces: totalSpaces, newDisabilitySpaces: disabilitySpaces });
      if (!res.success) throw new Error(res.error || "Failed to edit map");
    } else {
      const res = await addParkingLotMap({ parkingLotId: lotId, layoutJson: content, totalSpaces: totalSpaces, disabilitySpaces: disabilitySpaces });
      if (!res.success) throw new Error(res.error || "Failed to add map");
    }
    revalidatePath("/admin/map-editor");
  }

  async function importSpacesAction(formData: FormData) {
    "use server";
    const codesRaw = formData.get("codes") as string;
    const targetMapId = mapId;
    if (targetMapId && codesRaw) {
      const items = codesRaw
        .split(/\s|,|;|\n/)
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
        .map((code) => ({ code, disability: /\bDISABLED\b/i.test(code) ? true : false }));
      const res = await importParkingSpaces(targetMapId, items);
      if (!res.success) throw new Error(res.error || "Failed to import spaces");
    }
  }

  return (
    <div className="space-y-6">
      {/* Allow admin to select which parking lot to edit */}
          <div>
            <form method="get">
              <label htmlFor="parkingLotId" className="sr-only">Parking Lot</label>
              {lots.success && lots.data && lots.data.length > 0 ? (
                <>
                  <select name="parkingLotId" id="parkingLotId" defaultValue={String(parkingLotId)} className="mr-4 p-2 border rounded">
                    {lots.data.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn">Cambiar Lote</button>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No hay parking lots disponibles en tu cuenta. {lots.error === "Not authenticated" ? (
                    <>
                      Por favor <Link href="/login" className="text-primary underline">inicia sesión</Link> como administrador.
                    </>
                  ) : (
                    <>
                      {lots.error ? (
                        <span>{lots.error}</span>
                      ) : (
                        "Asegúrate de crear un lote en la sección de afiliados."
                      )}
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Editor de Mapa</h2>
          <p className="text-muted-foreground">
            Crea y edita el mapa de estacionamiento de forma interactiva o mediante JSON
          </p>
        </CardHeader>
        <CardContent>
          <AdminMapEditorClient initialLayout={initialLayout} parkingLotId={parkingLotId} mapId={mapId} saveAction={saveLayout} importAction={importSpacesAction} />
        </CardContent>
      </Card>
    </div>
  );
}

