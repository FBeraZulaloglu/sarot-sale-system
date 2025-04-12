import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function UpdatedSalesRecordsButton() {
  const navigate = useNavigate();
  
  return (
    <Button 
      onClick={() => navigate('/sales-records-updated')} 
      variant="outline" 
      className="flex items-center gap-1"
    >
      <span>Güncellenmiş Kayıtlar</span>
    </Button>
  );
}
