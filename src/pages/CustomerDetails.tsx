
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CustomerNotes } from "@/components/customers/CustomerNotes";
import { CustomerProfile } from "@/components/customers/CustomerProfile";
import { PurchaseHistory } from "@/components/customers/PurchaseHistory";
import { MOCK_CUSTOMERS, MOCK_PROJECTS } from "@/components/customers/MockData";
import { generateMockRooms, generateCustomerSales } from "@/components/customers/MockDataGenerator";

export default function CustomerDetails() {
  const { customerId } = useParams<{ customerId: string }>();
  
  // Find the customer by ID
  const customer = MOCK_CUSTOMERS.find(c => c.id === customerId);
  
  // Generate all rooms for all projects
  const MOCK_ROOMS = MOCK_PROJECTS.flatMap(project => 
    generateMockRooms(project.id, project.floorCount)
  );
  
  // If customer not found, show an error message
  if (!customer) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Link>
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold mb-2">Customer Not Found</h2>
                <p className="text-muted-foreground">
                  The customer you are looking for does not exist or has been removed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Generate mock sales for this customer
  const customerSales = generateCustomerSales(customer.id, MOCK_PROJECTS, MOCK_ROOMS);
  
  // Get customer's associated projects
  const associatedProjects = MOCK_PROJECTS.filter(p => customer.associatedProjectIds.includes(p.id));

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
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

        {/* Purchase History */}
        <PurchaseHistory 
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
