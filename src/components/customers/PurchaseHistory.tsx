
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SaleRecord, Project, Room } from "@/types";

interface PurchaseHistoryProps {
  customerSales: SaleRecord[];
  projects: Project[];
  rooms: Room[];
}

export function PurchaseHistory({ customerSales, projects, rooms }: PurchaseHistoryProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
        <CardDescription>
          Complete record of purchase transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerSales.length > 0 ? (
              customerSales.map((sale) => {
                const project = projects.find(p => p.id === sale.projectId);
                const room = rooms.find(r => r.id === sale.roomId);
                
                return (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(sale.startDate), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {project?.name || "Unknown Project"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {room?.roomNumber || "Unknown Room"}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${sale.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          sale.paymentStatus === "completed" && "bg-green-100 text-green-800 hover:bg-green-100/80",
                          sale.paymentStatus === "pending" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
                          sale.paymentStatus === "failed" && "bg-red-100 text-red-800 hover:bg-red-100/80"
                        )}
                      >
                        {sale.paymentStatus.charAt(0).toUpperCase() + sale.paymentStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sale.paymentMethod === "credit_card" ? "Credit Card" : 
                       sale.paymentMethod === "bank_transfer" ? "Bank Transfer" : "Cash"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No purchase history found for this customer.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
