export type UserRole = 'admin' | 'manager' | 'salesperson';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

// User request status types
export type UserRequestStatus = 'pending' | 'approved' | 'rejected';

// User request interface for authentication requests
export interface UserRequest {
  id: string;
  email: string;
  name: string;
  requestedRole: UserRole;
  status: UserRequestStatus;
  createdAt: string;
}

// House interface for different house types within projects
export interface House {
  id: string;
  name: string;
  projectId: string;
  description?: string;
  imageUrl?: string;
  floorCount: number;
  roomCount: number;
  price?: number;
  status?: 'available' | 'limited' | 'sold_out';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  roomCount: number;
  floorCount: number;
  imageUrl: string;
  image3dUrl: string;
  createdAt: string;
  images?: string[];
  houses?: House[];
  type: 'single' | 'multi'; // single = one house type, multi = multiple house types
}

export interface Room {
  id: string;
  projectId: string;
  houseId: string; 
  floor: number;
  roomNumber: string;
  status: 'available' | 'reserved' | 'sold';
  price: number;
  type?: string; // Room type like 1+1, 2+1, etc.
  size?: number; // Size in square meters
  balcony?: boolean; // Whether the room has a balcony
}

export interface RoomReservation {
  roomId: string;
  startDate: Date;
  endDate: Date;
}

export interface Customer {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  associatedProjectId: string;
  createdAt: string;
}

export interface SaleRecord {
  id: string;
  projectId: string;
  roomId: string;
  salespersonId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash';
  tax: number;
  createdAt: string;
  isCanceled?: boolean;
  cancellationReason?: string;
  cancellationDate?: string;
}

// New interface to represent a sale record with associated data
export interface SaleRecordWithDetails extends SaleRecord {
  project?: Project;
  room?: Room;
  customer?: Customer;
  salesperson?: User;
}
