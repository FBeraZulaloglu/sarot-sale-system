
import { Room } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, DollarSign, BedDouble } from "lucide-react";

interface RoomTooltipProps {
  room: Room;
}

export function RoomTooltip({ room }: RoomTooltipProps) {
  return (
    <Card className="shadow-lg w-56">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="font-medium text-base border-b pb-2 mb-1">Room {room.roomNumber}</div>
          
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Floor:</span>
            <span className="ml-auto font-medium">{room.floor}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Price:</span>
            <span className="ml-auto font-medium">${room.price.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <BedDouble className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Status:</span>
            <span className={`ml-auto capitalize font-medium ${
              room.status === 'available' 
                ? 'text-green-600' 
                : room.status === 'reserved' 
                  ? 'text-amber-600' 
                  : 'text-blue-600'
            }`}>
              {room.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
