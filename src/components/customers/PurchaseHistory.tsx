import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Calendar, User, Check, X } from "lucide-react";
import { SaleRecord, Project, Room } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PurchaseHistoryProps {
  customerSales: SaleRecord[];
  projects: Project[];
  rooms: Room[];
}

export function PurchaseHistory({ customerSales, projects, rooms }: PurchaseHistoryProps) {
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
      <CardHeader>
        <CardTitle>Ownership</CardTitle>
        <CardDescription>
          Complete record of property ownership
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Aidat Ödeme</TableHead>
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
                    <TableCell>
                      <Select
                        defaultValue={typeof sale.id === 'number' ? (sale.id % 2 === 0 ? 'paid' : 'unpaid') : 'unpaid'}
                        value={duesStatus[sale.id] || (typeof sale.id === 'number' ? (sale.id % 2 === 0 ? 'paid' : 'unpaid') : 'unpaid')}
                        onValueChange={(value) => handleDuesStatusChange(sale.id, value as 'paid' | 'unpaid')}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue>
                            {duesStatus[sale.id] === 'paid' || (duesStatus[sale.id] === undefined && typeof sale.id === 'number' && sale.id % 2 === 0) ? (
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span className="text-green-700">Ödendi</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <X className="h-4 w-4 text-red-600" />
                                <span className="text-red-700">Ödenmedi</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Ödendi</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="unpaid">
                            <div className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-600" />
                              <span>Ödenmedi</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No ownership records found for this customer.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
