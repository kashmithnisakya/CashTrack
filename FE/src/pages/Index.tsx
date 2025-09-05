import { LandingPage } from "@/components/LandingPage";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background flex items-center justify-center transition-colors duration-500">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mx-auto mb-4"></div>
      <p className="text-xl font-semibold text-muted-foreground">Loading CashTrack...</p>
    </div>
  </div>
);

interface DashboardUser {
  name: string;
  email: string;
}

const Index = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleLogout = () => {
    console.log('🚪 User logging out');
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // If authenticated, show dashboard
  if (isAuthenticated && user) {
    // Convert API user to dashboard user format
    const dashboardUser: DashboardUser = {
      name: user.email.split('@')[0], // Use email prefix as name for now
      email: user.email
    };

    return <Dashboard user={dashboardUser} onLogout={handleLogout} />;
  }

  // Otherwise, show landing page with login/register
  return <LandingPage />;
};

export default Index;