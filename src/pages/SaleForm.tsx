
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PROJECTS, MOCK_ROOMS, getAllMockRooms, generateMockRooms } from "@/components/sales/mockData";
import { SaleFormContainer } from "@/components/sales/SaleFormContainer";

export default function SaleForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const roomId = searchParams.get('roomId');
  
  // Find room by ID
  const selectedRoom = roomId ? MOCK_ROOMS.find(r => r.id === roomId) : null;
  const selectedProject = selectedRoom ? MOCK_PROJECTS.find(p => p.id === selectedRoom.projectId) : null;
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <div onClick={() => navigate(-1)} className="flex items-center gap-1 cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
            Back
          </div>
        </Button>
        
        <Card className="shadow-md animate-fade-in">
          <CardHeader>
            <CardTitle>New Sale Record</CardTitle>
            <CardDescription>
              Create a new sale record for a room
            </CardDescription>
          </CardHeader>
          
          <SaleFormContainer 
            selectedRoom={selectedRoom} 
            selectedProject={selectedProject}
            onCancel={() => navigate(-1)}
            onSuccess={(projectId) => {
              toast.success("Sale record created successfully", {
                description: "The room has been marked as sold"
              });
              navigate(`/projects/${projectId}`);
            }}
          />
        </Card>
      </div>
    </MainLayout>
  );
}
