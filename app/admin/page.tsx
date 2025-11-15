"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MapPin,
  DollarSign,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      description: "Registered users",
      icon: Users,
      trend: "+12.5% from last month",
      color: "text-blue-500",
    },
    {
      title: "Recognition Units",
      value: "45",
      description: "Active units",
      icon: MapPin,
      trend: "+3 new this week",
      color: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: "$24,567",
      description: "This month",
      icon: DollarSign,
      trend: "+18.2% from last month",
      color: "text-yellow-500",
    },
    {
      title: "System Status",
      value: "99.9%",
      description: "Uptime",
      icon: Activity,
      trend: "All systems operational",
      color: "text-purple-500",
    },
  ];

  const recentActivity = [
    {
      user: "user@example.com",
      action: "New reservation created",
      location: "Downtown Plaza - A-15",
      time: "5 min ago",
      status: "success",
    },
    {
      user: "admin@parkup.com",
      action: "Recognition unit updated",
      location: "Mall Parking - Unit #12",
      time: "15 min ago",
      status: "info",
    },
    {
      user: "user2@example.com",
      action: "Payment processed",
      location: "Airport Terminal",
      time: "30 min ago",
      status: "success",
    },
    {
      user: "system",
      action: "Alert: Low availability",
      location: "City Center Parking",
      time: "1 hour ago",
      status: "warning",
    },
  ];

  const systemAlerts = [
    {
      message: "Recognition Unit #23 requires maintenance",
      severity: "warning",
      time: "2 hours ago",
    },
    {
      message: "High traffic detected in Zone A",
      severity: "info",
      time: "4 hours ago",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Activity className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={`${activity.user}-${activity.action}-${activity.time}`}
                  className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="mt-0.5">{getStatusIcon(activity.status)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Important notifications requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div
                  key={`${alert.message}-${alert.time}`}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <AlertCircle
                    className={`h-5 w-5 ${
                      alert.severity === "warning"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      alert.severity === "warning" ? "default" : "secondary"
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks and management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button className="h-auto flex-col gap-2 py-6">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6">
              <MapPin className="h-6 w-6" />
              <span>Recognition Units</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6">
              <Activity className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6">
              <TrendingUp className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
