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

// Mock project data
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Burj Al Babas",
    description: "Iconic castle-style luxury villas with stunning architecture and premium amenities.",
    roomCount: 732,
    floorCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "single",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "2",
    name: "SAROT TERMAL PALACE",
    description: "Luxurious palace-inspired residences with elegant design and exclusive amenities.",
    roomCount: 388, // Total: 8 floors × (8 × 3+1 + 40 × 1+1) per floor + 4 × 4+1 + 8 × 3+1 + 28 × 2+1 on 7th floor
    floorCount: 8, // 0-7 floors (8 floors total)
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "multi", // Changed to multi to support different floor layouts
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ],
    houses: [
      { id: "2-0", name: "0. Kat (Zemin)", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-1", name: "1. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-2", name: "2. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-3", name: "3. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-4", name: "4. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-5", name: "5. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-6", name: "6. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-7", name: "7. Kat (Çatı)", projectId: "2", floorCount: 1, roomCount: 40 }  // 4 × 4+1 + 8 × 3+1 + 28 × 2+1
    ]
  },
  {
    id: "3",
    name: "Sarot Termal Park Otel",
    description: "Thermal spa resort with healing waters and comprehensive wellness facilities.",
    roomCount: 200,
    floorCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?q=80&w=1974&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "single",
    images: [
      "https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "4",
    name: "Sarot Country",
    description: "Country-style residences with natural surroundings and rustic charm.",
    roomCount: 150,
    floorCount: 2,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "single",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "5",
    name: "Sarot Teras Evler",
    description: "Modern terraced homes with panoramic views and contemporary design.",
    roomCount: 180,
    floorCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1529551739587-e242c564f727?q=80&w=2046&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2064&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "multi",
    images: [
      "https://images.unsplash.com/photo-1529551739587-e242c564f727?q=80&w=2046&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2064&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ],
    houses: [
      { id: "5-1", name: "Fulya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-2", name: "Sümbül", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-3", name: "Sekoya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-4", name: "Nergis", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-5", name: "Frezya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-6", name: "Kamelya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-7", name: "Sedir", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-8", name: "Safran", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-9", name: "Kardelen", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-10", name: "Laden", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-11", name: "Karanfil", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-12", name: "Papatya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-13", name: "Sardunya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-14", name: "Lilyum", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-15", name: "Arguvan", projectId: "5", floorCount: 3, roomCount: 12 },
    ]
  },
  {
    id: "6",
    name: "Sarot Bahçe Evleri",
    description: "Garden homes with lush green spaces and family-friendly environments.",
    roomCount: 150,
    floorCount: 2,
    imageUrl: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "multi",
    images: [
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ],
    houses: [
      { id: "6-1", name: "Anemon", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-2", name: "Acelya", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-3", name: "Orkide", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-4", name: "Menekse", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-5", name: "Gül", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-6", name: "Lale", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-7", name: "Zambak", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-8", name: "Yasemin", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-9", name: "Lavanta", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-10", name: "Akasya", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-11", name: "Begonvil", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-12", name: "Hanmeli", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-13", name: "Kaktus", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-14", name: "Narçiçeği", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-15", name: "Mimoza", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-16", name: "Mango", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-17", name: "Fesleğen", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-18", name: "Petunya", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-19", name: "Manolya", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-20", name: "Nilüfer", projectId: "6", floorCount: 2, roomCount: 8 },
    ]
  },
];

// Helper function to generate mock rooms for a project
function generateMockRooms(projectId: string, floorCount: number, houseId?: string): Room[] {
  const rooms: Room[] = [];
  
  // Check if this is the SAROT TERMAL PALACE project (id: "2")
  const isThermalPalace = projectId === "2" || (houseId && houseId.startsWith("2-"));
  
  for (let floor = 1; floor <= floorCount; floor++) {
    // For SAROT TERMAL PALACE, use the specific room configuration
    if (isThermalPalace) {
      // Generate 40 1+1 rooms
      for (let i = 1; i <= 40; i++) {
        const roomNumber = `${floor}${i.toString().padStart(2, '0')}`;
        const id = `${projectId}-${roomNumber}`;
        const price = 100000 + (floor * 10000) + (Math.random() * 50000);
        
        // Determine status based on some logic
        let status: 'available' | 'reserved' | 'sold' = 'available';
        const rand = Math.random();
        if (rand < 0.2) {
          status = 'reserved';
        } else if (rand < 0.5) {
          status = 'sold';
        }
        
        rooms.push({
          id,
          projectId,
          houseId: houseId || projectId,
          floor,
          roomNumber,
          price,
          status,
          type: '1+1', // All these rooms are 1+1
          size: Math.floor(50 + (Math.random() * 20)), // Smaller size for 1+1
          balcony: Math.random() > 0.3,
        });
      }
      
      // Generate 8 3+1 rooms
      for (let i = 41; i <= 48; i++) {
        const roomNumber = `${floor}${i.toString().padStart(2, '0')}`;
        const id = `${projectId}-${roomNumber}`;
        const price = 200000 + (floor * 15000) + (Math.random() * 70000); // Higher price for larger rooms
        
        // Determine status based on some logic
        let status: 'available' | 'reserved' | 'sold' = 'available';
        const rand = Math.random();
        if (rand < 0.2) {
          status = 'reserved';
        } else if (rand < 0.5) {
          status = 'sold';
        }
        
        rooms.push({
          id,
          projectId,
          houseId: houseId || projectId,
          floor,
          roomNumber,
          price,
          status,
          type: '3+1', // All these rooms are 3+1
          size: Math.floor(100 + (Math.random() * 40)), // Larger size for 3+1
          balcony: true, // All 3+1 have balconies
        });
      }
    } else {
      // For other projects, use the original logic with 8 rooms per floor
      const roomsPerFloor = 8;
      for (let i = 1; i <= roomsPerFloor; i++) {
        const roomNumber = `${floor}${i.toString().padStart(2, '0')}`;
        const id = `${projectId}-${roomNumber}`;
        const price = 100000 + (floor * 10000) + (Math.random() * 50000);
        
        // Determine status based on some logic
        let status: 'available' | 'reserved' | 'sold' = 'available';
        const rand = Math.random();
        if (rand < 0.2) {
          status = 'reserved';
        } else if (rand < 0.5) {
          status = 'sold';
        }
        
        rooms.push({
          id,
          projectId,
          houseId: houseId || projectId, // Use houseId if provided
          floor,
          roomNumber,
          price,
          status,
          type: Math.random() > 0.7 ? '2+1' : '1+1',
          size: Math.floor(50 + (Math.random() * 50)),
          balcony: Math.random() > 0.3,
        });
      }
    }
  }
  
  return rooms;
}

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

  // Generate mock rooms for this project
  const rooms = selectedHouse ? generateMockRooms(projectId, selectedHouse.floorCount, selectedHouse.id) : generateMockRooms(projectId, project.floorCount);

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
    const filteredRooms = MOCK_ROOMS.filter(room => {
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
