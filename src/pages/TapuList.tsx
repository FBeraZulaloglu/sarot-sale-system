import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Eye } from "lucide-react";
import { Tapu, Customer, Project, Room } from "@/types";
import { MOCK_CUSTOMERS } from "@/data/customers";
import { MOCK_PROJECTS } from "@/data/projects";
import { generateAllRooms } from "@/data/salesRecordsFromReservations";

// Generate mock tapu data
const generateMockTapuData = (): Tapu[] => {
  const MOCK_ROOMS = generateAllRooms();
  
  // Generate more tapu records (30) to better demonstrate the functionality
  return Array.from({ length: 30 }, (_, i) => {
    // Distribute tapu records more evenly across customers
    const customerIndex = i % MOCK_CUSTOMERS.length;
    const customerId = MOCK_CUSTOMERS[customerIndex].id;
    
    // Distribute tapu records more evenly across projects
    const projectIndex = i % MOCK_PROJECTS.length;
    const projectId = MOCK_PROJECTS[projectIndex].id;
    
    // Get rooms for this project
    const projectRooms = MOCK_ROOMS.filter(room => room.projectId === projectId);
    const roomId = projectRooms[i % projectRooms.length].id;
    
    // Generate dates that span across multiple years for better visualization
    const tapuDate = new Date();
    tapuDate.setFullYear(2022 + Math.floor(i / 10));
    tapuDate.setMonth(i % 12);
    tapuDate.setDate(1 + (i % 28));
    
    // Generate tapu numbers with a more recognizable pattern
    const tapuNo = `T-${2023000 + i}-${customerId.substring(0, 3)}-${projectId.substring(0, 3)}`;
    
    // Generate more varied status combinations
    const completionLevel = i % 5; // 0 to 4
    
    return {
      id: `tapu-${i + 1}`,
      customerId,
      projectId,
      roomId,
      tapuNo,
      tapuDate: tapuDate.toISOString().split('T')[0],
      donem: `${2022 + Math.floor(i / 12)}Q${1 + (i % 4)}`,
      week: `${1 + (i % 52)}`,
      tapuBedeli: 250000 + (i * 25000), // More varied prices
      ipotekli: i % 3 === 0, // Every third record has mortgage
      ipotekBedeli: i % 3 === 0 ? 100000 + (i * 10000) : undefined,
      // Status fields based on completion level
      tapuVerildi: completionLevel >= 1,
      faturaKesildi: completionLevel >= 1,
      alacaklarTemlikSozlesmesi: completionLevel >= 2,
      odemeninTamamlandiginaDairBelge: completionLevel >= 2,
      fotografliVekaletname: completionLevel >= 3,
      sozlesmeVeEkleriGerilAlindi: completionLevel >= 3,
      tapuMasrafi: completionLevel >= 4,
      onay: completionLevel === 4,
      aciklama: i % 4 === 0 ? `Tapu işlemi ${tapuDate.toLocaleDateString('tr-TR')} tarihinde başlatıldı.` : undefined,
      createdAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString() // More recent records first
    };
  });
};

const MOCK_TAPU_DATA = generateMockTapuData();

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
    .format(amount)
    .replace('₺', '') + ' ₺';
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

// Helper function to get customer name
const getCustomerName = (customerId: string): string => {
  const customer = MOCK_CUSTOMERS.find(c => c.id === customerId);
  return customer ? `${customer.name} ${customer.surname}` : 'Unknown Customer';
};

// Helper function to get project name
const getProjectName = (projectId: string): string => {
  const project = MOCK_PROJECTS.find(p => p.id === projectId);
  return project ? project.name : 'Unknown Project';
};

// Helper function to get room name
const getRoomName = (projectId: string, roomId: string): string => {
  const MOCK_ROOMS = generateAllRooms();
  
  const room = MOCK_ROOMS.find(r => r.id === roomId && r.projectId === projectId);
  return room ? `${room.floor}. Kat - ${room.roomNumber}` : 'Unknown Room';
};

// Helper function to determine tapu status
const getTapuStatus = (tapu: Tapu): { status: 'completed' | 'pending' | 'canceled', label: string } => {
  if (tapu.onay) {
    return { status: 'completed', label: 'Tamamlandı' };
  } else if (
    tapu.tapuVerildi &&
    tapu.faturaKesildi &&
    tapu.alacaklarTemlikSozlesmesi &&
    tapu.odemeninTamamlandiginaDairBelge &&
    tapu.fotografliVekaletname &&
    tapu.sozlesmeVeEkleriGerilAlindi &&
    tapu.tapuMasrafi
  ) {
    return { status: 'pending', label: 'Onay Bekliyor' };
  } else {
    return { status: 'pending', label: 'İşlemde' };
  }
};

export default function TapuList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter tapu data based on search term only
  const filteredTapuData = MOCK_TAPU_DATA.filter(tapu => {
    if (!searchTerm) return true;
    
    const customerName = getCustomerName(tapu.customerId).toLowerCase();
    const projectName = getProjectName(tapu.projectId).toLowerCase();
    const tapuNo = tapu.tapuNo.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return customerName.includes(searchLower) ||
      projectName.includes(searchLower) ||
      tapuNo.includes(searchLower);
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Tapu İşlemleri</h1>
            <p className="text-muted-foreground">Tüm tapu kayıtlarını görüntüleyin ve yönetin</p>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Müşteri adı, proje adı veya tapu no ile ara..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter section removed to fix errors */}
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tapu No</TableHead>
                    <TableHead>Müşteri</TableHead>
                    <TableHead>Proje</TableHead>
                    <TableHead>Daire</TableHead>
                    <TableHead>Tapu Tarihi</TableHead>
                    <TableHead>Tapu Bedeli</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTapuData.length > 0 ? (
                    filteredTapuData.map((tapu) => {
                      const status = getTapuStatus(tapu);
                      return (
                        <TableRow key={tapu.id}>
                          <TableCell className="font-medium">{tapu.tapuNo}</TableCell>
                          <TableCell>{getCustomerName(tapu.customerId)}</TableCell>
                          <TableCell>{getProjectName(tapu.projectId)}</TableCell>
                          <TableCell>{getRoomName(tapu.projectId, tapu.roomId)}</TableCell>
                          <TableCell>{formatDate(tapu.tapuDate)}</TableCell>
                          <TableCell>{formatCurrency(tapu.tapuBedeli)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${status.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                                status.status === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : 
                                'bg-red-100 text-red-800 hover:bg-red-100'}`}
                            >
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/tapu-islemleri/${tapu.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Arama kriterlerine uygun tapu kaydı bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
