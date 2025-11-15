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
  Users,
  Search,
  MoreVertical,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  Edit,
  Ban,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
  status: "active" | "inactive" | "blocked";
  registeredAt: string;
  lastLogin: string;
}

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const users: User[] = [
    {
      id: 1,
      email: "admin@parkup.com",
      name: "Admin User",
      roles: ["ROLE_ADMIN", "ROLE_USER"],
      status: "active",
      registeredAt: "2024-01-15",
      lastLogin: "2024-03-20",
    },
    {
      id: 2,
      email: "john.doe@example.com",
      name: "John Doe",
      roles: ["ROLE_USER"],
      status: "active",
      registeredAt: "2024-02-10",
      lastLogin: "2024-03-19",
    },
    {
      id: 3,
      email: "jane.smith@example.com",
      name: "Jane Smith",
      roles: ["ROLE_USER"],
      status: "active",
      registeredAt: "2024-02-15",
      lastLogin: "2024-03-18",
    },
    {
      id: 4,
      email: "blocked.user@example.com",
      name: "Blocked User",
      roles: ["ROLE_USER"],
      status: "blocked",
      registeredAt: "2024-01-20",
      lastLogin: "2024-02-28",
    },
    {
      id: 5,
      email: "inactive@example.com",
      name: "Inactive User",
      roles: ["ROLE_USER"],
      status: "inactive",
      registeredAt: "2024-01-05",
      lastLogin: "2024-01-10",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "active").length,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Admins",
      value: users.filter((u) => u.roles.includes("ROLE_ADMIN")).length,
      icon: Shield,
      color: "text-purple-500",
    },
    {
      label: "Blocked",
      value: users.filter((u) => u.status === "blocked").length,
      icon: Ban,
      color: "text-red-500",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "ROLE_ADMIN") {
      return (
        <Badge className="bg-purple-500">
          <Shield className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      );
    }
    return <Badge variant="outline">User</Badge>;
  };

  const handleEditUser = (userId: number) => {
    toast.info("Edit user functionality", {
      description: `Editing user ID: ${userId}`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    toast.error("Delete user functionality", {
      description: `This would delete user ID: ${userId}`,
    });
  };

  const handleBlockUser = (userId: number) => {
    toast.warning("Block user functionality", {
      description: `This would block user ID: ${userId}`,
    });
  };

  const handleSendEmail = (email: string) => {
    toast.success("Email functionality", {
      description: `This would send an email to: ${email}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all registered users
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                View and manage all registered users in the system
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.roles.map((role) => (
                        <span key={role}>{getRoleBadge(role)}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.registeredAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.lastLogin).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendEmail(user.email)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBlockUser(user.id)}>
                          <Ban className="mr-2 h-4 w-4" />
                          Block User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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
