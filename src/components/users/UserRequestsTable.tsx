
import { UserRequest } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, formatDistance } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

interface UserRequestsTableProps {
  requests: UserRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function UserRequestsTable({ requests, onApprove, onReject }: UserRequestsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500 hover:bg-red-600">Admin</Badge>;
      case "manager":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Manager</Badge>;
      case "salesperson":
        return <Badge className="bg-green-500 hover:bg-green-600">Salesperson</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Requested Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.name}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{getRoleBadge(request.requestedRole)}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {format(new Date(request.createdAt), "MMM d, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistance(new Date(request.createdAt), new Date(), { addSuffix: true })}
                </div>
              </TableCell>
              <TableCell>
                {request.status === "pending" ? (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                      onClick={() => onApprove(request.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                      onClick={() => onReject(request.id)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No access requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
