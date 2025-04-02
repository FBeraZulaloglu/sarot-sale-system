
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HotelModel3D } from "./HotelModel3D";
import { Project } from "@/types";
import { Box, RotateCcw } from "lucide-react";

interface ProjectModel3DDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModel3DDialog({ project, open, onOpenChange }: ProjectModel3DDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            3D View: {project.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2">
          <div className="relative overflow-hidden rounded-lg">
            <HotelModel3D projectName={project.name} floorCount={project.floorCount} />
            
            <div className="absolute top-3 right-3 bg-background/80 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
              <RotateCcw className="h-3 w-3" />
              Drag to rotate | Scroll to zoom
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Floors:</span>
              <span className="font-medium">{project.floorCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Rooms:</span>
              <span className="font-medium">{project.roomCount}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
