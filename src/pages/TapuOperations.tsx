import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Printer, FileText, List } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Customer, Project, Room, Tapu, Period, Season } from "@/types";
import { MOCK_CUSTOMERS } from "@/data/customers";
import { MOCK_PROJECTS } from "@/data/projects";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_SEASONS } from "@/data/seasons";
import { getReservationsAsSales, generateAllRooms } from "@/data/salesRecordsFromReservations";

// Generate mock tapu data for testing
const generateMockTapuData = (): Tapu[] => {
  const MOCK_ROOMS = generateAllRooms();
  
  return Array.from({ length: 15 }, (_, i) => {
    const customerId = MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)].id;
    const projectId = MOCK_PROJECTS[Math.floor(Math.random() * MOCK_PROJECTS.length)].id;
    const projectRooms = MOCK_ROOMS.filter(room => room.projectId === projectId);
    const roomId = projectRooms[Math.floor(Math.random() * projectRooms.length)].id;
    
    const tapuDate = new Date();
    tapuDate.setDate(tapuDate.getDate() - Math.floor(Math.random() * 365));
    
    return {
      id: `tapu-${i + 1}`,
      customerId,
      projectId,
      roomId,
      tapuNo: `T-${2023000 + i}`,
      tapuDate: tapuDate.toISOString().split('T')[0],
      donem: `${2023 + Math.floor(i / 4)}Q${1 + (i % 4)}`,
      week: `${1 + Math.floor(Math.random() * 52)}`,
      tapuBedeli: 250000 + Math.floor(Math.random() * 750000),
      ipotekli: Math.random() > 0.5,
      ipotekBedeli: Math.random() > 0.5 ? 100000 + Math.floor(Math.random() * 300000) : undefined,
      tapuVerildi: Math.random() > 0.3,
      faturaKesildi: Math.random() > 0.3,
      alacaklarTemlikSozlesmesi: Math.random() > 0.3,
      odemeninTamamlandiginaDairBelge: Math.random() > 0.3,
      fotografliVekaletname: Math.random() > 0.3,
      sozlesmeVeEkleriGerilAlindi: Math.random() > 0.3,
      tapuMasrafi: Math.random() > 0.3,
      onay: Math.random() > 0.7,
      aciklama: Math.random() > 0.7 ? "Örnek açıklama metni" : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString()
    };
  });
};

const MOCK_TAPU_DATA = generateMockTapuData();

export default function TapuOperations() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Extract all query parameters from the URL
  const queryCustomerId = queryParams.get('customerId');
  const querySaleId = queryParams.get('saleId');
  const queryProjectId = queryParams.get('projectId');
  const queryRoomId = queryParams.get('roomId');
  const queryPeriodId = queryParams.get('periodId');
  const querySeasonId = queryParams.get('seasonId');
  const querySaleDate = queryParams.get('saleDate');
  const queryHouseId = queryParams.get('houseId');
  
  // Check if we're coming from the sales records page
  const isFromSalesRecords = querySaleId !== null;
  
  const isNewRecord = id === 'new';
  const isEditMode = !isNewRecord && !!id;
  
  // Generate all rooms for all projects
  const MOCK_ROOMS = generateAllRooms();
  
  // Debug log to see what parameters are being passed
  console.log('URL Parameters:', {
    queryCustomerId,
    querySaleId,
    queryProjectId,
    queryRoomId,
    queryPeriodId,
    querySeasonId,
    querySaleDate,
    queryHouseId
  });
  
  // Find existing tapu record if editing
  const existingTapu = isEditMode ? MOCK_TAPU_DATA.find(tapu => tapu.id === id) : null;
  
  // Find the customer by ID (either from URL parameter or existing tapu record)
  const customer = isNewRecord && queryCustomerId 
    ? MOCK_CUSTOMERS.find(c => c.id === queryCustomerId)
    : existingTapu 
      ? MOCK_CUSTOMERS.find(c => c.id === existingTapu.customerId)
      : null;
      
  // Find the project by ID from URL parameter or existing tapu record
  const project = isNewRecord && queryProjectId
    ? MOCK_PROJECTS.find(p => p.id === queryProjectId)
    : existingTapu
      ? MOCK_PROJECTS.find(p => p.id === existingTapu.projectId)
      : null;
      
  // Find the room by ID from URL parameter or existing tapu record
  const room = isNewRecord && queryRoomId
    ? MOCK_ROOMS.find(r => r.id === queryRoomId)
    : existingTapu
      ? MOCK_ROOMS.find(r => r.id === existingTapu.roomId)
      : null;
      
  // Debug log for room data
  console.log('Room data:', {
    queryRoomId,
    foundRoom: room,
    allRooms: MOCK_ROOMS.slice(0, 3) // Log first 3 rooms for debugging
  });
  
  // Find the house if available
  const house = queryHouseId
    ? project?.houses?.find(h => h.id === queryHouseId)
    : room?.houseId !== room?.projectId
      ? project?.houses?.find(h => h.id === room?.houseId)
      : null;
      
  // Get customer's associated projects
  const associatedProjects = customer ? 
    MOCK_PROJECTS.filter(p => customer.associatedProjectIds.includes(p.id)) : [];
  
  // State for form fields
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customer);
  const [selectedProject, setSelectedProject] = useState<Project | null>(project);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(room);
  // Get period and season data from URL parameters
  const [periodData, setPeriodData] = useState<Period | null>(null);
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  
  // Get sale records data
  const salesRecords = getReservationsAsSales();
  
  // Fetch the complete sale record data when component mounts
  useEffect(() => {
    if (querySaleId) {
      // Find the complete sale record from the Satışlar Yeni page
      const saleRecord = salesRecords.find(sale => sale.id === querySaleId);
      
      if (saleRecord) {
        console.log('Found sale record:', saleRecord);
        
        // Set all the data from the sale record
        setSelectedCustomer(saleRecord.customer || null);
        setSelectedProject(saleRecord.project || null);
        
        // Make sure we're getting the room data
        if (saleRecord.room) {
          console.log('Setting room from sale record:', saleRecord.room);
          console.log('Room type from sale record:', saleRecord.room.type);
          // Force the room type to be set if it's missing
          const roomWithType = {
            ...saleRecord.room,
            type: saleRecord.room.type || (saleRecord.room.id.endsWith('0') ? '3+1' : saleRecord.room.id.endsWith('5') ? '2+1' : '1+1'),
            size: saleRecord.room.size || 50 + (Number(saleRecord.room.id.slice(-1)) * 10)
          };
          setSelectedRoom(roomWithType);
        } else if (queryRoomId) {
          // If room not in sale record but we have roomId, try to find it directly
          const roomFromId = MOCK_ROOMS.find(r => r.id === queryRoomId);
          console.log('Setting room from query param:', roomFromId);
          setSelectedRoom(roomFromId);
        }
        
        // Set period and season data
        if (saleRecord.period) {
          setPeriodData(saleRecord.period);
          setDonem(saleRecord.period.name);
        }
        
        if (saleRecord.season) {
          setSeasonData(saleRecord.season);
        }
      }
    }
  }, [querySaleId, queryRoomId, salesRecords]);
  
  // Debug useEffect to monitor selectedRoom changes
  useEffect(() => {
    console.log('selectedRoom changed:', selectedRoom);
    console.log('Room type value:', selectedRoom?.type);
  }, [selectedRoom]);
  
  // Initialize form fields with data from URL or existing tapu
  const [tapuNo, setTapuNo] = useState("");
  const [tapuDate, setTapuDate] = useState(querySaleDate ? new Date(querySaleDate).toISOString().split('T')[0] : "");
  const [donem, setDonem] = useState("");
  const [week, setWeek] = useState("");
  const [tapuBedeli, setTapuBedeli] = useState(0);
  const [ipotekli, setIpotekli] = useState(false);
  const [ipotekBedeli, setIpotekBedeli] = useState(0);
  const [tapuVerildi, setTapuVerildi] = useState(false);
  const [faturaKesildi, setFaturaKesildi] = useState(false);
  const [alacaklarTemlikSozlesmesi, setAlacaklarTemlikSozlesmesi] = useState(false);
  const [odemeninTamamlandiginaDairBelge, setOdemeninTamamlandiginaDairBelge] = useState(false);
  const [fotografliVekaletname, setFotografliVekaletname] = useState(false);
  const [sozlesmeVeEkleriGerilAlindi, setSozlesmeVeEkleriGerilAlindi] = useState(false);
  const [tapuMasrafi, setTapuMasrafi] = useState(false);
  const [onay, setOnay] = useState(false);
  const [aciklama, setAciklama] = useState("");
  
  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (existingTapu) {
      const project = MOCK_PROJECTS.find(p => p.id === existingTapu.projectId) || null;
      setSelectedProject(project);
      
      const room = MOCK_ROOMS.find(r => r.id === existingTapu.roomId && r.projectId === existingTapu.projectId) || null;
      setSelectedRoom(room);
      
      setTapuNo(existingTapu.tapuNo);
      setTapuDate(existingTapu.tapuDate);
      setDonem(existingTapu.donem);
      setWeek(existingTapu.week || "");
      setTapuBedeli(existingTapu.tapuBedeli);
      setIpotekli(existingTapu.ipotekli);
      setIpotekBedeli(existingTapu.ipotekBedeli || 0);
      setTapuVerildi(existingTapu.tapuVerildi);
      setFaturaKesildi(existingTapu.faturaKesildi);
      setAlacaklarTemlikSozlesmesi(existingTapu.alacaklarTemlikSozlesmesi);
      setOdemeninTamamlandiginaDairBelge(existingTapu.odemeninTamamlandiginaDairBelge);
      setFotografliVekaletname(existingTapu.fotografliVekaletname);
      setSozlesmeVeEkleriGerilAlindi(existingTapu.sozlesmeVeEkleriGerilAlindi);
      setTapuMasrafi(existingTapu.tapuMasrafi);
      setOnay(existingTapu.onay);
      setAciklama(existingTapu.aciklama || "");
    } else if (associatedProjects.length === 1) {
      // Set default project if customer has only one associated project
      setSelectedProject(associatedProjects[0]);
    }
  }, [existingTapu, associatedProjects, MOCK_ROOMS]);
  
  // Filter rooms based on selected project
  const availableRooms = selectedProject ? 
    MOCK_ROOMS.filter(room => room.projectId === selectedProject.id) : [];
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer || !selectedProject || !selectedRoom) {
      toast.error("Lütfen müşteri, proje ve oda bilgilerini seçiniz.");
      return;
    }
    
    if (!tapuNo || !tapuDate || !donem) {
      toast.error("Lütfen tapu numarası, tapu tarihi ve dönem bilgilerini giriniz.");
      return;
    }
    
    if (isEditMode && existingTapu) {
      // Update existing tapu record
      const updatedTapu: Tapu = {
        ...existingTapu,
        projectId: project?.id || selectedProject.id,
        roomId: room?.id || selectedRoom.id,
        tapuNo,
        tapuDate,
        donem,
        week: week || undefined,
        tapuBedeli,
        ipotekli,
        ipotekBedeli: ipotekli ? ipotekBedeli : undefined,
        tapuVerildi,
        faturaKesildi,
        alacaklarTemlikSozlesmesi,
        odemeninTamamlandiginaDairBelge,
        fotografliVekaletname,
        sozlesmeVeEkleriGerilAlindi,
        tapuMasrafi,
        onay,
        aciklama: aciklama || undefined,
      };
      
      // In a real app, this would update the record in the database
      console.log("Updated Tapu Record:", updatedTapu);
      toast.success("Tapu kaydı başarıyla güncellendi.");
      navigate('/tapu-islemleri');
    } else {
      // Create new tapu record
      const newTapu: Tapu = {
        id: `tapu-${Date.now()}`,
        customerId: selectedCustomer.id,
        projectId: selectedProject.id,
        roomId: selectedRoom.id,
        tapuNo,
        tapuDate,
        donem,
        week: week || undefined,
        tapuBedeli,
        ipotekli,
        ipotekBedeli: ipotekli ? ipotekBedeli : undefined,
        tapuVerildi,
        faturaKesildi,
        alacaklarTemlikSozlesmesi,
        odemeninTamamlandiginaDairBelge,
        fotografliVekaletname,
        sozlesmeVeEkleriGerilAlindi,
        tapuMasrafi,
        onay,
        aciklama: aciklama || undefined,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, this would save to a database
      console.log("New Tapu Record:", newTapu);
      toast.success("Tapu kaydı başarıyla oluşturuldu.");
      navigate('/tapu-islemleri');
    }
  };
  
  // Reset form fields
  const resetForm = () => {
    setTapuNo("");
    setTapuDate("");
    setDonem("");
    setWeek("");
    setTapuBedeli(0);
    setIpotekli(false);
    setIpotekBedeli(0);
    setTapuVerildi(false);
    setFaturaKesildi(false);
    setAlacaklarTemlikSozlesmesi(false);
    setOdemeninTamamlandiginaDairBelge(false);
    setFotografliVekaletname(false);
    setSozlesmeVeEkleriGerilAlindi(false);
    setTapuMasrafi(false);
    setOnay(false);
    setAciklama("");
  };
  
  // If customer not found, show an error message
  if ((isNewRecord && queryCustomerId) || (isEditMode && id) && !customer) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/sales-records-updated">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Satışlara Geri Dön
            </Link>
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold mb-2">Müşteri Bulunamadı</h2>
                <p className="text-muted-foreground">
                  Aradığınız müşteri mevcut değil veya kaldırılmış.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button variant="outline" asChild className="mr-4">
                <Link to="/sales-records-updated">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Satışlara Geri Dön
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-teal-800">{isEditMode ? 'Tapu Kaydını Düzenle' : 'Yeni Tapu Kaydı'}</h1>
            <div className="w-24 h-1 bg-teal-500 mx-auto mt-2 rounded-full"></div>
          </div>

          {/* Section 1: Sale Information (Read-only) */}
          <Card className="mb-6 shadow-sm">
            <CardHeader className="bg-teal-50 border-b border-teal-100">
              <CardTitle className="text-teal-800">Satış Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Customer Information */}
              <div className="bg-teal-50 p-4 rounded-lg mb-6 shadow-sm">
                <h3 className="text-lg font-semibold text-teal-800 mb-3">Müşteri Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-teal-900 mb-1 block">Adı Soyadı:</Label>
                    <Input 
                      value={selectedCustomer ? `${selectedCustomer.name} ${selectedCustomer.surname}` : ""} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-teal-900 mb-1 block">Telefon:</Label>
                    <Input 
                      value={selectedCustomer?.phone || ""} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-teal-900 mb-1 block">E-posta:</Label>
                    <Input 
                      value={selectedCustomer?.email || ""} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-teal-900 mb-1 block">Referans No:</Label>
                    <Input 
                      value={selectedCustomer?.id || ""} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                </div>
              </div>
              
              {/* Project and Room Information (Read-only) */}
              <div className="bg-teal-50 p-4 rounded-lg mb-6 shadow-sm">
                <h3 className="text-lg font-semibold text-teal-800 mb-3">Proje ve Daire Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-teal-900 mb-1 block">Proje Adı:</Label>
                    <Input 
                      value={selectedProject?.name || ""} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                  
                  {house && (
                    <div>
                      <Label className="text-teal-900 mb-1 block">Bina:</Label>
                      <Input 
                        value={house.name} 
                        readOnly 
                        className="bg-white border-teal-200"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-teal-900 mb-1 block">Daire:</Label>
                    <Input 
                      value={selectedRoom ? `${selectedRoom.floorName || `${selectedRoom.floor}. Kat`} - ${selectedRoom.roomNumber} Nolu Daire` : ""} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-teal-900 mb-1 block">Daire Tipi:</Label>
                    <Input 
                      value={selectedRoom?.type || (selectedRoom ? (selectedRoom.id.endsWith('0') ? '3+1' : selectedRoom.id.endsWith('5') ? '2+1' : '1+1') : "")} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-teal-900 mb-1 block">Oda Numarası:</Label>
                    <Input 
                      value={selectedRoom?.roomNumber || ""} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-teal-900 mb-1 block">Metrekare:</Label>
                    <Input 
                      value={selectedRoom?.size ? `${selectedRoom.size} m²` : (selectedRoom ? `${50 + (Number(selectedRoom.id.slice(-1)) * 10)} m²` : "")} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                </div>
              </div>
              
              {/* Dönem Information */}
              <div className="bg-teal-50 p-4 rounded-lg mb-6 shadow-sm">
                <h3 className="text-lg font-semibold text-teal-800 mb-3">Dönem Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-teal-900 mb-1 block">Dönem:</Label>
                    <Input 
                      value={donem} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-teal-900 mb-1 block">Dönem Tarihi:</Label>
                    <Input 
                      value={tapuDate} 
                      readOnly 
                      className="bg-white border-teal-200"
                    />
                  </div>
                  
                  {seasonData && (
                    <div>
                      <Label className="text-teal-900 mb-1 block">Sezon:</Label>
                      <Input 
                        value={seasonData.name} 
                        readOnly 
                        className="bg-white border-teal-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Section 2: Tapu Information (Editable) */}
          <Card className="mb-6 shadow-sm">
            <CardHeader className="bg-teal-50 border-b border-teal-100">
              <CardTitle className="text-teal-800">Tapu Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Tapu Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-teal-900 mb-2 block">Tapu Bilgisi:</Label>
                  <Input 
                    value={tapuNo} 
                    onChange={(e) => setTapuNo(e.target.value)}
                    placeholder="Tapu bilgisi giriniz"
                    className="border-teal-200"
                  />
                </div>
                
                <div>
                  <Label className="text-teal-900 mb-2 block">Tapu İsmi:</Label>
                  <Input 
                    value={tapuDate} 
                    onChange={(e) => setTapuDate(e.target.value)}
                    className="border-teal-200"
                    placeholder="Tapu ismi giriniz"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="alacaklarTemlikSozlesmesi" 
                    checked={alacaklarTemlikSozlesmesi}
                    onCheckedChange={(checked) => setAlacaklarTemlikSozlesmesi(checked === true)}
                  />
                  <Label htmlFor="alacaklarTemlikSozlesmesi" className="text-teal-900">Alacağın Temliki Sözleşmesi</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="odemeninTamamlandiginaDairBelge" 
                    checked={odemeninTamamlandiginaDairBelge}
                    onCheckedChange={(checked) => setOdemeninTamamlandiginaDairBelge(checked === true)}
                  />
                  <Label htmlFor="odemeninTamamlandiginaDairBelge" className="text-teal-900">Ödemenin Tamamlandığına Dair Belge</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-teal-900 mb-2 block">Tapu Bedeli:</Label>
                  <Input 
                    type="number" 
                    value={tapuBedeli} 
                    onChange={(e) => setTapuBedeli(Number(e.target.value))}
                    placeholder="Tapu bedeli giriniz"
                    className="border-teal-200"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="tapuMasrafi" 
                    checked={tapuMasrafi}
                    onCheckedChange={(checked) => setTapuMasrafi(checked === true)}
                  />
                  <Label htmlFor="tapuMasrafi" className="text-teal-900">Tapu Masrafı</Label>
                </div>
              </div>
              
              {/* Mortgage Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="ipotekli" 
                    checked={ipotekli}
                    onCheckedChange={(checked) => setIpotekli(checked === true)}
                  />
                  <Label htmlFor="ipotekli" className="text-teal-900">İpotekli</Label>
                </div>
                
                {ipotekli && (
                  <div>
                    <Label className="text-teal-900 mb-2 block">İpotek Bedeli:</Label>
                    <Input 
                      type="number" 
                      value={ipotekBedeli} 
                      onChange={(e) => setIpotekBedeli(Number(e.target.value))}
                      placeholder="İpotek bedeli giriniz"
                      className="border-teal-200"
                    />
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Document Status Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="fotografliVekaletname" 
                      checked={fotografliVekaletname}
                      onCheckedChange={(checked) => setFotografliVekaletname(checked === true)}
                    />
                    <Label htmlFor="fotografliVekaletname" className="text-teal-900">Fotoğraflı vekaletname Nüfus Kağıdı Fotokopisi</Label>
                  </div>
                  
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="sozlesmeVeEkleriGerilAlindi" 
                      checked={sozlesmeVeEkleriGerilAlindi}
                      onCheckedChange={(checked) => setSozlesmeVeEkleriGerilAlindi(checked === true)}
                    />
                    <Label htmlFor="sozlesmeVeEkleriGerilAlindi" className="text-teal-900">Sözleşme ve Ekleri Geri Alındı mı?</Label>
                  </div>
                  
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="onay" 
                      checked={onay}
                      onCheckedChange={(checked) => setOnay(checked === true)}
                    />
                    <Label htmlFor="onay" className="text-teal-900">Onay</Label>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="tapuVerildi" 
                      checked={tapuVerildi}
                      onCheckedChange={(checked) => setTapuVerildi(checked === true)}
                    />
                    <Label htmlFor="tapuVerildi" className="text-teal-900">Tapu Verildi mi?</Label>
                  </div>
                  
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="faturaKesildi" 
                      checked={faturaKesildi}
                      onCheckedChange={(checked) => setFaturaKesildi(checked === true)}
                    />
                    <Label htmlFor="faturaKesildi" className="text-teal-900">Fatura Kesildi mi?</Label>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              <div className="mb-4">
                <Label className="text-teal-900 mb-2 block">Açıklama:</Label>
                <Textarea 
                  value={aciklama}
                  onChange={(e) => setAciklama(e.target.value)}
                  className="min-h-[150px] border-teal-200"
                  placeholder="Tapu işlemi ile ilgili notlar..."
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap justify-between gap-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Formu Temizle
            </Button>
            
            <Button type="submit" variant="success">
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? 'Güncelle' : 'Kaydet'}
            </Button>
            
            <Button type="button" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Yazdır
            </Button>
            
            <Button type="button" variant="outline" asChild>
              <Link to={isFromSalesRecords ? "/sales-records-updated" : "/tapu-islemleri"}>
                <List className="h-4 w-4 mr-2" />
                {isFromSalesRecords ? "Önceki Sayfa" : "Tapu Listesi"}
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
