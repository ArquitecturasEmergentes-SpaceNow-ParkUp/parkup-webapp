import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { listParkingLots, getParkingLotById, editParkingLotMap, importParkingSpaces } from "@/lib/parkingLots";
import parkingLayoutData from "@/data/parking-layout.json";
import { AdminMapEditorClient } from "@/components/admin/AdminMapEditorClient";

export default async function MapEditorPage() {
  const lots = await listParkingLots();
  const lot = lots.success && lots.data && lots.data.length > 0 ? lots.data[0] : null;
  let initialLayout = JSON.stringify(parkingLayoutData);
  let mapId: number | null = null;
  const parkingLotId = lot ? lot.id : 1;
  const lotDetail = lot ? await getParkingLotById(lot.id) : null;
  if (lotDetail && lotDetail.success && lotDetail.data && Array.isArray(lotDetail.data.maps) && lotDetail.data.maps.length > 0) {
    const m = lotDetail.data.maps[0];
    mapId = m.id;
    if (m.layoutJson) initialLayout = m.layoutJson;
  }

  async function saveLayout(formData: FormData) {
    "use server";
    const content = formData.get("layout") as string;
    const targetMapId = mapId;
    if (targetMapId) {
      await editParkingLotMap(targetMapId, { parkingLotId, newLayoutJson: content });
    }
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
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Editor de Mapa</h2>
        </CardHeader>
        <CardContent>
          <AdminMapEditorClient initialLayout={initialLayout} parkingLotId={parkingLotId} mapId={mapId} saveAction={saveLayout} importAction={importSpacesAction} />
        </CardContent>
      </Card>
    </div>
  );
}

