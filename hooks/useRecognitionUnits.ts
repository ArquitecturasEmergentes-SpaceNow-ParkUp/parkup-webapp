"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  type RecognitionUnit,
  getAllRecognitionUnits,
  createRecognitionUnit,
  updateRecognitionUnit,
  deleteRecognitionUnit,
  controlBarrier,
  toggleAutoEntryExit,
} from "@/lib/recognitionUnits";

export interface UseRecognitionUnitsReturn {
  units: RecognitionUnit[];
  isLoading: boolean;
  isSaving: boolean;
  loadUnits: () => Promise<void>;
  handleBarrierToggle: (unitId: string, currentState: boolean) => Promise<void>;
  handleAutoEntryExitToggle: (
    unitId: string,
    currentState: boolean,
  ) => Promise<void>;
  handleCreate: (data: {
    identifier: string;
    location: "ENTRANCE" | "EXIT";
    affiliateId: number;
    parkingLotId: number;
    description: string;
  }) => Promise<boolean>;
  handleUpdate: (
    unitId: string,
    data: {
      identifier: string;
      location: "ENTRANCE" | "EXIT";
      affiliateId: number;
      parkingLotId: number;
      description: string;
    },
  ) => Promise<boolean>;
  handleDelete: (unitId: string) => Promise<boolean>;
}

export function useRecognitionUnits(): UseRecognitionUnitsReturn {
  const [units, setUnits] = useState<RecognitionUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadUnits = useCallback(async () => {
    setIsLoading(true);
    const result = await getAllRecognitionUnits();
    if (result.success && result.data) {
      setUnits(result.data);
    } else {
      toast.error(result.error || "Failed to load recognition units");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const handleBarrierToggle = useCallback(
    async (unitId: string, currentState: boolean) => {
      const newState = !currentState;

      // Optimistic update
      setUnits((prevUnits) =>
        prevUnits.map((unit) =>
          unit.id === unitId ? { ...unit, barrierOpen: newState } : unit,
        ),
      );

      const result = await controlBarrier(unitId, newState);
      if (!result.success) {
        // Revert on error
        setUnits((prevUnits) =>
          prevUnits.map((unit) =>
            unit.id === unitId ? { ...unit, barrierOpen: currentState } : unit,
          ),
        );
        toast.error(result.error || "Failed to control barrier");
      } else {
        toast.success(`Barrier ${newState ? "opened" : "closed"} successfully`);
      }
    },
    [],
  );

  const handleAutoEntryExitToggle = useCallback(
    async (unitId: string, currentState: boolean) => {
      const newState = !currentState;

      // Optimistic update
      setUnits((prevUnits) =>
        prevUnits.map((unit) =>
          unit.id === unitId ? { ...unit, autoEntryExit: newState } : unit,
        ),
      );

      const result = await toggleAutoEntryExit(unitId, newState);
      if (!result.success) {
        // Revert on error
        setUnits((prevUnits) =>
          prevUnits.map((unit) =>
            unit.id === unitId
              ? { ...unit, autoEntryExit: currentState }
              : unit,
          ),
        );
        toast.error(result.error || "Failed to toggle auto entry/exit");
      } else {
        toast.success(`Auto entry/exit ${newState ? "enabled" : "disabled"}`);
      }
    },
    [],
  );

  const handleCreate = useCallback(
    async (data: {
      identifier: string;
      location: "ENTRANCE" | "EXIT";
      affiliateId: number;
      parkingLotId: number;
      description: string;
    }) => {
      if (!data.identifier.trim()) {
        toast.error("Please enter a unit identifier");
        return false;
      }

      if (!data.description.trim()) {
        toast.error("Please enter a description");
        return false;
      }

      if (data.affiliateId <= 0) {
        toast.error("Please enter a valid affiliate ID");
        return false;
      }

      if (data.parkingLotId <= 0) {
        toast.error("Please enter a valid parking lot ID");
        return false;
      }

      setIsSaving(true);
      const result = await createRecognitionUnit(data);

      if (result.success && result.data) {
        const newUnit = result.data;
        setUnits((prevUnits) => [...prevUnits, newUnit]);
        toast.success("Recognition unit created successfully");
        setIsSaving(false);
        return true;
      } else {
        toast.error(result.error || "Failed to create recognition unit");
        setIsSaving(false);
        return false;
      }
    },
    [],
  );

  const handleUpdate = useCallback(
    async (
      unitId: string,
      data: {
        identifier: string;
        location: "ENTRANCE" | "EXIT";
        affiliateId: number;
        parkingLotId: number;
        description: string;
      },
    ) => {
      if (!data.identifier.trim()) {
        toast.error("Please enter a unit identifier");
        return false;
      }

      if (!data.description.trim()) {
        toast.error("Please enter a description");
        return false;
      }

      if (data.affiliateId <= 0) {
        toast.error("Please enter a valid affiliate ID");
        return false;
      }

      if (data.parkingLotId <= 0) {
        toast.error("Please enter a valid parking lot ID");
        return false;
      }

      setIsSaving(true);
      const result = await updateRecognitionUnit(unitId, data);

      if (result.success && result.data) {
        const updatedUnit = result.data;
        setUnits((prevUnits) =>
          prevUnits.map((unit) => (unit.id === unitId ? updatedUnit : unit)),
        );
        toast.success("Recognition unit updated successfully");
        setIsSaving(false);
        return true;
      } else {
        toast.error(result.error || "Failed to update recognition unit");
        setIsSaving(false);
        return false;
      }
    },
    [],
  );

  const handleDelete = useCallback(async (unitId: string) => {
    setIsSaving(true);
    const result = await deleteRecognitionUnit(unitId);

    if (result.success) {
      setUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== unitId));
      toast.success("Recognition unit deleted successfully");
      setIsSaving(false);
      return true;
    } else {
      toast.error(result.error || "Failed to delete recognition unit");
      setIsSaving(false);
      return false;
    }
  }, []);

  return {
    units,
    isLoading,
    isSaving,
    loadUnits,
    handleBarrierToggle,
    handleAutoEntryExitToggle,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
