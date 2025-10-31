"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  createReservation,
  getCurrentUserId,
  type CreateReservationRequest,
} from "@/lib/reservations";

export interface UseReservationsReturn {
  isCreating: boolean;
  handleCreateReservation: (
    parkingLotId: number,
    startTime: string,
    endTime: string,
  ) => Promise<boolean>;
}

export function useReservations(): UseReservationsReturn {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateReservation = useCallback(
    async (parkingLotId: number, startTime: string, endTime: string) => {
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
        startTime,
        endTime,
      };

      const result = await createReservation(data);

      if (result.success && result.data) {
        toast.success("Reservation created successfully!");
        setIsCreating(false);
        return true;
      } else {
        toast.error(result.error || "Failed to create reservation");
        setIsCreating(false);
        return false;
      }
    },
    [],
  );

  return {
    isCreating,
    handleCreateReservation,
  };
}
