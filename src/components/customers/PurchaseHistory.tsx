import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Calendar, User, Check, X } from "lucide-react";
import { SaleRecord, Project, Room, SaleRecordWithDetails } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PurchaseHistoryProps {
  customerSales: SaleRecordWithDetails[];
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
    <Card className="mb-8 border-blue-200 shadow-md">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
        <CardTitle className="text-blue-900 dark:text-blue-100">Satın Alınan Daireler</CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          Mülkiyet kayıtları ve ödeme bilgileri
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-100 dark:bg-blue-900/30">
              <TableHead className="text-blue-900 dark:text-blue-100">Tarih</TableHead>
              <TableHead className="text-blue-900 dark:text-blue-100">Proje</TableHead>
              <TableHead className="text-blue-900 dark:text-blue-100">Daire</TableHead>
              <TableHead className="text-blue-900 dark:text-blue-100">Aidat Ödeme</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerSales.length > 0 ? (
              customerSales.map((sale) => {
                // Use the already attached project and room from SaleRecordWithDetails if available
                const project = sale.project || projects.find(p => p.id === sale.projectId);
                const room = sale.room || rooms.find(r => r.id === sale.roomId);
                
                return (
                  <TableRow key={sale.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10">
                    <TableCell className="border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        {format(new Date(sale.startDate), "dd.MM.yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        {project?.name || "Bilinmeyen Proje"}
                      </div>
                    </TableCell>
                    <TableCell className="border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        {room ? `Oda ${room.roomNumber}, Kat ${room.floor}` : "Bilinmeyen Daire"}
                      </div>
                    </TableCell>
                    <TableCell className="border-b border-blue-100">
                      <Select
                        defaultValue={typeof sale.id === 'number' ? (sale.id % 2 === 0 ? 'paid' : 'unpaid') : 'unpaid'}
                        value={duesStatus[sale.id] || (typeof sale.id === 'number' ? (sale.id % 2 === 0 ? 'paid' : 'unpaid') : 'unpaid')}
                        onValueChange={(value) => handleDuesStatusChange(sale.id, value as 'paid' | 'unpaid')}
                      >
                        <SelectTrigger className="w-[120px] border-blue-200 hover:border-blue-400 focus:ring-blue-400">
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
                        <SelectContent className="border-blue-200 bg-blue-50/80">
                          <SelectItem value="paid" className="hover:bg-blue-100/50">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-teal-600" />
                              <span>Ödendi</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="unpaid" className="hover:bg-blue-100/50">
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
                <TableCell colSpan={4} className="text-center py-8 text-blue-600/70 dark:text-blue-400/70">
                  Bu müşteri için satın alınan daire kaydı bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
