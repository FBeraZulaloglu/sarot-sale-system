// Helper function to format date instead of using date-fns
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Building2, Calendar, User, Check, X } from "lucide-react";
import { Customer, Project, SaleRecord, Room } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CustomerProfileProps {
  customer: Customer;
  associatedProjects: Project[];
  customerSales: SaleRecord[];
  projects: Project[];
  rooms: Room[];
}

export function CustomerProfile({ customer, associatedProjects, customerSales, projects, rooms }: CustomerProfileProps) {
  // State to track dues payment status for each sale
  const [duesStatus, setDuesStatus] = useState<Record<string, 'paid' | 'unpaid'>>({});
  
  // Function to handle dues status change
  const handleDuesStatusChange = (saleId: string, status: 'paid' | 'unpaid') => {
    setDuesStatus(prev => ({
      ...prev,
      [saleId]: status
    }));
    
    // Show toast notification
    toast.success(`Aidat durumu ${status === 'paid' ? 'Ödendi' : 'Ödenmedi'} olarak güncellendi`);
  };
  return (
    <Card className="mb-8">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16 shadow-sm">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {customer.name.charAt(0)}{customer.surname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {customer.name} {customer.surname}
            </CardTitle>
            <CardDescription>
              Customer since {formatDate(customer.createdAt)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {/* Contact Information */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-blue-800 dark:text-blue-300">Contact Information</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>john.doe@example.com</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>+90 555 123 4567</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Ankara, Turkey</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
