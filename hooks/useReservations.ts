"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  createReservation,
  confirmReservationPayment,
  getCurrentUserId,
  type CreateReservationRequest,
} from "@/lib/reservations";

export interface UseReservationsReturn {
  isCreating: boolean;
  handleCreateReservation: (
    parkingLotId: number,
    parkingSlotId: number | null,
    startTime: string,
    endTime: string,
    paymentIntentId: string,
  ) => Promise<boolean>;
}

export function useReservations(): UseReservationsReturn {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateReservation = useCallback(
    async (parkingLotId: number, parkingSlotId: number | null, startTime: string, endTime: string, paymentIntentId: string) => {
      // Get current user ID
      const userId = await getCurrentUserId();

      if (!userId) {
        toast.error("User not authenticated");
        return false;
      }

      if (!parkingLotId) {
        toast.error("Please select a parking lot");
        return false;
      }

      if (!startTime || !endTime) {
        toast.error("Please provide start and end times");
        return false;
      }

      if (!paymentIntentId) {
        toast.error("Payment information is missing");
        return false;
      }

      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      if (startDate >= endDate) {
        toast.error("End time must be after start time");
        return false;
      }

      if (startDate < new Date()) {
        toast.error("Start time cannot be in the past");
        return false;
      }

      setIsCreating(true);

      const data: CreateReservationRequest = {
        userId,
        parkingLotId,
        parkingSlotId: parkingSlotId || undefined,
        startTime,
        endTime,
      };

      // Step 1: Create the reservation
      console.log("Step 1: Creating reservation...");
      const result = await createReservation(data);

      if (result.success && result.data) {
        console.log("Step 1: Reservation created successfully, ID:", result.data.id);
        
        // Step 2: Confirm the payment
        console.log("Step 2: Confirming payment...");
        const confirmResult = await confirmReservationPayment(
          result.data.id,
          paymentIntentId
        );

        if (confirmResult.success) {
          console.log("Step 2: Payment confirmed successfully");
          toast.success("Reservación creada y pago confirmado exitosamente!");
          setIsCreating(false);
          return true;
        }
        console.error("Step 2: Payment confirmation failed:", confirmResult.error);
        toast.error(
          confirmResult.error || "Reservación creada pero falló la confirmación del pago"
        );
        setIsCreating(false);
        return false;
      }
      console.error("Step 1: Reservation creation failed:", result.error);
      toast.error(result.error || "Failed to create reservation");
      setIsCreating(false);
      return false;
    },
    [],
  );

  return {
    isCreating,
    handleCreateReservation,
  };
}
