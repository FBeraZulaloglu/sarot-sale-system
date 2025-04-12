import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, User, ArrowRight, Mail, Phone, Building2 } from "lucide-react";
import { Customer } from "@/types";
import { MOCK_CUSTOMERS } from "@/data/customers";

// Project name mapping
const PROJECT_NAMES: Record<string, string> = {
  "1": "Burj Al Babas",
  "2": "Sarot Palace",
  "3": "Sarot Grand Resort & Spa",
  "4": "Sarot Boutique Hotel & Termal",
  "5": "Sarot Teras Evler",
  "6": "Sarot Bahçe Evleri",
};

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
      <div className="container mx-auto px-4 py-6 min-h-screen">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-1">Müşteriler</h1>
          <p className="text-muted-foreground">Tüm müşterileri görüntüleyin ve yönetin</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-semibold">Müşteri Arama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="İsim, e-posta veya telefon ile ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Aidat</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
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
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-100">
                              Ödendi
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-100">
                              Ödenmedi
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isCustomerActive(customer.id) ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-100">
                              Aktif
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-100">
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
                            Detaylar
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aramanızla eşleşen müşteri bulunamadı.
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
