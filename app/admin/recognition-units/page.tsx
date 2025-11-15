"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Search,
  MoreVertical,
  Plus,
  Activity,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Settings,
  Power,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";

interface RecognitionUnit {
  id: number;
  name: string;
  location: string;
  ipAddress: string;
  status: "online" | "offline" | "maintenance" | "error";
  lastSync: string;
  version: string;
  capacity: number;
  occupied: number;
}

export default function RecognitionUnitsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const units: RecognitionUnit[] = [
    {
      id: 1,
      name: "Unit-DT-001",
      location: "Downtown Plaza - Level 1",
      ipAddress: "192.168.1.101",
      status: "online",
      lastSync: "2024-03-20T10:30:00",
      version: "v2.3.1",
      capacity: 50,
      occupied: 32,
    },
    {
      id: 2,
      name: "Unit-DT-002",
      location: "Downtown Plaza - Level 2",
      ipAddress: "192.168.1.102",
      status: "online",
      lastSync: "2024-03-20T10:29:00",
      version: "v2.3.1",
      capacity: 50,
      occupied: 45,
    },
    {
      id: 3,
      name: "Unit-ML-001",
      location: "Mall Parking - Main Entrance",
      ipAddress: "192.168.2.101",
      status: "maintenance",
      lastSync: "2024-03-19T15:20:00",
      version: "v2.3.0",
      capacity: 100,
      occupied: 0,
    },
    {
      id: 4,
      name: "Unit-AP-001",
      location: "Airport Terminal - Parking A",
      ipAddress: "192.168.3.101",
      status: "online",
      lastSync: "2024-03-20T10:28:00",
      version: "v2.3.1",
      capacity: 200,
      occupied: 156,
    },
    {
      id: 5,
      name: "Unit-CC-001",
      location: "City Center - Underground",
      ipAddress: "192.168.4.101",
      status: "error",
      lastSync: "2024-03-20T08:15:00",
      version: "v2.2.5",
      capacity: 75,
      occupied: 0,
    },
    {
      id: 6,
      name: "Unit-CC-002",
      location: "City Center - Street Level",
      ipAddress: "192.168.4.102",
      status: "offline",
      lastSync: "2024-03-19T22:00:00",
      version: "v2.3.1",
      capacity: 30,
      occupied: 0,
    },
  ];

  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.ipAddress.includes(searchQuery)
  );

  const stats = [
    {
      label: "Total Units",
      value: units.length,
      icon: MapPin,
      color: "text-blue-500",
    },
    {
      label: "Online",
      value: units.filter((u) => u.status === "online").length,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Maintenance",
      value: units.filter((u) => u.status === "maintenance").length,
      icon: Activity,
      color: "text-yellow-500",
    },
    {
      label: "Issues",
      value: units.filter((u) => u.status === "error" || u.status === "offline")
        .length,
      icon: AlertCircle,
      color: "text-red-500",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Online
          </Badge>
        );
      case "offline":
        return (
          <Badge variant="secondary">
            <WifiOff className="mr-1 h-3 w-3" />
            Offline
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-yellow-500">
            <Settings className="mr-1 h-3 w-3" />
            Maintenance
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const percentage = (occupied / capacity) * 100;
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const handleEditUnit = (unitId: number) => {
    toast.info("Edit unit functionality", {
      description: `Editing recognition unit ID: ${unitId}`,
    });
  };

  const handleDeleteUnit = (unitId: number) => {
    toast.error("Delete unit functionality", {
      description: `This would delete recognition unit ID: ${unitId}`,
    });
  };

  const handleRestartUnit = (unitId: number) => {
    toast.success("Restart unit functionality", {
      description: `This would restart recognition unit ID: ${unitId}`,
    });
  };

  const handleConfigureUnit = (unitId: number) => {
    toast.info("Configure unit functionality", {
      description: `Opening configuration for unit ID: ${unitId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recognition Units</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all recognition units across locations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Unit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Recognition Units</CardTitle>
              <CardDescription>
                View and manage all recognition units in the system
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search units..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Unit Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.id}</TableCell>
                  <TableCell className="font-semibold">{unit.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {unit.location}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {unit.ipAddress}
                  </TableCell>
                  <TableCell>{getStatusBadge(unit.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${getOccupancyColor(
                          unit.occupied,
                          unit.capacity
                        )}`}
                      >
                        {unit.occupied}
                      </span>
                      <span className="text-muted-foreground">
                        / {unit.capacity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {unit.version}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatLastSync(unit.lastSync)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleEditUnit(unit.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Unit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleConfigureUnit(unit.id)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRestartUnit(unit.id)}
                        >
                          <Power className="mr-2 h-4 w-4" />
                          Restart Unit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Unit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
