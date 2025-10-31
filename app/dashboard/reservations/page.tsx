"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ParkingMap,
  StatusLegend,
  ReservationDialog,
} from "@/components/reservations";
import { useReservations } from "@/hooks/useReservations";
import type { SlotStatus, SlotType } from "@/components/reservations";
import parkingSlotsData from "@/data/parking-slots.json";

interface ParkingSpot {
  id: string;
  slotNumber: string;
  status: SlotStatus;
  type: SlotType;
  parkingSlotId: number;
  parkingLotId: number;
}

// Importar datos desde JSON
const PARKING_SLOTS: ParkingSpot[] = parkingSlotsData as ParkingSpot[];

export default function ReservationsPage() {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isCreating, handleCreateReservation } = useReservations();

  const selectedSlot = PARKING_SLOTS.find((slot) => slot.id === selectedSlotId);

  const handleSlotSelect = (slotId: string) => {
    const slot = PARKING_SLOTS.find((s) => s.id === slotId);
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
  ) => {
    if (!selectedSlot) {
      return;
    }

    const success = await handleCreateReservation(
      selectedSlot.parkingLotId,
      new Date(startTime).toISOString(),
      new Date(endTime).toISOString(),
    );

    if (success) {
      // Actualizar el estado local del slot a RESERVED
      const slotIndex = PARKING_SLOTS.findIndex((s) => s.id === selectedSlotId);
      if (slotIndex !== -1) {
        PARKING_SLOTS[slotIndex].status = "RESERVED";
      }
      setIsDialogOpen(false);
      setSelectedSlotId(null);
    }
  };

  const availableCount = PARKING_SLOTS.filter(
    (slot) => slot.status === "AVAILABLE",
  ).length;
  const occupiedCount = PARKING_SLOTS.filter(
    (slot) => slot.status === "OCCUPIED",
  ).length;
  const reservedCount = PARKING_SLOTS.filter(
    (slot) => slot.status === "RESERVED",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Parking Central</h1>
            <p className="text-muted-foreground">
              Seleccione un espacio para reservarlo.
            </p>
          </div>
          <StatusLegend />
        </div>

        {/* Stats */}
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

      {/* Parking Map */}
      <ParkingMap
        slots={PARKING_SLOTS}
        onSlotSelect={handleSlotSelect}
        selectedSlotId={selectedSlotId}
        showOnlyAvailable={showOnlyAvailable}
        onToggleShowOnlyAvailable={setShowOnlyAvailable}
      />

      {/* Reserve Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          className="px-12 py-6 text-lg font-semibold"
          disabled={!selectedSlot}
          onClick={handleReserveClick}
        >
          {selectedSlot
            ? `Reservar Lugar ${selectedSlot.slotNumber}`
            : "Reservar Lugar"}
        </Button>
      </div>

      {/* Selected Slot Info */}
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

      {/* Reservation Dialog */}
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
