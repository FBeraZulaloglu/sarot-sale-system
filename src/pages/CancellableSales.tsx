import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { SaleRecordWithDetails } from "@/types";

// Import mock data from SalesRecords
// In a real app, this would be replaced with API calls
import { MOCK_SALES_RECORDS } from "./SalesRecords";

export default function CancellableSales() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Filter only pending sales that are not canceled
  const pendingSales = MOCK_SALES_RECORDS.filter(record => 
    record.paymentStatus === "pending" && !record.isCanceled
  );

  // Apply search filter
  const filteredSales = pendingSales.filter(record => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    const roomNumber = record.room?.roomNumber.toLowerCase() || '';
    const customerName = `${record.customer?.name} ${record.customer?.surname}`.toLowerCase();
    const projectName = record.project?.name.toLowerCase() || '';
    
    return (
      roomNumber.includes(searchLower) ||
      customerName.includes(searchLower) ||
      projectName.includes(searchLower)
    );
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(filteredSales.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSales.slice(indexOfFirstRecord, indexOfLastRecord);

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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">İptal Edilebilir Satışlar</h1>
        
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="searchFilter">Müşteri veya Proje Arama</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="searchFilter"
                    type="search"
                    placeholder="Müşteri adı veya proje ile arama yapın"
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/sales-records")}
                className="mb-0.5"
              >
                Tüm Satışlara Dön
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Sales Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Beklemedeki Satışlar</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Proje</TableHead>
                  <TableHead>Daire</TableHead>
                  <TableHead>Kat</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Ödeme Tipi</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.startDate), "dd.MM.yyyy")}</TableCell>
                      <TableCell>{record.customer?.name} {record.customer?.surname}</TableCell>
                      <TableCell>{record.project?.name}</TableCell>
                      <TableCell>{record.room?.roomNumber}</TableCell>
                      <TableCell>{record.room?.floor}</TableCell>
                      <TableCell>{record.amount.toLocaleString()} ₺</TableCell>
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
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => navigate(`/cancel-sale/${record.id}`)}
                          className="flex items-center gap-1"
                        >
                          İptal İşlemi
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {search ? "Arama kriterlerinize uygun beklemede satış kaydı bulunamadı." : "İptal edilebilir satış kaydı bulunamadı."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Pagination */}
        {filteredSales.length > 0 && (
          <div className="py-4 px-6 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {indexOfFirstRecord + 1} ile {Math.min(indexOfLastRecord, filteredSales.length)} arasında {filteredSales.length} kayıttan gösteriliyor
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
      </div>
    </MainLayout>
  );
}
