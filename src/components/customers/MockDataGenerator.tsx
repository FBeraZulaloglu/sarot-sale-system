
import { Customer, SaleRecord, Project, Room } from "@/types";

// Function to generate mock rooms
export const generateMockRooms = (projectId: string, floorCount: number): Room[] => {
  const rooms: Room[] = [];
  // Generate rooms for each floor
  for (let floor = 1; floor <= floorCount; floor++) {
    // Generate 5 rooms per floor for simplicity
    for (let room = 1; room <= 5; room++) {
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

// Generate mock sales for a specific customer
export const generateCustomerSales = (customerId: string, projects: Project[], rooms: Room[]): SaleRecord[] => {
  const sales: SaleRecord[] = [];
  
  // Determine how many purchases this customer has made (1-5)
  const purchaseCount = Math.floor(Math.random() * 5) + 1;
  
  for (let i = 0; i < purchaseCount; i++) {
    // Randomly select a project
    const projectId = projects[Math.floor(Math.random() * projects.length)].id;
    
    // Find a sold room from that project or create one
    const projectRooms = rooms.filter(room => room.projectId === projectId);
    const room = projectRooms[Math.floor(Math.random() * projectRooms.length)];
    
    // Create a sale date (within the last year)
    const saleDate = new Date();
    saleDate.setDate(saleDate.getDate() - Math.floor(Math.random() * 365));
    
    sales.push({
      id: `sale-${customerId}-${i}`,
      projectId,
      roomId: room.id,
      customerId,
      salespersonId: `salesperson-${Math.floor(Math.random() * 3) + 1}`,
      startDate: saleDate.toISOString(),
      endDate: saleDate.toISOString(),
      amount: room.price,
      paymentStatus: ['pending', 'completed', 'failed'][Math.floor(Math.random() * 3)] as 'pending' | 'completed' | 'failed',
      paymentMethod: ['credit_card', 'bank_transfer', 'cash'][Math.floor(Math.random() * 3)] as 'credit_card' | 'bank_transfer' | 'cash',
      tax: room.price * 0.18, // 18% tax
      createdAt: saleDate.toISOString(),
    });
  }
  
  return sales;
};
