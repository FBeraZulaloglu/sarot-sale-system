
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Project, Room } from "@/types";
import { MOCK_PROJECTS } from "./mockData";
import { RoomDetailsCard } from "./RoomDetailsCard";

interface PropertyDetailsSectionProps {
  formData: {
    projectId: string;
    roomId: string;
    startDate: Date;
    paymentMethod: string;
    includesTax: boolean;
  };
  selectedRoomDetails: Room | null;
  availableRooms: Room[];
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onCheckboxChange: (checked: boolean) => void;
  selectedProject: Project | null;
  selectedRoom: Room | null;
}

export function PropertyDetailsSection({
  formData,
  selectedRoomDetails,
  availableRooms,
  onSelectChange,
  onDateChange,
  onCheckboxChange,
  selectedProject,
  selectedRoom
}: PropertyDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Property Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectId">Project</Label>
          <Select
            value={formData.projectId}
            onValueChange={(value) => onSelectChange("projectId", value)}
            disabled={!!selectedProject}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_PROJECTS.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="roomId">Room</Label>
          <Select
            value={formData.roomId}
            onValueChange={(value) => onSelectChange("roomId", value)}
            disabled={!formData.projectId || !!selectedRoom}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              {availableRooms.length > 0 ? (
                availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    Room {room.roomNumber} (Floor {room.floor})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-rooms" disabled>No rooms available</SelectItem> // Added a fallback for when no rooms are available
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedRoomDetails && <RoomDetailsCard room={selectedRoomDetails} />}
      
      <div className="space-y-2">
        <Label htmlFor="startDate">Sale Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.startDate ? (
                format(formData.startDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.startDate}
              onSelect={onDateChange}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select
          value={formData.paymentMethod}
          onValueChange={(value) => onSelectChange("paymentMethod", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="includesTax"
          checked={formData.includesTax}
          onCheckedChange={onCheckboxChange}
        />
        <label
          htmlFor="includesTax"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Include tax in price calculation
        </label>
      </div>
    </div>
  );
}
