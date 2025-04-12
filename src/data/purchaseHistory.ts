import { SaleRecord, SaleRecordWithDetails } from "@/types";
import { MOCK_CUSTOMERS } from "./customers";
import { MOCK_PROJECTS } from "./projects";
import { generateAllRooms } from "./salesRecordsFromReservations";
import { MOCK_USERS } from "./users";

// Generate mock purchase history data
export const generateMockPurchaseHistory = (): SaleRecordWithDetails[] => {
  const rooms = generateAllRooms();
  const purchaseHistory: SaleRecordWithDetails[] = [];
  
  // Create 3-5 purchase records for each customer
  MOCK_CUSTOMERS.forEach((customer, customerIndex) => {
    // Number of purchases for this customer (3-5)
    const purchaseCount = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < purchaseCount; i++) {
      // Pick a project from customer's associated projects
      const projectId = customer.associatedProjectIds[i % customer.associatedProjectIds.length];
      const project = MOCK_PROJECTS.find(p => p.id === projectId);
      
      if (!project) continue;
      
      // Find rooms for this project
      const projectRooms = rooms.filter(r => r.projectId === projectId);
      
      if (projectRooms.length === 0) continue;
      
      // Pick a room
      const roomIndex = (customerIndex * i) % projectRooms.length;
      const room = projectRooms[roomIndex];
      
      // Generate a purchase date (between 1 and 24 months ago)
      const purchaseDate = new Date();
      purchaseDate.setMonth(purchaseDate.getMonth() - (1 + Math.floor(Math.random() * 24)));
      
      // Generate an end date (1 year after purchase date)
      const endDate = new Date(purchaseDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      // Pick a salesperson
      const salespersonIndex = (customerIndex + i) % MOCK_USERS.length;
      const salesperson = MOCK_USERS[salespersonIndex];
      
      // Generate a payment status
      const paymentStatuses: ('pending' | 'completed' | 'failed')[] = ['pending', 'completed', 'failed'];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * 3)];
      
      // Generate a payment method
      const paymentMethods: ('credit_card' | 'bank_transfer' | 'cash')[] = ['credit_card', 'bank_transfer', 'cash'];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * 3)];
      
      // Generate a unique ID
      const id = `purchase-${customerIndex}-${i}-${Date.now()}`;
      
      // Create the purchase record
      const purchaseRecord: SaleRecordWithDetails = {
        id,
        projectId,
        roomId: room.id,
        salespersonId: salesperson.id,
        customerId: customer.id,
        startDate: purchaseDate.toISOString(),
        endDate: endDate.toISOString(),
        amount: room.price,
        paymentStatus,
        paymentMethod,
        tax: Math.round(room.price * 0.18), // 18% tax
        createdAt: purchaseDate.toISOString(),
        isConfirmed: true,
        isCanceled: false,
        
        // Add associated objects
        project,
        room,
        customer,
        salesperson,
        saleDate: purchaseDate,
        house: project.houses ? project.houses[0] : undefined
      };
      
      purchaseHistory.push(purchaseRecord);
    }
  });
  
  return purchaseHistory;
};

// Generate the mock purchase history data
export const MOCK_PURCHASE_HISTORY = generateMockPurchaseHistory();

// Helper function to get purchase history for a specific customer
export const getCustomerPurchaseHistory = (customerId: string): SaleRecordWithDetails[] => {
  return MOCK_PURCHASE_HISTORY.filter(purchase => purchase.customerId === customerId);
};
