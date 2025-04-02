import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types";
import { Play } from "lucide-react";

interface YoutubeVideoDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export function YoutubeVideoDialog({ project, open, onOpenChange, videoId }: YoutubeVideoDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Video: {project.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2">
          <div className="relative overflow-hidden rounded-lg aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={`${project.name} Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Proje:</span>
              <span className="font-medium">{project.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Odalar:</span>
              <span className="font-medium">{project.roomCount}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
