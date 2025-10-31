"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Video, Pencil, Trash2 } from "lucide-react";
import type { RecognitionUnit } from "@/lib/recognitionUnits";

interface RecognitionUnitRowProps {
  unit: RecognitionUnit;
  onEdit: (unit: RecognitionUnit) => void;
  onDelete: (unit: RecognitionUnit) => void;
  onBarrierToggle: (unitId: string, currentState: boolean) => void;
  onAutoEntryExitToggle: (unitId: string, currentState: boolean) => void;
}

export function RecognitionUnitRow({
  unit,
  onEdit,
  onDelete,
  onBarrierToggle,
  onAutoEntryExitToggle,
}: RecognitionUnitRowProps) {
  return (
    <TableRow className="border-b">
      <TableCell className="py-6">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-base">{unit.identifier}</span>
          <span className="text-sm text-muted-foreground">{unit.location}</span>
        </div>
      </TableCell>
      <TableCell className="py-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              unit.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span className="text-muted-foreground capitalize">
            {unit.status || "INACTIVE"}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-6 text-center">
        <div className="flex justify-center">
          <Button className="flex items-center justify-center w-20 h-14 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
            <Video className="h-6 w-6 text-gray-400" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground min-w-[50px]">
              {unit.barrierOpen ? "Open" : "Closed"}
            </span>
            <Switch
              checked={unit.barrierOpen || false}
              onCheckedChange={() =>
                onBarrierToggle(unit.id, unit.barrierOpen || false)
              }
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="py-6 text-center">
        <div className="flex justify-center">
          <Switch
            checked={unit.autoEntryExit || false}
            onCheckedChange={() =>
              onAutoEntryExitToggle(unit.id, unit.autoEntryExit || false)
            }
          />
        </div>
      </TableCell>
      <TableCell className="py-6">
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(unit)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(unit)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
