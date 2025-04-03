import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Project, House } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Building2, Home, Calendar, Users2, Map, RotateCcw, Box, Play, Hotel, Building } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { ProjectModel3DDialog } from "@/components/projects/ProjectModel3DDialog";
import { YoutubeVideoDialog } from "@/components/projects/YoutubeVideoDialog";

// Mock data for demonstration
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Burj Al Babas",
    description: "Iconic castle-style luxury villas with stunning architecture and premium amenities.",
    roomCount: 732,
    floorCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "single",
  },
  {
    id: "2",
    name: "Sarot Palace",
    description: "Luxurious palace-inspired residences with elegant design and exclusive amenities.",
    roomCount: 120,
    floorCount: 4,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "single",
  },
  {
    id: "3",
    name: "Sarot Grand Resort & Spa",
    description: "Five-star luxury resort with world-class spa, multiple restaurants, and breathtaking mountain views.",
    roomCount: 200,
    floorCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1780&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "hotel",
    houses: [
      { id: "3-1", name: "Deluxe Oda", projectId: "3", floorCount: 1, roomCount: 80 },
      { id: "3-2", name: "Suite Oda", projectId: "3", floorCount: 1, roomCount: 60 },
      { id: "3-3", name: "Kral Dairesi", projectId: "3", floorCount: 1, roomCount: 40 },
      { id: "3-4", name: "Termal Oda", projectId: "3", floorCount: 1, roomCount: 20 }
    ],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1780&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1932&auto=format&fit=crop"
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "4",
    name: "Sarot Boutique Hotel & Termal",
    description: "Intimate boutique hotel offering personalized service, thermal facilities, and elegant accommodations in the heart of nature.",
    roomCount: 60,
    floorCount: 5,
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1932&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "hotel",
    houses: [
      { id: "4-1", name: "Standart Oda", projectId: "4", floorCount: 1, roomCount: 30 },
      { id: "4-2", name: "Deluxe Oda", projectId: "4", floorCount: 1, roomCount: 20 },
      { id: "4-3", name: "Suite Oda", projectId: "4", floorCount: 1, roomCount: 10 }
    ],
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1932&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "5",
    name: "Sarot Teras Evler",
    description: "Modern terraced homes with panoramic views and contemporary design.",
    roomCount: 180,
    floorCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1529551739587-e242c564f727?q=80&w=2046&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2064&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "multi",
    houses: [
      { id: "5-1", name: "Fulya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-2", name: "Sümbül", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-3", name: "Sekoya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-4", name: "Nergis", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-5", name: "Frezya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-6", name: "Kamelya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-7", name: "Sedir", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-8", name: "Safran", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-9", name: "Kardelen", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-10", name: "Laden", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-11", name: "Karanfil", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-12", name: "Papatya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-13", name: "Sardunya", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-14", name: "Lilyum", projectId: "5", floorCount: 3, roomCount: 12 },
      { id: "5-15", name: "Arguvan", projectId: "5", floorCount: 3, roomCount: 12 },
    ],
  },
  {
    id: "6",
    name: "Sarot Bahçe Evleri",
    description: "Garden homes with lush green spaces and family-friendly environments.",
    roomCount: 150,
    floorCount: 2,
    imageUrl: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "multi",
    houses: [
      { id: "6-1", name: "Anemon", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-2", name: "Acelya", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-3", name: "Akasya", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-4", name: "Ardıç", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-5", name: "Yonca", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-6", name: "Yasemin", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-7", name: "Zambak", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-8", name: "Zencefil", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-9", name: "Zerdali", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-10", name: "Lale", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-11", name: "Gardenya", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-12", name: "Gonca", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-13", name: "Gelincik", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-14", name: "Zakkum", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-15", name: "Mimoza", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-16", name: "Mango", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-17", name: "Fesleğen", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-18", name: "Petunya", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-19", name: "Manolya", projectId: "6", floorCount: 2, roomCount: 8 },
      { id: "6-20", name: "Nilüfer", projectId: "6", floorCount: 2, roomCount: 8 },
    ],
  },
];

export default function Projects() {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isVideoDialogOpen, setVideoDialogOpen] = useState(false);
  const youtubeVideoId = "MHfT2GAOMV4";

  const handleProjectClick = (project: Project) => {
    if (project.type === "multi" && project.houses && project.houses.length > 0) {
      setActiveProject(project);
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  const handleHouseClick = (project: Project, house: House) => {
    navigate(`/projects/${project.id}?house=${house.id}`);
  };

  const openYoutubeVideo = (project: Project) => {
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

        <h1 className="text-3xl font-bold tracking-tight">Sarot Projeler</h1>
        <p className="text-muted-foreground mb-4">
          Sarot'un prestijli konut ve otel projelerini keşfedin.
        </p>
        
        <div className="flex gap-2 mb-4">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Tüm Projeler
          </Button>
          <Button variant="outline" className="gap-2">
            <Building2 className="h-4 w-4" />
            Konut Projeleri
          </Button>
          <Button variant="outline" className="gap-2">
            <Hotel className="h-4 w-4" />
            Otel Projeleri
          </Button>
        </div>

        {/* Enhanced 3D Carousel for Projects */}
        <div className="py-6">
          <Carousel className="w-full mx-auto">
            <CarouselContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {MOCK_PROJECTS.map((project) => (
                  <Card 
                    key={project.id} 
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="relative">
                      <div className="relative w-full h-48 overflow-hidden group">
                        <img 
                          src={project.imageUrl} 
                          alt={project.name} 
                          className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                          <Button variant="secondary" size="sm" className="gap-1">
                            <Building className="h-4 w-4" />
                            Projeyi İncele
                          </Button>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {project.type === "multi" && (
                          <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            Çoklu Konut
                          </Badge>
                        )}
                        {project.type === "hotel" && (
                          <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center">
                            <Hotel className="h-3 w-3 mr-1" />
                            Otel
                          </Badge>
                        )}
                      </div>
                      
                      {/* Video Button */}
                      {project.videoUrl && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="absolute bottom-2 right-2 rounded-md bg-white/90 hover:bg-white text-red-500 hover:text-red-600 gap-1 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openYoutubeVideo(project);
                          }}
                        >
                          <Play className="h-4 w-4 fill-current" />
                          Video
                        </Button>
                      )}
                      
                      {/* Hotel Specific Badge */}
                      {project.type === "hotel" && (
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          <Badge variant="outline" className="bg-white/90 text-xs">
                            {project.houses?.length || 0} Oda Tipi
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex items-center gap-1 bg-muted/50 p-1.5 rounded-md">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Kat</span>
                            <span className="text-sm font-medium">{project.floorCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 bg-muted/50 p-1.5 rounded-md">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">{project.name.toLowerCase().includes('otel') ? 'Oda' : 'Konut'}</span>
                            <span className="text-sm font-medium">{project.roomCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* House Types Preview */}
                      {project.type === "multi" && project.houses && project.houses.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-1">Konut Tipleri:</div>
                          <div className="flex flex-wrap gap-1">
                            {project.houses.slice(0, 5).map((house) => (
                              <Button 
                                key={house.id} 
                                variant="outline" 
                                size="sm" 
                                className="text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHouseClick(project, house);
                                }}
                              >
                                {house.name}
                              </Button>
                            ))}
                            {project.houses.length > 5 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProjectClick(project);
                                }}
                              >
                                +{project.houses.length - 5} daha
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-2">
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => handleProjectClick(project)}
                      >
                        Detayları Gör
                      </Button>
                      
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/projects/${project.id}`);
                          }}
                        >
                          <Building className="h-4 w-4 mr-1" />
                          Proje
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            openYoutubeVideo(project);
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Video
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious className="static" />
              <CarouselNext className="static" />
            </div>
          </Carousel>
        </div>

        {/* Display houses for multi-house projects */}
        {activeProject && activeProject.type === "multi" && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>{activeProject.name} - Konut Tipleri</CardTitle>
                <CardDescription>
                  {activeProject.name} projesindeki tüm konut tiplerini inceleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeProject.houses?.map((house) => (
                    <Card 
                      key={house.id} 
                      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md`}
                      onClick={() => handleHouseClick(activeProject, house)}
                    >
                      <div className="relative">
                        <div className="h-32 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                          <Home className="h-12 w-12 text-blue-500/70" />
                        </div>
                        <Badge className="absolute top-2 right-2">
                          {house.name}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {house.name}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 ml-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHouseClick(activeProject, house);
                            }}
                          >
                            <ChevronLeft className="h-4 w-4 rotate-180" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1 bg-muted/50 p-1.5 rounded-md">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Kat</span>
                              <span className="text-sm font-medium">{house.floorCount}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 bg-muted/50 p-1.5 rounded-md">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Konut</span>
                              <span className="text-sm font-medium">{house.roomCount}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <Button 
                            variant="default" 
                            className="w-full"
                            onClick={() => handleHouseClick(activeProject, house)}
                          >
                            Konutları Gör
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveProject(null);
                  }}
                  className="mr-2"
                >
                  Kapat
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* 3D Model Dialog */}
        <ProjectModel3DDialog
          open={false}
          onOpenChange={() => {}}
          project={null}
        />

        {/* YouTube Video Dialog */}
        <YoutubeVideoDialog
          open={isVideoDialogOpen}
          onOpenChange={setVideoDialogOpen}
          videoId={youtubeVideoId}
          project={activeProject}
        />
      </div>
    </MainLayout>
  );
}
