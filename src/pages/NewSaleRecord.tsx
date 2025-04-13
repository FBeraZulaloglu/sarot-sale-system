import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PROJECTS, MOCK_ROOMS } from "@/data/projects";
import { SaleFormContainer } from "@/components/sales/SaleFormContainer";
import { SaleRecordWithDetails } from "@/types";

export default function NewSaleRecord() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  
  // Find room by ID (for new sale mode)
  const selectedRoom = roomId ? MOCK_ROOMS.find(r => r.id === roomId) : null;
  const selectedProject = selectedRoom ? MOCK_PROJECTS.find(p => p.id === selectedRoom.projectId) : 
                         projectId ? MOCK_PROJECTS.find(p => p.id === projectId) : null;
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <div onClick={() => navigate(-1)} className="flex items-center gap-1 cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
            Geri
          </div>
        </Button>
        
        <Card className="shadow-md animate-fade-in">
          <CardHeader>
            <CardTitle>Yeni Satış Kaydı</CardTitle>
            <CardDescription>
              Bir Oda İçin Yeni Satış Kaydı Gir
            </CardDescription>
          </CardHeader>
          
          <SaleFormContainer 
            selectedRoom={selectedRoom} 
            selectedProject={selectedProject}
            existingSale={null}
            isViewMode={false}
            isEditMode={false}
            onCancel={() => navigate(-1)}
            onSuccess={(projectId) => {
              toast.success("Satış kaydı başarıyla oluşturuldu", {
                description: "Oda başarıyla satıldı"
              });
              navigate('/sales-records-updated');
            }}
          />
        </Card>
      </div>
    </MainLayout>
  );
}
