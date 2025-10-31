"use client";

import {
  DeleteConfirmDialog,
  EmptyState,
  LoadingState,
  RecognitionUnitForm,
  RecognitionUnitsTable,
  type FormData,
} from "@/components/recognition-units";
import { Button } from "@/components/ui/button";
import { useRecognitionUnits } from "@/hooks/useRecognitionUnits";
import type { RecognitionUnit } from "@/lib/recognitionUnits";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function RecognitionUnitsPage() {
  const {
    units,
    isLoading,
    isSaving,
    handleBarrierToggle,
    handleAutoEntryExitToggle,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useRecognitionUnits();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<RecognitionUnit | null>(
    null,
  );

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleOpenEditDialog = (unit: RecognitionUnit) => {
    setSelectedUnit(unit);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (unit: RecognitionUnit) => {
    setSelectedUnit(unit);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data: FormData) => {
    const success = await handleCreate(data);
    return success;
  };

  const handleEditSubmit = async (data: FormData) => {
    if (!selectedUnit) return false;
    const success = await handleUpdate(selectedUnit.id, data);
    if (success) {
      setSelectedUnit(null);
    }
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUnit) return;
    const success = await handleDelete(selectedUnit.id);
    if (success) {
      setSelectedUnit(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Command Center Overview</h1>
        <Button onClick={handleOpenCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Recognition Unit
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <LoadingState />
        ) : units.length === 0 ? (
          <EmptyState onAddClick={handleOpenCreateDialog} />
        ) : (
          <RecognitionUnitsTable
            units={units}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteDialog}
            onBarrierToggle={handleBarrierToggle}
            onAutoEntryExitToggle={handleAutoEntryExitToggle}
          />
        )}
      </div>

      <RecognitionUnitForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isSaving={isSaving}
        mode="create"
      />

      <RecognitionUnitForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditSubmit}
        isSaving={isSaving}
        mode="edit"
        initialData={
          selectedUnit
            ? {
                identifier: selectedUnit.identifier,
                location: selectedUnit.location,
                affiliateId: selectedUnit.affiliateId,
                parkingLotId: selectedUnit.parkingLotId,
                description: selectedUnit.description,
              }
            : undefined
        }
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        unit={selectedUnit}
        isDeleting={isSaving}
      />
    </div>
  );
}
