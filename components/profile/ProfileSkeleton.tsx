"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 bg-gray-200" />
        <Skeleton className="h-5 w-96 bg-gray-200" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 bg-gray-200" />
          <Skeleton className="h-4 w-72 bg-gray-200" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-20 w-full bg-gray-200" />
          <Skeleton className="h-20 w-full bg-gray-200" />
          <Skeleton className="h-20 w-full bg-gray-200" />
        </CardContent>
      </Card>
    </div>
  );
}