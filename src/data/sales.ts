import { SaleRecord, SaleRecordWithDetails, Customer, User } from "@/types";
import { MOCK_PROJECTS, MOCK_ROOMS } from "./projects";
import { MOCK_RESERVATIONS } from "./reservations";

/**
 * Mock sales data for the Sarot Sale System
 * This data represents sales records with connections to projects, rooms, and reservations
 */

// Mock customers
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Ahmet",
    surname: "Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 555 123 4567",
    associatedProjectIds: ["1", "3"],
    createdAt: new Date(2023, 1, 15).toISOString()
  },
  {
    id: "c2",
    name: "Ayşe",
    surname: "Demir",
    email: "ayse.demir@example.com",
    phone: "+90 555 234 5678",
    associatedProjectIds: ["2"],
    createdAt: new Date(2023, 2, 20).toISOString()
  },
  {
    id: "c3",
    name: "Mehmet",
    surname: "Kaya",
    email: "mehmet.kaya@example.com",
    phone: "+90 555 345 6789",
    associatedProjectIds: ["1", "5"],
    createdAt: new Date(2023, 3, 10).toISOString()
  },
  {
    id: "c4",
    name: "Zeynep",
    surname: "Şahin",
    email: "zeynep.sahin@example.com",
    phone: "+90 555 456 7890",
    associatedProjectIds: ["3", "4"],
    createdAt: new Date(2023, 4, 5).toISOString()
  },
  {
    id: "c5",
    name: "Mustafa",
    surname: "Çelik",
    email: "mustafa.celik@example.com",
    phone: "+90 555 567 8901",
    associatedProjectIds: ["2", "5"],
    createdAt: new Date(2023, 5, 12).toISOString()
  }
];

// Mock salespeople
export const MOCK_SALESPEOPLE: User[] = [
  {
    id: "s1",
    name: "Ali",
    surname: "Yıldız",
    email: "ali.yildiz@sarot.com",
    role: "salesperson",
    createdAt: new Date(2022, 1, 10).toISOString()
  },
  {
    id: "s2",
    name: "Fatma",
    surname: "Öztürk",
    email: "fatma.ozturk@sarot.com",
    role: "salesperson",
    createdAt: new Date(2022, 2, 15).toISOString()
  },
  {
    id: "s3",
    name: "Hasan",
    surname: "Aydın",
    email: "hasan.aydin@sarot.com",
    role: "salesperson",
    createdAt: new Date(2022, 3, 20).toISOString()
  }
];

// Generate sale records based on MOCK_PROJECTS, MOCK_ROOMS, and MOCK_RESERVATIONS
export const MOCK_SALES: SaleRecord[] = [
  // Sales for Sarot Palace (Project ID: 1)
  {
    id: "sale-1",
    projectId: "1",
    roomId: "1-1-01", // Format: projectId-floor-roomNumber
    salespersonId: "s1",
    customerId: "c1",
    startDate: new Date(2023, 6, 1).toISOString(),
    endDate: new Date(2023, 6, 15).toISOString(),
    amount: 250000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 18000,
    createdAt: new Date(2023, 5, 25).toISOString(),
    isConfirmed: true
  },
  {
    id: "sale-2",
    projectId: "1",
    roomId: "1-2-05",
    salespersonId: "s2",
    customerId: "c3",
    startDate: new Date(2023, 7, 10).toISOString(),
    endDate: new Date(2023, 7, 25).toISOString(),
    amount: 320000,
    paymentStatus: "completed",
    paymentMethod: "credit_card",
    tax: 22000,
    createdAt: new Date(2023, 6, 15).toISOString(),
    isConfirmed: true
  },
  
  // Sales for Sarot Teras Evler (Project ID: 2)
  {
    id: "sale-3",
    projectId: "2",
    roomId: "2-3-12",
    salespersonId: "s3",
    customerId: "c2",
    startDate: new Date(2023, 8, 5).toISOString(),
    endDate: new Date(2023, 8, 20).toISOString(),
    amount: 280000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 19600,
    createdAt: new Date(2023, 7, 25).toISOString(),
    isConfirmed: true
  },
  
  // Sales for Sarot Termal Vadi (Project ID: 3) - Multi-house project
  {
    id: "sale-4",
    projectId: "3",
    roomId: "3-1-1-02", // Format: projectId-houseId-floor-roomNumber
    salespersonId: "s1",
    customerId: "c4",
    startDate: new Date(2023, 9, 1).toISOString(),
    endDate: new Date(2023, 9, 15).toISOString(),
    amount: 350000,
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    tax: 24500,
    createdAt: new Date(2023, 8, 20).toISOString(),
    isConfirmed: false
  },
  {
    id: "sale-5",
    projectId: "3",
    roomId: "3-5-2-03",
    salespersonId: "s2",
    customerId: "c4",
    startDate: new Date(2023, 10, 10).toISOString(),
    endDate: new Date(2023, 10, 25).toISOString(),
    amount: 420000,
    paymentStatus: "completed",
    paymentMethod: "cash",
    tax: 29400,
    createdAt: new Date(2023, 9, 30).toISOString(),
    isConfirmed: true
  },
  
  // Canceled sale
  {
    id: "sale-6",
    projectId: "5",
    roomId: "5-1-08",
    salespersonId: "s3",
    customerId: "c5",
    startDate: new Date(2023, 11, 5).toISOString(),
    endDate: new Date(2023, 11, 20).toISOString(),
    amount: 300000,
    paymentStatus: "failed",
    paymentMethod: "credit_card",
    tax: 21000,
    createdAt: new Date(2023, 10, 25).toISOString(),
    isConfirmed: false,
    isCanceled: true,
    cancellationReason: "Payment issues",
    cancellationDate: new Date(2023, 10, 28).toISOString()
  }
];

// Function to enrich sale records with associated data
export function getSalesWithDetails(): SaleRecordWithDetails[] {
  return MOCK_SALES.map(sale => {
    // Find associated project
    const project = MOCK_PROJECTS.find(p => p.id === sale.projectId);
    
    // Find associated room
    const room = MOCK_ROOMS.find(r => r.id === sale.roomId);
    
    // Find associated customer
    const customer = MOCK_CUSTOMERS.find(c => c.id === sale.customerId);
    
    // Find associated salesperson
    const salesperson = MOCK_SALESPEOPLE.find(s => s.id === sale.salespersonId);
    
    // Find associated reservation if any
    const reservation = MOCK_RESERVATIONS.find(
      r => r.roomId === sale.roomId && 
      new Date(r.startDate).toISOString() === sale.startDate && 
      new Date(r.endDate).toISOString() === sale.endDate
    );
    
    return {
      ...sale,
      project,
      room,
      customer,
      salesperson,
      // Include the full reservation object if found
      reservation
    };
  });
}

// Function to get sales by project
export function getSalesByProject(projectId: string): SaleRecordWithDetails[] {
  return getSalesWithDetails().filter(sale => sale.projectId === projectId);
}

// Function to get sales by customer
export function getSalesByCustomer(customerId: string): SaleRecordWithDetails[] {
  return getSalesWithDetails().filter(sale => sale.customerId === customerId);
}

// Function to get sales by salesperson
export function getSalesBySalesperson(salespersonId: string): SaleRecordWithDetails[] {
  return getSalesWithDetails().filter(sale => sale.salespersonId === salespersonId);
}

// Function to get sales by room
export function getSalesByRoom(roomId: string): SaleRecordWithDetails[] {
  return getSalesWithDetails().filter(sale => sale.roomId === roomId);
}

// Function to create a new sale record and add it to MOCK_SALES
export function createSaleRecord(saleData: Omit<SaleRecord, 'id' | 'createdAt'>): SaleRecord {
  // Generate a new unique ID for the sale
  const newId = `sale-${MOCK_SALES.length + 1}`;
  
  // Process payment methods if they exist
  let paymentMethods = undefined;
  if (saleData.paymentMethods) {
    paymentMethods = saleData.paymentMethods;
  } else if (typeof saleData.paymentMethod === 'string' && saleData.amount) {
    // Create a single payment method from the legacy fields if no payment methods array
    paymentMethods = [
      {
        type: saleData.paymentMethod as 'cash' | 'credit_card' | 'bank_transfer',
        amount: saleData.amount,
        date: new Date().toISOString().split('T')[0]
      }
    ];
  }
  
  // Create the new sale record with current timestamp
  const newSale: SaleRecord = {
    ...saleData,
    id: newId,
    paymentMethods,
    createdAt: new Date().toISOString(),
  };
  
  // Add the new sale to the MOCK_SALES array
  MOCK_SALES.push(newSale);
  
  // Also create a reservation if one doesn't exist yet
  const existingReservation = MOCK_RESERVATIONS.find(
    r => r.roomId === saleData.roomId && 
    new Date(r.startDate).toISOString() === saleData.startDate && 
    new Date(r.endDate).toISOString() === saleData.endDate
  );
  
  if (!existingReservation) {
    // Import is at the top, so we can use MOCK_RESERVATIONS directly
    MOCK_RESERVATIONS.push({
      id: `reservation-${MOCK_RESERVATIONS.length + 1}`,
      roomId: saleData.roomId,
      projectId: saleData.projectId,
      houseId: saleData.roomId.split('-')[1], // Extract houseId from roomId
      salespersonId: saleData.salespersonId,
      customerId: saleData.customerId,
      startDate: new Date(saleData.startDate),
      endDate: new Date(saleData.endDate),
      periodId: '', // This would need to be determined based on the dates
      seasonId: '', // This would need to be determined based on the dates
      amount: saleData.amount,
      paymentStatus: saleData.paymentStatus,
      paymentMethod: saleData.paymentMethod,
      tax: saleData.tax,
      createdAt: new Date(),
      isConfirmed: saleData.isConfirmed || false
    });
  }
  
  // Update the room status to 'sold'
  const roomToUpdate = MOCK_ROOMS.find(room => room.id === saleData.roomId);
  if (roomToUpdate) {
    roomToUpdate.status = 'sold';
  }
  
  return newSale;
}
