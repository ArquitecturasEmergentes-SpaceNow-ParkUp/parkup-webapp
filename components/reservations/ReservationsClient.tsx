"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParkingMap, ReservationDialog } from "@/components/reservations";
import { useReservations } from "@/hooks/useReservations";
import type { SlotStatus, SlotType } from "@/components/reservations/ParkingSlot";
import type { ParkingSlot as BackendParkingSlot } from "@/lib/reservations";

interface ParkingSpot {
  id: string;
  slotNumber: string;
  status: SlotStatus;
  type: SlotType;
  parkingSlotId: number;
  parkingLotId: number;
}

function mapType(type: BackendParkingSlot["type"]): SlotType {
  if (type === "DISABLED") return "DISABLED";
  if (type === "MOTORCYCLE") return "MOTORCYCLE";
  return "REGULAR";
}

function mapStatus(status: BackendParkingSlot["status"]): SlotStatus {
  if (status === "OCCUPIED") return "OCCUPIED";
  if (status === "RESERVED") return "RESERVED";
  return "AVAILABLE";
}

export function ReservationsClient({ slots }: { slots: BackendParkingSlot[] }) {
  const normalizedSlots: ParkingSpot[] = useMemo(
    () =>
      (slots || []).map((s) => ({
        id: s.slotNumber,
        slotNumber: s.slotNumber,
        status: mapStatus(s.status),
        type: mapType(s.type),
        parkingSlotId: s.id,
        parkingLotId: s.parkingLotId,
      })),
    [slots],
  );

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isCreating, handleCreateReservation } = useReservations();

  const selectedSlot = normalizedSlots.find((slot) => slot.id === selectedSlotId);

  const handleSlotSelect = (slotId: string) => {
    const slot = normalizedSlots.find((s) => s.id === slotId);
    if (slot && slot.status === "AVAILABLE") {
      setSelectedSlotId(slotId);
    }
  };

  const handleReserveClick = () => {
    if (selectedSlot) {
      setIsDialogOpen(true);
    }
  };

  const handleConfirmReservation = async (
    startTime: string,
    endTime: string,
    paymentIntentId: string,
  ) => {
    if (!selectedSlot) {
      return;
    }

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toISOString().replace(/\.\d{3}Z$/, "Z");
    };

    const success = await handleCreateReservation(
      selectedSlot.parkingLotId,
      formatDate(startTime),
      formatDate(endTime),
      paymentIntentId,
    );

    if (success) {
      setIsDialogOpen(false);
      setSelectedSlotId(null);
    }
  };

  return (
    <div className="space-y-6">
      <ParkingMap
        slots={normalizedSlots}
        onSlotSelect={handleSlotSelect}
        selectedSlotId={selectedSlotId}
        showOnlyAvailable={showOnlyAvailable}
        onToggleShowOnlyAvailable={setShowOnlyAvailable}
      />

      <div className="flex justify-center">
        <Button
          size="lg"
          className="px-12 py-6 text-lg font-semibold"
          disabled={!selectedSlot}
          onClick={handleReserveClick}
        >
          {selectedSlot ? `Reservar Lugar ${selectedSlot.slotNumber}` : "Reservar Lugar"}
        </Button>
      </div>

      {selectedSlot && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800 text-center">
              Ha seleccionado el espacio{" "}
              <Badge variant="default" className="font-bold">
                {selectedSlot.slotNumber}
              </Badge>
              {selectedSlot.type === "MOTORCYCLE" && " (Motocicleta)"}
              {selectedSlot.type === "DISABLED" && " (Discapacitados)"}. Haga
              clic en el botón para configurar su reservación.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedSlot && (
        <ReservationDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onConfirm={handleConfirmReservation}
          isCreating={isCreating}
          slotNumber={selectedSlot.slotNumber}
          slotType={selectedSlot.type}
        />
      )}
    </div>
  );
}

