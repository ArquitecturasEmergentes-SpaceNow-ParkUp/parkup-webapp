'use client';

import type { LogsFilters } from '@/lib/logs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface FiltersProps {
  filters: LogsFilters;
  onFilterChange: (filters: LogsFilters) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const handleInputChange = (key: keyof LogsFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    onFilterChange({ page: 0, size: filters.size || 20, sort: undefined });
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'page' && key !== 'size' && value
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="logs-search" className="text-sm font-medium">Búsqueda</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en acciones, detalles..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              id="logs-search"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="logs-action" className="text-sm font-medium">Acción</label>
          <Select
            value={filters.action || undefined}
            onValueChange={(value) => handleInputChange('action', value === 'all' ? '' : value)}
            id="logs-action"
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las acciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="CREATE_USER">Crear Usuario</SelectItem>
              <SelectItem value="UPDATE_USER">Actualizar Usuario</SelectItem>
              <SelectItem value="DELETE_USER">Eliminar Usuario</SelectItem>
              <SelectItem value="CREATE_PARKING_LOT">Crear Estacionamiento</SelectItem>
              <SelectItem value="UPDATE_PARKING_LOT">Actualizar Estacionamiento</SelectItem>
              <SelectItem value="DELETE_PARKING_LOT">Eliminar Estacionamiento</SelectItem>
              <SelectItem value="CREATE_RECOGNITION_UNIT">Crear Unidad de Reconocimiento</SelectItem>
              <SelectItem value="UPDATE_RECOGNITION_UNIT">Actualizar Unidad de Reconocimiento</SelectItem>
              <SelectItem value="DELETE_RECOGNITION_UNIT">Eliminar Unidad de Reconocimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="logs-username" className="text-sm font-medium">Usuario</label>
          <Input
            placeholder="Nombre de usuario"
            value={filters.username || ''}
            onChange={(e) => handleInputChange('username', e.target.value)}
            id="logs-username"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="logs-status" className="text-sm font-medium">Estado</label>
          <Select
            value={filters.status || undefined}
            onValueChange={(value) => handleInputChange('status', value === 'all' ? '' : value)}
            id="logs-status"
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="SUCCESS">Éxito</SelectItem>
              <SelectItem value="FAILURE">Fallo</SelectItem>
              <SelectItem value="WARNING">Advertencia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="logs-startdate" className="text-sm font-medium">Fecha Inicio</label>
          <Input
            type="datetime-local"
            value={filters.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            id="logs-startdate"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="logs-enddate" className="text-sm font-medium">Fecha Fin</label>
          <Input
            type="datetime-local"
            value={filters.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            id="logs-enddate"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}