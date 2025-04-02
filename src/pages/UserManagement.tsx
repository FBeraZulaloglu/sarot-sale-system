
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserTable } from "@/components/users/UserTable";
import { UserRequestsTable } from "@/components/users/UserRequestsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserRole, UserRequest } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// Mock user requests data
const MOCK_USER_REQUESTS: UserRequest[] = [
  {
    id: "req1",
    email: "john.doe@hotel.com",
    name: "John Doe",
    requestedRole: "manager" as UserRole,
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "req2",
    email: "sarah.smith@hotel.com",
    name: "Sarah Smith",
    requestedRole: "salesperson" as UserRole,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "req3",
    email: "michael.brown@hotel.com",
    name: "Michael Brown",
    requestedRole: "manager" as UserRole,
    status: "approved",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: "req4",
    email: "jessica.white@hotel.com",
    name: "Jessica White",
    requestedRole: "salesperson" as UserRole,
    status: "rejected",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
];

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([
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
  ]);
  
  const [userRequests, setUserRequests] = useState<UserRequest[]>(MOCK_USER_REQUESTS);

  const handleApproveRequest = (requestId: string) => {
    setUserRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: "approved" } 
          : request
      )
    );
    
    // Find the approved request to add as a new user
    const approvedRequest = userRequests.find(request => request.id === requestId);
    if (approvedRequest && approvedRequest.status !== "approved") {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: approvedRequest.email,
        name: approvedRequest.name,
        role: approvedRequest.requestedRole,
        createdAt: new Date().toISOString(),
      };
      
      setUsers(prev => [...prev, newUser]);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setUserRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: "rejected" } 
          : request
      )
    );
  };

  console.log("User Management page rendered", { user });

  return (
    <MainLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and access requests for the hotel management system.
          </p>
        </div>

        <Tabs defaultValue="users" className="mt-6">
          <TabsList>
            <TabsTrigger value="users">Active Users</TabsTrigger>
            <TabsTrigger value="requests">
              Access Requests
              <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                {userRequests.filter(req => req.status === "pending").length}
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <UserTable users={users} currentUser={user} />
          </TabsContent>
          <TabsContent value="requests" className="mt-4">
            <UserRequestsTable 
              requests={userRequests} 
              onApprove={handleApproveRequest} 
              onReject={handleRejectRequest} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
