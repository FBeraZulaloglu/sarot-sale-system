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
import { Customer, Project, Room, Tapu } from "@/types";
import { MOCK_CUSTOMERS, MOCK_PROJECTS } from "@/components/customers/MockData";
import { generateMockRooms } from "@/components/customers/MockDataGenerator";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Generate mock tapu data for testing
const generateMockTapuData = (): Tapu[] => {
  const MOCK_ROOMS = MOCK_PROJECTS.flatMap(project => 
    generateMockRooms(project.id, project.floorCount)
  );
  
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
  const queryCustomerId = queryParams.get('customerId');
  
  const isNewRecord = id === 'new';
  const isEditMode = !isNewRecord && !!id;
  
  // Generate all rooms for all projects
  const MOCK_ROOMS = MOCK_PROJECTS.flatMap(project => 
    generateMockRooms(project.id, project.floorCount)
  );
  
  // Find existing tapu record if editing
  const existingTapu = isEditMode ? MOCK_TAPU_DATA.find(tapu => tapu.id === id) : null;
  
  // Find the customer by ID (either from URL parameter or existing tapu record)
  const customer = isNewRecord && queryCustomerId 
    ? MOCK_CUSTOMERS.find(c => c.id === queryCustomerId)
    : existingTapu 
      ? MOCK_CUSTOMERS.find(c => c.id === existingTapu.customerId)
      : null;
  
  // Get customer's associated projects
  const associatedProjects = customer ? 
    MOCK_PROJECTS.filter(p => customer.associatedProjectIds.includes(p.id)) : [];
  
  // State for form fields
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customer);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [tapuNo, setTapuNo] = useState("");
  const [tapuDate, setTapuDate] = useState("");
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
            <Link to="/tapu-islemleri">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tapu Listesine Dön
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
                <Link to="/tapu-islemleri">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tapu Listesine Dön
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">{isEditMode ? 'Tapu Kaydını Düzenle' : 'Yeni Tapu Kaydı'}</h1>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-800">{isEditMode ? 'Tapu Kaydını Düzenle' : 'Yeni Tapu Kaydı'}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Customer Selection */}
              {!customer && (
                <div className="mb-6">
                  <Label className="text-amber-900 mb-2 block">Müşteri Seçiniz:</Label>
                  <Select 
                    value={selectedCustomer?.id || ""} 
                    onValueChange={(value) => {
                      const customer = MOCK_CUSTOMERS.find(c => c.id === value);
                      setSelectedCustomer(customer || null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Müşteri seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_CUSTOMERS.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} {customer.surname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Customer Information */}
              {(customer || selectedCustomer) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="mb-4">
                      <Label className="text-amber-900">Referans:</Label>
                      <Input 
                        value={(customer || selectedCustomer)?.id || ""} 
                        readOnly 
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <Label className="text-amber-900">Adı Soyadı:</Label>
                      <Input 
                        value={`${(customer || selectedCustomer)?.name || ""} ${(customer || selectedCustomer)?.surname || ""}`} 
                        readOnly 
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <Label className="text-amber-900">E-posta:</Label>
                      <Input 
                        value={(customer || selectedCustomer)?.email || ""} 
                        readOnly 
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <Label className="text-amber-900">Telefon:</Label>
                      <Input 
                        value={(customer || selectedCustomer)?.phone || ""} 
                        readOnly 
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Project and Room Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-amber-900 mb-2 block">Proje:</Label>
                  <Select 
                    value={selectedProject?.id || ""} 
                    onValueChange={(value) => {
                      const project = MOCK_PROJECTS.find(p => p.id === value);
                      setSelectedProject(project || null);
                      setSelectedRoom(null); // Reset room when project changes
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Proje seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      {associatedProjects.length > 0 ? (
                        associatedProjects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))
                      ) : (
                        MOCK_PROJECTS.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-amber-900 mb-2 block">Daire:</Label>
                  <Select 
                    value={selectedRoom?.id || ""} 
                    onValueChange={(value) => {
                      const room = availableRooms.find(r => r.id === value);
                      setSelectedRoom(room || null);
                    }}
                    disabled={!selectedProject}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Daire seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.floor}. Kat - {room.roomNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Tapu Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-amber-900 mb-2 block">Tapu No:</Label>
                  <Input 
                    value={tapuNo} 
                    onChange={(e) => setTapuNo(e.target.value)}
                    placeholder="Tapu numarası giriniz"
                  />
                </div>
                
                <div>
                  <Label className="text-amber-900 mb-2 block">Tapu Tarihi:</Label>
                  <Input 
                    type="date" 
                    value={tapuDate} 
                    onChange={(e) => setTapuDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label className="text-amber-900 mb-2 block">Dönem:</Label>
                  <Input 
                    value={donem} 
                    onChange={(e) => setDonem(e.target.value)}
                    placeholder="Örn: 2023Q1"
                  />
                </div>
                
                <div>
                  <Label className="text-amber-900 mb-2 block">Hafta:</Label>
                  <Input 
                    value={week} 
                    onChange={(e) => setWeek(e.target.value)}
                    placeholder="Örn: 12"
                  />
                </div>
                
                <div>
                  <Label className="text-amber-900 mb-2 block">Tapu Bedeli:</Label>
                  <Input 
                    type="number" 
                    value={tapuBedeli} 
                    onChange={(e) => setTapuBedeli(Number(e.target.value))}
                    placeholder="Tapu bedeli giriniz"
                  />
                </div>
              </div>
              
              {/* Mortgage Information */}
              <div className="mb-6">
                <div className="flex items-center mb-4 gap-2">
                  <Checkbox 
                    id="ipotekli" 
                    checked={ipotekli}
                    onCheckedChange={(checked) => setIpotekli(checked === true)}
                  />
                  <Label htmlFor="ipotekli" className="text-amber-900">İpotekli</Label>
                </div>
                
                {ipotekli && (
                  <div className="pl-6">
                    <Label className="text-amber-900 mb-2 block">İpotek Bedeli:</Label>
                    <Input 
                      type="number" 
                      value={ipotekBedeli} 
                      onChange={(e) => setIpotekBedeli(Number(e.target.value))}
                      placeholder="İpotek bedeli giriniz"
                    />
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Document Status Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="alacaklarTemlikSozlesmesi" 
                      checked={alacaklarTemlikSozlesmesi}
                      onCheckedChange={(checked) => setAlacaklarTemlikSozlesmesi(checked === true)}
                    />
                    <Label htmlFor="alacaklarTemlikSozlesmesi" className="text-amber-900">Alacaklar Temlik Sözleşmesi</Label>
                  </div>
                  
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="odemeninTamamlandiginaDairBelge" 
                      checked={odemeninTamamlandiginaDairBelge}
                      onCheckedChange={(checked) => setOdemeninTamamlandiginaDairBelge(checked === true)}
                    />
                    <Label htmlFor="odemeninTamamlandiginaDairBelge" className="text-amber-900">Ödemenin Tamamlandığına Dair Belge</Label>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="fotografliVekaletname" 
                      checked={fotografliVekaletname}
                      onCheckedChange={(checked) => setFotografliVekaletname(checked === true)}
                    />
                    <Label htmlFor="fotografliVekaletname" className="text-amber-900">Fotoğraflı Vekaletname</Label>
                  </div>
                  
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="sozlesmeVeEkleriGerilAlindi" 
                      checked={sozlesmeVeEkleriGerilAlindi}
                      onCheckedChange={(checked) => setSozlesmeVeEkleriGerilAlindi(checked === true)}
                    />
                    <Label htmlFor="sozlesmeVeEkleriGerilAlindi" className="text-amber-900">Sözleşme ve Ekleri Geri Alındı</Label>
                  </div>
                  
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="tapuMasrafi" 
                      checked={tapuMasrafi}
                      onCheckedChange={(checked) => setTapuMasrafi(checked === true)}
                    />
                    <Label htmlFor="tapuMasrafi" className="text-amber-900">Tapu Masrafı</Label>
                  </div>
                  
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="tapuVerildi" 
                      checked={tapuVerildi}
                      onCheckedChange={(checked) => setTapuVerildi(checked === true)}
                    />
                    <Label htmlFor="tapuVerildi" className="text-amber-900">Tapu Verildi</Label>
                  </div>
                  
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="faturaKesildi" 
                      checked={faturaKesildi}
                      onCheckedChange={(checked) => setFaturaKesildi(checked === true)}
                    />
                    <Label htmlFor="faturaKesildi" className="text-amber-900">Fatura Kesildi</Label>
                  </div>
                  
                  <div className="flex items-center mb-4 gap-2">
                    <Checkbox 
                      id="onay" 
                      checked={onay}
                      onCheckedChange={(checked) => setOnay(checked === true)}
                    />
                    <Label htmlFor="onay" className="text-amber-900">Onay</Label>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              <div className="mb-4">
                <Label className="text-amber-900 mb-2 block">Açıklama:</Label>
                <Textarea 
                  value={aciklama}
                  onChange={(e) => setAciklama(e.target.value)}
                  className="min-h-[150px]"
                  placeholder="Tapu işlemi ile ilgili notlar..."
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap justify-between gap-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Formu Temizle
            </Button>
            
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? 'Güncelle' : 'Kaydet'}
            </Button>
            
            <Button type="button" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Yazdır
            </Button>
            
            <Button type="button" variant="outline" asChild>
              <Link to="/tapu-islemleri">
                <List className="h-4 w-4 mr-2" />
                Tapu Kayıtları
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
