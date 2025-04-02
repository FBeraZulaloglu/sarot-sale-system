import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Project, Room } from "@/types";
import { 
  ChevronLeft, Building2, Home, Calendar, 
  BedDouble, DollarSign, Users, Play, Layers, Building, Hotel
} from "lucide-react";
import { DateRangeFilter } from "@/components/projects/DateRangeFilter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RoomTooltip } from "@/components/projects/RoomTooltip";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { YoutubeVideoDialog } from "@/components/projects/YoutubeVideoDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mock data for demonstration
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Luxury Grand Hotel",
    description: "A 5-star luxury hotel with modern amenities and stunning views.",
    roomCount: 120,
    floorCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    // Add array of images for the carousel
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "2",
    name: "Seaside Resort",
    description: "Beachfront resort with private beach access and water activities.",
    roomCount: 90,
    floorCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "3",
    name: "Mountain View Lodge",
    description: "Cozy mountain retreat with hiking trails and outdoor activities.",
    roomCount: 80,
    floorCount: 5,
    imageUrl: "https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?q=80&w=1974&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    images: [
      "https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "4",
    name: "Urban Boutique Hotel",
    description: "Stylish city center hotel with artistic design and local charm.",
    roomCount: 60,
    floorCount: 4,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "5",
    name: "Historic Grand Palace",
    description: "Heritage hotel in a restored palace with classical architecture.",
    roomCount: 100,
    floorCount: 7,
    imageUrl: "https://images.unsplash.com/photo-1529551739587-e242c564f727?q=80&w=2046&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2064&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    images: [
      "https://images.unsplash.com/photo-1529551739587-e242c564f727?q=80&w=2046&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2064&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "6",
    name: "Skyline Towers",
    description: "Modern high-rise hotel with panoramic city views and rooftop pool.",
    roomCount: 150,
    floorCount: 30,
    imageUrl: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    images: [
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ]
  },
];

// Function to generate mock rooms for a project
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
        floor,
        roomNumber,
        status: Math.random() > 0.7 ? 'sold' : Math.random() > 0.5 ? 'reserved' : 'available',
        price: Math.floor(100000 + Math.random() * 500000), // Random price between 100k and 600k
      });
    }
  }
  return rooms;
};

// Mock reservation data for date filtering
const MOCK_RESERVATIONS = [
  // Generate some random reservation periods for rooms
  { roomId: "1-101", startDate: new Date(2023, 6, 1), endDate: new Date(2023, 6, 15) },
  { roomId: "1-102", startDate: new Date(2023, 6, 10), endDate: new Date(2023, 6, 20) },
  { roomId: "1-103", startDate: new Date(2023, 7, 5), endDate: new Date(2023, 7, 15) },
  // Add more as needed
];

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0];
  const [activeTab, setActiveTab] = useState("overview");
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined);
  const [isVideoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const youtubeVideoId = "MHfT2GAOMV4";

  // Generate mock rooms for this project
  const rooms = generateMockRooms(project.id, project.floorCount);

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
  const roomsByFloor = filteredRooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  // Count rooms by status
  const roomCounts = {
    available: rooms.filter((r) => r.status === 'available').length,
    reserved: rooms.filter((r) => r.status === 'reserved').length,
    sold: rooms.filter((r) => r.status === 'sold').length,
    total: rooms.length,
  };

  // Count total rooms per floor
  const totalRoomsByFloor = Array.from({ length: project.floorCount }, (_, i) => i + 1).reduce((acc, floor) => {
    acc[floor] = rooms.filter(room => room.floor === floor).length;
    return acc;
  }, {} as Record<number, number>);

  // Count rooms by status for each floor
  const roomStatusByFloor = Array.from({ length: project.floorCount }, (_, i) => i + 1).reduce((acc, floor) => {
    const floorRooms = rooms.filter(room => room.floor === floor);
    acc[floor] = {
      available: floorRooms.filter(room => room.status === 'available' && isRoomAvailableBetweenDates(room.id, startDateFilter, endDateFilter)).length,
      reserved: floorRooms.filter(room => room.status === 'reserved').length,
      sold: floorRooms.filter(room => room.status === 'sold').length,
      total: floorRooms.length
    };
    return acc;
  }, {} as Record<number, {available: number, reserved: number, sold: number, total: number}>);

  const handleDateRangeFilter = (startDate: Date | undefined, endDate: Date | undefined) => {
    setStartDateFilter(startDate);
    setEndDateFilter(endDate);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link to="/" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Project header */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
            {/* Image Carousel */}
            <Carousel className="w-full">
              <CarouselContent>
                {project.images?.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${project.name} - Image ${index + 1}`}
                          className="w-full h-auto object-cover aspect-video"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                )) || (
                  <CarouselItem>
                    <div className="p-1">
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={project.image3dUrl}
                          alt={project.name}
                          className="w-full h-auto object-cover aspect-video"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="-left-3" />
              <CarouselNext className="-right-3" />
            </Carousel>
            
            {/* Video Button */}
            <div className="mt-3 flex justify-center">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setVideoDialogOpen(true)}
              >
                <Play className="h-4 w-4" />
                Video aç
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="card-hover">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Total Floors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{project.floorCount}</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Total Rooms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{project.roomCount}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="card-hover">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Room Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-lg font-bold">{roomCounts.available}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-green-500" 
                        style={{ width: `${(roomCounts.available / roomCounts.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reserved</p>
                    <p className="text-lg font-bold">{roomCounts.reserved}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-amber-500" 
                        style={{ width: `${(roomCounts.reserved / roomCounts.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sold</p>
                    <p className="text-lg font-bold">{roomCounts.sold}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ width: `${(roomCounts.sold / roomCounts.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Filter System */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Room Availability</h2>
          
          <DateRangeFilter onFilter={handleDateRangeFilter} />
          
          {(startDateFilter && endDateFilter) && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-4 text-sm">
              Showing rooms available between {startDateFilter.toLocaleDateString()} and {endDateFilter.toLocaleDateString()}
            </div>
          )}
          
          {/* Info banner for date filter */}
          
        </div>
        
        {/* Floor tabs */}
        <div className="mt-8">
          <Tabs defaultValue="1">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-3">Floor Plans</h2>
              
              {/* Floor Information Card */}
              <div className="mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Floor {selectedFloor} Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-muted/20 rounded-md">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Hotel className="h-4 w-4" />
                          Total Rooms
                        </div>
                        <div className="text-2xl font-bold">{roomStatusByFloor[selectedFloor]?.total || 0}</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-md">
                        <div className="text-sm text-green-700 flex items-center gap-1">
                          <BedDouble className="h-4 w-4" />
                          Available
                        </div>
                        <div className="text-2xl font-bold text-green-700">{roomStatusByFloor[selectedFloor]?.available || 0}</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-md">
                        <div className="text-sm text-amber-700 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Reserved
                        </div>
                        <div className="text-2xl font-bold text-amber-700">{roomStatusByFloor[selectedFloor]?.reserved || 0}</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-md">
                        <div className="text-sm text-blue-700 flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          Sold
                        </div>
                        <div className="text-2xl font-bold text-blue-700">{roomStatusByFloor[selectedFloor]?.sold || 0}</div>
                      </div>
                    </div>
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
                        <div className="text-sm font-medium">Floor {floor}</div>
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
            {Array.from({ length: project.floorCount }, (_, i) => i + 1).map((floor) => (
              <TabsContent key={floor} value={floor.toString()} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Floor {floor} - Rooms ({roomStatusByFloor[floor]?.available || 0} available)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {roomsByFloor[floor]?.length ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
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
