import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Authentication from "./pages/Authentication";
import ProjectDetails from "./pages/ProjectDetails";
import SaleForm from "./pages/SaleForm";
import SalesRecords from "./pages/SalesRecords";
import SalesRecordsUpdated from "./pages/SalesRecordsUpdated";
import CancellableSales from "./pages/CancellableSales";
import CancelSale from "./pages/CancelSale";
import NewSaleRecord from "./pages/NewSaleRecord";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import CustomerForm from "./pages/CustomerForm";
import UserManagement from "./pages/UserManagement";
import TapuList from "./pages/TapuList";
import TapuOperations from "./pages/TapuOperations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/projects/:projectId/new-sale" element={<NewSaleRecord />} />
            <Route path="/sales/new" element={<SaleForm />} />
            <Route path="/sales-records" element={<SalesRecords />} />
            <Route path="/sales-records-updated" element={<SalesRecordsUpdated />} />
            <Route path="/sales/:saleId" element={<SaleForm />} />
            <Route path="/sales/:saleId/edit" element={<SaleForm />} />
            <Route path="/cancellable-sales" element={<CancellableSales />} />
            <Route path="/cancel-sale/:saleId" element={<CancelSale />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:customerId" element={<CustomerDetails />} />
            <Route path="/tapu-islemleri" element={<TapuList />} />
            <Route path="/tapu-islemleri/new" element={<TapuOperations />} />
            <Route path="/tapu-islemleri/:id" element={<TapuOperations />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
