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
import { SaleRecordWithDetails, Project, Room, Customer, User } from "@/types";
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

// Mock data for demonstration
// Using the imported data from separate files

// Function to generate mock rooms
const generateMockRooms = (projectId: string, floorCount: number): Room[] => {
  const rooms: Room[] = [];
  // Generate rooms for each floor
  for (let floor = 1; floor <= floorCount; floor++) {
    // Generate 20 rooms per floor
    for (let room = 1; room <= 20; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
      rooms.push({
        id: `${projectId}-${roomNumber}`,
        projectId,
        houseId: `house-${projectId}-1`, // Add required houseId property
        floor,
        roomNumber,
        status: Math.random() > 0.7 ? 'sold' : Math.random() > 0.5 ? 'reserved' : 'available',
        price: Math.floor(100000 + Math.random() * 500000), // Random price between 100k and 600k
      });
    }
  }
  return rooms;
};

// Generate all rooms for all projects
const getAllMockRooms = (): Room[] => {
  return MOCK_PROJECTS.flatMap(project => 
    generateMockRooms(project.id, project.floorCount)
  );
};

const MOCK_ROOMS = getAllMockRooms();

// Generate mock sales records
const generateMockSalesRecords = (): SaleRecordWithDetails[] => {
  const soldRooms = MOCK_ROOMS.filter(room => room.status === 'sold');
  return soldRooms.map((room, index) => {
    const customerId = MOCK_CUSTOMERS[index % MOCK_CUSTOMERS.length].id;
    const salespersonId = MOCK_USERS[index % MOCK_USERS.length].id;
    const saleDate = new Date();
    saleDate.setDate(saleDate.getDate() - Math.floor(Math.random() * 60)); // Random date within the last 60 days
    
    // Randomly mark some sales as canceled (about 20%)
    const isCanceled = Math.random() < 0.2;
    let cancellationReason = null;
    let cancellationDate = null;
    
    if (isCanceled) {
      const cancellationReasons = [
        "Customer withdrew from the purchase",
        "Payment issues",
        "Property condition concerns",
        "Better offer found elsewhere",
        "Financial difficulties",
        "Legal complications"
      ];
      cancellationReason = cancellationReasons[Math.floor(Math.random() * cancellationReasons.length)];
      
      // Cancellation date is after sale date but before now
      const cancelDate = new Date(saleDate);
      cancelDate.setDate(cancelDate.getDate() + Math.floor(Math.random() * 10) + 1); // 1-10 days after sale
      if (cancelDate > new Date()) cancelDate.setDate(new Date().getDate() - 1); // Ensure it's not in the future
      cancellationDate = cancelDate.toISOString();
    }
    
    return {
      id: `sale-${index + 1}`,
      projectId: room.projectId,
      roomId: room.id,
      customerId,
      salespersonId,
      startDate: saleDate.toISOString(),
      endDate: saleDate.toISOString(), // For simplicity, using same date
      amount: room.price,
      paymentStatus: isCanceled ? 'failed' : ['pending', 'completed', 'failed'][Math.floor(Math.random() * 3)] as 'pending' | 'completed' | 'failed',
      paymentMethod: ['credit_card', 'bank_transfer', 'cash'][Math.floor(Math.random() * 3)] as 'credit_card' | 'bank_transfer' | 'cash',
      tax: room.price * 0.18, // 18% tax
      createdAt: saleDate.toISOString(),
      isCanceled,
      cancellationReason: cancellationReason,
      cancellationDate: cancellationDate,
      // Include associated data
      project: MOCK_PROJECTS.find(p => p.id === room.projectId),
      room,
      customer: MOCK_CUSTOMERS.find(c => c.id === customerId),
      salesperson: MOCK_USERS.find(u => u.id === salespersonId)
    };
  });
};

export const MOCK_SALES_RECORDS = generateMockSalesRecords();

export default function SalesRecords() {
  const navigate = useNavigate();
  // Filter state
  const [filters, setFilters] = useState({
    projectId: "all", 
    paymentStatus: "all", 
    paymentMethod: "all", 
    search: "",
    showCanceled: "all", // New filter for canceled sales
    saleStatus: "all", // New filter for sale status (pending/confirmed)
  });

  // State for sale cancellation and confirmation
  const [selectedSale, setSelectedSale] = useState<SaleRecordWithDetails | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isFinalConfirmDialogOpen, setIsFinalConfirmDialogOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Used to force re-render after confirming a sale

  // Handler for filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Function to handle initial cancellation request - shows reason dialog
  const handleInitialCancelRequest = () => {
    setIsConfirmDialogOpen(false);
    setIsDialogOpen(true);
  };

  // Function to handle sale cancellation - shows final confirmation dialog
  const handleCancelSale = () => {
    if (!selectedSale || !cancellationReason.trim()) {
      toast.error("İptal sebebi belirtmelisiniz.");
      return;
    }

    // Show final confirmation dialog
    setIsDialogOpen(false);
    setIsFinalConfirmDialogOpen(true);
  };

  // Function to finalize the cancellation after final confirmation
  const finalizeCancellation = () => {
    if (!selectedSale) return;
    
    // In a real app, this would be an API call
    // For now, we'll update the mock data directly
    const updatedRecords = MOCK_SALES_RECORDS.map(record => {
      if (record.id === selectedSale.id) {
        return {
          ...record,
          isCanceled: true,
          cancellationReason: cancellationReason.trim(),
          cancellationDate: new Date().toISOString(),
          paymentStatus: 'failed' as const
        };
      }
      return record;
    });

    // Update the mock data
    // In a real app, this would be handled by the API
    Object.assign(MOCK_SALES_RECORDS, updatedRecords);

    // Reset state
    setSelectedSale(null);
    setCancellationReason("");
    setIsFinalConfirmDialogOpen(false);

    // Show success message
    toast.success("Satış başarıyla iptal edildi.");
  };

  // Apply filters to sales records
  const filteredSalesRecords = MOCK_SALES_RECORDS.filter(record => {
    // Filter by project 
    if (filters.projectId !== "all" && record.projectId !== filters.projectId) {
      return false;
    }
    
    // Filter by payment status
    if (filters.paymentStatus !== "all" && record.paymentStatus !== filters.paymentStatus) {
      return false;
    }
    
    // Filter by payment method
    if (filters.paymentMethod !== "all" && record.paymentMethod !== filters.paymentMethod) {
      return false;
    }

    // Filter by cancellation status
    if (filters.showCanceled === "canceled" && !record.isCanceled) {
      return false;
    } else if (filters.showCanceled === "active" && record.isCanceled) {
      return false;
    }
    
    // Filter by sale status (pending/confirmed)
    if (filters.saleStatus === "pending" && (record.isConfirmed || record.isCanceled)) {
      return false;
    } else if (filters.saleStatus === "confirmed" && (!record.isConfirmed || record.isCanceled)) {
      return false;
    }
    
    // Filter by sale status (pending/confirmed)
    if (filters.saleStatus === "pending" && (record.isConfirmed || record.isCanceled)) {
      return false;
    } else if (filters.saleStatus === "confirmed" && (!record.isConfirmed || record.isCanceled)) {
      return false;
    }

    // Filter by search (room number, customer name, or project name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const roomNumber = record.room?.roomNumber.toLowerCase() || '';
      const customerName = `${record.customer?.name} ${record.customer?.surname}`.toLowerCase();
      const projectName = record.project?.name.toLowerCase() || '';
      
      if (
        !roomNumber.includes(searchLower) &&
        !customerName.includes(searchLower) &&
        !projectName.includes(searchLower)
      ) {
        return false;
      }
    }
    
    return true;
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // Calculate pagination
  const totalPages = Math.ceil(filteredSalesRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSalesRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    // If total pages are less than max pages to show, display all pages
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);

    // Calculate start and end of middle pages
    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);

    // Adjust if we're near the end
    if (endPage - startPage < maxPagesToShow - 3) {
      startPage = Math.max(2, endPage - (maxPagesToShow - 3));
    }

    // Add ellipsis if needed
    if (startPage > 2) {
      pageNumbers.push('ellipsis-start');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('ellipsis-end');
    }

    // Always show last page
    pageNumbers.push(totalPages);
  }

  // Function to download the filtered results as CSV
  const downloadFilteredResults = () => {
    // Only proceed if there are records to download
    if (filteredSalesRecords.length === 0) {
      toast.error("No records to download.");
      return;
    }

    // Define CSV headers
    const headers = [
      "Tarih",
      "Müşteri Adı",
      "Proje",
      "Oda",
      "Kat",
      "Tutar",
      "Ödeme Durumu",
      "Ödeme Yöntemi",
      "Satış Personeli"
    ];

    // Convert records to CSV rows
    const csvRows = filteredSalesRecords.map(record => {
      return [
        format(new Date(record.startDate), "MMM dd, yyyy"),
        `${record.customer?.name || ""} ${record.customer?.surname || ""}`,
        record.project?.name || "",
        record.room?.roomNumber || "",
        record.room?.floor || "",
        record.amount.toLocaleString(),
        record.paymentStatus.charAt(0).toUpperCase() + record.paymentStatus.slice(1),
        record.paymentMethod === "credit_card" ? "Kredi Kartı" : 
          record.paymentMethod === "bank_transfer" ? "Banka Transfer" : "Nakit",
        record.salesperson?.name || ""
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sales-records-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Sales records downloaded successfully!");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Yeni Satış Kaydı</h1>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Project Filter */}
              <div>
                <Label htmlFor="projectFilter">Proje</Label>
                <Select
                  value={filters.projectId}
                  onValueChange={(value) => handleFilterChange("projectId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Projeler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Projeler</SelectItem>
                    
                    {/* Group projects by type */}
                    <SelectGroup>
                      <SelectLabel>Sarot Projeleri</SelectLabel>
                      {MOCK_PROJECTS.filter(p => p.name.includes('Sarot')).map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    
                    <SelectGroup>
                      <SelectLabel>Diğer Projeler</SelectLabel>
                      {MOCK_PROJECTS.filter(p => !p.name.includes('Sarot')).map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Payment Status Filter */}
              <div>
                <Label htmlFor="paymentStatusFilter">Ödeme Durumu</Label>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) => handleFilterChange("paymentStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Ödeme Durumları" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Ödeme Durumları</SelectItem>
                    <SelectItem value="pending">Beklemede</SelectItem>
                    <SelectItem value="completed">Tamamlandı</SelectItem>
                    <SelectItem value="failed">Başarısız</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sale Status Filter */}
              <div>
                <Label htmlFor="saleStatusFilter">Satış Durumu</Label>
                <Select
                  value={filters.saleStatus}
                  onValueChange={(value) => handleFilterChange("saleStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Satış Durumları" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Satışlar</SelectItem>
                    <SelectItem value="pending">Bekleyen Satışlar</SelectItem>
                    <SelectItem value="confirmed">Kesinleşmiş Satışlar</SelectItem>
                    <SelectItem value="canceled">İptal Edilmiş Satışlar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Payment Method Filter */}
              <div>
                <Label htmlFor="paymentMethodFilter">Ödeme Tipi</Label>
                <Select
                  value={filters.paymentMethod}
                  onValueChange={(value) => handleFilterChange("paymentMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Ödeme Tipleri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Ödeme Tipleri</SelectItem>
                    <SelectItem value="credit_card">Kredi Kartı</SelectItem>
                    <SelectItem value="bank_transfer">Havale</SelectItem>
                    <SelectItem value="cash">Nakit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Cancellation Status Filter */}
              <div>
                <Label htmlFor="cancellationStatusFilter">İptal Durumu</Label>
                <Select
                  value={filters.showCanceled}
                  onValueChange={(value) => handleFilterChange("showCanceled", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm İptal Durumları" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm İptal Durumları</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="canceled">İptal Edilmiş</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Search Filter */}
              <div>
                <Label htmlFor="searchFilter">Müşteri Arama</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="searchFilter"
                    type="search"
                    placeholder="Müşteri adı ile arama yapın"
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Reset Filters and Download Button */}
            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setFilters({
                  projectId: "all",
                  paymentStatus: "all",
                  paymentMethod: "all",
                  search: "",
                  showCanceled: "all"
                })}
              >
                Filtreleri Sıfırla
              </Button>
              
              <Button 
                variant="success" 
                onClick={downloadFilteredResults}
                disabled={filteredSalesRecords.length === 0}
              >
                <Download className="mr-1" />
                Kayıtları İndir
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Sales Records Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Bayi</TableHead>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Proje</TableHead>
                  <TableHead>Blok</TableHead>
                  <TableHead>Daire</TableHead>
                  <TableHead>Kat</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Ödeme Durumu</TableHead>
                  <TableHead>Ödeme Tipi</TableHead>
                  <TableHead>Satıcı</TableHead>
                  <TableHead>Senet No</TableHead>
                  <TableHead>TC No</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.startDate), "dd.MM.yyyy")}</TableCell>
                      <TableCell>Merkez</TableCell>
                      <TableCell>{record.customer?.name} {record.customer?.surname}</TableCell>
                      <TableCell>{record.project?.name}</TableCell>
                      <TableCell>A</TableCell>
                      <TableCell>{record.room?.roomNumber}</TableCell>
                      <TableCell>{record.room?.floor}</TableCell>
                      <TableCell>{record.amount.toLocaleString()} ₺</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          record.paymentStatus === "completed" && "bg-green-100 text-green-800",
                          record.paymentStatus === "pending" && "bg-yellow-100 text-yellow-800",
                          record.paymentStatus === "failed" && "bg-red-100 text-red-800"
                        )}>
                          {record.paymentStatus === "completed" ? "Tamamlandı" :
                           record.paymentStatus === "pending" ? "Beklemede" : "Başarısız"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          record.paymentMethod === "credit_card" && "bg-blue-100 text-blue-800",
                          record.paymentMethod === "bank_transfer" && "bg-purple-100 text-purple-800",
                          record.paymentMethod === "cash" && "bg-gray-100 text-gray-800"
                        )}>
                          {record.paymentMethod === "credit_card" ? "Kredi Kartı" :
                           record.paymentMethod === "bank_transfer" ? "Havale" : "Nakit"}
                        </span>
                      </TableCell>
                      <TableCell>{record.salesperson?.name}</TableCell>
                      <TableCell>{record.id.substring(0, 8)}</TableCell>
                      <TableCell>{Math.floor(Math.random() * 10000000000).toString().padStart(11, '0')}</TableCell>
                      <TableCell>{record.customer?.phone || "(555) 123-4567"}</TableCell>
                      <TableCell>{record.customer?.email}</TableCell>
                      <TableCell>
                        {record.isCanceled ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              İptal Edildi
                            </span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="font-medium">İptal Bilgileri</p>
                                    <p className="text-sm">Sebep: {record.cancellationReason}</p>
                                    {record.cancellationDate && (
                                      <p className="text-sm">Tarih: {format(new Date(record.cancellationDate), "dd.MM.yyyy")}</p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-1"
                              onClick={() => {
                                setSelectedSale(record);
                                setIsConfirmDialogOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                              İptal Et
                            </Button>
                            
                            <Button
                              variant="outline"
                              className="border-amber-200 bg-amber-600 text-white hover:bg-amber-700 hover:text-white flex items-center gap-1"
                              onClick={() => navigate(`/tapu-islemleri/new?customerId=${record.customerId}`)}
                            >
                              <FileText className="h-4 w-4" />
                              Tapu Oluştur
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={17} className="text-center py-8 text-muted-foreground">
                      Arama kriterlerinize uygun satış kaydı bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Pagination */}
        {filteredSalesRecords.length > 0 && (
          <div className="py-4 px-6 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {indexOfFirstRecord + 1} ile {Math.min(indexOfLastRecord, filteredSalesRecords.length)} arasında {filteredSalesRecords.length} kayıttan gösteriliyor
              </div>
              
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                  
                  {pageNumbers.map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page as number)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
        
        {/* Initial Confirmation Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={(open) => setIsConfirmDialogOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Satış İptal Onayı</DialogTitle>
              <DialogDescription>
                Bu satışı iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Vazgeç
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setIsConfirmDialogOpen(false);
                  setIsDialogOpen(true);
                }}
              >
                Devam Et
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Cancellation Reason Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>İptal Sebebi</DialogTitle>
              <DialogDescription>
                Lütfen satışı iptal etme sebebinizi belirtin.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="İptal sebebini giriniz"
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Vazgeç
              </Button>
              <Button variant="destructive" onClick={handleCancelSale}>
                Devam Et
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Final Confirmation Dialog */}
        <Dialog open={isFinalConfirmDialogOpen} onOpenChange={(open) => setIsFinalConfirmDialogOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Son Onay</DialogTitle>
              <DialogDescription>
                Bu satışı iptal etmek üzeresiniz. Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsFinalConfirmDialogOpen(false)}>
                Vazgeç
              </Button>
              <Button 
                variant="destructive" 
                onClick={finalizeCancellation}
              >
                Evet, İptal Et
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
