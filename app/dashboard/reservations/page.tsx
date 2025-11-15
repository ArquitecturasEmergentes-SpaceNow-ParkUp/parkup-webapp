import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusLegend } from "@/components/reservations";
import { ReservationsClient } from "@/components/reservations/ReservationsClient";
import { getParkingSlotsByLot } from "@/lib/reservations";

export default async function ReservationsPage() {
  const parkingLotId = 1;
  const result = await getParkingSlotsByLot(parkingLotId);
  const slots = (result.success && result.data) ? result.data : [];

  const availableCount = slots.filter((slot) => slot.status === "AVAILABLE").length;
  const occupiedCount = slots.filter((slot) => slot.status === "OCCUPIED").length;
  const reservedCount = slots.filter((slot) => slot.status === "RESERVED").length;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Parking Central</h1>
            <p className="text-muted-foreground">Seleccione un espacio para reservarlo.</p>
          </div>
          <StatusLegend />
        </div>
        <Card>
          <CardContent className="flex gap-4 pt-6">
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
          </CardContent>
        </Card>
      </div>
      <ReservationsClient slots={slots} />
    </div>
  );
}
