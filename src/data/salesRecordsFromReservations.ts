import { SaleRecordWithDetails, Period, Season, Room } from "@/types";
import { MOCK_PROJECTS } from "./projects";
import { MOCK_CUSTOMERS } from "./customers";
import { MOCK_USERS } from "./users";
import { MOCK_RESERVATIONS } from "./reservations";
import { MOCK_PERIODS, MOCK_SEASONS, getPeriodByDate } from "./seasons";

/**
 * Generate rooms for all projects
 */
export function generateAllRooms(): Room[] {
  return MOCK_PROJECTS.flatMap(project => {
    const rooms = [];
    for (let floor = 1; floor <= project.floorCount; floor++) {
      for (let roomNum = 1; roomNum <= 10; roomNum++) {
        const roomId = `${project.id}-${floor}-${roomNum}`;
        rooms.push({
          id: roomId,
          projectId: project.id,
          houseId: project.houses && project.houses.length > 0 ? project.houses[0].id : project.id,
          floor,
          roomNumber: `${roomNum}`,
          status: 'available',
          price: 100000 + (floor * 10000) + (roomNum * 1000),
          type: roomNum % 3 === 0 ? '3+1' : roomNum % 2 === 0 ? '2+1' : '1+1',
          size: 50 + (roomNum * 10),
          balcony: roomNum % 2 === 0,
          floorName: project.id === '1' ? ['A KATI', 'B KATI', 'C KATI', 'D KATI', 'E KATI', 'F KATI', 'G KATI', 'H KATI'][floor - 1] : undefined
        });
      }
    }
    return rooms;
  });
}

// Generate all rooms once
const ALL_ROOMS = generateAllRooms();

// Store custom sale records
let CUSTOM_SALE_RECORDS: SaleRecordWithDetails[] = [];

/**
 * Add a new sale record to the system
 * @param saleData The sale record data to add
 * @returns The newly created sale record
 */
export function addSaleRecord(saleData: {
  projectId: string;
  roomId: string;
  customerId: string;
  salespersonId: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash';
  houseId?: string;
}): SaleRecordWithDetails {
  // Find the associated project
  const project = MOCK_PROJECTS.find(p => p.id === saleData.projectId);
  
  // Find the associated customer
  const customer = MOCK_CUSTOMERS.find(c => c.id === saleData.customerId);
  
  // Find the associated salesperson
  const salesperson = MOCK_USERS.find(u => u.id === saleData.salespersonId);
  
  // Find the house if it's a multi-house project
  const house = project?.houses?.find(h => h.id === saleData.houseId);
  
  // Find the room based on roomId
  const room = ALL_ROOMS.find(r => r.id === saleData.roomId);
  
  // Generate a unique ID for the new sale record
  const id = `sale-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create the current date
  const currentDate = new Date();
  
  // Find the period (dönem) based on the current date
  const period = getPeriodByDate(currentDate);
  
  // Find the season based on period
  const season = period ? MOCK_SEASONS.find(s => s.id === period.seasonId) : undefined;
  
  // Create the new sale record
  const newSaleRecord: SaleRecordWithDetails = {
    id,
    projectId: saleData.projectId,
    roomId: saleData.roomId,
    salespersonId: saleData.salespersonId,
    customerId: saleData.customerId,
    startDate: currentDate.toISOString(),
    endDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week later
    amount: saleData.amount,
    paymentStatus: saleData.paymentStatus,
    paymentMethod: saleData.paymentMethod,
    tax: Math.round(saleData.amount * 0.08), // 8% tax
    createdAt: currentDate.toISOString(),
    isConfirmed: true,
    isCanceled: false,
    // Add the associated objects
    project,
    customer,
    salesperson,
    house,
    room,
    period,
    season,
    saleDate: currentDate
  };
  
  // Add the new sale record to the custom sale records
  CUSTOM_SALE_RECORDS.push(newSaleRecord);
  
  return newSaleRecord;
}

/**
 * Convert reservations to sale records for display in the SalesRecords table
 * This provides a unified view of reservations as sale records
 */
export function getReservationsAsSales(): SaleRecordWithDetails[] {
  // Convert reservations to sale records
  const salesFromReservations = MOCK_RESERVATIONS.map(reservation => {
    // Find the associated project
    const project = MOCK_PROJECTS.find(p => p.id === reservation.projectId);
    
    // Find the associated customer - Map the customer ID format (c1, c2) to the actual format (1, 2)
    const customerIdNumber = reservation.customerId.replace('c', '');
    const customer = MOCK_CUSTOMERS.find(c => c.id === customerIdNumber);
    
    // Find the associated salesperson - Map the salesperson ID format (s1, s2) to the actual format (1, 2)
    const salespersonIdNumber = reservation.salespersonId.replace('s', '');
    const salesperson = MOCK_USERS.find(u => u.id === salespersonIdNumber);
    
    // Find the house if it's a multi-house project
    const house = project?.houses?.find(h => h.id === reservation.houseId);
    
    // Find the room based on roomId
    const room = ALL_ROOMS.find(r => r.id === reservation.roomId);
    
    // Find the period (dönem) based on the reservation date
    const period = getPeriodByDate(reservation.startDate);
    
    // Find the season based on period
    const season = period ? MOCK_SEASONS.find(s => s.id === period.seasonId) : undefined;
    
    // Sale date is the creation date of the reservation
    const saleDate = reservation.createdAt;
    
    // Convert reservation to sale record format
    return {
      id: reservation.id,
      projectId: reservation.projectId,
      roomId: reservation.roomId,
      salespersonId: reservation.salespersonId,
      customerId: reservation.customerId,
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      amount: reservation.amount,
      paymentStatus: reservation.paymentStatus,
      paymentMethod: reservation.paymentMethod,
      tax: reservation.tax,
      createdAt: reservation.createdAt.toISOString(),
      isConfirmed: reservation.isConfirmed || false,
      isCanceled: false,
      // Add the associated objects
      project,
      customer,
      salesperson,
      reservation,
      // Add house information for multi-house projects
      house,
      // Add room information
      room,
      // Add period and season information
      period,
      season,
      // Add sale date
      saleDate
    };
  });
  
  // Combine the sales from reservations with custom sale records
  return [...salesFromReservations, ...CUSTOM_SALE_RECORDS];
}
