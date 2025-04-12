import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Project, Room, House } from "@/types";
import { 
  ChevronLeft, Building2, Home, Calendar, 
  BedDouble, DollarSign, Users, Play, Layers, Building, Hotel
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
import { Link, useParams, useSearchParams } from "react-router-dom";
import { MOCK_PROJECTS, MOCK_ROOMS } from "@/data/projects";
import { MOCK_RESERVATIONS } from "@/data/reservations";



export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const houseId = searchParams.get('house');
  const project = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0];
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined);
  const [isVideoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [tabsValue, setTabsValue] = useState<string>('1');
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
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
    
    // Filter by date range if both dates are selected
    const isAvailableInDateRange = isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter);
    
    // Filter by status
    const matchesStatus = true; // Always true since we don't have a status filter
    
    // Filter by price if price filter is set
    const matchesPrice = true; // Always true since we don't have a price filter
    
    // Combined filter result
    return isAvailableInDateRange && matchesStatus && matchesPrice;
  });

  // Group rooms by floor
  const roomsByFloor = filteredRooms.reduce<Record<number, Room[]>>((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});

  // Get available floors
  const availableFloors = Object.keys(roomsByFloor).map(Number).sort((a, b) => a - b);

  // Ensure selectedFloor is valid
  useEffect(() => {
    if (availableFloors.length > 0 && !availableFloors.includes(selectedFloor)) {
      setSelectedFloor(availableFloors[0]);
    }
  }, [availableFloors, selectedFloor]);

  // Get rooms for the selected floor
  const roomsForSelectedFloor = roomsByFloor[selectedFloor] || [];

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
      acc[Number(floor)] = {
        total: floorRooms.length,
        available: floorRooms.filter(room => room.status === 'available' && 
          isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)).length,
        reserved: floorRooms.filter(room => room.status === 'reserved' || 
          !isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)).length,
        sold: floorRooms.filter(room => room.status === 'sold').length,
      };
    } else {
      acc[Number(floor)] = {
        total: floorRooms.length,
        available: 0,
        reserved: 0,
        sold: 0,
      };
    }
    return acc;
  }, {} as Record<number, typeof roomCounts>);

  // Calculate total rooms by floor
  const totalRoomsByFloor = Object.entries(roomsByFloor).reduce((acc, [floor, rooms]) => {
    acc[Number(floor)] = rooms.length;
    return acc;
  }, {} as Record<number, number>);

  const [activeFilters, setActiveFilters] = useState<{
    selectedDonems: string[];
    roomCount?: string;
    roomType?: string;
  }>({ selectedDonems: [] });

  const handleDateRangeFilter = (
    startDate: Date | undefined, 
    endDate: Date | undefined,
    season?: string,
    roomCount?: string,
    roomType?: string,
    weekNumber?: string,
    donem?: string | string[],
    donemType?: 'single' | 'multiple' | 'all'
  ) => {
    // Set date filters
    setStartDateFilter(startDate);
    setEndDateFilter(endDate);
    
    // If period (dönem) is selected, we need to set proper date range
    if (donem && donemType) {
      if (donemType === 'single' && typeof donem === 'string') {
        // For single period selection, create a date range for the selected period
        const periodWeek = parseInt(donem);
        const today = new Date();
        const year = today.getFullYear();
        
        // Simple period to date calculation (each period is roughly 7 days)
        const periodStart = new Date(year, 0, 1 + (periodWeek - 1) * 7);
        const periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
        
        setStartDateFilter(periodStart);
        setEndDateFilter(periodEnd);
      } else if (donemType === 'multiple' && Array.isArray(donem) && donem.length > 0) {
        // For multiple period selection, use the first and last periods to create a range
        const periodNumbers = donem.map(d => parseInt(d)).sort((a, b) => a - b);
        const firstPeriod = periodNumbers[0];
        const lastPeriod = periodNumbers[periodNumbers.length - 1];
        
        const today = new Date();
        const year = today.getFullYear();
        
        const periodStart = new Date(year, 0, 1 + (firstPeriod - 1) * 7);
        const periodEnd = new Date(year, 0, 1 + (lastPeriod - 1) * 7 + 6);
        
        setStartDateFilter(periodStart);
        setEndDateFilter(periodEnd);
      }
    }
  };

  const handleFilterChange = (filterInfo: {
    selectedDonems: string[];
    roomCount?: string;
    roomType?: string;
  }) => {
    setActiveFilters(filterInfo);
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
                <Carousel className="w-full">
                  <CarouselContent>
                    {project.images?.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="overflow-hidden rounded-lg">
                            <img 
                              src={image} 
                              alt={`${project.name} - Image ${index + 1}`}
                              className="w-full h-64 object-cover"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center mt-4 gap-2">
                    <CarouselPrevious className="static" />
                    <CarouselNext className="static" />
                  </div>
                </Carousel>
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                {selectedHouse && (
                  <Badge variant="outline" className="mb-2">
                    {selectedHouse.name} Konut Tipi
                  </Badge>
                )}
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{selectedHouse?.floorCount || project.floorCount}</p>
                      <p className="text-xs text-muted-foreground">Kat Sayısı</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{selectedHouse?.roomCount || project.roomCount}</p>
                      <p className="text-xs text-muted-foreground">Konut Sayısı</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {Math.floor((selectedHouse?.roomCount || project.roomCount) * 0.7)}
                      </p>
                      <p className="text-xs text-muted-foreground">Satılan Konutlar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Başlangıç Tarihi</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button 
                    onClick={() => setVideoDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Tanıtım Videosunu İzle
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* House Selector for Multi-House Projects */}
          {project.type === "multi" && project.houses && project.houses.length > 0 && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Konutlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                    {project.houses.map((house) => (
                      <Button 
                        key={house.id} 
                        variant="outline"
                        className={`w-full h-14 flex flex-col items-center justify-center py-3 rounded-lg shadow-sm transition-all duration-200 ${
                          selectedHouse?.id === house.id 
                            ? 'bg-gradient-to-r from-rose-900 to-amber-800 text-amber-50 hover:from-rose-800 hover:to-amber-700 border-none shadow-md' 
                            : 'bg-gradient-to-r from-amber-50 to-rose-50 text-rose-900 hover:from-amber-100 hover:to-rose-100 border-rose-200'
                        }`}
                        onClick={() => setSelectedHouse(house)}
                      >
                        <div className="flex items-center gap-2">
                          <Hotel className={`h-4 w-4 ${selectedHouse?.id === house.id ? 'text-amber-200' : 'text-rose-700'}`} />
                          <span className="font-medium">{house.name}</span>
                        </div>
                      </Button>
                    ))}
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
              <DateRangeFilter onFilter={handleDateRangeFilter} onFilterChange={handleFilterChange} />
            </CardContent>
          </Card>
        </div>
        
        {/* Floor Plans */}
        <Tabs value={tabsValue} onValueChange={setTabsValue} className="mt-8">
          {/* Active Filter Information */}
          {activeFilters.selectedDonems.length > 0 && (
            <div className="mb-4">
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-700" />
                    <div>
                      <span className="font-medium text-amber-900">Seçili Dönemler: </span>
                      <span className="text-amber-800">
                        {activeFilters.selectedDonems.map((donem, index) => (
                          <Badge key={donem} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 mr-1">
                            {donem}. Dönem
                          </Badge>
                        ))}
                      </span>
                    </div>
                  </div>
                  {activeFilters.roomCount && (
                    <div className="flex items-center gap-2 mt-2">
                      <Home className="h-5 w-5 text-amber-700" />
                      <div>
                        <span className="font-medium text-amber-900">Oda Tipi: </span>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                          {activeFilters.roomCount}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="mb-8">
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Kat {selectedFloor} Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isDateFilterApplied ? (
                    /* Show room status counts after dönem selection */
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-muted/20 rounded-md">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Hotel className="h-4 w-4" />
                          Tüm Daire Sayısı
                        </div>
                        <div className="text-2xl font-bold">{roomStatusByFloor[selectedFloor]?.total || 0}</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-md">
                        <div className="text-sm text-green-700 flex items-center gap-1">
                          <BedDouble className="h-4 w-4" />
                          Müsait Daire Sayısı
                        </div>
                        <div className="text-2xl font-bold text-green-700">{roomStatusByFloor[selectedFloor]?.available || 0}</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-md">
                        <div className="text-sm text-amber-700 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Rezerve Edilmiş Daire Sayısı
                        </div>
                        <div className="text-2xl font-bold text-amber-700">{roomStatusByFloor[selectedFloor]?.reserved || 0}</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-md">
                        <div className="text-sm text-blue-700 flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          Satılmış Daire Sayısı
                        </div>
                        <div className="text-2xl font-bold text-blue-700">{roomStatusByFloor[selectedFloor]?.sold || 0}</div>
                      </div>
                    </div>
                  ) : (
                    /* Show room type counts before dönem selection */
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(roomCountsByType)
                        .filter(([type]) => type !== 'unknown')
                        .map(([type, count], index) => (
                          <div key={type} className="p-3 bg-gray-50 rounded-md">
                            <div className="text-sm text-gray-700 flex items-center gap-1">
                              <BedDouble className="h-4 w-4" />
                              {type} Daire
                            </div>
                            <div className="text-2xl font-bold text-gray-700">
                              {count}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: project.floorCount }, (_, i) => i + 1).map((floor) => {
                // Calculate percentage of available rooms for this floor
                const availablePercentage = roomStatusByFloor[floor] ? 
                  (roomStatusByFloor[floor].available / roomStatusByFloor[floor].total) * 100 : 0;
                
                return (
                <Card 
                  key={`summary-${floor}`} 
                  className={`p-0 cursor-pointer transition-all hover:shadow-md overflow-hidden ${selectedFloor === floor ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => {
                    setSelectedFloor(floor);
                    setTabsValue(floor.toString());
                  }}
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 bg-opacity-70 p-3 relative">
                    <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1.5 shadow-sm">
                      <Building className="h-4 w-4 text-gray-700" />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="h-4 w-4" />
                      <div className="text-sm font-medium">{roomsByFloor[floor]?.[0]?.floorName} (Kat {floor})</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Hotel className="h-4 w-4" />
                      <div className="text-lg font-bold">
                        {totalRoomsByFloor[floor]} Daire
                      </div>
                    </div>
                    
                    {/* Room availability indicator */}
                    <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${availablePercentage}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs flex justify-between">
                      <span>{roomStatusByFloor[floor]?.available || 0} müsait</span>
                      <span className="text-muted-foreground">{roomStatusByFloor[floor]?.total || 0} total</span>
                    </div>
                  </div>
                </Card>
                );
              })}
            </div>
          </div>
            
          {/* Rooms grid for each floor */}
          {Array.from({ length: project.floorCount }, (_, i) => i + 1).map((floor) => (
            <TabsContent key={floor} value={floor.toString()} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {/* Display floor name if available (for Sarot Palace) */}
                    {roomsByFloor[floor]?.[0]?.floorName ? 
                      `${roomsByFloor[floor][0].floorName} - Odalar (${roomStatusByFloor[floor]?.available || 0} müsait)` : 
                      `Floor ${floor} - Odalar (${roomStatusByFloor[floor]?.available || 0} müsait)`
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {roomsByFloor[floor]?.length ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                       {roomsByFloor[floor]?.map((room) => {
                        // Determine status colors and styles based on filtering
                        // Use gray colors when no filter is applied, status-specific colors when filtered
                        const statusConfig = {
                          available: {
                            bgColor: isDateFilterApplied ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200',
                            textColor: isDateFilterApplied ? 'text-green-700' : 'text-gray-700',
                            hoverColor: isDateFilterApplied ? 'hover:bg-green-100' : 'hover:bg-gray-100',
                            icon: <BedDouble className="h-4 w-4" />,
                            label: isDateFilterApplied ? 'Müsait' : room.type || 'Daire'
                          },
                          reserved: {
                            bgColor: isDateFilterApplied ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200',
                            textColor: isDateFilterApplied ? 'text-amber-700' : 'text-gray-700',
                            hoverColor: isDateFilterApplied ? 'hover:bg-amber-100' : 'hover:bg-gray-100',
                            icon: isDateFilterApplied ? <Calendar className="h-4 w-4" /> : <BedDouble className="h-4 w-4" />,
                            label: isDateFilterApplied ? 'Rezerve' : room.type || 'Daire'
                          },
                          sold: {
                            bgColor: isDateFilterApplied ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200',
                            textColor: isDateFilterApplied ? 'text-blue-700' : 'text-gray-700',
                            hoverColor: isDateFilterApplied ? 'hover:bg-blue-100' : 'hover:bg-gray-100',
                            icon: isDateFilterApplied ? <DollarSign className="h-4 w-4" /> : <BedDouble className="h-4 w-4" />,
                            label: isDateFilterApplied ? 'Satıldı' : room.type || 'Daire'
                          }
                        };
                        
                        const config = statusConfig[room.status];
                        
                        return (
                        <TooltipProvider key={room.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {isDateFilterApplied ? (
                                // Determine if the room is actually available for the selected period
                                // A room is available if its status is 'available' AND it has no overlapping reservations
                                room.status === 'available' && isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter) ? (
                                  // For available rooms, show clickable link to create sale
                                  <Link
                                    to={`/sales/new?roomId=${room.id}&periodId=${activeFilters?.selectedDonems?.[0] || ''}`}
                                    className={`block group border ${config.bgColor} ${config.hoverColor} rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md`}
                                  >
                                    {/* Room number header */}
                                    <div className={`${config.bgColor} border-b ${config.textColor} py-1.5 px-2 font-medium flex justify-between items-center`}>
                                      <span className="text-sm">{room.roomNumber}</span>
                                      {config.icon}
                                    </div>
                                    
                                    {/* Room content */}
                                    <div className="p-2">
                                      {/* Status badge */}
                                      <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor} border`}>
                                        {config.icon}
                                        <span>{config.label}</span>
                                      </div>
                                      
                                      {/* Price */}
                                      <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                          <DollarSign className="h-3.5 w-3.5" />
                                          <span>${(room.price / 1000).toFixed(0)}k</span>
                                        </div>
                                        
                                        {/* Action button */}
                                        <div className="rounded-full p-1 bg-green-100">
                                          <DollarSign className="h-3.5 w-3.5 text-green-700" />
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                ) : (
                                  // For reserved or sold rooms, show a non-clickable card
                                  <div className={`block group border ${config.bgColor} rounded-lg shadow-sm overflow-hidden cursor-not-allowed`}>
                                    {/* Room number header */}
                                    <div className={`${config.bgColor} border-b ${config.textColor} py-1.5 px-2 font-medium flex justify-between items-center`}>
                                      <span className="text-sm">{room.roomNumber}</span>
                                      {config.icon}
                                    </div>
                                    
                                    {/* Room content */}
                                    <div className="p-2">
                                      {/* Status badge */}
                                      <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor} border`}>
                                        {config.icon}
                                        <span>{config.label}</span>
                                      </div>
                                      
                                      {/* Price */}
                                      <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                          <DollarSign className="h-3.5 w-3.5" />
                                          <span>${(room.price / 1000).toFixed(0)}k</span>
                                        </div>
                                        
                                        {/* Action button */}
                                        <div className="rounded-full p-1 bg-gray-100">
                                          <Users className="h-3.5 w-3.5 text-gray-500" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              ) : (
                                // When no date filter is applied, show disabled room card
                                <div className="block group border bg-gray-100 rounded-lg shadow-sm overflow-hidden cursor-not-allowed opacity-80">
                                  {/* Room number header */}
                                  <div className="bg-gray-100 border-b text-gray-500 py-1.5 px-2 font-medium flex justify-between items-center">
                                    <span className="text-sm">{room.roomNumber}</span>
                                    <BedDouble className="h-4 w-4" />
                                  </div>
                                  
                                  {/* Room content */}
                                  <div className="p-2">
                                    {/* Status badge */}
                                    <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 border">
                                      <BedDouble className="h-4 w-4" />
                                      <span>{room.type || 'Daire'}</span>
                                    </div>
                                    
                                    {/* Price */}
                                    <div className="mt-2 flex items-center justify-between">
                                      <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
                                        <DollarSign className="h-3.5 w-3.5" />
                                        <span>${(room.price / 1000).toFixed(0)}k</span>
                                      </div>
                                      
                                      {/* Action button */}
                                      <div className="rounded-full p-1 bg-gray-200">
                                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </TooltipTrigger>
                            <TooltipContent side="top" className="p-0 border-0">
                              <RoomTooltip 
                                room={room} 
                                isAvailableForPeriod={room.status === 'available' && isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)}
                                isDateFilterApplied={isDateFilterApplied}
                                startDate={startDateFilter}
                                endDate={endDateFilter}
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Kriterlerinize uygun herhangi bir oda bulunamadı!
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      
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
