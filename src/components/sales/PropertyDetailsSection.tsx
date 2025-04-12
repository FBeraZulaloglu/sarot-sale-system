
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Project, Room } from "@/types";
import { RoomDetailsCard } from "./RoomDetailsCard";
import { MOCK_PROJECTS } from "@/data/projects";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PropertyDetailsSectionProps {
  formData: {
    projectId: string;
    roomId: string;
    startDate: Date;
    paymentMethod: string;
    includesTax: boolean;
    salespersonId?: string;
  };
  formErrors?: {
    projectId?: string;
    roomId?: string;
  };
  selectedRoomDetails: Room | null;
  availableRooms: Room[];
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onCheckboxChange: (checked: boolean) => void;
  selectedProject: Project | null;
  selectedRoom: Room | null;
  isViewMode?: boolean;
}

export function PropertyDetailsSection({
  formData,
  formErrors = {},
  selectedRoomDetails,
  availableRooms,
  onSelectChange,
  onDateChange,
  onCheckboxChange,
  selectedProject,
  selectedRoom,
  isViewMode = false
}: PropertyDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Mülk Bilgileri</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectId">Proje</Label>
          {selectedProject ? (
            <div className="p-2 border rounded-md bg-muted/20">
              <p className="font-medium">{selectedProject.name}</p>
              <p className="text-xs text-muted-foreground">Proje bilgisi önceki sayfadan aktarılmıştır</p>
            </div>
          ) : (
            <div>
              <Select
                value={formData.projectId}
                onValueChange={(value) => onSelectChange("projectId", value)}
              >
                <SelectTrigger className={formErrors.projectId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seçilen Proje" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PROJECTS.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.projectId && (
                <Alert variant="destructive" className="py-2 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formErrors.projectId}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="roomId">Oda</Label>
          {selectedRoom ? (
            <div className="p-2 border rounded-md bg-muted/20">
              <p className="font-medium">Oda {selectedRoom.roomNumber} (Kat {selectedRoom.floor})</p>
              <p className="text-xs text-muted-foreground">Oda bilgisi önceki sayfadan aktarılmıştır</p>
            </div>
          ) : (
            <div>
              <Select
                value={formData.roomId}
                onValueChange={(value) => onSelectChange("roomId", value)}
                disabled={!formData.projectId || isViewMode}
              >
                <SelectTrigger className={formErrors.roomId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Oda seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.length > 0 ? (
                    availableRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        Oda {room.roomNumber} (Kat {room.floor})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-rooms" disabled>Uygun oda bulunmamaktadır</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {formErrors.roomId && (
                <Alert variant="destructive" className="py-2 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formErrors.roomId}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Du00f6nem (Period) Information */}
      {selectedProject && selectedRoom && (
        <div className="p-3 border rounded-md bg-amber-50/50">
          <h4 className="font-medium text-amber-800 mb-2">Seçilen Dönem Bilgisi</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Başlangıç:</span>{' '}
              <span className="font-medium">{formData.startDate ? format(formData.startDate, 'dd.MM.yyyy') : 'Belirtilmemiş'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Bitiş:</span>{' '}
              <span className="font-medium">{formData.startDate ? format(new Date(formData.startDate.getTime() + 14 * 24 * 60 * 60 * 1000), 'dd.MM.yyyy') : 'Belirtilmemiş'}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Dönem bilgisi önceki sayfadan aktarılmıştır ve değiştirilemez.</p>
        </div>
      )}

      {selectedRoomDetails && <RoomDetailsCard room={selectedRoomDetails} />}
      
      <div className="space-y-2">
        <Label htmlFor="startDate">Satın Alma Tarihi</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.startDate && "text-muted-foreground"
              )}
              disabled={(!!selectedProject && !!selectedRoom) || isViewMode}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.startDate ? (
                format(formData.startDate, "dd.MM.yyyy")
              ) : (
                <span>Tarih seçiniz</span>
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
        <h3 className="text-lg font-semibold">Satış Yapan/Bayi</h3>
        <Label htmlFor="salesperson">Satış Temsilcisi</Label>
        <Select
          value={formData.salespersonId || ""}
          onValueChange={(value) => onSelectChange("salespersonId", value)}
          disabled={isViewMode}
        >
          <SelectTrigger>
            <SelectValue placeholder="Satış temsilcisi seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s1">ADMİN</SelectItem>
            <SelectItem value="s2">Murat Tiryaki</SelectItem>
            <SelectItem value="s3">Şu an Kullanan Kullanıcı</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
