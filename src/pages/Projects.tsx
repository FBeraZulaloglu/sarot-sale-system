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
import { MOCK_PROJECTS } from "@/data/projects";



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
                      
                      {/* House Types Preview removed from here and will only be shown when 'Detayları Gör' is clicked */}
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-2">
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => {
                          if (project.type === "multi" && project.houses && project.houses.length > 0) {
                            navigate(`/projects/${project.id}?house=${project.houses[0].id}`);
                          } else {
                            navigate(`/projects/${project.id}`);
                          }
                        }}
                      >
                        Detayları Gör
                      </Button>
                      
                      {/* Buttons removed as requested */}
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
