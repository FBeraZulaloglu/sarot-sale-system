import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Building2, User, BarChart3, Calendar, Home, Hotel, Building, Play, FileText } from "lucide-react";
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
    name: "SAROT TERMAL PALACE",
    description: "Luxurious palace-inspired residences with elegant design and exclusive amenities featuring multiple room types across 8 floors.",
    roomCount: 388, // Total: 8 floors × (8 × 3+1 + 40 × 1+1) per floor + 4 × 4+1 + 8 × 3+1 + 28 × 2+1 on 7th floor
    floorCount: 8, // 0-7 floors (8 floors total)
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "multi", // Multiple floor layouts
    houses: [
      { id: "2-0", name: "0. Kat (Zemin)", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-1", name: "1. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-2", name: "2. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-3", name: "3. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-4", name: "4. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-5", name: "5. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-6", name: "6. Kat", projectId: "2", floorCount: 1, roomCount: 48 }, // 8 × 3+1 + 40 × 1+1
      { id: "2-7", name: "7. Kat (Çatı)", projectId: "2", floorCount: 1, roomCount: 40 }  // 4 × 4+1 + 8 × 3+1 + 28 × 2+1
    ],
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
    description: "Modern terraced homes with panoramic views and contemporary design. All units are 1+1 rooms.",
    roomCount: 180,
    floorCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1529551739587-e242c564f727?q=80&w=2046&auto=format&fit=crop",
    image3dUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2064&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    type: "single",
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tapu İşlemleri</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">
              Tapu kayıtları ve işlemleri
            </p>
          </CardContent>
          <CardFooter className="p-0 pt-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/tapu-islemleri">Tüm Tapu Kayıtları</Link>
            </Button>
          </CardFooter>
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
        
        {/* Filter buttons removed */}
        
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
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {project.id === "5" && (
                    <Badge className="bg-green-500 hover:bg-green-600 flex items-center">
                      <Building2 className="h-3 w-3 mr-1" />
                      Tek Tip Konut
                    </Badge>
                  )}
                  {project.id === "2" && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center">
                      <Building2 className="h-3 w-3 mr-1" />
                      8 Kat
                    </Badge>
                  )}
                  {project.type === "hotel" && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center">
                      <Hotel className="h-3 w-3 mr-1" />
                      Otel
                    </Badge>
                  )}
                </div>
                

                
                {/* Room Type Badge removed */}
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
