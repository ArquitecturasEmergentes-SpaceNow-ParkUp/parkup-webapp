"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParkingCircle, Car, Clock, MapPin, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Active Parkings",
      value: "3",
      description: "Currently occupied spots",
      icon: Car,
      trend: "+2 from yesterday",
    },
    {
      title: "Total Revenue",
      value: "$1,234",
      description: "This month",
      icon: TrendingUp,
      trend: "+12.5% from last month",
    },
    {
      title: "Available Spots",
      value: "12",
      description: "Ready to book",
      icon: ParkingCircle,
      trend: "Updated 5 min ago",
    },
    {
      title: "Avg Duration",
      value: "2.5h",
      description: "Per parking session",
      icon: Clock,
      trend: "Stable",
    },
  ];

  const recentActivity = [
    {
      spot: "A-15",
      location: "Downtown Plaza",
      time: "2 hours ago",
      status: "active",
    },
    {
      spot: "B-08",
      location: "Mall Parking",
      time: "5 hours ago",
      status: "completed",
    },
    {
      spot: "C-22",
      location: "Airport Terminal",
      time: "1 day ago",
      status: "completed",
    },
  ];

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
                <Icon className="h-4 w-4 text-muted-foreground" />
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest parking sessions and bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={`${activity.spot}-${activity.time}`}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Spot {activity.spot}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                  <Badge
                    variant={
                      activity.status === "active" ? "default" : "secondary"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your parking efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-auto flex-col gap-2 py-6">
              <ParkingCircle className="h-6 w-6" />
              <span>Book New Spot</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6">
              <Car className="h-6 w-6" />
              <span>My Vehicles</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6">
              <MapPin className="h-6 w-6" />
              <span>Find Parking</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
