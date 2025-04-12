
import { Room } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, DollarSign, BedDouble, Calendar, Users, Home, Check, X, Building2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomTooltipProps {
  room: Room;
  isAvailableForPeriod?: boolean;
  isDateFilterApplied?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export function RoomTooltip({ room, isAvailableForPeriod = true, isDateFilterApplied = false, startDate, endDate }: RoomTooltipProps) {
  // Determine status display based on room status and availability for the selected period
  const getStatusDisplay = () => {
    if (!isDateFilterApplied) {
      return {
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        icon: <BedDouble className="h-4 w-4" />,
        label: room.status === 'available' ? 'Available' : room.status === 'reserved' ? 'Reserved' : 'Sold',
        message: 'Uygunluk için seçilen aralığı kontrol et'
      };
    }
    
    if (room.status === 'available' && isAvailableForPeriod) {
      return {
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: <Check className="h-4 w-4" />,
        label: 'Bu dönemde rezervasyon yapmak için uygun',
        message: 'Yeni bir satış kaydı oluştur'
      };
    } else if (room.status === 'available' && !isAvailableForPeriod) {
      return {
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        icon: <Calendar className="h-4 w-4" />,
        label: 'Bu dönemde rezervasyon yapılmış',
        message: 'Bu odanın seçilen aralığında rezervasyonu yapılmış'
      };
    } else if (room.status === 'reserved') {
      return {
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        icon: <Calendar className="h-4 w-4" />,
        label: 'Bu dönemde rezervasyon yapılmış',
        message: 'Bu odanın rezervasyonu yapılmış'
      };
    } else {
      return {
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        icon: <DollarSign className="h-4 w-4" />,
        label: 'Sold',
        message: 'Bu odanın satışı yapılmış'
      };
    }
  };
  
  const statusDisplay = getStatusDisplay();
  
  return (
    <Card className="shadow-lg w-64">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="font-medium text-base border-b pb-2 mb-1 flex justify-between items-center">
            <span>Oda {room.roomNumber}</span>
            <Badge variant="outline" className={`${statusDisplay.bgColor} ${statusDisplay.color} border-none`}>
              {statusDisplay.icon}
              <span className="ml-1">{statusDisplay.label}</span>
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Kat:</span>
            <span className="ml-auto font-medium">{room.floor}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tip:</span>
            <span className="ml-auto font-medium">{room.type || 'Standard'}</span>
          </div>
          
          {room.size && (
            <div className="flex items-center gap-2 text-sm">
              <Building2Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Boyut:</span>
              <span className="ml-auto font-medium">{room.size} m²</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Fiyat:</span>
            <span className="ml-auto font-medium">${room.price.toLocaleString()}</span>
          </div>
          
          {isDateFilterApplied && (
            <div className="mt-2 pt-2 border-t text-sm">
              <div className={`p-2 rounded ${statusDisplay.bgColor} ${statusDisplay.color}`}>
                {statusDisplay.message}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
