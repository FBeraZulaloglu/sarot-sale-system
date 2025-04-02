
import { AuthForm } from "@/components/auth/AuthForm";

export default function Authentication() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-md">
        <AuthForm />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">Demo Credentials:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-md border p-2">
              <div className="font-medium">Admin</div>
              <div>admin@hotel.com</div>
              <div>admin123</div>
            </div>
            <div className="rounded-md border p-2">
              <div className="font-medium">Manager</div>
              <div>manager@hotel.com</div>
              <div>manager123</div>
            </div>
            <div className="rounded-md border p-2">
              <div className="font-medium">Salesperson</div>
              <div>sales@hotel.com</div>
              <div>sales123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
