import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, Download, XCircle, Info, FileText, BadgeCheck } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { SaleRecordWithDetails } from "@/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MOCK_PROJECTS } from "@/data/projects";
import { MOCK_CUSTOMERS } from "@/data/customers";
import { MOCK_USERS } from "@/data/users";
import { getReservationsAsSales } from "@/data/salesRecordsFromReservations";

// Use the reservations data as sales records
export default function SalesRecordsUpdated() {
  const navigate = useNavigate();
  
  // State for selected sale record to cancel
  const [selectedSale, setSelectedSale] = useState<SaleRecordWithDetails | null>(null);
  // Removed duplicate dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isFinalConfirmDialogOpen, setIsFinalConfirmDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  
  // Filter state
  const [filters, setFilters] = useState({
    projectId: "all",
    paymentStatus: "all",
    paymentMethod: "all",
    search: "",
    showCanceled: "all", // New filter for canceled sales
    saleStatus: "all", // New filter for sale status (pending/confirmed)
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  // Handler for filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Function to handle initial cancellation request - shows reason dialog
  const handleInitialCancelRequest = (sale: SaleRecordWithDetails) => {
    setSelectedSale(sale);
    setIsConfirmDialogOpen(true);
  };
  
  // Function to handle sale cancellation - shows final confirmation dialog
  const handleCancelSale = () => {
    if (!cancellationReason.trim()) {
      toast.error("Lütfen iptal sebebi giriniz.");
      return;
    }
    
    setIsConfirmDialogOpen(false);
    setIsFinalConfirmDialogOpen(true);
  };
  
  // Function to finalize the cancellation after final confirmation
  const finalizeCancellation = () => {
    if (!selectedSale) return;
    
    // In a real application, this would make an API call to cancel the sale
    // For the mock data, we'll just update the local state
    
    // Find the sale in the MOCK_SALES_RECORDS array and update it
    const updatedSalesRecords = MOCK_SALES_RECORDS.map(sale => {
      if (sale.id === selectedSale.id) {
        return {
          ...sale,
          isCanceled: true,
          cancellationReason,
          cancellationDate: new Date().toISOString(),
        };
      }
      return sale;
    });
    
    // Update the MOCK_SALES_RECORDS array
    // In a real application, this would be handled by the backend
    // For demo purposes, we're just updating the local state
    // MOCK_SALES_RECORDS = updatedSalesRecords;
    
    setIsFinalConfirmDialogOpen(false);
    setCancellationReason("");
    setSelectedSale(null);
    
    toast.success("Satış başarıyla iptal edildi.");
  };

  // Get sales records from reservations
  const MOCK_SALES_RECORDS = getReservationsAsSales();
  
  // Apply filters to the sales records
  const filteredSales = MOCK_SALES_RECORDS.filter(sale => {
    // Project filter
    if (filters.projectId !== "all" && sale.projectId !== filters.projectId) {
      return false;
    }
    
    // Payment status filter
    if (filters.paymentStatus !== "all" && sale.paymentStatus !== filters.paymentStatus) {
      return false;
    }
    
    // Payment method filter
    if (filters.paymentMethod !== "all" && sale.paymentMethod !== filters.paymentMethod) {
      return false;
    }
    
    // Canceled filter
    if (filters.showCanceled === "active" && sale.isCanceled) {
      return false;
    } else if (filters.showCanceled === "canceled" && !sale.isCanceled) {
      return false;
    }
    
    // Sale status filter
    if (filters.saleStatus === "confirmed" && !sale.isConfirmed) {
      return false;
    } else if (filters.saleStatus === "pending" && sale.isConfirmed) {
      return false;
    }
    
    // Search filter (search in customer name, room id, or project name)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const customerName = `${sale.customer?.name} ${sale.customer?.surname}`.toLowerCase();
      const roomId = sale.roomId.toLowerCase();
      const projectName = sale.project?.name.toLowerCase() || '';
      
      return (
        customerName.includes(searchTerm) ||
        roomId.includes(searchTerm) ||
        projectName.includes(searchTerm)
      );
    }
    
    return true;
  });
  
  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSales.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSales.length / recordsPerPage);
  
  // Function to change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };
  
  // Function to format date in Turkish format (dd.MM.yyyy)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy');
  };
  
  // Group projects by type for the filter dropdown
  const projectsByType = MOCK_PROJECTS.reduce((acc, project) => {
    // Determine project type group
    const projectType = project.name.toLowerCase().includes('sarot') ? 'Sarot Projeleri' : 'Diğer Projeler';
    
    if (!acc[projectType]) {
      acc[projectType] = [];
    }
    
    acc[projectType].push(project);
    return acc;
  }, {} as Record<string, typeof MOCK_PROJECTS>);
  
  // Get payment status options
  const paymentStatusOptions = [
    { value: 'all', label: 'Tüm Ödeme Durumları' },
    { value: 'pending', label: 'Beklemede' },
    { value: 'completed', label: 'Tamamlandı' },
    { value: 'failed', label: 'Başarısız' },
    { value: 'refunded', label: 'İade Edildi' },
  ];
  
  // Get payment method options
  const paymentMethodOptions = [
    { value: 'all', label: 'Tüm Ödeme Yöntemleri' },
    { value: 'cash', label: 'Nakit' },
    { value: 'credit_card', label: 'Kredi Kartı' },
    { value: 'bank_transfer', label: 'Banka Havalesi' },
  ];
  
  // Get sale status options
  const saleStatusOptions = [
    { value: 'all', label: 'Tüm Satış Durumları' },
    { value: 'confirmed', label: 'Onaylanmış' },
    { value: 'pending', label: 'Beklemede' },
  ];
  
  // Get canceled status options
  const canceledStatusOptions = [
    { value: 'all', label: 'Tüm Kayıtlar' },
    { value: 'active', label: 'Aktif Satışlar' },
    { value: 'canceled', label: 'İptal Edilenler' },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Satışlar Yeni</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/sales-records')} variant="outline" className="flex items-center gap-1">
              <span>Standart Görünüm</span>
            </Button>
            <Button onClick={() => navigate('/new-sale')} className="bg-primary hover:bg-primary/90">
              Yeni Satış Kaydı
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Project filter */}
              <div className="space-y-2">
                <Label htmlFor="project-filter">Proje</Label>
                <Select
                  value={filters.projectId}
                  onValueChange={(value) => handleFilterChange('projectId', value)}
                >
                  <SelectTrigger id="project-filter">
                    <SelectValue placeholder="Tüm Projeler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Projeler</SelectItem>
                    {/* Group projects by type */}
                    {Object.entries(projectsByType).map(([groupName, projects]) => (
                      <SelectGroup key={groupName}>
                        <SelectLabel>{groupName}</SelectLabel>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Payment status filter */}
              <div className="space-y-2">
                <Label htmlFor="payment-status-filter">Ödeme Durumu</Label>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) => handleFilterChange('paymentStatus', value)}
                >
                  <SelectTrigger id="payment-status-filter">
                    <SelectValue placeholder="Tüm Ödeme Durumları" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Payment method filter */}
              <div className="space-y-2">
                <Label htmlFor="payment-method-filter">Ödeme Yöntemi</Label>
                <Select
                  value={filters.paymentMethod}
                  onValueChange={(value) => handleFilterChange('paymentMethod', value)}
                >
                  <SelectTrigger id="payment-method-filter">
                    <SelectValue placeholder="Tüm Ödeme Yöntemleri" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sale status filter */}
              <div className="space-y-2">
                <Label htmlFor="sale-status-filter">Satış Durumu</Label>
                <Select
                  value={filters.saleStatus}
                  onValueChange={(value) => handleFilterChange('saleStatus', value)}
                >
                  <SelectTrigger id="sale-status-filter">
                    <SelectValue placeholder="Tüm Satış Durumları" />
                  </SelectTrigger>
                  <SelectContent>
                    {saleStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Canceled status filter */}
              <div className="space-y-2">
                <Label htmlFor="canceled-status-filter">İptal Durumu</Label>
                <Select
                  value={filters.showCanceled}
                  onValueChange={(value) => handleFilterChange('showCanceled', value)}
                >
                  <SelectTrigger id="canceled-status-filter">
                    <SelectValue placeholder="Tüm Kayıtlar" />
                  </SelectTrigger>
                  <SelectContent>
                    {canceledStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Search filter */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="search-filter">Arama</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-filter"
                    placeholder="Müşteri, oda veya proje ara..."
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Sales Records Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Satış Kayıtları</CardTitle>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Dışa Aktar</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proje</TableHead>
                    <TableHead>Oda</TableHead>
                    <TableHead>Müşteri</TableHead>
                    <TableHead>Satış Temsilcisi</TableHead>
                    <TableHead>Dönem</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Satış Tarihi</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Ödeme Durumu</TableHead>
                    <TableHead>Ödeme Yöntemi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-4">
                        Filtrelere uygun satış kaydı bulunamadı.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentRecords.map((sale) => (
                      <TableRow key={sale.id} className={cn(sale.isCanceled && "bg-red-50")}>
                        <TableCell>{sale.project?.name || "Bilinmiyor"}</TableCell>
                        <TableCell>{sale.roomId}</TableCell>
                        <TableCell>
                          <div className="font-medium">{sale.customer?.name} {sale.customer?.surname}</div>
                          <div className="text-sm text-muted-foreground">{sale.customer?.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{sale.salesperson?.name} {sale.salesperson?.surname}</div>
                          <div className="text-sm text-muted-foreground">{sale.salesperson?.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{sale.period?.name || "Belirtilmemiş"}</div>
                          <div className="text-sm text-muted-foreground">{sale.season?.name || ""}</div>
                        </TableCell>
                        <TableCell>
                          <div>{formatDate(sale.startDate)}</div>
                          <div className="text-sm text-muted-foreground">
                            {sale.endDate && `- ${formatDate(sale.endDate)}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          {sale.saleDate ? formatDate(sale.saleDate.toISOString()) : formatDate(sale.createdAt)}
                        </TableCell>
                        <TableCell>{formatCurrency(sale.amount)}</TableCell>
                        <TableCell>
                          <div className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            sale.paymentStatus === 'completed' && "bg-green-100 text-green-800",
                            sale.paymentStatus === 'pending' && "bg-yellow-100 text-yellow-800",
                            sale.paymentStatus === 'failed' && "bg-red-100 text-red-800",
                            sale.paymentStatus as string === 'refunded' && "bg-blue-100 text-blue-800"
                          )}>
                            {sale.paymentStatus === 'completed' && "Tamamlandı"}
                            {sale.paymentStatus === 'pending' && "Beklemede"}
                            {sale.paymentStatus === 'failed' && "Başarısız"}
                            {sale.paymentStatus as string === 'refunded' && "İade Edildi"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {sale.paymentMethod === 'cash' && "Nakit"}
                          {sale.paymentMethod === 'credit_card' && "Kredi Kartı"}
                          {sale.paymentMethod === 'bank_transfer' && "Banka Havalesi"}
                        </TableCell>
                        <TableCell>
                          {sale.isCanceled ? (
                            <div className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                              İptal Edildi
                            </div>
                          ) : sale.isConfirmed ? (
                            <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                              Onaylanmış
                            </div>
                          ) : (
                            <div className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                              Beklemede
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            {/* Action buttons in a dropdown menu for better UX */}
                            <div className="relative">
                              <Select
                                onValueChange={(value) => {
                                  switch (value) {
                                    case 'view':
                                      navigate(`/sales/${sale.id}`);
                                      break;
                                    case 'edit':
                                      navigate(`/sales/${sale.id}/edit`);
                                      break;
                                    case 'confirm':
                                      toast.success("Satış başarıyla onaylandı.");
                                      break;
                                    case 'cancel':
                                      handleInitialCancelRequest(sale);
                                      break;
                                    case 'tapu':
                                      // Pass all relevant parameters from the sale record to the tapu form
                                      navigate(`/tapu-islemleri/new?saleId=${sale.id}&roomId=${sale.roomId}&customerId=${sale.customerId}&projectId=${sale.projectId}&periodId=${sale.reservation?.periodId || ''}&seasonId=${sale.reservation?.seasonId || ''}&saleDate=${sale.saleDate ? sale.saleDate.toISOString() : ''}&houseId=${sale.house?.id || ''}`);
                                      break;
                                  }
                                }}
                              >
                                <SelectTrigger className="w-[130px] h-8">
                                  <SelectValue placeholder="İşlemler" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="view">
                                    <div className="flex items-center gap-2">
                                      <Info className="h-4 w-4" />
                                      <span className="font-medium">Detaylar</span>
                                    </div>
                                  </SelectItem>
                                  
                                  {!sale.isCanceled && (
                                    <>
                                      <SelectItem value="edit">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          <span className="font-medium">Düzenle</span>
                                        </div>
                                      </SelectItem>
                                      
                                      {!sale.isConfirmed && (
                                        <SelectItem value="confirm">
                                          <div className="flex items-center gap-2 text-green-600">
                                            <BadgeCheck className="h-4 w-4" />
                                            <span className="font-medium">Onayla</span>
                                          </div>
                                        </SelectItem>
                                      )}
                                      
                                      <SelectItem value="cancel">
                                        <div className="flex items-center gap-2 text-red-600">
                                          <XCircle className="h-4 w-4" />
                                          <span className="font-medium">İptal Et</span>
                                        </div>
                                      </SelectItem>
                                      
                                      <SelectItem value="tapu">
                                        <div className="flex items-center gap-2 text-blue-600">
                                          <FileText className="h-4 w-4" />
                                          <span className="font-medium">Tapu Oluştur</span>
                                        </div>
                                      </SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      
                      // Show first page, last page, and pages around current page
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => paginate(pageNumber)}
                              isActive={pageNumber === currentPage}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      // Show ellipsis for gaps
                      if (
                        (pageNumber === 2 && currentPage > 3) ||
                        (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Confirmation Dialog for Cancellation Reason */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Satış İptal Onayı</DialogTitle>
            <DialogDescription>
              Bu satışı iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cancellation-reason">İptal Sebebi</Label>
              <Textarea
                id="cancellation-reason"
                placeholder="İptal sebebini giriniz..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsConfirmDialogOpen(false);
              setCancellationReason("");
            }}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleCancelSale}>
              Devam Et
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Final Confirmation Dialog */}
      <Dialog open={isFinalConfirmDialogOpen} onOpenChange={setIsFinalConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Son Onay</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Satışı iptal etmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFinalConfirmDialogOpen(false)}>
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={finalizeCancellation}>
              Evet, İptal Et
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* We've removed the duplicate dialog for cancellation reason */}
    </MainLayout>
  );
}
