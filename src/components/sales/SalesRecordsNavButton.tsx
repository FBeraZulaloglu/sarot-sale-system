import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * A button component that allows navigation between the original and updated sales records pages
 */
export function SalesRecordsNavButton() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we're on the updated page or the original page
  const isOnUpdatedPage = location.pathname === "/sales-records-updated";
  
  return (
    <Button 
      onClick={() => navigate(isOnUpdatedPage ? '/sales-records' : '/sales-records-updated')} 
      variant="outline" 
      className="flex items-center gap-1"
    >
      {isOnUpdatedPage ? "Orijinal Kayıtlar" : "Güncellenmiş Kayıtlar"}
    </Button>
  );
}
