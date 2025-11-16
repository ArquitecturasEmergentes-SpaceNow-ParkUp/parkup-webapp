"use client";

import {
  ChevronDown,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  User2,
  Users,
  BarChart3,
  Shield,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUser } from "@/components/dashboard/user-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { logout } from "@/app/actions";
import { toast } from "sonner";
import { getDisplayRole } from "@/lib/auth";

const principalItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
];

const gestionUsuariosItems = [
  { title: "Conductores", url: "/admin/users?tab=drivers", icon: Users, badge: "24" },
  { title: "Propietarios", url: "/admin/users?tab=owners", icon: Users, badge: "18" },
  { title: "Personal", url: "/admin/users?tab=staff", icon: Users, badge: "8" },
];

const operacionesItems = [
  { title: "Unidades de Reconocimiento", url: "/admin/recognition-units", icon: MapPin, badge: "45" },
  { title: "Editor de Mapas", url: "/admin/map-editor", icon: LayoutDashboard },
  { title: "Reportes", url: "/admin/reports", icon: BarChart3 },
  { title: "Logs del Sistema", url: "/admin/logs", icon: FileText },
];

const administracionItems = [
  { title: "Configuración", url: "/admin/settings", icon: Settings },
  { title: "Seguridad", url: "/admin/security", icon: Shield },
  { title: "Ayuda y Soporte", url: "/admin/support", icon: HelpCircle },
];

const socialMedia = [
  { title: "Facebook", href: "https://facebook.com/parkup", icon: "/facebook.svg" },
  { title: "WhatsApp", href: "https://wa.me/parkupsupport", icon: "/whatsapp.svg" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const handleLogout = async () => {
    toast.success("Logged out successfully", {
      description: "See you next time!",
    });
    setTimeout(async () => {
      await logout();
    }, 1000);
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                  <Image
                    src="/logo_app.webp"
                    alt="ParkUp Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ParkUp Admin</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Administration Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {principalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestión de Usuarios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gestionUsuariosItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url.split("?")[0])} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operaciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operacionesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {administracionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Redes Sociales</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid gap-2">
              {socialMedia.map((social) => (
                <Link key={social.title} href={social.href} target="_blank" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                  <Image src={social.icon} alt={`${social.title} icon`} width={20} height={20} className="h-5 w-5" />
                  <span>{social.title}</span>
                </Link>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-orange-500 text-white">
                      {user ? getInitials(user.email) : "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.email || "Loading..."}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user ? getDisplayRole(user) : ""}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">
                    <User2 className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    User Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
