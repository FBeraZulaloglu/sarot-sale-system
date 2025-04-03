import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Building2, User, BarChart3, Calendar, Home, Hotel, Building, Play } from "lucide-react";
import { Project } from "@/types";

// Import projects data from Projects page
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
    ],
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const renderOverviewCards = () => {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_PROJECTS.length}</div>
            <p className="text-xs text-muted-foreground">
              Active hotel development projects
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_PROJECTS.reduce((acc, project) => acc + project.roomCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available across all projects
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              In the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Team members using the system
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderWelcomeMessage = () => {
    if (!user) return null;
    
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name}
        </h1>
        <p className="text-muted-foreground">
          {user.role === "admin" 
            ? "Monitor system performance and manage users from your admin dashboard"
            : user.role === "manager"
            ? "Review project status and team performance from your manager dashboard"
            : "Track your sales assignments and customer interactions"}
        </p>
      </div>
    );
  };

  const renderProjectList = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Sarot Projeler</h2>
          <Button asChild variant="default" className="gap-1">
            <Link to="/projects">
              <Building2 className="h-4 w-4" />
              Tüm Projeleri Gör
            </Link>
          </Button>
        </div>
        
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
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROJECTS.map((project) => (
            <Card key={project.id} className="overflow-hidden cursor-pointer transition-all hover:shadow-md">
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
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute bottom-2 right-2 rounded-md bg-white/90 hover:bg-white text-red-500 hover:text-red-600 gap-1 shadow-sm"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Video
                </Button>
                
                {/* Hotel Specific Badge */}
                {project.type === "hotel" && project.houses && (
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    <Badge variant="outline" className="bg-white/90 text-xs">
                      {project.houses.length} Oda Tipi
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
                      <span className="text-xs text-muted-foreground">{project.type === "hotel" ? 'Oda' : 'Konut'}</span>
                      <span className="text-sm font-medium">{project.roomCount}</span>
                    </div>
                  </div>
                </div>
                
                {/* House Types Preview */}
                {project.type === "multi" && project.houses && project.houses.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1">Konut Tipleri:</div>
                    <div className="flex flex-wrap gap-1">
                      {project.houses.slice(0, 3).map((house) => (
                        <Button 
                          key={house.id} 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          asChild
                        >
                          <Link to={`/projects/${project.id}?house=${house.id}`}>
                            {house.name}
                          </Link>
                        </Button>
                      ))}
                      {project.houses.length > 3 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          asChild
                        >
                          <Link to={`/projects/${project.id}`}>
                            +{project.houses.length - 3} daha
                          </Link>
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
                  asChild
                >
                  <Link to={`/projects/${project.id}`}>
                    Detayları Gör
                  </Link>
                </Button>
                
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/projects/${project.id}`}>
                      <Building className="h-4 w-4 mr-1" />
                      Proje
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {renderWelcomeMessage()}
        {renderOverviewCards()}
        {renderProjectList()}
      </div>
    </MainLayout>
  );
}
