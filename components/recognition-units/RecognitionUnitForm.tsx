"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface RecognitionUnitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<boolean>;
  isSaving: boolean;
  mode: "create" | "edit";
  initialData?: FormData;
}

export interface FormData {
  identifier: string;
  location: "ENTRANCE" | "EXIT";
  affiliateId: number;
  parkingLotId: number;
  description: string;
}

export function RecognitionUnitForm({
  open,
  onOpenChange,
  onSubmit,
  isSaving,
  mode,
  initialData,
}: RecognitionUnitFormProps) {
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    location: "ENTRANCE",
    affiliateId: 0,
    parkingLotId: 0,
    description: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        identifier: "",
        location: "ENTRANCE",
        affiliateId: 0,
        parkingLotId: 0,
        description: "",
      });
    }
    setErrors({});
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Identifier is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    if (!formData.affiliateId || formData.affiliateId <= 0) {
      newErrors.affiliateId = "Affiliate ID must be greater than 0";
    }

    if (!formData.parkingLotId || formData.parkingLotId <= 0) {
      newErrors.parkingLotId = "Parking Lot ID must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        identifier: "",
        location: "ENTRANCE",
        affiliateId: 0,
        parkingLotId: 0,
        description: "",
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      identifier: "",
      location: "ENTRANCE",
      affiliateId: 0,
      parkingLotId: 0,
      description: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Recognition Unit"
              : "Edit Recognition Unit"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new recognition unit to the system."
              : "Update the recognition unit information."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">
              Identifier <span className="text-destructive">*</span>
            </Label>
            <Input
              id="identifier"
              placeholder="Enter unit identifier"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
              disabled={isSaving}
            />
            {errors.identifier && (
              <p className="text-sm text-destructive">{errors.identifier}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.location}
              onValueChange={(value: "ENTRANCE" | "EXIT") =>
                setFormData({ ...formData, location: value })
              }
              disabled={isSaving}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENTRANCE">Entrance</SelectItem>
                <SelectItem value="EXIT">Exit</SelectItem>
              </SelectContent>
            </Select>
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="affiliateId">
                Affiliate ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="affiliateId"
                type="number"
                min="1"
                placeholder="Enter affiliate ID"
                value={formData.affiliateId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    affiliateId: parseInt(e.target.value) || 0,
                  })
                }
                disabled={isSaving}
              />
              {errors.affiliateId && (
                <p className="text-sm text-destructive">{errors.affiliateId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parkingLotId">
                Parking Lot ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="parkingLotId"
                type="number"
                min="1"
                placeholder="Enter parking lot ID"
                value={formData.parkingLotId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parkingLotId: parseInt(e.target.value) || 0,
                  })
                }
                disabled={isSaving}
              />
              {errors.parkingLotId && (
                <p className="text-sm text-destructive">
                  {errors.parkingLotId}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter unit description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isSaving}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
