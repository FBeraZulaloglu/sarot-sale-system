import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, User, BarChart3, Calendar } from "lucide-react";
import { Project } from "@/types";

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
          <h2 className="text-2xl font-bold tracking-tight">Hotel Projects</h2>
          <Button asChild variant="default" className="bg-black hover:bg-black/80 text-white">
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROJECTS.map((project) => (
            <Card key={project.id} className="overflow-hidden card-hover">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
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
