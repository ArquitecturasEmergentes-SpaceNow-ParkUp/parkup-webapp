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
import { Calendar, Clock, AlertTriangle, Accessibility } from "lucide-react";
import { PaymentWrapper } from "./PaymentWrapper";

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startTime: string, endTime: string, paymentIntentId: string) => Promise<void>;
  isCreating: boolean;
  slotNumber: string;
  slotType: string;
  userHasDisability?: boolean;
  isDisabledSlot?: boolean;
}

export function ReservationDialog({
  open,
  onOpenChange,
  onConfirm,
  isCreating,
  slotNumber,
  slotType,
  userHasDisability = false,
  isDisabledSlot = false,
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
  const [showPayment, setShowPayment] = useState(false);
  
  // Check if user can reserve this slot
  const canReserveDisabledSlot = !isDisabledSlot || userHasDisability;

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    // Auto-adjust end time to be 2 hours after start time
    setEndTime(getDefaultEndTime(value));
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    await onConfirm(startTime, endTime, paymentIntentId);
  };

  const calculateAmount = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    // $5 per hour
    return Math.max(5, diffHours * 1);
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
    } 
    if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    } 
    return `${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
  };

  const isValidTimeRange = () => {
    if (!startTime || !endTime) return false;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    return start >= now && end > start;
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setShowPayment(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {showPayment ? "Proceso de Pago" : "Confirmar Reservación"}
          </DialogTitle>
          <DialogDescription>
            {showPayment ? (
              <>
                Complete el pago para confirmar su reservación del espacio{" "}
                <span className="font-semibold">{slotNumber}</span>
              </>
            ) : (
              <>
                Complete los detalles de su reservación para el espacio{" "}
                <span className="font-semibold">{slotNumber}</span>
                {slotType === "MOTORCYCLE" && " (Motocicleta)"}
                {slotType === "DISABLED" && " (Discapacitados)"}.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {!showPayment ? (
          <>
            <div className="space-y-4 py-4">
              {/* Warning for disabled slot when user doesn't have disability */}
              {isDisabledSlot && !userHasDisability && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">
                        Atención: Espacio para Discapacitados
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Este espacio es exclusivo para personas con discapacidad.
                        Si necesitas acceso a estos espacios, activa la opción de
                        accesibilidad en tu perfil.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Info for disabled slot when user has disability */}
              {isDisabledSlot && userHasDisability && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Este espacio está habilitado para personas con discapacidad.
                    </p>
                  </div>
                </div>
              )}
              
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
                  disabled={isCreating || !canReserveDisabledSlot}
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
                  disabled={isCreating || !canReserveDisabledSlot}
                  min={startTime}
                />
              </div>

              {isValidTimeRange() && canReserveDisabledSlot && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Duración:</span> {formatDuration()}
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <span className="font-semibold">Costo estimado:</span> S/. {calculateAmount().toFixed(2)}
                  </p>
                </div>
              )}

              {!isValidTimeRange() && startTime && endTime && canReserveDisabledSlot && (
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
                onClick={() => setShowPayment(true)}
                disabled={!isValidTimeRange() || isCreating || !canReserveDisabledSlot}
                className="w-full sm:w-auto"
              >
                {canReserveDisabledSlot ? "Continuar al Pago" : "No Disponible"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-4">
            <PaymentWrapper
              amount={calculateAmount()}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
              startTime={startTime}
              endTime={endTime}
              slotNumber={slotNumber}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
