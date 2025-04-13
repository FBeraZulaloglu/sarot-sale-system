import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import sarotLogo from '@/assets/sarot-termal.png';
import { 
  Home, 
  BarChart3, 
  Users, 
  UserCog, 
  LogOut, 
  Menu,
  ChevronRight,
  FileText,
  DollarSign,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: "Ana Sayfa",
      href: "/",
      icon: Home,
      active: isActive("/"),
      roles: ["admin", "manager", "salesperson"],
    },

    {
      name: "Tüm Satışlar",
      href: "/sales-records-updated",
      icon: BarChart3,
      active: isActive("/sales-records-updated") || location.pathname.startsWith("/sales/"),
      roles: ["admin", "manager", "salesperson"],
    },

    {
      name: "Tapu İşlemleri",
      href: "/tapu-islemleri",
      icon: FileText,
      active: isActive("/tapu-islemleri") || location.pathname.startsWith("/tapu-islemleri/"),
      roles: ["admin", "manager", "salesperson"],
    },
    {
      name: "Müşteriler",
      href: "/customers",
      icon: Users,
      active: isActive("/customers") || location.pathname.startsWith("/customers/"),
      roles: ["admin", "manager", "salesperson"],
    },
    {
      name: "Kullanıcı Yönetimi",
      href: "/users",
      icon: UserCog,
      active: isActive("/users"),
      roles: ["admin"],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    return hasPermission(item.roles as any);
  });

  const sidebarContent = (
    <>
      <div className="px-3 py-4">
        <div className="mb-8 flex h-12 items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-all hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold text-lg text-white p-1 py-5">SAROT DİJİTAL PORTAL</span>
          </Link>
        </div>

        <div className="space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
              {item.active && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Separator className="my-4 bg-sidebar-border" />
        <div className="px-3 py-2">
          <div className="mb-2 px-4 py-2">
            <p className="text-xs font-medium text-sidebar-foreground/60">
              Logged in as
            </p>
            <p className="text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {user?.role}
            </p>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border lg:flex",
          className
        )}
      >
        <ScrollArea className="flex flex-1 flex-col">
          {sidebarContent}
        </ScrollArea>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <ScrollArea className="h-full">
            {sidebarContent}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
