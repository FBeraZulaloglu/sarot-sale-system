
import { Project, Room } from "@/types";

// Mock data for demonstration
export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Luxury Grand Hotel",
    description: "A 5-star luxury hotel with modern amenities and stunning views.",
    roomCount: 120,
    floorCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
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
  },
];

// Function to generate mock rooms for a project
export const generateMockRooms = (projectId: string, floorCount: number): Room[] => {
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

// Generate all rooms for all projects
export const getAllMockRooms = (): Room[] => {
  return MOCK_PROJECTS.flatMap(project => 
    generateMockRooms(project.id, project.floorCount)
  );
};

export const MOCK_ROOMS = getAllMockRooms();
