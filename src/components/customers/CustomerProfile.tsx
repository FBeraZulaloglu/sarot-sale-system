// Helper function to format date instead of using date-fns
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Building2, Check, X, Calendar } from "lucide-react";
import { Customer, Project, SaleRecord, Room, SaleRecordWithDetails } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CustomerProfileProps {
  customer: Customer;
  associatedProjects: Project[];
  customerSales: SaleRecordWithDetails[];
  projects: Project[];
  rooms: Room[];
}

export function CustomerProfile({ customer, associatedProjects, customerSales, projects, rooms }: CustomerProfileProps) {
  // State to track dues payment status for each sale
  const [duesStatus, setDuesStatus] = useState<Record<string, 'paid' | 'pending' | 'unpaid'>>({});
  
  // State to track dues payment amount for each sale
  const [duesAmount, setDuesAmount] = useState<Record<string, number>>({});
  
  // State to track dues payment date for each sale
  const [duesPaymentDate, setDuesPaymentDate] = useState<Record<string, string>>({});
  
  // Function to handle dues status change
  const handleDuesStatusChange = (saleId: string, status: 'paid' | 'pending' | 'unpaid') => {
    setDuesStatus(prev => ({
      ...prev,
      [saleId]: status
    }));
    
    // Show toast notification
    toast.success(`Aidat durumu ${status === 'paid' ? 'Ödendi' : status === 'pending' ? 'Beklemede' : 'Ödenmedi'} olarak güncellendi`);
  };
  
  // Function to handle dues amount change
  const handleDuesAmountChange = (saleId: string, amount: number) => {
    setDuesAmount(prev => ({
      ...prev,
      [saleId]: amount
    }));
  };
  
  // Function to handle dues payment date change
  const handleDuesPaymentDateChange = (saleId: string, date: string) => {
    setDuesPaymentDate(prev => ({
      ...prev,
      [saleId]: date
    }));
  };
  return (
    <Card className="mb-8 border-blue-200 shadow-md">
      <CardHeader className="pb-0 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16 shadow-sm">
            <AvatarFallback className="bg-blue-600 text-white text-xl">
              {customer.name.charAt(0)}{customer.surname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
              {customer.name} {customer.surname}
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Kayıt tarihi: {formatDate(customer.createdAt)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {/* Contact Information */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-blue-800 dark:text-blue-300">İletişim Bilgileri</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>{customer.phone}</span>
              </div>
            </div>
          </div>
          
          {/* Rented Apartments Table */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg shadow-sm mt-4">
            <h3 className="text-lg font-medium mb-3 text-blue-800 dark:text-blue-300">Kiralanan Daireler</h3>
            {customerSales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-100 dark:bg-blue-900/30">
                      <th className="text-left p-3 border-b border-blue-200 text-blue-700 dark:text-blue-300">Proje</th>
                      <th className="text-left p-3 border-b border-blue-200 text-blue-700 dark:text-blue-300">Daire</th>
                      <th className="text-left p-3 border-b border-blue-200 text-blue-700 dark:text-blue-300">Satın Alma Tarihi</th>
                      <th className="text-left p-3 border-b border-blue-200 text-blue-700 dark:text-blue-300">Aidat Ödemesi</th>
                      <th className="text-left p-3 border-b border-blue-200 text-blue-700 dark:text-blue-300">Aidat Tutarı</th>
                      <th className="text-left p-3 border-b border-blue-200 text-blue-700 dark:text-blue-300">Son Ödeme Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerSales.map(sale => {
                      // Use the already attached project and room from SaleRecordWithDetails if available
                      const project = sale.project || projects.find(p => p.id === sale.projectId);
                      const room = sale.room || rooms.find(r => r.id === sale.roomId);
                      return (
                        <tr key={sale.id} className="hover:bg-blue-100/50 dark:hover:bg-blue-900/20">
                          <td className="p-3 border-b border-blue-100">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-5 w-5 text-blue-600" />
                              <span>{project?.name || "Bilinmeyen Proje"}</span>
                            </div>
                          </td>
                          <td className="p-3 border-b border-blue-100">
                            {room ? (
                              <div className="flex flex-col">
                                <span>Oda {room.roomNumber}, Kat {room.floor}</span>
                                {room.type && <span className="text-xs text-blue-700">({room.type})</span>}
                              </div>
                            ) : (
                              "Bilinmeyen Daire"
                            )}
                          </td>
                          <td className="p-3 border-b border-blue-100">
                            {format(new Date(sale.startDate), "dd.MM.yyyy")}
                          </td>
                          <td className="p-3 border-b border-blue-100">
                            <Select
                              defaultValue={duesStatus[sale.id] || (sale.paymentStatus === 'completed' ? 'paid' : sale.paymentStatus === 'pending' ? 'pending' : 'unpaid')}
                              value={duesStatus[sale.id] || (sale.paymentStatus === 'completed' ? 'paid' : sale.paymentStatus === 'pending' ? 'pending' : 'unpaid')}
                              onValueChange={(value) => handleDuesStatusChange(sale.id, value as 'paid' | 'pending' | 'unpaid')}
                            >
                              <SelectTrigger className="w-[120px] border-blue-200 hover:border-blue-400 focus:ring-blue-400">
                                <SelectValue>
                                  {duesStatus[sale.id] === 'paid' || (duesStatus[sale.id] === undefined && sale.paymentStatus === 'completed') ? (
                                    <div className="flex items-center gap-2">
                                      <Check className="h-4 w-4 text-green-600" />
                                      <span className="text-green-700">Ödendi</span>
                                    </div>
                                  ) : duesStatus[sale.id] === 'pending' || (duesStatus[sale.id] === undefined && sale.paymentStatus === 'pending') ? (
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-blue-600" />
                                      <span className="text-blue-700">Beklemede</span>
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
                                <SelectItem value="pending" className="hover:bg-blue-100/50">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span>Beklemede</span>
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
                          </td>
                          <td className="p-3 border-b border-blue-100">
                            <input
                              type="number"
                              className="w-24 p-1 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                              defaultValue={duesAmount[sale.id] || Math.round(sale.amount * 0.05).toString()}
                              onChange={(e) => handleDuesAmountChange(sale.id, parseFloat(e.target.value))}
                            />
                            <span className="ml-1 text-blue-700">₺</span>
                          </td>
                          <td className="p-3 border-b border-blue-100">
                            <input
                              type="date"
                              className="p-1 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                              defaultValue={duesPaymentDate[sale.id] || new Date().toISOString().split('T')[0]}
                              onChange={(e) => handleDuesPaymentDateChange(sale.id, e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-blue-600/70 dark:text-blue-400/70">Bu müşteriye ait kiralanan daire bulunamadı.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
