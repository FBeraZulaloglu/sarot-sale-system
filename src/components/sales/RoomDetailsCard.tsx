
import { Room } from "@/types";

interface RoomDetailsCardProps {
  room: Room;
}

export function RoomDetailsCard({ room }: RoomDetailsCardProps) {
  return (
    <div className="bg-muted p-4 rounded-md">
      <div className="text-sm font-medium">Selected Room Details</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
        <div>Room Number:</div>
        <div className="font-medium">{room.roomNumber}</div>
        <div>Floor:</div>
        <div className="font-medium">{room.floor}</div>
        <div>Price:</div>
        <div className="font-medium">${room.price.toLocaleString()}</div>
      </div>
    </div>
  );
}
