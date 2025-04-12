
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PROJECTS, MOCK_ROOMS } from "@/data/projects";
import { SaleFormContainer } from "@/components/sales/SaleFormContainer";
import { getReservationsAsSales } from "@/data/salesRecordsFromReservations";
import { SaleRecordWithDetails } from "@/types";

export default function SaleForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saleId } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const roomId = searchParams.get('roomId');
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [saleData, setSaleData] = useState<SaleRecordWithDetails | null>(null);
  
  // Find sale by ID if in edit or view mode
  useEffect(() => {
    if (saleId) {
      const allSales = getReservationsAsSales();
      const foundSale = allSales.find(sale => sale.id === saleId);
      
      if (foundSale) {
        setSaleData(foundSale);
        // Check if we're in edit mode or view mode based on the URL path
        setIsEditMode(location.pathname.includes('/edit'));
        setIsViewMode(!location.pathname.includes('/edit'));
      } else {
        // Sale not found, redirect to sales list
        toast.error('Satış kaydı bulunamadı');
        navigate('/sales-records-updated');
      }
    }
  }, [saleId, location.pathname, navigate]);
  
  // Find room by ID (for new sale mode)
  const selectedRoom = roomId ? MOCK_ROOMS.find(r => r.id === roomId) : 
                      saleData ? MOCK_ROOMS.find(r => r.id === saleData.roomId) : null;
  const selectedProject = selectedRoom ? MOCK_PROJECTS.find(p => p.id === selectedRoom.projectId) : 
                         saleData ? MOCK_PROJECTS.find(p => p.id === saleData.projectId) : null;
  
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
            <CardTitle>
              {isViewMode ? 'Satış Detayları' : 
               isEditMode ? 'Satış Kaydını Düzenle' : 
               'Yeni Satış Kaydı'}
            </CardTitle>
            <CardDescription>
              {isViewMode ? 'Satış kaydı detaylarını görüntüle' : 
               isEditMode ? 'Mevcut satış kaydını düzenle' : 
               'Bir Oda İçin Yeni Satış Kaydı Gir'}
            </CardDescription>
          </CardHeader>
          
          <SaleFormContainer 
            selectedRoom={selectedRoom} 
            selectedProject={selectedProject}
            existingSale={saleData}
            isViewMode={isViewMode}
            isEditMode={isEditMode}
            onCancel={() => navigate(-1)}
            onSuccess={(projectId) => {
              toast.success(
                isEditMode 
                  ? "Satış kaydı başarıyla güncellendi" 
                  : "Satış kaydı başarıyla oluşturuldu", 
                {
                  description: isEditMode 
                    ? "Satış kaydı güncellendi" 
                    : "Oda başarıyla satıldı"
                }
              );
              navigate('/sales-records-updated');
            }}
          />
        </Card>
      </div>
    </MainLayout>
  );
}
