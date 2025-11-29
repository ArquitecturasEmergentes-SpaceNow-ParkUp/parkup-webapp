import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusLegend } from "@/components/reservations";
import { ReservationsClient } from "@/components/reservations/ReservationsClient";
import { getParkingSlotsByLot } from "@/lib/reservations";
import { listParkingLots } from "@/lib/parkingLots";
import { getParkingLotById } from "@/lib/parkingLots";
import { getProfileByUserId, getCurrentUserId } from "@/lib/profiles";

export default async function ReservationsPage({ searchParams }: { searchParams?: { parkingLotId?: string } }) {
  // Resolve parking lot selection from query string; if not provided, default to first lot
  const lots = await listParkingLots();
  const resolvedSearchParams =
    searchParams && typeof (searchParams as any)?.then === "function" ? await searchParams : searchParams;

  const selectedParkingLotId = resolvedSearchParams?.parkingLotId
    ? Number(resolvedSearchParams.parkingLotId)
    : undefined;

  const defaultLot = lots.success && lots.data && lots.data.length > 0 ? lots.data[0] : null;
  const parkingLotId = selectedParkingLotId ?? (defaultLot ? defaultLot.id : undefined);
  const result = parkingLotId ? await getParkingSlotsByLot(parkingLotId) : { success: true, data: [], error: undefined };
  const slots = (result.success && result.data) ? result.data : [];
  
  // Fetch user's disability status from their profile
  const userId = await getCurrentUserId();
  let userHasDisability = false;
  
  if (userId) {
    const profileResult = await getProfileByUserId(userId);
    if (profileResult.success && profileResult.data) {
      userHasDisability = profileResult.data.disability ?? false;
    }
  }
  
  // Try to retrieve the current parking lot layout (latest map)
  const lot = parkingLotId ? await getParkingLotById(parkingLotId) : null;
  let layout: any[] | undefined = undefined;
    if (lot && lot.success && lot.data && Array.isArray(lot.data.maps) && lot.data.maps.length > 0) {
    const latestMap = lot.data.maps[lot.data.maps.length - 1];
    if (latestMap && latestMap.layoutJson) {
      try {
        const parsed = JSON.parse(latestMap.layoutJson);
          // Support 2 shapes: array of rows OR array of slot codes (legacy)
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (typeof parsed[0] === "string") {
              // Legacy: array of codes -> create a single-row layout
              layout = [
                { row: "A", slots: [{ ids: parsed as string[], gap: false }] },
              ];
            } else {
              layout = parsed;
            }
          }
      } catch {
        layout = undefined;
      }
    }
  }

  const availableCount = slots.filter((slot) => slot.status === "AVAILABLE").length;
  const occupiedCount = slots.filter((slot) => slot.status === "OCCUPIED").length;
  const reservedCount = slots.filter((slot) => slot.status === "RESERVED").length;
  const disabledCount = slots.filter((slot) => slot.type === "DISABLED").length;

  return (
    <div className="space-y-6">
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
            <div className="text-sm text-muted-foreground">No hay parking lots disponibles.</div>
          )}
        </form>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Parking Central</h1>
            <p className="text-muted-foreground">Seleccione un espacio para reservarlo.</p>
          </div>
          <StatusLegend />
        </div>
        <Card>
          <CardContent className="flex flex-wrap gap-4 pt-6">
            <Badge variant="secondary" className="gap-2 px-4 py-2 text-base">
              <span className="font-bold text-lg">{availableCount}</span>
              <span>Disponibles</span>
            </Badge>
            <Badge variant="secondary" className="gap-2 px-4 py-2 text-base">
              <span className="font-bold text-lg">{occupiedCount}</span>
              <span>Ocupados</span>
            </Badge>
            <Badge variant="secondary" className="gap-2 px-4 py-2 text-base">
              <span className="font-bold text-lg">{reservedCount}</span>
              <span>Reservados</span>
            </Badge>
            {disabledCount > 0 && (
              <Badge variant="secondary" className="gap-2 px-4 py-2 text-base bg-blue-100 text-blue-800">
                <span className="font-bold text-lg">{disabledCount}</span>
                <span>♿ Discapacitados</span>
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>
      <ReservationsClient slots={slots} layout={layout} userHasDisability={userHasDisability} />
    </div>
  );
}
