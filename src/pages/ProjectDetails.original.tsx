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
import { format } from "date-fns";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined);
  const [seasonFilter, setSeasonFilter] = useState<string | undefined>(undefined);
  const [isVideoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
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

  // Count rooms by status
  const roomCounts = {
    total: filteredRooms.length,
    available: filteredRooms.filter(room => room.status === 'available').length,
    reserved: filteredRooms.filter(room => room.status === 'reserved').length,
    sold: filteredRooms.filter(room => room.status === 'sold').length,
  };

  // Calculate room status by floor
  const roomStatusByFloor = Object.entries(roomsByFloor).reduce((acc, [floor, rooms]) => {
    acc[Number(floor)] = {
      total: rooms.length,
      available: rooms.filter(room => room.status === 'available').length,
      reserved: rooms.filter(room => room.status === 'reserved').length,
      sold: rooms.filter(room => room.status === 'sold').length,
    };
    return acc;
  }, {} as Record<number, typeof roomCounts>);

  // Calculate total rooms by floor
  const totalRoomsByFloor = Object.entries(roomsByFloor).reduce((acc, [floor, rooms]) => {
    acc[Number(floor)] = rooms.length;
    return acc;
  }, {} as Record<number, number>);

  const handleDateRangeFilter = (
    startDate: Date | undefined, 
    endDate: Date | undefined, 
    season?: string,
    roomCount?: string,
    roomType?: string,
    weekNumber?: string
  ) => {
    setStartDateFilter(startDate);
    setEndDateFilter(endDate);
    setSeasonFilter(season);
    
    // Apply filters to the rooms
    const projectRooms = selectedHouse
      ? MOCK_ROOMS.filter(room => room.projectId === projectId && room.houseId === selectedHouse.id)
      : MOCK_ROOMS.filter(room => room.projectId === projectId);
      
    const filteredRooms = projectRooms.filter(room => {
      // Filter by house if a house is selected
      if (selectedHouse && room.houseId !== selectedHouse.id) {
        return false;
      }
      
      // Filter by date range if specified
      if (startDate && endDate) {
        // In a real app, we would check if the room is available during this date range
        // For now, we'll just include all rooms when a date range is specified
      }
      
      // Filter by season if specified
      if (season) {
        // In a real app, we would check if the room is available during this season
        // For now, we'll just include all rooms when a season is specified
      }
      
      // Filter by specific week if season and week are specified
      if (season && weekNumber) {
        // In a real app, we would check if the room is available during this specific week
        // For now, we'll just include all rooms when a week is specified
        // This would typically involve checking availability for specific dates
        // corresponding to the selected week
      }
      
      // Filter by room count if specified
      if (roomCount) {
        // In a real app, we would check the room's actual count/size
        // For now, we'll just filter based on the room type which might include this info
        if (room.type && !room.type.includes(roomCount)) {
          return false;
        }
      }
      
      // Filter by room type if specified
      if (roomType) {
        // Check if the room matches the selected type
        if (roomType === 'standart' && room.type !== 'Standart') return false;
        if (roomType === 'premium' && room.type !== 'Premium') return false;
        if (roomType === 'engelli' && room.type !== 'Engelli') return false;
        if (roomType === 'king-suit' && room.type !== 'King Suit') return false;
        if (roomType === 'suit' && room.type !== 'Suit') return false;
      }
      
      return true;
    });
    
    console.log(`Filters applied: ${startDate ? format(startDate, 'PP') : 'No start date'}, ${endDate ? format(endDate, 'PP') : 'No end date'}, Season: ${season || 'None'}, Week: ${weekNumber || 'None'}, Room Count: ${roomCount || 'Any'}, Room Type: ${roomType || 'Any'}`);
    console.log(`Filtered rooms: ${filteredRooms.length}`);
  };

  return (
    <MainLayout requireAuth={false}>
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
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Başlangıç Tarihi</p>
                    </div>
                  </div>
                </div>
                
                {/* Project Features Overview */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-md border border-indigo-100">
                    <div className="text-xs text-indigo-700 flex items-center gap-1 mb-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>Property Details</span>
                    </div>
                    <div className="text-sm font-medium text-indigo-700">
                      <div className="flex justify-between">
                        <span>Total Units:</span>
                        <span>{roomCounts.total}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Floors:</span>
                        <span>{selectedHouse ? selectedHouse.floorCount : project.floorCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-rose-50 rounded-md border border-rose-100">
                    <div className="text-xs text-rose-700 flex items-center gap-1 mb-1">
                      <Home className="h-3.5 w-3.5" />
                      <span>Amenities</span>
                    </div>
                    <div className="text-sm font-medium text-rose-700">
                      <div className="flex items-center gap-1">
                        <span>• Thermal Spa</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span>• 24/7 Security</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-emerald-50 rounded-md border border-emerald-100">
                    <div className="text-xs text-emerald-700 flex items-center gap-1 mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Project Timeline</span>
                    </div>
                    <div className="text-sm font-medium text-emerald-700">
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span>Jan 2023</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Completion:</span>
                        <span>Dec 2025</span>
                      </div>
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

          {/* House selector section removed - this project only has 1+1 rooms */}
        </div>
        
        {/* Filter System */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{selectedHouse ? `${selectedHouse.name} Oda Arama` : `${project.name} Konut Arama`}</CardTitle>
            </CardHeader>
            <CardContent>
              <DateRangeFilter onFilter={handleDateRangeFilter} />
            </CardContent>
          </Card>
        </div>
        
        {/* Floor Plans */}
        <Tabs defaultValue={selectedFloor.toString()} className="mt-8">
          <div className="mb-8">
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    All Floors Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-muted/20 rounded-md">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Hotel className="h-4 w-4" />
                        Total Rooms
                      </div>
                      <div className="text-2xl font-bold">{roomCounts.total}</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-md">
                      <div className="text-sm text-green-700 flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        Available
                      </div>
                      <div className="text-2xl font-bold text-green-700">{roomCounts.available}</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-md">
                      <div className="text-sm text-amber-700 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Reserved
                      </div>
                      <div className="text-2xl font-bold text-amber-700">{roomCounts.reserved}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-md">
                      <div className="text-sm text-blue-700 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Sold
                      </div>
                      <div className="text-2xl font-bold text-blue-700">{roomCounts.sold}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: project.floorCount }, (_, i) => i).map((floor) => {
                // Calculate percentage of available rooms for this floor
                const availablePercentage = roomStatusByFloor[floor] ? 
                  (roomStatusByFloor[floor].available / roomStatusByFloor[floor].total) * 100 : 0;
                
                // Get floor name based on index
                const getFloorName = (index) => {
                  if (project.id === "2") { // For Sarot Termal Palace
                    if (index === 0) return "0. Kat (Zemin)";
                    if (index === 7) return "7. Kat (Çatı)";
                    return `${index}. Kat`;
                  }
                  return `Floor ${index + 1}`;
                };
                
                return (
                <Card 
                  key={`summary-${floor}`} 
                  className={`p-0 cursor-pointer transition-all hover:shadow-md overflow-hidden ${selectedFloor === floor ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => {
                    setSelectedFloor(floor);
                    const tabElement = document.querySelector(`[data-value="${floor}"]`);
                    if (tabElement) {
                      (tabElement as HTMLElement).click();
                    }
                  }}
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 bg-opacity-70 p-3 relative">
                    <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1.5 shadow-sm">
                      <Building className="h-4 w-4 text-gray-700" />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="h-4 w-4" />
                      <div className="text-sm font-medium">{getFloorName(floor)}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Hotel className="h-4 w-4" />
                      <div className="text-lg font-bold">
                        {totalRoomsByFloor[floor]} rooms
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
                      <span>{roomStatusByFloor[floor]?.available || 0} available</span>
                      <span className="text-muted-foreground">{roomStatusByFloor[floor]?.total || 0} total</span>
                    </div>
                  </div>
                </Card>
                );
              })}
            </div>
          </div>
            
          {/* Rooms grid for each floor */}
          {Array.from({ length: project.floorCount }, (_, i) => i).map((floor) => (
            <TabsContent key={floor} value={floor.toString()} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {project.id === "2" ? (
                      floor === 0 ? "0. Kat (Zemin)" : 
                      floor === 7 ? "7. Kat (Çatı)" : 
                      `${floor}. Kat`
                    ) : `Floor ${floor + 1}`} - Rooms ({roomStatusByFloor[floor]?.available || 0} available)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {roomsByFloor[floor]?.length ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                      {roomsByFloor[floor]?.map((room) => {
                        // Determine status colors and styles
                        const statusConfig = {
                          available: {
                            bgColor: 'bg-green-50 border-green-200',
                            textColor: 'text-green-700',
                            hoverColor: 'hover:bg-green-100',
                            icon: <BedDouble className="h-4 w-4" />,
                            label: 'Available'
                          },
                          reserved: {
                            bgColor: 'bg-amber-50 border-amber-200',
                            textColor: 'text-amber-700',
                            hoverColor: 'hover:bg-amber-100',
                            icon: <Calendar className="h-4 w-4" />,
                            label: 'Reserved'
                          },
                          sold: {
                            bgColor: 'bg-blue-50 border-blue-200',
                            textColor: 'text-blue-700',
                            hoverColor: 'hover:bg-blue-100',
                            icon: <DollarSign className="h-4 w-4" />,
                            label: 'Sold'
                          }
                        };
                        
                        const config = statusConfig[room.status];
                        
                        return (
                        <TooltipProvider key={room.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                to={`/sales/new?roomId=${room.id}`}
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
                                    <div className={`rounded-full p-1 ${room.status === 'available' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                      {room.status === 'available' ? (
                                        <DollarSign className="h-3.5 w-3.5 text-green-700" />
                                      ) : (
                                        <Users className="h-3.5 w-3.5 text-gray-500" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="p-0 border-0">
                              <RoomTooltip room={room} />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No rooms match your filter criteria on this floor.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <YoutubeVideoDialog
        project={project}
        open={isVideoDialogOpen}
        onOpenChange={setVideoDialogOpen}
        videoId={youtubeVideoId}
      />
    </MainLayout>
  );
}
