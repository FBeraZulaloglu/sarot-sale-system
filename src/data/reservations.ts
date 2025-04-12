import { RoomReservation } from "@/types";
import { MOCK_CUSTOMERS, MOCK_SALESPEOPLE } from "./sales";
import { MOCK_PERIODS, MOCK_SEASONS } from "./seasons";

/**
 * Mock reservation data for date filtering in the Sarot Sale System
 * This data represents room reservations for specific date ranges with customer, project, and house information
 * aligned with the SaleRecord structure
 */
export const MOCK_RESERVATIONS: RoomReservation[] = [
  // Project 1 - Sarot Palace reservations
  { 
    id: "res-001",
    roomId: "1-101", 
    projectId: "1", 
    houseId: "1-0", // Main building
    customerId: "c1",
    salespersonId: "s1",
    startDate: new Date(2024, 5, 29), // June 29, 2024
    endDate: new Date(2024, 6, 5),    // July 5, 2024
    periodId: "period-27",
    seasonId: "season-3",
    amount: 250000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 18000,
    createdAt: new Date(2024, 5, 15),
    isConfirmed: true
  },
  { 
    id: "res-002",
    roomId: "1-102", 
    projectId: "1", 
    houseId: "1-0",
    customerId: "c2",
    salespersonId: "s2",
    startDate: new Date(2024, 6, 6),  // July 6, 2024
    endDate: new Date(2024, 6, 12),   // July 12, 2024
    periodId: "period-28",
    seasonId: "season-3",
    amount: 320000,
    paymentStatus: "completed",
    paymentMethod: "credit_card",
    tax: 22000,
    createdAt: new Date(2024, 5, 20),
    isConfirmed: true
  },
  { 
    id: "res-003",
    roomId: "1-103", 
    projectId: "1", 
    houseId: "1-0",
    customerId: "c3",
    salespersonId: "s3",
    startDate: new Date(2024, 6, 27),  // July 27, 2024
    endDate: new Date(2024, 7, 2),    // August 2, 2024
    periodId: "period-31",
    seasonId: "season-3",
    amount: 280000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 19600,
    createdAt: new Date(2024, 6, 10),
    isConfirmed: true
  },
  
  // Project 2 - Sarot Thermal Park - House 1
  { 
    id: "res-004",
    roomId: "2-101", 
    projectId: "2", 
    houseId: "2-1", // House A
    customerId: "c4",
    salespersonId: "s1",
    startDate: new Date(2024, 5, 29),  // June 29, 2024
    endDate: new Date(2024, 6, 5),    // July 5, 2024
    periodId: "period-27",
    seasonId: "season-3",
    amount: 350000,
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    tax: 24500,
    createdAt: new Date(2024, 5, 15),
    isConfirmed: false
  },
  { 
    id: "res-005",
    roomId: "2-102", 
    projectId: "2", 
    houseId: "2-1",
    customerId: "c5",
    salespersonId: "s2",
    startDate: new Date(2024, 7, 3),   // August 3, 2024
    endDate: new Date(2024, 7, 9),    // August 9, 2024
    periodId: "period-32",
    seasonId: "season-3",
    amount: 420000,
    paymentStatus: "completed",
    paymentMethod: "cash",
    tax: 29400,
    createdAt: new Date(2024, 6, 15),
    isConfirmed: true
  },
  
  // Project 2 - Sarot Thermal Park - House 2
  { 
    id: "res-006",
    roomId: "2-103", 
    projectId: "2", 
    houseId: "2-2", // House B
    customerId: "c1", // Returning customer
    salespersonId: "s3",
    startDate: new Date(2024, 7, 24),  // August 24, 2024
    endDate: new Date(2024, 7, 30),   // August 30, 2024
    periodId: "period-35",
    seasonId: "season-3",
    amount: 300000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 21000,
    createdAt: new Date(2024, 7, 1),
    isConfirmed: true
  },
  { 
    id: "res-007",
    roomId: "3-101", 
    projectId: "3", 
    houseId: "3-0",
    customerId: "c2",
    salespersonId: "s1",
    startDate: new Date(2024, 6, 13),  // July 13, 2024
    endDate: new Date(2024, 6, 19),   // July 19, 2024
    periodId: "period-29",
    seasonId: "season-3",
    amount: 275000,
    paymentStatus: "completed",
    paymentMethod: "credit_card",
    tax: 19250,
    createdAt: new Date(2024, 5, 30),
    isConfirmed: true
  },
  
  // Project 3 - Sarot Termal Residence
  { 
    id: "res-008",
    roomId: "3-102", 
    projectId: "3", 
    houseId: "3-0",
    customerId: "c3",
    salespersonId: "s2",
    startDate: new Date(2024, 6, 27),  // July 27, 2024
    endDate: new Date(2024, 7, 2),    // August 2, 2024
    periodId: "period-31",
    seasonId: "season-3",
    amount: 290000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 20300,
    createdAt: new Date(2024, 6, 10),
    isConfirmed: true
  },
  { 
    id: "res-009",
    roomId: "4-101", 
    projectId: "4", 
    houseId: "4-0",
    customerId: "c4",
    salespersonId: "s3",
    startDate: new Date(2024, 8, 1),   // September 1, 2024
    endDate: new Date(2024, 8, 7),    // September 7, 2024
    periodId: "period-36",
    seasonId: "season-4",
    amount: 310000,
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    tax: 21700,
    createdAt: new Date(2024, 7, 15),
    isConfirmed: false
  },
  
  // Fall and Winter reservations
  { 
    id: "res-010",
    roomId: "5-101", 
    projectId: "5", 
    houseId: "5-0",
    customerId: "c5",
    salespersonId: "s1",
    startDate: new Date(2024, 9, 1),   // October 1, 2024
    endDate: new Date(2024, 9, 7),    // October 7, 2024
    periodId: "period-40",
    seasonId: "season-4",
    amount: 265000,
    paymentStatus: "completed",
    paymentMethod: "credit_card",
    tax: 18550,
    createdAt: new Date(2024, 8, 15),
    isConfirmed: true
  },
  { 
    id: "res-011",
    roomId: "6-101", 
    projectId: "6", 
    houseId: "6-0",
    customerId: "c1", // Same customer as first reservation
    salespersonId: "s2",
    startDate: new Date(2024, 10, 5),  // November 5, 2024
    endDate: new Date(2024, 10, 11),  // November 11, 2024
    periodId: "period-45",
    seasonId: "season-4",
    amount: 240000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 16800,
    createdAt: new Date(2024, 9, 20),
    isConfirmed: true
  },
  
  // Multi-house project reservations
  { 
    id: "res-012",
    roomId: "2-0-101", 
    projectId: "2", 
    houseId: "2-0", // Main building
    customerId: "c2", // Returning customer
    salespersonId: "s3",
    startDate: new Date(2024, 5, 29),  // June 29, 2024
    endDate: new Date(2024, 6, 5),    // July 5, 2024
    periodId: "period-27",
    seasonId: "season-3",
    amount: 260000,
    paymentStatus: "completed",
    paymentMethod: "credit_card",
    tax: 18200,
    createdAt: new Date(2024, 5, 1),
    isConfirmed: true
  },
  { 
    id: "res-013",
    roomId: "2-1-102", 
    projectId: "2", 
    houseId: "2-1", // House A
    customerId: "c3",
    salespersonId: "s1",
    startDate: new Date(2024, 6, 27),  // July 27, 2024
    endDate: new Date(2024, 7, 2),    // August 2, 2024
    periodId: "period-31",
    seasonId: "season-3",
    amount: 285000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 19950,
    createdAt: new Date(2024, 6, 10),
    isConfirmed: true
  },
  { 
    id: "res-014",
    roomId: "3-1-103", 
    projectId: "3", 
    houseId: "3-1", // House A
    customerId: "c4",
    salespersonId: "s2",
    startDate: new Date(2024, 8, 1),   // September 1, 2024
    endDate: new Date(2024, 8, 7),    // September 7, 2024
    periodId: "period-36",
    seasonId: "season-4",
    amount: 295000,
    paymentStatus: "pending",
    paymentMethod: "credit_card",
    tax: 20650,
    createdAt: new Date(2024, 7, 15),
    isConfirmed: false
  },
  { 
    id: "res-015",
    roomId: "5-1-104", 
    projectId: "5", 
    houseId: "5-1", // House A
    customerId: "c5",
    salespersonId: "s3",
    startDate: new Date(2024, 9, 1),   // October 1, 2024
    endDate: new Date(2024, 9, 7),    // October 7, 2024
    periodId: "period-40",
    seasonId: "season-4",
    amount: 270000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 18900,
    createdAt: new Date(2024, 8, 15),
    isConfirmed: true
  },
  { 
    id: "res-016",
    roomId: "6-1-105", 
    projectId: "6", 
    houseId: "6-1", // House A
    customerId: "c1",
    salespersonId: "s1",
    startDate: new Date(2024, 10, 5),  // November 5, 2024
    endDate: new Date(2024, 10, 11),  // November 11, 2024
    periodId: "period-45",
    seasonId: "season-4",
    amount: 245000,
    paymentStatus: "completed",
    paymentMethod: "credit_card",
    tax: 17150,
    createdAt: new Date(2024, 9, 20),
    isConfirmed: true
  },
  
  // Winter reservations (December - February)
  { 
    id: "res-017",
    roomId: "1-201", 
    projectId: "1", 
    houseId: "1-0",
    customerId: "c2",
    salespersonId: "s2",
    startDate: new Date(2023, 11, 22), // December 22, 2023
    endDate: new Date(2023, 11, 28),  // December 28, 2023
    periodId: "period-51",
    seasonId: "season-1",
    amount: 230000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 16100,
    createdAt: new Date(2023, 10, 15),
    isConfirmed: true
  },
  { 
    id: "res-018",
    roomId: "2-202", 
    projectId: "2", 
    houseId: "2-0",
    customerId: "c3",
    salespersonId: "s3",
    startDate: new Date(2024, 0, 5),   // January 5, 2024
    endDate: new Date(2024, 0, 11),   // January 11, 2024
    periodId: "period-1",
    seasonId: "season-1",
    amount: 255000,
    paymentStatus: "completed",
    paymentMethod: "credit_card",
    tax: 17850,
    createdAt: new Date(2023, 11, 15),
    isConfirmed: true
  },
  { 
    id: "res-019",
    roomId: "3-203", 
    projectId: "3", 
    houseId: "3-0",
    customerId: "c4",
    salespersonId: "s1",
    startDate: new Date(2024, 1, 9),   // February 9, 2024
    endDate: new Date(2024, 1, 15),   // February 15, 2024
    periodId: "period-6",
    seasonId: "season-1",
    amount: 265000,
    paymentStatus: "completed",
    paymentMethod: "bank_transfer",
    tax: 18550,
    createdAt: new Date(2024, 0, 5),
    isConfirmed: true
  },
  
  // Spring reservations (March - May)
  { 
    id: "res-020",
    roomId: "4-204", 
    projectId: "4", 
    houseId: "4-0",
    customerId: "c5",
    salespersonId: "s2",
    startDate: new Date(2024, 2, 15),  // March 15, 2024
    endDate: new Date(2024, 2, 21),   // March 21, 2024
    periodId: "period-11",
    seasonId: "season-2",
    amount: 280000,
    paymentStatus: "completed",
    paymentMethod: "credit_card",
    tax: 19600,
    createdAt: new Date(2024, 1, 10),
    isConfirmed: true
  }
];
