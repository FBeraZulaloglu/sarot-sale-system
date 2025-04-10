import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, User, ArrowRight, Mail, Phone, Plus, Building2 } from "lucide-react";
import { Customer } from "@/types";

// Project name mapping
const PROJECT_NAMES: Record<string, string> = {
  "1": "Burj Al Babas",
  "2": "Sarot Palace",
  "3": "Sarot Grand Resort & Spa",
  "4": "Sarot Boutique Hotel & Termal",
  "5": "Sarot Teras Evler",
  "6": "Sarot Bahçe Evleri",
};

// Mock customers data (using the same data from SalesRecords.tsx)
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    associatedProjectIds: ["1", "3"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane",
    surname: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    associatedProjectIds: ["2", "5"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Robert",
    surname: "Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 456-7890",
    associatedProjectIds: ["1"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Emily",
    surname: "Williams",
    email: "emily.w@example.com",
    phone: "+1 (555) 234-5678",
    associatedProjectIds: ["3", "4"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Michael",
    surname: "Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 876-5432",
    associatedProjectIds: ["2", "6"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Sarah",
    surname: "Davis",
    email: "sarah.d@example.com",
    phone: "+1 (555) 345-6789",
    associatedProjectIds: ["4", "1"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "David",
    surname: "Miller",
    email: "david.m@example.com",
    phone: "+1 (555) 765-4321",
    associatedProjectIds: ["5", "3"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Jennifer",
    surname: "Wilson",
    email: "jennifer.w@example.com",
    phone: "+1 (555) 432-1098",
    associatedProjectIds: ["6", "2", "4"],
    createdAt: new Date().toISOString(),
  },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Function to determine if a customer is active
  const isCustomerActive = (customerId: string) => {
    // Simple logic for demo - customers with ID divisible by 3 are inactive
    const id = parseInt(customerId);
    return !isNaN(id) && id % 3 !== 0;
  };

  // Get project name by ID - keeping this for reference
  const getProjectName = (projectId: string) => {
    return PROJECT_NAMES[projectId] || "Unknown Project";
  };
  
  // Check if customer has paid dues
  const hasPaidDues = (customerId: string) => {
    // Using a simple algorithm based on customer ID for demo purposes
    // In a real app, this would check a payment status from the database
    const id = parseInt(customerId);
    return !isNaN(id) && id % 2 === 0;
  };

  // Filter customers based on search query
  const filteredCustomers = MOCK_CUSTOMERS.filter((customer) => {
    const fullName = `${customer.name} ${customer.surname}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return (
      fullName.includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchQuery)
    );
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Customers</h1>
          <Button onClick={() => navigate("/customers/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Customer
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or phone..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Aidat</TableHead>
                  <TableHead>Aktif</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span>
                            {customer.name} {customer.surname}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {customer.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {hasPaidDues(customer.id) ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Ödendi
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Ödenmedi
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isCustomerActive(customer.id) ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Aktif
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Pasif
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex items-center gap-1"
                        >
                          <Link to={`/customers/${customer.id}`}>
                            View History
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No customers found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
