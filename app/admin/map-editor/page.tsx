import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { listParkingLots, getParkingLotById, editParkingLotMap, importParkingSpaces, addParkingLotMap } from "@/lib/parkingLots";
import { revalidatePath } from "next/cache";
import parkingLayoutData from "@/data/parking-layout.json";
import { AdminMapEditorClient } from "@/components/admin/AdminMapEditorClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function MapEditorPage() {
  const lots = await listParkingLots();
  const lot = lots.success && lots.data && lots.data.length > 0 ? lots.data[0] : null;
  let initialLayout = JSON.stringify(parkingLayoutData);
  let mapId: number | null = null;
  const parkingLotId = lot ? lot.id : 1;
  const lotDetail = lot ? await getParkingLotById(lot.id) : null;
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
    const computeTotals = (jsonText: string) => {
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
        return { totalSpaces: undefined, disabilitySpaces: undefined };
      }
    };
    const totals = computeTotals(content);
    if (targetMapId) {
      await editParkingLotMap(targetMapId, { parkingLotId, newLayoutJson: content, newTotalSpaces: totals.totalSpaces, newDisabilitySpaces: totals.disabilitySpaces });
    } else {
      await addParkingLotMap({ parkingLotId, layoutJson: content, totalSpaces: totals.totalSpaces, disabilitySpaces: totals.disabilitySpaces });
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
      await importParkingSpaces(targetMapId, items);
    }
  }

  return (
    <div className="space-y-6">
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

