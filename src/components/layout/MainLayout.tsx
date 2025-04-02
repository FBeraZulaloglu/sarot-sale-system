
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  className?: string;
}

export function MainLayout({
  children,
  requireAuth = true,
  allowedRoles,
  className,
}: MainLayoutProps) {
  const { isAuthenticated, user, isLoading, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until authentication state is loaded
    if (isLoading) return;

    // If authentication is required but user is not authenticated, redirect to auth page
    if (requireAuth && !isAuthenticated) {
      navigate("/auth");
      return;
    }

    // If roles are specified, check if user has permission
    if (
      requireAuth && 
      isAuthenticated && 
      allowedRoles && 
      allowedRoles.length > 0 && 
      !hasPermission(allowedRoles as any)
    ) {
      navigate("/unauthorized");
      return;
    }

    // If user is authenticated but on auth page, redirect to dashboard
    if (isAuthenticated && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [
    isAuthenticated, 
    isLoading, 
    navigate, 
    requireAuth, 
    allowedRoles, 
    hasPermission
  ]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated, show nothing
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If roles are specified and user doesn't have permission, show nothing
  if (
    requireAuth && 
    isAuthenticated && 
    allowedRoles && 
    allowedRoles.length > 0 && 
    !hasPermission(allowedRoles as any)
  ) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className={cn("flex-1 overflow-auto", className)}>
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
