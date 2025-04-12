import { Room } from "@/types";

// Sample rooms for Sarot Palace project
// These are example rooms that follow the Room interface structure

// Constants
const SAROT_PALACE_PROJECT_ID = "1";

// Helper function to create a room with the required format
export const createRoom = (
  id: string,
  projectId: string,
  houseId: string,
  floor: number,
  floorName: string,
  roomNumber: string,
  price: number,
  type: string,
  tapuName: string,
  size?: number,
  balcony?: boolean,
  features?: string[]
): Room => {
  return {
    id,
    projectId,
    houseId,
    floor,
    floorName,
    roomNumber,
    status: 'available', // Default status
    price,
    type,
    size,
    balcony,
    // Adding tapuName and features as custom properties
    ...(tapuName && { tapuName }),
    ...(features && { features })
  };
};

// Sample rooms for Sarot Palace
export const SAMPLE_ROOMS: Room[] = [
  // A/Zemin floor sample room (1+1)
  createRoom(
    "1-1", // id
    SAROT_PALACE_PROJECT_ID, // projectId
    SAROT_PALACE_PROJECT_ID, // houseId
    1, // floor
    "A/Zemin", // floorName
    "A-16", // roomNumber
    100000, // price
    "1+1", // type
    "A/Zemin Bağımsız Bölüm 1", // tapuName
    60, // size
    true, // balcony
    ["Ekonomik", "Kompakt", "Aydınlık"] // features
  ),
  
  // A/1 floor sample room (3+1)
  createRoom(
    "1-57", // id
    SAROT_PALACE_PROJECT_ID, // projectId
    SAROT_PALACE_PROJECT_ID, // houseId
    2, // floor
    "A/1", // floorName
    "A1-1", // roomNumber
    150000, // price
    "3+1", // type
    "A/1 Bağımsız Bölüm 57", // tapuName
    100, // size
    true, // balcony
    ["Geniş Salon", "Aile Dairesi", "Manzaralı"] // features
  ),
  
  // A/2 floor sample room (1+1)
  createRoom(
    "1-115", // id
    SAROT_PALACE_PROJECT_ID, // projectId
    SAROT_PALACE_PROJECT_ID, // houseId
    3, // floor
    "A/2", // floorName
    "B-3", // roomNumber
    110000, // price
    "1+1", // type
    "A/2 Bağımsız Bölüm 115", // tapuName
    65, // size
    false, // balcony
    ["Ekonomik", "Kompakt"] // features
  ),
  
  // A/4 floor sample room (3+1)
  createRoom(
    "1-225", // id
    SAROT_PALACE_PROJECT_ID, // projectId
    SAROT_PALACE_PROJECT_ID, // houseId
    5, // floor
    "A/4", // floorName
    "D-1", // roomNumber
    170000, // price
    "3+1", // type
    "A/4 Nolu Bağımsız Bölüm 225", // tapuName
    105, // size
    true, // balcony
    ["Geniş Salon", "Aile Dairesi", "Yüksek Tavan"] // features
  ),
  
  // A/7+ÇATI floor sample room (Penthouse)
  createRoom(
    "1-393", // id
    SAROT_PALACE_PROJECT_ID, // projectId
    SAROT_PALACE_PROJECT_ID, // houseId
    8, // floor
    "A/7+ÇATI", // floorName
    "K-14", // roomNumber
    250000, // price
    "Penthouse", // type
    "A/7+ÇATI Bağımsız Bölüm 393", // tapuName
    120, // size
    true, // balcony
    ["Geniş Teras", "Manzaralı", "Yüksek Tavan", "Çatı Katı"] // features
  )
];

// Export all rooms (will be expanded later)
export const ALL_ROOMS: Room[] = [
  ...SAMPLE_ROOMS,
  // More rooms will be added here
];

// Helper functions
export const getRoomById = (roomId: string): Room | undefined => {
  return ALL_ROOMS.find(room => room.id === roomId);
};

export const getRoomsByProject = (projectId: string): Room[] => {
  return ALL_ROOMS.filter(room => room.projectId === projectId);
};

export const getRoomsByFloor = (projectId: string, floorName: string): Room[] => {
  return ALL_ROOMS.filter(room => room.projectId === projectId && room.floorName === floorName);
};

export const getRoomsByType = (projectId: string, type: string): Room[] => {
  return ALL_ROOMS.filter(room => room.projectId === projectId && room.type === type);
};
