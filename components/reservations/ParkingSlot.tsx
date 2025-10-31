"use client";

import { Car, Bike, Accessibility } from "lucide-react";
import { cn } from "@/lib/utils";

export type SlotStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";
export type SlotType = "REGULAR" | "DISABLED" | "MOTORCYCLE";

interface ParkingSlotProps {
  slotNumber: string;
  status: SlotStatus;
  type: SlotType;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}

export function ParkingSlot({
  slotNumber,
  status,
  type,
  onClick,
  disabled = false,
  isSelected = false,
}: ParkingSlotProps) {
  const getStatusColor = () => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 border-green-300 hover:bg-green-200 text-green-800";
      case "OCCUPIED":
        return "bg-red-100 border-red-300 text-red-800 cursor-not-allowed";
      case "RESERVED":
        return "bg-yellow-100 border-yellow-300 text-yellow-800 cursor-not-allowed";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getIcon = () => {
    const iconClass = "h-8 w-8";
    switch (type) {
      case "MOTORCYCLE":
        return <Bike className={iconClass} />;
      case "DISABLED":
        return <Accessibility className={iconClass} />;
      default:
        return <Car className={iconClass} />;
    }
  };

  const isClickable = status === "AVAILABLE" && !disabled;

  return (
    <button
      type="button"
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={cn(
        "flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 transition-all duration-200",
        getStatusColor(),
        isClickable && "cursor-pointer active:scale-95",
        !isClickable && "cursor-not-allowed opacity-75",
        isSelected && "ring-4 ring-blue-500 ring-offset-2 scale-105",
      )}
    >
      <span className="font-bold text-sm mb-1">{slotNumber}</span>
      {getIcon()}
    </button>
  );
}
