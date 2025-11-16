"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings, User2 } from "lucide-react";
import { useUser } from "@/components/dashboard/user-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/actions";

export function AppHeaderProfileButton() {
  const { user } = useUser();

  const getInitials = (email: string) => email.substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarFallback className="rounded-lg">
            {user ? getInitials(user.email) : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:grid text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            {user?.email || "Cargando..."}
          </span>
          <span className="truncate text-xs text-muted-foreground">Usuario</span>
        </div>
        <ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <User2 className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}