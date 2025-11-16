"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, RotateCcw, Move, Square } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LayoutGroup {
  ids: string[];
  gap: boolean;
}

interface LayoutRow {
  row: string;
  slots: LayoutGroup[];
}

interface ParkingSpace {
  id: string;
  x: number;
  y: number;
  row: string;
  column: number;
}

interface InteractiveMapEditorProps {
  initialLayout: LayoutRow[];
  onLayoutChange: (layout: LayoutRow[]) => void;
  onSave: (layout: LayoutRow[]) => void;
}

export function InteractiveMapEditor({ 
  initialLayout, 
  onLayoutChange, 
  onSave 
}: InteractiveMapEditorProps) {
  const [layout, setLayout] = useState<LayoutRow[]>(initialLayout);
  const [selectedTool, setSelectedTool] = useState<'add' | 'delete' | 'move'>('add');
  const [newRowName, setNewRowName] = useState('');
  const [selectedRow, setSelectedRow] = useState<string>('');
  const [draggedSpace, setDraggedSpace] = useState<ParkingSpace | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const pendingAdd = useRef<Set<string>>(new Set());
  const isProcessingClick = useRef(false);
  const lastClick = useRef<{ key: string; t: number } | null>(null);
  const activePointers = useRef<Map<number, number>>(new Map());
  const lastDelete = useRef<{ id: string; t: number; pointerId: number } | null>(null);

  // Convert layout to parking spaces for visual representation
  const getParkingSpaces = useCallback(() => {
    const spaces: ParkingSpace[] = [];
    layout.forEach((rowConfig, rowIndex) => {
      let currentX = 0;
      rowConfig.slots.forEach((group) => {
        if (group.gap) {
          currentX += 1; // Gap represents one space width
        } else {
          group.ids.forEach((id, index) => {
            spaces.push({
              id,
              x: currentX + index,
              y: rowIndex,
              row: rowConfig.row,
              column: currentX + index
            });
          });
          currentX += group.ids.length;
        }
      });
    });
    return spaces;
  }, [layout]);

  const handleCanvasClick = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.type !== 'pointerup') return;
    if (!event.isPrimary) return;
    if (event.button !== 0) return;
    console.log('CLICK start', { time: event.timeStamp, tool: selectedTool });
    if (selectedTool !== 'add') return;
    event.preventDefault();
    event.stopPropagation();
    try {
      const tNow = performance.now();
      const last = activePointers.current.get(event.pointerId);
      if (last && tNow - last < 300) {
        console.log('IGNORED: repeated pointerId within window', event.pointerId);
        return;
      }
      activePointers.current.set(event.pointerId, tNow);
    } catch {}

    if (selectedTool === 'add') {
      if (isProcessingClick.current) {
        console.log('CLICK ignored: processing flag true');
        return;
      }
      isProcessingClick.current = true;
      setTimeout(() => {
        isProcessingClick.current = false;
        console.log('processing flag cleared');
      }, 100);
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    console.log('canvas rect', rect);
    if (!rect) return;

    const container = event.currentTarget as HTMLDivElement;
    const scrollX = container.scrollLeft;
    const scrollY = container.scrollTop;
    const relX = event.clientX - rect.left + scrollX;
    const relY = event.clientY - rect.top + scrollY;
    const x = Math.floor((relX - 60) / 80);
    const y = Math.floor(relY / 80);
    const posKey = `${x},${y}`;
    console.log('grid pos', { x, y, posKey });

    const now = performance.now();
    if (lastClick.current && lastClick.current.key === posKey && now - lastClick.current.t < 300) {
      console.log('IGNORED: same position within debounce window');
      return;
    }
    lastClick.current = { key: posKey, t: now };

    if ((selectedTool as string) === 'delete') {
      console.log('DELETE start', { x, y, posKey });
      const target = getParkingSpaces().find(space => space.x === x && space.y === y);
      console.log('DELETE target', target);
      if (!target) {
        console.log('DELETE no target at position');
        return;
      }
      setLayout(prev => {
        const newLayout = [...prev];
        const rowIndex = newLayout.findIndex(row => row.row === target.row);
        console.log('DELETE rowIndex', rowIndex);
        if (rowIndex === -1) {
          console.log('DELETE row not found');
          return prev;
        }
        const slots = newLayout[rowIndex].slots;
        console.log('DELETE slots before', JSON.stringify(slots));
        const updatedSlots: LayoutGroup[] = [];
        for (let i = 0; i < slots.length; i++) {
          const group = slots[i];
          console.log('DELETE inspect group', { i, group });
          if (group.gap) {
            updatedSlots.push(group);
            continue;
          }
          const idx = group.ids.indexOf(target.id);
          console.log('DELETE id index in group', { i, idx, ids: group.ids });
          if (idx === -1) {
            updatedSlots.push(group);
            continue;
          }
          const left = group.ids.slice(0, idx);
          const right = group.ids.slice(idx + 1);
          console.log('DELETE split', { left, right });
          if (left.length > 0) updatedSlots.push({ ids: left, gap: false });
          updatedSlots.push({ ids: [], gap: true });
          if (right.length > 0) updatedSlots.push({ ids: right, gap: false });
          for (let j = i + 1; j < slots.length; j++) updatedSlots.push(slots[j]);
          newLayout[rowIndex].slots = mergeConsecutiveGaps(updatedSlots);
          console.log('DELETE slots after', JSON.stringify(newLayout[rowIndex].slots));
          return newLayout;
        }
        console.log('DELETE id not found in any group; no changes');
        return prev;
      });
      console.log('DELETE end');
      return;
    }

    if (pendingAdd.current.has(posKey)) {
      console.log('CLICK ignored: pos pending', posKey);
      return;
    }
    pendingAdd.current.add(posKey);
    console.log('pendingAdd size', pendingAdd.current.size);

    const existingSpace = getParkingSpaces().find(space => space.x === x && space.y === y);
    if (existingSpace) {
      console.log('exists -> skip', existingSpace);
      pendingAdd.current.delete(posKey);
      return;
    }

    console.log('ADD at', { x, y });

    const baseLayout = layout;
    console.log('base layout', baseLayout);
    const newLayout = baseLayout.map(r => ({ row: r.row, slots: r.slots.map(g => ({ ids: [...g.ids], gap: g.gap })) }));

    let targetRow = newLayout[y];
    console.log('targetRow before', targetRow);
    if (!targetRow && y >= 0) {
      const newRowName = String.fromCharCode(65 + y);
      console.log('create row', newRowName);
      targetRow = { row: newRowName, slots: [] };
      newLayout[y] = targetRow;
    }

    if (!targetRow) {
      console.log('no targetRow -> abort');
      pendingAdd.current.delete(posKey);
      return;
    }

    const existingNums: number[] = [];
    targetRow.slots.forEach(group => {
      if (!group.gap) {
        group.ids.forEach(id => {
          const num = Number(id.replace(targetRow.row, ''));
          if (!Number.isNaN(num)) existingNums.push(num);
        });
      }
    });
    const maxNum = existingNums.length ? Math.max(...existingNums) : 0;
    const spaceNumber = maxNum + 1;
    const spaceId = `${targetRow.row}${spaceNumber}`;
    console.log('id final (sequential per row)', spaceId);

    const rowIndex = y;
    let currentX = 0;
    let insertAfterIndex = -1;
    for (let i = 0; i < newLayout[rowIndex].slots.length; i++) {
      const group = newLayout[rowIndex].slots[i];
      console.log('loop group', i, group);
      if (group.gap) {
        currentX += 1;
        if (currentX <= x) {
          insertAfterIndex = i;
        }
      } else {
        if (currentX <= x && x < currentX + group.ids.length) {
          const spaceIndexInGroup = x - currentX;
          console.log('splice into group', { spaceIndexInGroup, before: group.ids });
          group.ids.splice(spaceIndexInGroup, 0, spaceId);
          console.log('splice done', group.ids);
          pendingAdd.current.delete(posKey);
          setLayout(newLayout);
          return;
        }
        currentX += group.ids.length;
        insertAfterIndex = i;
      }
    }

    let targetInsertIndex = insertAfterIndex + 1;
    if (currentX < x) {
      const gapsNeeded = x - currentX;
      for (let i = 0; i < gapsNeeded; i++) {
        newLayout[rowIndex].slots.splice(targetInsertIndex, 0, { ids: [], gap: true });
        targetInsertIndex++;
      }
    } else if (currentX > x) {
      targetInsertIndex = 0;
    }

    console.log(`Inserting new group at index ${targetInsertIndex}`);
    newLayout[rowIndex].slots.splice(targetInsertIndex, 0, { ids: [spaceId], gap: false });
    console.log('Layout updated successfully');
    pendingAdd.current.delete(posKey);
    setLayout(newLayout);
    return;
  };

  const handleCanvasPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    handleCanvasClick(event);
    activePointers.current.delete(event.pointerId);
  };

  const handleSpaceClick = (space: ParkingSpace) => {
    if (selectedTool === 'delete') {
      console.log('DELETE via space click', space);
      setLayout(prev => {
        const newLayout = [...prev];
        const rowIndex = newLayout.findIndex(row => row.row === space.row);
        console.log('DELETE space rowIndex', rowIndex);
        if (rowIndex === -1) {
          console.log('DELETE space row not found');
          return prev;
        }

        const slots = newLayout[rowIndex].slots;
        console.log('DELETE space slots before', JSON.stringify(slots));
        const updatedSlots: LayoutGroup[] = [];

        for (let i = 0; i < slots.length; i++) {
          const group = slots[i];
          if (group.gap) {
            updatedSlots.push(group);
            continue;
          }
          const idx = group.ids.indexOf(space.id);
          console.log('DELETE space id index in group', { i, idx, ids: group.ids });
          if (idx === -1) {
            updatedSlots.push(group);
            continue;
          }
          const left = group.ids.slice(0, idx);
          const right = group.ids.slice(idx + 1);
          console.log('DELETE space split', { left, right });
          if (left.length > 0) {
            updatedSlots.push({ ids: left, gap: false });
          }
          updatedSlots.push({ ids: [], gap: true });
          if (right.length > 0) {
            updatedSlots.push({ ids: right, gap: false });
          }
          // Append remaining groups as-is
          for (let j = i + 1; j < slots.length; j++) {
            updatedSlots.push(slots[j]);
          }
          newLayout[rowIndex].slots = mergeConsecutiveGaps(updatedSlots);
          console.log('DELETE space slots after', JSON.stringify(newLayout[rowIndex].slots));
          return newLayout;
        }

        console.log('DELETE space id not found; no changes');
        return prev;
      });
    }
  };

  function mergeConsecutiveGaps(slots: LayoutGroup[]): LayoutGroup[] {
    const result: LayoutGroup[] = [];
    for (const g of slots) {
      if (result.length > 0 && result[result.length - 1].gap && g.gap) {
        continue;
      }
      result.push(g);
    }
    return result;
  }

  const addNewRow = () => {
    if (!newRowName.trim()) return;
    
    const existingRow = layout.find(row => row.row === newRowName.toUpperCase());
    if (existingRow) {
      alert('Esta fila ya existe');
      return;
    }

    const newRow: LayoutRow = {
      row: newRowName.toUpperCase(),
      slots: []
    };

    setLayout(prev => [...prev, newRow]);
    setNewRowName('');
  };

  const clearLayout = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todo el mapa?')) {
      setLayout([]);
    }
  };

  const handleSave = () => {
    onLayoutChange(layout);
    onSave(layout);
  };

  const parkingSpaces = getParkingSpaces();
  const canvasWidth = Math.max(800, (Math.max(...parkingSpaces.map(s => s.x), 0) + 2) * 80);
  const canvasHeight = Math.max(400, (layout.length + 1) * 80);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Herramientas de Edición</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={selectedTool === 'add' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTool('add')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
              <Button
                variant={selectedTool === 'delete' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setSelectedTool('delete')}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <Input
                placeholder="Nombre de fila (ej: A, B, C)"
                value={newRowName}
                onChange={(e) => setNewRowName(e.target.value)}
                className="w-40"
                maxLength={2}
              />
              <Button onClick={addNewRow} size="sm">
                Agregar Fila
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={clearLayout}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Limpiar Todo
            </Button>

            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-1" />
              Guardar Mapa
            </Button>
          </div>

          <div className="mt-4 flex gap-2 items-center">
            <Badge variant={selectedTool === 'add' ? 'default' : 'outline'}>
              Modo: Agregar espacios
            </Badge>
            <Badge variant={selectedTool === 'delete' ? 'destructive' : 'outline'}>
              Modo: Eliminar espacios
            </Badge>
            <span className="text-sm text-muted-foreground">
              Total de espacios: {parkingSpaces.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Mapa Interactivo</h3>
          <p className="text-sm text-muted-foreground">
            Haz clic en el mapa para agregar espacios. Usa las herramientas de arriba para cambiar entre modos.
          </p>
        </CardHeader>
        <CardContent>
          <div 
            ref={canvasRef}
            className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-auto"
            style={{ width: '100%', height: `${canvasHeight}px`, minHeight: '400px' }}
            onPointerDown={(e) => {
              if (selectedTool === 'add' && e.isPrimary && e.button === 0) {
                try {
                  (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
                } catch {}
              }
            }}
            onPointerUp={handleCanvasPointerUp}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: Math.ceil(canvasWidth / 80) + 1 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 border-l border-gray-200"
                  style={{ left: `${i * 80}px` }}
                />
              ))}
              {Array.from({ length: layout.length + 2 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-gray-200"
                  style={{ top: `${i * 80}px` }}
                />
              ))}
            </div>

            {/* Row labels */}
            {layout.map((row, index) => (
              <div
                key={row.row}
                className="absolute flex items-center justify-center font-semibold text-gray-600 bg-gray-200 border border-gray-300"
                style={{
                  left: '0px',
                  top: `${index * 80}px`,
                  width: '60px',
                  height: '80px'
                }}
              >
                {row.row}
              </div>
            ))}

            {/* Parking spaces */}
            {parkingSpaces.map((space) => (
              <div
                key={space.id}
                className={`absolute w-16 h-16 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center font-semibold text-sm ${
                  selectedTool === 'delete' 
                    ? 'bg-red-100 border-red-300 hover:bg-red-200' 
                    : 'bg-blue-100 border-blue-300 hover:bg-blue-200'
                }`}
                style={{
                  left: `${space.x * 80 + 60}px`,
                  top: `${space.y * 80 + 10}px`
                }}
                onPointerDown={(e) => {
                  if (!e.isPrimary || e.button !== 0) return;
                  e.preventDefault();
                  e.stopPropagation();
                  if (selectedTool !== 'delete') return;
                  const now = performance.now();
                  const ld = lastDelete.current;
                  if (ld && ld.id === space.id && ld.pointerId === e.pointerId && now - ld.t < 300) {
                    return;
                  }
                  lastDelete.current = { id: space.id, t: now, pointerId: e.pointerId };
                  handleSpaceClick(space);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedTool !== 'delete') return;
                  handleSpaceClick(space);
                }}
                title={`Espacio ${space.id} - Fila ${space.row}`}
              >
                {space.id}
              </div>
            ))}

            {/* Instructions */}
            {parkingSpaces.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Square className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Comienza a crear tu mapa</p>
                  <p className="text-sm">Haz clic aquí para agregar tu primer espacio de estacionamiento</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Layout Preview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Vista Previa del Layout JSON</h3>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-60">
            {JSON.stringify(layout, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}