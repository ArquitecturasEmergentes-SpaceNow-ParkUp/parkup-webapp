"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar, Clock } from "lucide-react";

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startTime: string, endTime: string) => Promise<void>;
  isCreating: boolean;
  slotNumber: string;
  slotType: string;
}

export function ReservationDialog({
  open,
  onOpenChange,
  onConfirm,
  isCreating,
  slotNumber,
  slotType,
}: ReservationDialogProps) {
  // Set default times: start in 5 minutes, end in 2 hours
  const getDefaultStartTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    return date.toISOString().slice(0, 16);
  };

  const getDefaultEndTime = (startTime: string) => {
    const date = new Date(startTime);
    date.setHours(date.getHours() + 2);
    return date.toISOString().slice(0, 16);
  };

  const [startTime, setStartTime] = useState(getDefaultStartTime());
  const [endTime, setEndTime] = useState(getDefaultEndTime(getDefaultStartTime()));

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    // Auto-adjust end time to be 2 hours after start time
    setEndTime(getDefaultEndTime(value));
  };

  const handleConfirm = async () => {
    await onConfirm(startTime, endTime);
  };

  const formatDuration = () => {
    if (!startTime || !endTime) return "";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0 && diffMinutes > 0) {
      return `${diffHours} hora${diffHours > 1 ? "s" : ""} y ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    } else {
      return `${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
    }
  };

  const isValidTimeRange = () => {
    if (!startTime || !endTime) return false;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    return start >= now && end > start;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirmar Reservación</DialogTitle>
          <DialogDescription>
            Complete los detalles de su reservación para el espacio{" "}
            <span className="font-semibold">{slotNumber}</span>
            {slotType === "MOTORCYCLE" && " (Motocicleta)"}
            {slotType === "DISABLED" && " (Discapacitados)"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="start-time" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Hora de Inicio
            </Label>
            <Input
              id="start-time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              disabled={isCreating}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hora de Fin
            </Label>
            <Input
              id="end-time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={isCreating}
              min={startTime}
            />
          </div>

          {isValidTimeRange() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Duración:</span> {formatDuration()}
              </p>
            </div>
          )}

          {!isValidTimeRange() && startTime && endTime && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                La hora de fin debe ser posterior a la hora de inicio y la hora
                de inicio debe ser futura.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValidTimeRange() || isCreating}
            className="w-full sm:w-auto"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reservando...
              </>
            ) : (
              "Confirmar Reservación"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
