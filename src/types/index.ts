export type UserRole = 'admin' | 'manager' | 'salesperson';

export interface User {
  id: string;
  email: string;
  name: string;
  surname?: string; // Added surname field
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
  createdAt: string;
  images?: string[];
  houses?: House[];
  videoUrl?: string;
  type: 'single' | 'multi' | 'hotel'; // single = one house type, multi = multiple house types, hotel = hotel project
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
  floorName?: string; // Optional floor name (e.g., 'A KATI', 'B KATI', etc. for Sarot Palace)
}

export interface Season {
  id: string;
  name: string; // e.g., "Summer 2023", "Winter 2023-2024"
  season_start: Date;
  season_end: Date;
  periods: Period[];
}

export interface Period {
  id: string;
  name: string; // e.g., "Dönem 27"
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  seasonId: string;
}

export interface RoomReservation {
  id: string;
  roomId: string;
  projectId: string;
  houseId: string;
  salespersonId: string;
  customerId: string;
  startDate: Date;
  endDate: Date;
  periodId: string;
  seasonId: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash';
  tax: number;
  createdAt: Date;
  isConfirmed?: boolean;
  isCanceled?: boolean;
  cancellationReason?: string;
  cancellationDate?: Date;
}

export interface Customer {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  associatedProjectIds: string[]; // Changed from single associatedProjectId to array
  createdAt: string;
}

export interface PaymentMethod {
  type: 'cash' | 'credit_card' | 'bank_transfer' | 'installment' | 'check';
  amount: number;
  date: string;
  installmentCount?: string; // Number of installments for installment or bank transfer payments
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
  paymentMethods?: PaymentMethod[]; // Multiple payment methods
  tax: number;
  createdAt: string;
  isConfirmed?: boolean; // Added isConfirmed field for sale confirmation status
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
  reservation?: RoomReservation; // Added reservation information
  period?: Period; // Period (Dönem) information
  season?: Season; // Season information
  saleDate?: Date; // Sale date (Satış Tarihi)
  house?: House; // House information for multi-house projects
}

export type TapuStatus = 'pending' | 'completed' | 'canceled';

export interface Tapu {
  id: string;
  customerId: string;
  projectId: string;
  roomId: string;
  tapuNo: string;
  tapuDate: string;
  donem: string; // Period (Dönem)
  week?: string;
  tapuBedeli: number; // Deed fee
  ipotekli: boolean; // Mortgaged
  ipotekBedeli?: number; // Mortgage amount
  tapuVerildi: boolean; // Deed delivered
  faturaKesildi: boolean; // Invoice issued
  alacaklarTemlikSozlesmesi: boolean; // Assignment of receivables agreement
  odemeninTamamlandiginaDairBelge: boolean; // Payment completion document
  fotografliVekaletname: boolean; // Photographed power of attorney
  sozlesmeVeEkleriGerilAlindi: boolean; // Contract and attachments returned
  tapuMasrafi: boolean; // Deed expenses
  onay: boolean; // Approval
  aciklama?: string; // Notes/explanation
  createdAt: string;
}
