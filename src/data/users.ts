import { User } from "@/types";

// Mock users (salespersons)
export const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@hotel.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "manager@hotel.com",
    name: "Manager User",
    role: "manager",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "sales@hotel.com",
    name: "Sales User",
    role: "salesperson",
    createdAt: new Date().toISOString(),
  },
];
