import { SaleRecordWithDetails } from "@/types";
import { MOCK_PROJECTS } from "./projects";
import { MOCK_CUSTOMERS } from "./customers";
import { MOCK_USERS } from "./users";
import { MOCK_RESERVATIONS } from "./reservations";

/**
 * Convert reservations to sale records for display in the SalesRecords table
 * This provides a unified view of reservations as sale records
 */
export function getReservationsAsSales(): SaleRecordWithDetails[] {
  return MOCK_RESERVATIONS.map(reservation => {
    // Find the associated project
    const project = MOCK_PROJECTS.find(p => p.id === reservation.projectId);
    
    // Find the associated customer
    const customer = MOCK_CUSTOMERS.find(c => c.id === reservation.customerId);
    
    // Find the associated salesperson
    const salesperson = MOCK_USERS.find(u => u.id === reservation.salespersonId);
    
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
      reservation
    };
  });
}
