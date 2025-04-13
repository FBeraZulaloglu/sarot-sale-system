import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Project, Room, House } from "@/types";
import { 
  ChevronLeft, Building2, Home, Calendar, Check,
  BedDouble, DollarSign, Users, Play, Layers, Building, Hotel,
  PlusCircle, UserCog, FileText
} from "lucide-react";
import { DateRangeFilter } from "@/components/projects/DateRangeFilter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RoomTooltip } from "@/components/projects/RoomTooltip";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { YoutubeVideoDialog } from "@/components/projects/YoutubeVideoDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { MOCK_PROJECTS, MOCK_ROOMS, projectFloorConfigs } from "@/data/projects";
import { MOCK_RESERVATIONS } from "@/data/reservations";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const houseId = searchParams.get('house');
  const project = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0];
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined);
  const [isVideoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | string>(1);
  const [tabsValue, setTabsValue] = useState<string>('1');
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [selectedFloorType, setSelectedFloorType] = useState<string>('A-C');
  const youtubeVideoId = "MHfT2GAOMV4";

  // Find the selected house if houseId is provided
  useEffect(() => {
    if (houseId && project.houses) {
      const house = project.houses.find(h => h.id === houseId);
      if (house) {
        setSelectedHouse(house);
      }
    }
  }, [houseId, project.houses]);

  // Filter rooms for this project from the imported MOCK_ROOMS array
  const rooms = selectedHouse
    ? MOCK_ROOMS.filter(room => room.projectId === projectId && room.houseId === selectedHouse.id)
    : MOCK_ROOMS.filter(room => room.projectId === projectId);

  // Function to check if a room is available between dates
  const isRoomAvailableBetweenDates = (roomId: string, startDate?: Date, endDate?: Date): boolean => {
    // If no dates selected, room is considered available
    if (!startDate || !endDate) return true;
    
    // Check if room has any reservations that overlap with the date range
    const overlappingReservations = MOCK_RESERVATIONS.filter(reservation => {
      if (reservation.roomId !== roomId) return false;
      
      // Check for any overlap between the date ranges
      return !(
        (reservation.endDate < startDate) || 
        (reservation.startDate > endDate)
      );
    });
    
    // Room is available if there are no overlapping reservations and it's not sold
    return overlappingReservations.length === 0;
  };

  // Filter rooms based on date and status
  const filteredRooms = rooms.filter(room => {
    // If a house is selected, only show rooms for that house
    if (selectedHouse && room.houseId !== selectedHouse.id) {
      return false;
    }

    const isAvailableInDateRange = isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter);
    if (startDateFilter && endDateFilter && !isAvailableInDateRange) {
      return false;
    }

    
    return isAvailableInDateRange;
  });

  // Group rooms by floor
  const roomsByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<string | number, Room[]>);

  // Get available floors - handle both numeric and string floor types
  const availableFloors = Object.keys(roomsByFloor).map(floor => {
    return isNaN(Number(floor)) ? floor : Number(floor);
  }).sort((a, b) => {
    // Custom sort function to handle both string and number floors
    if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    // String floors come before number floors
    return typeof a === 'string' ? -1 : 1;
  });

  // Ensure selectedFloor is valid
  useEffect(() => {
    if (availableFloors.length > 0 && !selectedFloor) {
      // Sadece selectedFloor boşsa ilk katı seç
      setSelectedFloor(availableFloors[0]);
      setTabsValue(availableFloors[0].toString());
    }
  }, [availableFloors]); // selectedFloor'u bağımlılıklardan kaldır

  // Get rooms for the selected floor
  const roomsForSelectedFloor = roomsByFloor[selectedFloor.toString()] || [];

  // Count rooms by status - only if date filter is applied
  const isDateFilterApplied = startDateFilter !== undefined && endDateFilter !== undefined;
  
  // Count rooms by type (1+1, 2+1, etc.)
  const roomCountsByType = rooms.reduce((acc, room) => {
    const type = room.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Room counts will only be calculated if date filter is applied
  const roomCounts = isDateFilterApplied ? {
    total: filteredRooms.length,
    available: filteredRooms.filter(room => room.status === 'available' && 
      isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)).length,
    reserved: filteredRooms.filter(room => room.status === 'reserved' || 
      !isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)).length,
    sold: filteredRooms.filter(room => room.status === 'sold').length,
  } : {
    total: rooms.length,
    available: 0,
    reserved: 0,
    sold: 0,
  };

  // Calculate room status by floor - only if date filter is applied
  const roomStatusByFloor = Object.entries(roomsByFloor).reduce((acc, [floor, floorRooms]) => {
    if (isDateFilterApplied) {
      // Use the floor as is (could be string or number)
      acc[floor] = {
        total: floorRooms.length,
        available: floorRooms.filter(room => room.status === 'available' && 
          isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)).length,
        reserved: floorRooms.filter(room => room.status === 'reserved' || 
          !isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)).length,
        sold: floorRooms.filter(room => room.status === 'sold').length,
      };
    } else {
      acc[floor] = {
        total: floorRooms.length,
        available: 0,
        reserved: 0,
        sold: 0,
      };
    }
    return acc;
  }, {} as Record<string | number, { total: number; available: number; reserved: number; sold: number }>);
  
  // Count total rooms by floor
  const totalRoomsByFloor = Object.entries(roomsByFloor).reduce((acc, [floor, rooms]) => {
    acc[floor] = rooms.length;
    return acc;
  }, {} as Record<string | number, number>);
  
  // State for active filters
  const [activeFilters, setActiveFilters] = useState<{
    selectedDonems: string[];
    roomCount?: string;
    roomType?: string;
    floorType?: string;
  }>({
    selectedDonems: [],
  });

  // Handle date range filter
  const handleDateRangeFilter = (
    startDate: Date | undefined, 
    endDate: Date | undefined,
    season?: string,
    roomCount?: string,
    roomType?: string,
    weekNumber?: string,
    donem?: string | string[],
    donemType?: 'single' | 'multiple' | 'all',
    floorType?: string
  ) => {
    setStartDateFilter(startDate);
    setEndDateFilter(endDate);
    
    // Update active filters
    const selectedDonems = Array.isArray(donem) ? donem : donem ? [donem] : [];
    setActiveFilters({
      selectedDonems,
      roomCount,
      roomType,
      floorType
    });
    
    // If floor type is provided, update the selected floor type
    if (floorType) {
      setSelectedFloorType(floorType);
    }
  };

  const handleFilterChange = (filterInfo: {
    selectedDonems: string[];
    roomCount?: string;
    roomType?: string;
    floorType?: string;
  }) => {
    setActiveFilters(filterInfo);
    
    // Update the selected floor type when it changes in the DateRangeFilter
    if (filterInfo.floorType && filterInfo.floorType !== selectedFloorType) {
      // Sadece floor type değiştiğinde bu işlemleri yap
      setSelectedFloorType(filterInfo.floorType);
      
      // Her proje için uygun kat seçimini yap
      let floorToSelect;
      
      if (project.name === 'Sarot Palace') {
        if (filterInfo.floorType === 'A-C') {
          // Önce A, A1, B, C katları arasında odası olan ilk katı bul
          floorToSelect = Object.keys(roomsByFloor)
            .find(floor => ['A', 'A1', 'B', 'C'].includes(floor));
        } else if (filterInfo.floorType === 'D-F') {
          // Önce D, E, F katları arasında odası olan ilk katı bul
          floorToSelect = Object.keys(roomsByFloor)
            .find(floor => ['D', 'E', 'F'].includes(floor));
        } else if (filterInfo.floorType === 'penthouse') {
          // Penthouse katını bul
          floorToSelect = Object.keys(roomsByFloor)
            .find(floor => floor === 'P');
        }
      } else if (project.name === 'Sarot Termal Country') {
        if (filterInfo.floorType === 'A-D-V') {
          floorToSelect = Object.keys(roomsByFloor)
            .find(floor => ['A', 'B', 'C', 'D', 'V'].includes(floor));
        } else if (filterInfo.floorType === 'E-H') {
          floorToSelect = Object.keys(roomsByFloor)
            .find(floor => ['E', 'F', 'G', 'H'].includes(floor));
        }
      }
      
      // Eğer seçilecek bir kat bulunduysa güncelle
      if (floorToSelect) {
        const floorValue = isNaN(Number(floorToSelect)) ? floorToSelect : Number(floorToSelect);
        setSelectedFloor(floorValue);
        setTabsValue(floorToSelect.toString());
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back button */}
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="-ml-2">
              <Link to="/projects" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Projelere Dön
              </Link>
            </Button>
          </div>

          {/* Project Header with Image Carousel */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {project.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <Button onClick={() => setVideoDialogOpen(true)} variant="outline" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Tanıtım Videosu
                  </Button>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <p>{project.description}</p>
                </div>
              </div>
              
              <div>
                <Carousel className="w-full max-w-lg mx-auto">
                  <CarouselContent>
                    {project.images?.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-0">
                              <img
                                src={image}
                                alt={`${project.name} - Image ${index + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>

          {/* House Selector for Multi-House Projects */}
          {project.houses && project.houses.length > 0 && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Blok Seçimi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedHouse && (
                      <Button 
                        variant="outline" 
                        className="w-full h-14 flex flex-col items-center justify-center py-3 rounded-lg shadow-sm bg-gradient-to-r from-gray-100 to-amber-50 text-gray-700 hover:from-gray-200 hover:to-amber-100 border-gray-200"
                        onClick={() => setSelectedHouse(null)}
                      >
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Tümünü Göster</span>
                        </div>
                      </Button>
                    )}
                    
                    {project.houses.map((house) => (
                      <Button
                        key={house.id}
                        variant="outline"
                        className={`w-full h-14 flex flex-col items-center justify-center py-3 rounded-lg shadow-sm ${
                          selectedHouse?.id === house.id
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200'
                            : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 hover:from-gray-200 hover:to-gray-100 border-gray-200'
                        }`}
                        onClick={() => setSelectedHouse(house)}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className={`h-4 w-4 ${selectedHouse?.id === house.id ? 'text-blue-500' : 'text-gray-500'}`} />
                          <span className="font-medium">{house.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Filter System */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Konut Arama</CardTitle>
            </CardHeader>
            <CardContent>
              <DateRangeFilter 
                onFilter={handleDateRangeFilter} 
                onFilterChange={handleFilterChange}
                projectName={project.name}
                projectId={project.id}
              />
            </CardContent>
          </Card>
        </div>

        {/* Selected Floors Cards */}
        <div className="mb-8">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Seçilen Katlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  // Hangi katları göstereceğimizi belirleyelim
                  let floorsToShow = [];
                  
                  if (project.name === 'Sarot Palace') {
                    if (selectedFloorType === 'A-C') {
                      floorsToShow = ['A', 'A1', 'B', 'C'];
                    } else if (selectedFloorType === 'D-F') {
                      floorsToShow = ['D', 'E', 'F'];
                    } else if (selectedFloorType === 'penthouse') {
                      floorsToShow = ['P'];
                    } else {
                      // Eğer kat tipi seçilmemişse tüm katları göster
                      floorsToShow = ['A', 'A1', 'B', 'C', 'D', 'E', 'F', 'P'];
                    }
                  } else {
                    // Diğer projeler için mevcut katları kullan
                    floorsToShow = Object.keys(roomsByFloor);
                  }
                  
                  return floorsToShow.map(floorKey => {
                    // Determine floor type styling for Sarot Palace
                    let cardBg = '';
                    let cardBorder = '';
                    let badgeBg = '';
                    let badgeText = '';
                    let headerBg = '';
                    let headerText = '';
                    
                    // Kat için oda sayılarını hesapla
                    const totalRooms = roomsByFloor[floorKey]?.length || 0;
                    const availableRooms = isDateFilterApplied && roomsByFloor[floorKey] ? 
                      roomsByFloor[floorKey].filter(room => 
                        room.status === 'available' && isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)
                      ).length || 0 : 0;
                    const reservedRooms = isDateFilterApplied && roomsByFloor[floorKey] ? 
                      roomsByFloor[floorKey].filter(room => 
                        room.status === 'reserved' || !isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)
                      ).length || 0 : 0;
                    const soldRooms = isDateFilterApplied && roomsByFloor[floorKey] ? 
                      roomsByFloor[floorKey].filter(room => 
                        room.status === 'sold'
                      ).length || 0 : 0;
                    
                    // Kat adı belirleme - projects.ts'den al
                    let floorName = '';
                    
                    // Önce roomsByFloor'dan kat adını almaya çalış
                    if (roomsByFloor[floorKey]?.[0]?.floorName) {
                      floorName = roomsByFloor[floorKey][0].floorName;
                    } 
                    // Yoksa projectFloorConfigs'den bulmaya çalış
                    else {
                      // Projenin kat yapılandırmasını bul
                      const projectConfig = projectFloorConfigs?.[project.id];
                      if (projectConfig) {
                        // Bu kat için yapılandırmasını bul
                        const floorConfig = projectConfig.find(config => config.floor === floorKey);
                        if (floorConfig?.floorName) {
                          floorName = floorConfig.floorName;
                        }
                      }
                    }
                    
                    return (
                      <Card 
                        key={`floor-card-${floorKey}`} 
                        className={`overflow-hidden cursor-pointer hover:bg-blue-50 transition-colors ${cardBg} ${cardBorder} ${selectedFloor === floorKey ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedFloor(floorKey);
                          setTabsValue(floorKey.toString());
                        }}
                      >
                        <div className={`py-3 px-4 ${headerBg} ${headerText} font-medium flex items-center justify-between`}>
                          <div className="flex items-center gap-2">
                            <span>{floorName}</span>
                          </div>
                          <span className={`text-sm font-medium ${selectedFloor === floorKey ? 'text-blue-700' : 'text-muted-foreground'}`}>
                            {selectedFloor === floorKey ? 'Seçili' : 'Seç'}
                          </span>
                        </div>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Toplam Daire</span>
                              <span className="font-medium text-lg">{totalRooms}</span>
                            </div>
                            {isDateFilterApplied && (
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">Müsait</span>
                                  <span className="font-medium text-lg text-green-600">{availableRooms}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">Rezerve</span>
                                  <span className="font-medium text-lg text-amber-600">{reservedRooms}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">Satılmış</span>
                                  <span className="font-medium text-lg text-blue-600">{soldRooms}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Proje ve kata özel dönem başlangıç bilgisi */}
                          <div className="mt-3 text-xs text-slate-600">
                            <div>
                              Dönem başlangıcı: <span className="font-medium">
                                {project.name === 'Sarot Palace' && 
                                  (['A', 'A1', 'B', 'C'].includes(floorKey) ? '30 Aralık' : 
                                   ['D', 'E', 'F'].includes(floorKey) ? '31 Aralık' : 
                                   floorKey === 'P' ? '1 Ocak' : '30 Aralık')
                                }
                                {project.name === 'Sarot Teras Evler' && 
                                  (['G', 'H', 'I', 'J'].includes(floorKey) ? '31 Aralık' : '1 Ocak')
                                }
                                {project.name === 'Sarot Termal Vadi' && 
                                  (['F', 'L', 'M', 'N', 'S'].includes(floorKey) ? '31 Aralık' : '1 Ocak')
                                }
                                {project.name === 'Sarot Termal Country' && 
                                  (['A', 'B', 'C', 'D', 'V'].includes(floorKey) ? '01 Ocak' : 
                                  ['E', 'F', 'G', 'H'].includes(floorKey) ? '02 Ocak' : 'KAT YOK')
                                }
                                {project.name === 'Burj-Al Babas' && '1 Mart'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Floor Rooms as Cards */}
        {selectedFloor && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-blue-600" />
                  {selectedFloor} Katı Odaları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {roomsByFloor[selectedFloor]?.map((room) => {
                    // Determine status colors and styles
                    let statusColor = '';
                    let statusBg = '';
                    let statusBorder = '';
                    let statusIcon = null;
                    
                    if (room.status === 'available') {
                      statusColor = 'text-green-700';
                      statusBg = 'bg-green-50';
                      statusBorder = 'border-green-200';
                      statusIcon = <Check className="h-4 w-4" />;
                    } else if (room.status === 'reserved') {
                      statusColor = 'text-amber-700';
                      statusBg = 'bg-amber-50';
                      statusBorder = 'border-amber-200';
                      statusIcon = <Calendar className="h-4 w-4" />;
                    } else if (room.status === 'sold') {
                      statusColor = 'text-blue-700';
                      statusBg = 'bg-blue-50';
                      statusBorder = 'border-blue-200';
                      statusIcon = <DollarSign className="h-4 w-4" />;
                    }
                    
                    return (
                      <Card 
                        key={`room-card-${room.id}`} 
                        className={`overflow-hidden ${statusBg} ${statusBorder}`}
                      >
                        <div className={`py-2 px-3 ${statusBg} ${statusColor} border-b ${statusBorder} font-medium flex items-center justify-between`}>
                          <div className="flex items-center gap-1">
                            <div className="text-sm font-bold">{room.roomNumber}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {statusIcon}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Oda Tipi</span>
                              <span className="text-sm font-medium">{room.type || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Boyut</span>
                              <span className="text-sm font-medium">{room.size ? `${room.size}m²` : '-'}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-muted-foreground">Durum</span>
                              <Badge className={`${statusBg} ${statusColor} border ${statusBorder}`}>
                                {room.status === 'available' ? 'Müsait' : 
                                 room.status === 'reserved' ? 'Rezerve' : 
                                 room.status === 'sold' ? 'Satıldı' : '-'}
                              </Badge>
                            </div>
                            
                            {/* Durum bazlı işlem butonları */}
                            <div className="mt-3 pt-2 border-t">
                              {room.status === 'available' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="w-full text-green-700 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-800"
                                  onClick={() => {
                                    // Yeni satış kaydı sayfasına yönlendir
                                    navigate(`/projects/${project.id}/new-sale?roomId=${room.id}`)
                                  }}
                                >
                                  <PlusCircle className="h-4 w-4 mr-1" />
                                  Yeni Satış Kaydı
                                </Button>
                              )}
                              
                              {room.status === 'reserved' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="w-full text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-800"
                                  onClick={() => {
                                    // Müşteri bilgilerini güncelleme işlemi
                                    alert(`${room.roomNumber} numaralı oda için müşteri bilgileri güncellenecek`);
                                    // Burada müşteri bilgileri formuna yönlendirme yapılabilir
                                  }}
                                >
                                  <UserCog className="h-4 w-4 mr-1" />
                                  Satışı Güncelle
                                </Button>
                              )}
                              
                              {room.status === 'sold' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="w-full text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-800"
                                  onClick={() => {
                                    // Satış kaydını görüntüleme işlemi
                                    alert(`${room.roomNumber} numaralı oda için satış kaydı görüntülenecek`);
                                    // Burada satış kaydı detaylarına yönlendirme yapılabilir
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  Satışı Görüntüle
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* YouTube Video Dialog */}
        <YoutubeVideoDialog
          project={project}
          open={isVideoDialogOpen}
          onOpenChange={setVideoDialogOpen}
          videoId={youtubeVideoId}
        />
      </div>
    </MainLayout>
  );
}
