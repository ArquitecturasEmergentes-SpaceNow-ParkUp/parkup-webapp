"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecognitionUnitRow } from "./RecognitionUnitRow";
import type { RecognitionUnit } from "@/lib/recognitionUnits";

interface RecognitionUnitsTableProps {
  units: RecognitionUnit[];
  onEdit: (unit: RecognitionUnit) => void;
  onDelete: (unit: RecognitionUnit) => void;
  onBarrierToggle: (unitId: string, currentState: boolean) => void;
  onAutoEntryExitToggle: (unitId: string, currentState: boolean) => void;
}

export function RecognitionUnitsTable({
  units,
  onEdit,
  onDelete,
  onBarrierToggle,
  onAutoEntryExitToggle,
}: RecognitionUnitsTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2">
            <TableHead className="font-bold text-base">Unit Name</TableHead>
            <TableHead className="font-bold text-base text-center">
              Status
            </TableHead>
            <TableHead className="font-bold text-base text-center">
              Live Feed
            </TableHead>
            <TableHead className="font-bold text-base text-center">
              Barrier Control
            </TableHead>
            <TableHead className="font-bold text-base text-center">
              Auto Entry/Exit
            </TableHead>
            <TableHead className="font-bold text-base text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <RecognitionUnitRow
              key={unit.id}
              unit={unit}
              onEdit={onEdit}
              onDelete={onDelete}
              onBarrierToggle={onBarrierToggle}
              onAutoEntryExitToggle={onAutoEntryExitToggle}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
