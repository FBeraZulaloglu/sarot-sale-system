
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@hotel.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as UserRole,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "manager@hotel.com",
    password: "manager123",
    name: "Manager User",
    role: "manager" as UserRole,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "sales@hotel.com",
    password: "sales123",
    name: "Sales User",
    role: "salesperson" as UserRole,
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in via localStorage
    const storedUser = localStorage.getItem("hotel_erp_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in mock data
      const foundUser = MOCK_USERS.find(
        user => user.email === email && user.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Set user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem("hotel_erp_user", JSON.stringify(userWithoutPassword));
      
      toast.success("Logged in successfully", {
        description: `Welcome back, ${userWithoutPassword.name}!`
      });
      
      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Please check your credentials"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (MOCK_USERS.some(user => user.email === email)) {
        throw new Error("User already exists");
      }
      
      // Create new user
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      };
      
      // Set user in state and localStorage
      setUser(newUser);
      localStorage.setItem("hotel_erp_user", JSON.stringify(newUser));
      
      toast.success("Account created successfully", {
        description: `Welcome, ${newUser.name}!`
      });
      
      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      toast.error("Signup failed", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hotel_erp_user");
    toast.info("Logged out successfully");
    navigate("/auth");
  };

  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    console.log("Checking permission:", { userRole: user.role, requiredRoles });
    return requiredRoles.includes(user.role);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
