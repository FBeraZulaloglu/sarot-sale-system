
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CustomerNotes } from "@/components/customers/CustomerNotes";
import { CustomerProfile } from "@/components/customers/CustomerProfile";
import { MOCK_CUSTOMERS } from "@/data/customers";
import { MOCK_PROJECTS } from "@/data/projects";
import { generateAllRooms } from "@/data/salesRecordsFromReservations";
import { getCustomerPurchaseHistory } from "@/data/purchaseHistory";

export default function CustomerDetails() {
  const { customerId } = useParams<{ customerId: string }>();
  
  // Find the customer by ID
  const customer = MOCK_CUSTOMERS.find(c => c.id === customerId);
  
  // Generate all rooms for all projects
  const MOCK_ROOMS = generateAllRooms();
  
  // If customer not found, show an error message
  if (!customer) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Müşterilere Geri Dön
            </Link>
          </Button>
          <Card>
            <CardContent className="pt-6 bg-blue-50/50">
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold mb-2 text-blue-800">Müşteri Bulunamadı</h2>
                <p className="text-blue-600/70">
                  Aradığınız müşteri mevcut değil veya kaldırılmış.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Get sales records for this customer from data folder
  const customerSales = getCustomerPurchaseHistory(customer.id);
  
  // Get customer's associated projects
  const associatedProjects = MOCK_PROJECTS.filter(p => customer.associatedProjectIds.includes(p.id));

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 bg-blue-50/30 min-h-screen">
        <Button variant="outline" asChild className="mb-6 border-blue-300 hover:bg-blue-50 text-blue-700">
          <Link to="/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Müşterilere Geri Dön
          </Link>
        </Button>

        {/* Customer Profile */}
        <CustomerProfile 
          customer={customer} 
          associatedProjects={associatedProjects} 
          customerSales={customerSales}
          projects={MOCK_PROJECTS}
          rooms={MOCK_ROOMS} 
        />


        {/* Customer Notes Section */}
        <div className="mb-8">
          <CustomerNotes 
            customerId={customer.id} 
            customerName={`${customer.name} ${customer.surname}`} 
          />
        </div>
      </div>
    </MainLayout>
  );
}
