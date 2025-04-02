
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Mail, Phone } from "lucide-react";
import { Customer, Project, SaleRecord } from "@/types";

interface CustomerProfileProps {
  customer: Customer;
  associatedProject: Project | undefined;
  customerSales: SaleRecord[];
}

export function CustomerProfile({ customer, associatedProject, customerSales }: CustomerProfileProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {customer.name.charAt(0)}{customer.surname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {customer.name} {customer.surname}
            </CardTitle>
            <CardDescription>
              Customer since {format(new Date(customer.createdAt), "MMMM yyyy")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Associated Project</h3>
            {associatedProject ? (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <img 
                    src={associatedProject.imageUrl} 
                    alt={associatedProject.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{associatedProject.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {associatedProject.description}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No associated project</p>
            )}
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Purchases</p>
                <p className="text-2xl font-bold">{customerSales.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  ${customerSales.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Completed Payments</p>
                <p className="text-2xl font-bold">
                  {customerSales.filter(sale => sale.paymentStatus === 'completed').length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold">
                  {customerSales.filter(sale => sale.paymentStatus === 'pending').length}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
