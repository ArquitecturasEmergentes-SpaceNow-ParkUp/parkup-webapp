"use client";

import { ParkingSlot, type SlotStatus, type SlotType } from "./ParkingSlot";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import parkingLayoutData from "@/data/parking-layout.json";

interface ParkingSpot {
  id: string;
  slotNumber: string;
  status: SlotStatus;
  type: SlotType;
}

interface ParkingMapProps {
  slots: ParkingSpot[];
  onSlotSelect: (slotId: string) => void;
  selectedSlotId: string | null;
  showOnlyAvailable: boolean;
  onToggleShowOnlyAvailable: (checked: boolean) => void;
}

interface LayoutGroup {
  ids: string[];
  gap: boolean;
}

interface LayoutRow {
  row: string;
  slots: LayoutGroup[];
}

// Import layout configuration from JSON
const PARKING_LAYOUT: LayoutRow[] = parkingLayoutData as LayoutRow[];

export function ParkingMap({
  slots,
  onSlotSelect,
  selectedSlotId,
  showOnlyAvailable,
  onToggleShowOnlyAvailable,
}: ParkingMapProps) {
  const getSlotById = (id: string): ParkingSpot | undefined => {
    return slots.find((slot) => slot.id === id);
  };

  const shouldShowSlot = (slotId: string): boolean => {
    if (!showOnlyAvailable) return true;
    const slot = getSlotById(slotId);
    return slot ? slot.status === "AVAILABLE" : false;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Mapa del Estacionamiento</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-available" className="text-sm">
              Mostrar solo disponibles
            </Label>
            <Switch
              id="show-available"
              checked={showOnlyAvailable}
              onCheckedChange={onToggleShowOnlyAvailable}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-8 space-y-4">
          {PARKING_LAYOUT.map((rowConfig) => (
            <div key={rowConfig.row} className="flex gap-4 justify-start">
              {rowConfig.slots.map((group, groupIndex) => {
                if (group.gap) {
                  return (
                    <div
                      key={`gap-${rowConfig.row}-${groupIndex}`}
                      className="w-20"
                    />
                  );
                }

                return (
                  <div
                    key={`group-${rowConfig.row}-${groupIndex}`}
                    className="flex gap-4"
                  >
                    {group.ids.map((slotId) => {
                      const slot = getSlotById(slotId);

                      // If filtering and slot not available, show empty space
                      if (!shouldShowSlot(slotId)) {
                        return <div key={slotId} className="w-20 h-20" />;
                      }

                      // If slot doesn't exist in data, skip
                      if (!slot) {
                        return null;
                      }

                      return (
                        <ParkingSlot
                          key={slot.id}
                          slotNumber={slot.slotNumber}
                          status={slot.status}
                          type={slot.type}
                          onClick={() => onSlotSelect(slot.id)}
                          isSelected={selectedSlotId === slot.id}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
