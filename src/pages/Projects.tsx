import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Project } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Building2, Home, Calendar, Users2, Map, RotateCcw, Box, Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { ProjectModel3DDialog } from "@/components/projects/ProjectModel3DDialog";
import { YoutubeVideoDialog } from "@/components/projects/YoutubeVideoDialog";

// Mock data for demonstration
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Luxury Grand Hotel",
    description: "A 5-star luxury hotel with modern amenities and stunning views.",
    roomCount: 120,
    floorCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Seaside Resort",
    description: "Beachfront resort with private beach access and water activities.",
    roomCount: 90,
    floorCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Mountain View Lodge",
    description: "Cozy mountain retreat with hiking trails and outdoor activities.",
    roomCount: 80,
    floorCount: 5,
    imageUrl: "https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?q=80&w=1974&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Urban Boutique Hotel",
    description: "Stylish city center hotel with artistic design and local charm.",
    roomCount: 60,
    floorCount: 4,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Historic Grand Palace",
    description: "Heritage hotel in a restored palace with classical architecture.",
    roomCount: 100,
    floorCount: 7,
    imageUrl: "https://images.unsplash.com/photo-1529551739587-e242c564f727?q=80&w=2046&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2064&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Skyline Towers",
    description: "Modern high-rise hotel with panoramic city views and rooftop pool.",
    roomCount: 150,
    floorCount: 30,
    imageUrl: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [is3DDialogOpen, set3DDialogOpen] = useState(false);
  const [isVideoDialogOpen, setVideoDialogOpen] = useState(false);
  const youtubeVideoId = "MHfT2GAOMV4";

  const openYoutubeVideo = (project: Project) => {
    setSelectedProject(project);
    setVideoDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="-ml-2">
          <Link to="/" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">Hotel Projects</h1>
        <p className="text-muted-foreground">
          Browse through our collection of hotel development projects in 3D view.
        </p>

        {/* Enhanced 3D Carousel for Projects */}
        <div className="py-6">
          <Carousel className="w-full mx-auto">
            <CarouselContent>
              {MOCK_PROJECTS.map((project) => (
                <CarouselItem key={project.id} className="md:basis-1/1 lg:basis-1/1">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={16/9} className="bg-muted">
                          <div className="w-full h-full rounded-t-lg relative group overflow-hidden">
                            <img
                              src={project.image3dUrl}
                              alt={`${project.name} 3D View`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70 group-hover:opacity-40 transition-opacity"></div>
                            <Button 
                              variant="secondary"
                              className="absolute top-4 right-4 bg-primary/90 text-primary-foreground hover:bg-primary/80 px-3 py-1 h-auto rounded-full text-xs font-medium flex items-center gap-1"
                              onClick={(e) => {
                                e.preventDefault();
                                openYoutubeVideo(project);
                              }}
                            >
                              <Play className="h-3 w-3" />
                              Video aç
                            </Button>
                          </div>
                        </AspectRatio>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-2xl">{project.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{project.floorCount}</p>
                              <p className="text-xs text-muted-foreground">Floors</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{project.roomCount}</p>
                              <p className="text-xs text-muted-foreground">Rooms</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{Math.floor(project.roomCount * 0.7)}</p>
                              <p className="text-xs text-muted-foreground">Sold Units</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {new Date(project.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">Launch Date</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" asChild>
                          <Link to={`/projects/${project.id}`} className="flex items-center gap-2">
                            <Map className="h-4 w-4" />
                            Floor Plans
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link to={`/projects/${project.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious className="relative static translate-y-0 left-0" />
              <CarouselNext className="relative static translate-y-0 right-0" />
            </div>
          </Carousel>
        </div>

        {/* Standard Grid View */}
        <div className="pt-8">
          <h2 className="text-2xl font-bold mb-6">All Projects</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_PROJECTS.map((project) => (
              <Card key={project.id} className="overflow-hidden card-hover">
                <div className="aspect-video w-full overflow-hidden relative group">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="secondary"
                      className="bg-primary/90 text-primary-foreground hover:bg-primary/80"
                      onClick={(e) => {
                        e.preventDefault();
                        openYoutubeVideo(project);
                      }}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Video aç
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Floors:</span>
                    <span className="font-medium">{project.floorCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rooms:</span>
                    <span className="font-medium">{project.roomCount}</span>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <Link to={`/projects/${project.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Model Dialog */}
      <ProjectModel3DDialog 
        project={selectedProject} 
        open={is3DDialogOpen} 
        onOpenChange={set3DDialogOpen} 
      />
      
      {/* YouTube Video Dialog */}
      <YoutubeVideoDialog
        project={selectedProject}
        open={isVideoDialogOpen}
        onOpenChange={setVideoDialogOpen}
        videoId={youtubeVideoId}
      />
    </MainLayout>
  );
}
