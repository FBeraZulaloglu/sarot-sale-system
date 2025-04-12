import { Project, Room } from "@/types";

/**
 * Mock project data for Sarot Sale System
 * Each project can have multiple houses, and each house has its own set of rooms
 */
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

// Define MOCK_PROJECTS first
export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Sarot Palace",
    description: "Iconic castle-style luxury villas with stunning architecture and premium amenities.",
    roomCount: 732,
    floorCount: 8,
    imageUrl: "https://imgkit.otelz.com/turkey/bolu/mudurnu/sarotthermalpalacetatilkoyu830b6771.jpg",
    createdAt: new Date().toISOString(),
    type: "single",
    images: [
      "https://sarotthermalpalace.net/wp-content/uploads/2023/04/1-Sarot-Palace-Slayt.webp",
      "https://sarotthermalpalace.net/wp-content/uploads/2023/04/Sarot-Termal-Palace-Genel-1-4_1200x800.jpg",
    ]
  },
  {
    id: "2",
    name: "Sarot Teras Evler",
    description: "Luxurious palace-inspired residences with elegant design and exclusive amenities.",
    roomCount: 388, 
    floorCount: 5, 
    imageUrl: "https://cdn3.enuygun.com/media/lib/1x720/uploads/image/sarot-thermal-palace-hotel-bolu-genel-39720482.webp",
    createdAt: new Date().toISOString(),
    type: "single",
    images: [
      "https://sarotthermalpalace.net/wp-content/uploads/2023/04/1-Sarot-Palace-Slayt.webp",
      "https://sarotthermalpalace.net/wp-content/uploads/2023/04/Sarot-Termal-Palace-Genel-1-4_1200x800.jpg",
    ],
  },
  {
    id: "3",
    name: "Sarot Termal Vadi",
    description: "Thermal spa resort with healing waters and comprehensive wellness facilities.",
    roomCount: 200,
    floorCount: 8,
    imageUrl: "https://lh3.googleusercontent.com/p/AF1QipMh_zCzF2oo5uc-SRfOwtSEF08CwA4x2CrVDF73=s680-w680-h510",
    createdAt: new Date().toISOString(),
    type: "multi",
    images: [
      "https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ],
    houses: [
      { id: "3-1", name: "Anemon", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-2", name: "Acelya", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-3", name: "Orkide", projectId: "3", floorCount: 3, roomCount: 12 },
      { id: "3-4", name: "Menekse", projectId: "3", floorCount: 1, roomCount: 8 },
      { id: "3-5", name: "Gül", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-6", name: "Lale", projectId: "3", floorCount: 3, roomCount: 10 },
      { id: "3-7", name: "Zambak", projectId: "3", floorCount: 2, roomCount: 10 },
      { id: "3-8", name: "Yasemin", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-9", name: "Lavanta", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-10", name: "Akasya", projectId: "3", floorCount: 2, roomCount: 10 },
      { id: "3-11", name: "Begonvil", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-12", name: "Hanmeli", projectId: "3", floorCount: 3, roomCount: 8 },
      { id: "3-13", name: "Kaktus", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-14", name: "Narçiçeği", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-15", name: "Mimoza", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-16", name: "Mango", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-17", name: "Fesleğen", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-18", name: "Petunya", projectId: "3", floorCount: 2, roomCount: 8 },
      { id: "3-19", name: "Manolya", projectId: "3", floorCount: 3, roomCount: 8 },
      { id: "3-20", name: "Nilüfer", projectId: "3", floorCount: 2, roomCount: 8 },
    ]
  },
  {
    id: "4",
    name: "Sarot Termal Country",
    description: "Country-style residences with natural surroundings and rustic charm.",
    roomCount: 150,
    floorCount: 2,
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6Kf8345dnudwGU8svwoaR9kQYAkFsRd0M__LGHk5WlgbfzXOdH-nf2_AR8QFjM0q64XWm-AzfFS_ty7cmvszMtBXMcx6lq5TvYJeJdXqGmJhtkBvf3lk_Q16Z9klBPUYJSp2QV2qFv5ax/s1600/SAROT+COUNTRY+RES%C4%B0M.jpg",
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
    name: "Burj-Al Babas",
    description: "Modern terraced homes with panoramic views and contemporary design.",
    roomCount: 180,
    floorCount: 3,
    imageUrl: "https://www.burjalbabas.com/assets/images/index/1.jpg",
    createdAt: new Date().toISOString(),
    type: "single",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2064&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ]
  }
];

// Define specific floor configurations for each project
const projectFloorConfigs = {
  // Sarot Palace (id: "1") - specific floor configuration based on the floor plan images
  "1": [
    { floor: 1, floorName: "A KATI", roomsPerFloor: 36, types: ['1+1', '2+1', '3+1'] },   // Giriş Kat (Ground Floor)
    { floor: 2, floorName: "A1 KATI", roomsPerFloor: 36, types: ['1+1', '2+1', '3+1'] },  // A1 Floor
    { floor: 3, floorName: "B KATI", roomsPerFloor: 36, types: ['1+1', '2+1', '3+1'] },   // 1st Floor
    { floor: 4, floorName: "C KATI", roomsPerFloor: 36, types: ['2+1', '3+1'] },        // 2nd Floor
    { floor: 5, floorName: "D KATI", roomsPerFloor: 36, types: ['2+1', '3+1'] },        // 3rd Floor
    { floor: 6, floorName: "E KATI", roomsPerFloor: 36, types: ['3+1', '4+1'] },        // 4th Floor
    { floor: 7, floorName: "F KATI", roomsPerFloor: 36, types: ['3+1', '4+1'] },        // 5th Floor
    { floor: 8, floorName: "PENTHOUSE", roomsPerFloor: 12, types: ['4+1', '5+1'] }      // 6th Floor (VIP PENTHOUSE)
  ],
  // Sarot Teras Evler (id: "2") - specific floor configuration
  "2": [
    { floor: 1, roomsPerFloor: 40, types: ['1+1'] },
    { floor: 2, roomsPerFloor: 40, types: ['2+1'] },
    { floor: 3, roomsPerFloor: 40, types: ['2+1', '2+1'] },
    { floor: 4, roomsPerFloor: 40, types: ['2+1'] },
    { floor: 5, roomsPerFloor: 40, types: ['2+1', '2+1'] },
    { floor: 6, roomsPerFloor: 40, types: ['1+1'] },
    { floor: 7, roomsPerFloor: 40, types: ['1+1', '2+1'] },
    { floor: 8, roomsPerFloor: 40, types: ['1+1'] }
  ],
  // Sarot Termal Country (id: "4") - specific floor configuration
  "4": [
    { floor: 1, roomsPerFloor: 10, types: ['2+1', '3+1'] },
  ],
  // Burj-Al Babas (id: "5") - specific floor configuration
  "5": [
    { floor: 1, roomsPerFloor: 12, types: ['2+1'] },
  ]
};

// Define specific floor configurations for houses in Sarot Termal Vadi (id: "3")
const sarotTermalVadiHouseFloorConfigs = {
  // Each house will have its own floor configuration with unique floor names and room types
  "3-1": [ // Anemon House
    { floor: 1, floorName: "Zemin Kat", roomsPerFloor: 5, types: ['1+1', '2+1'] },
    { floor: 2, floorName: "Üst Kat", roomsPerFloor: 3, types: ['3+1', '4+1'] }
  ],
  "3-2": [ // Acelya House
    { floor: 1, floorName: "Giriş Kat", roomsPerFloor: 4, types: ['2+1'] },
    { floor: 2, floorName: "Birinci Kat", roomsPerFloor: 4, types: ['2+1', '3+1'] }
  ],
  "3-3": [ // Orkide House
    { floor: 1, floorName: "Alt Kat", roomsPerFloor: 6, types: ['1+1'] },
    { floor: 2, floorName: "Orta Kat", roomsPerFloor: 4, types: ['2+1'] },
    { floor: 3, floorName: "Üst Kat", roomsPerFloor: 2, types: ['4+1'] }
  ],
  "3-4": [ // Menekse House
    { floor: 1, floorName: "A Blok", roomsPerFloor: 8, types: ['1+1', '2+1'] }
  ],
  "3-5": [ // Gül House
    { floor: 1, floorName: "Bahçe Katı", roomsPerFloor: 3, types: ['2+1'] },
    { floor: 2, floorName: "Ana Kat", roomsPerFloor: 5, types: ['3+1'] }
  ],
  "3-6": [ // Lale House
    { floor: 1, floorName: "Giriş", roomsPerFloor: 4, types: ['2+1'] },
    { floor: 2, floorName: "Orta", roomsPerFloor: 4, types: ['2+1'] },
    { floor: 3, floorName: "Teras", roomsPerFloor: 2, types: ['3+1', '4+1'] }
  ],
  "3-7": [ // Zambak House
    { floor: 1, floorName: "A Katı", roomsPerFloor: 6, types: ['1+1'] },
    { floor: 2, floorName: "B Katı", roomsPerFloor: 4, types: ['2+1'] }
  ],
  "3-8": [ // Yasemin House
    { floor: 1, floorName: "Zemin", roomsPerFloor: 4, types: ['2+1', '3+1'] },
    { floor: 2, floorName: "Üst", roomsPerFloor: 4, types: ['3+1'] }
  ],
  "3-9": [ // Lavanta House
    { floor: 1, floorName: "Alt Seviye", roomsPerFloor: 5, types: ['1+1', '2+1'] },
    { floor: 2, floorName: "Üst Seviye", roomsPerFloor: 3, types: ['3+1', '4+1'] }
  ],
  "3-10": [ // Akasya House
    { floor: 1, floorName: "Bahçe", roomsPerFloor: 6, types: ['1+1'] },
    { floor: 2, floorName: "Ana", roomsPerFloor: 4, types: ['2+1'] }
  ],
  "3-11": [ // Begonvil House
    { floor: 1, floorName: "Giriş Seviyesi", roomsPerFloor: 4, types: ['2+1'] },
    { floor: 2, floorName: "Üst Seviye", roomsPerFloor: 4, types: ['3+1'] }
  ],
  "3-12": [ // Hanmeli House
    { floor: 1, floorName: "Alt", roomsPerFloor: 3, types: ['1+1', '2+1'] },
    { floor: 2, floorName: "Orta", roomsPerFloor: 3, types: ['2+1'] },
    { floor: 3, floorName: "Üst", roomsPerFloor: 2, types: ['3+1'] }
  ],
  "3-13": [ // Kaktus House
    { floor: 1, floorName: "Zemin Seviye", roomsPerFloor: 5, types: ['1+1', '2+1'] },
    { floor: 2, floorName: "Birinci Seviye", roomsPerFloor: 3, types: ['3+1'] }
  ],
  "3-14": [ // Narçiçeği House
    { floor: 1, floorName: "Giriş Bölümü", roomsPerFloor: 4, types: ['2+1'] },
    { floor: 2, floorName: "Üst Bölüm", roomsPerFloor: 4, types: ['2+1', '3+1'] }
  ],
  "3-15": [ // Mimoza House
    { floor: 1, floorName: "Alt Kısım", roomsPerFloor: 6, types: ['1+1'] },
    { floor: 2, floorName: "Üst Kısım", roomsPerFloor: 2, types: ['3+1', '4+1'] }
  ],
  "3-16": [ // Mango House
    { floor: 1, floorName: "Bahçe Seviyesi", roomsPerFloor: 4, types: ['2+1'] },
    { floor: 2, floorName: "Ana Seviye", roomsPerFloor: 4, types: ['2+1', '3+1'] }
  ],
  "3-17": [ // Fesleğen House
    { floor: 1, floorName: "Alt Bölüm", roomsPerFloor: 5, types: ['1+1', '2+1'] },
    { floor: 2, floorName: "Üst Bölüm", roomsPerFloor: 3, types: ['3+1'] }
  ],
  "3-18": [ // Petunya House
    { floor: 1, floorName: "Zemin", roomsPerFloor: 4, types: ['2+1'] },
    { floor: 2, floorName: "Birinci", roomsPerFloor: 4, types: ['3+1'] }
  ],
  "3-19": [ // Manolya House
    { floor: 1, floorName: "Alt Kat", roomsPerFloor: 3, types: ['1+1', '2+1'] },
    { floor: 2, floorName: "Orta Kat", roomsPerFloor: 3, types: ['2+1'] },
    { floor: 3, floorName: "Üst Kat", roomsPerFloor: 2, types: ['3+1', '4+1'] }
  ],
  "3-20": [ // Nilüfer House
    { floor: 1, floorName: "Giriş Katı", roomsPerFloor: 4, types: ['2+1'] },
    { floor: 2, floorName: "Üst Katı", roomsPerFloor: 4, types: ['3+1'] }
  ]
};

// Function to generate rooms based on specific floor configuration
function generateRoomsWithConfig(projectId: string, floorConfig: any[], houseId?: string): Room[] {
  const rooms: Room[] = [];
  
  floorConfig.forEach(config => {
    for (let i = 1; i <= config.roomsPerFloor; i++) {
      // For Sarot Palace, use the actual room numbering from the floor plan (1-36)
      // For Sarot Termal Vadi houses, use a special format
      // For other projects, use the standard floor+room format
      let roomNumber = '';
      if (projectId === '1' && config.floorName) {
        // For Sarot Palace, just use the room number (1-36) as shown in the floor plan
        roomNumber = i.toString();
      } else if (projectId === '3' && houseId && houseId.startsWith('3-') && config.floorName) {
        // For Sarot Termal Vadi houses, use a special format with house identifier
        // Format: H-F-R where H is house number, F is floor, R is room number
        // Example: For house 3-5, floor 2, room 3 -> 5-2-03
        const houseNumber = houseId.split('-')[1];
        roomNumber = `${houseNumber}-${config.floor}-${i.toString().padStart(2, '0')}`;
      } else {
        // Standard format for other projects
        roomNumber = `${config.floor}${i.toString().padStart(2, '0')}`;
      }
      
      const id = `${projectId}-${config.floor}-${roomNumber}`;
      
      // Determine price based on floor and room type
      const basePrice = 100000 + (config.floor * 15000);
      const randomFactor = Math.random() * 50000;
      
      // Randomly select a type from available types for this floor
      const type = config.types[Math.floor(Math.random() * config.types.length)];
      
      // Adjust price based on room type
      let price = basePrice + randomFactor;
      if (type === '2+1') price *= 1.2;
      if (type === '3+1') price *= 1.5;
      if (type === '4+1') price *= 1.8;
      if (type === '5+1') price *= 2.2;
      
      // Determine size based on room type
      let size = 0;
      if (type === '1+1') size = Math.floor(50 + (Math.random() * 20));
      if (type === '2+1') size = Math.floor(70 + (Math.random() * 30));
      if (type === '3+1') size = Math.floor(100 + (Math.random() * 40));
      if (type === '4+1') size = Math.floor(140 + (Math.random() * 40));
      if (type === '5+1') size = Math.floor(180 + (Math.random() * 50));
      
      // Determine status based on some logic
      let status: 'available' | 'reserved' | 'sold' = 'available';
      const rand = Math.random();
      if (rand < 0.2) {
        status = 'reserved';
      } else if (rand < 0.5) {
        status = 'sold';
      }
      
      // Determine if the room has a balcony (more likely in larger apartments)
      const balconyProbability = type === '1+1' ? 0.3 : type === '2+1' ? 0.6 : 0.9;
      const balcony = Math.random() < balconyProbability;
      
      // Create the room object with all properties
      const room: Room = {
        id,
        projectId,
        houseId: houseId || projectId,
        floor: config.floor,
        roomNumber,
        price,
        status,
        type,
        size,
        balcony
      };
      
      // Add floorName if available (for Sarot Palace)
      if (config.floorName) {
        // @ts-ignore - We're adding a custom property that might not be in the type definition
        room.floorName = config.floorName;
      }
      
      rooms.push(room);
    }
  });
  
  return rooms;
}

// Generate mock rooms for all projects and houses
export const MOCK_ROOMS: Room[] = [];

// Populate MOCK_ROOMS with rooms for each project and house
(function populateMockRooms() {
  // Add rooms for projects with specific floor configurations
  MOCK_PROJECTS.forEach(project => {
    if (project.type === 'single' && projectFloorConfigs[project.id]) {
      // Use specific floor configuration for this project
      const rooms = generateRoomsWithConfig(project.id, projectFloorConfigs[project.id]);
      MOCK_ROOMS.push(...rooms);
    } else if (project.type === 'single') {
      // Fallback to generic room generation for single projects without specific config
      const rooms = generateMockRooms(project.id, project.floorCount);
      MOCK_ROOMS.push(...rooms);
    }
  });
  
  // Add rooms for projects with houses
  MOCK_PROJECTS.forEach(project => {
    if (project.houses && project.houses.length > 0) {
      if (project.id === "3") {
        // Special handling for Sarot Termal Vadi with house-specific floor configs
        project.houses.forEach(house => {
          if (sarotTermalVadiHouseFloorConfigs[house.id]) {
            const rooms = generateRoomsWithConfig(project.id, sarotTermalVadiHouseFloorConfigs[house.id], house.id);
            MOCK_ROOMS.push(...rooms);
          } else {
            // Fallback if no specific config found for this house
            const rooms = generateMockRooms(project.id, house.floorCount, house.id);
            MOCK_ROOMS.push(...rooms);
          }
        });
      } else if (projectFloorConfigs[project.id]) {
        // For other multi-house projects with specific floor configs
        project.houses.forEach(house => {
          const rooms = generateRoomsWithConfig(project.id, projectFloorConfigs[project.id], house.id);
          MOCK_ROOMS.push(...rooms);
        });
      } else {
        // Fallback to generic room generation for houses without specific config
        project.houses.forEach(house => {
          const rooms = generateMockRooms(project.id, house.floorCount, house.id);
          MOCK_ROOMS.push(...rooms);
        });
      }
    }
  });
})();

