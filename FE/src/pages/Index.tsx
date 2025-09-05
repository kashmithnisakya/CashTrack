import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { Dashboard } from "@/components/Dashboard";
import { useToast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // Demo login - in real app this would call your authentication API
    setUser({
      name: email.split('@')[0],
      email: email
    });
    
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
  };

  const handleRegister = (email: string, password: string, name: string) => {
    // Demo registration - in real app this would call your authentication API
    setUser({
      name: name,
      email: email
    });
    
    toast({
      title: "Account created!",
      description: "Welcome to CashTrack. Start tracking your expenses now.",
    });
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return <LandingPage onLogin={handleLogin} onRegister={handleRegister} />;
};

export default Index;
