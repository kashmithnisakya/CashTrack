import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Shield, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import logoIcon from "@/assets/logo-icon.png";

interface LandingPageProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, name: string) => void;
}

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('👤 LandingPage: Login form submitted:', { email: loginEmail });
    onLogin(loginEmail, loginPassword);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('👤 LandingPage: Registration form submitted:', { email: registerEmail, name: registerName });
    onRegister(registerEmail, registerPassword, registerName);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-white text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <img src={logoIcon} alt="CashTrack" className="w-12 h-12 mr-3" />
                <h1 className="text-4xl md:text-6xl font-bold">CashTrack</h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Take control of your finances with smart expense tracking
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Smart Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Growth Insights</span>
                </div>
              </div>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md">
              <Card className="shadow-glow bg-gradient-card border-0">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
                  <CardDescription>
                    Join thousands who trust CashTrack with their finances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="min-h-[280px]">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" variant="hero" className="w-full" size="lg">
                          Sign In
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="register" className="min-h-[280px]">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="reg-email">Email</Label>
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="Enter your email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="reg-password">Password</Label>
                          <Input
                            id="reg-password"
                            type="password"
                            placeholder="Create a password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" variant="hero" className="w-full" size="lg">
                          Create Account
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CashTrack?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make expense tracking simple and insightful
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card border-0">
              <CardHeader className="text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Smart Categorization</CardTitle>
                <CardDescription>
                  Automatically categorize your expenses with AI-powered insights
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-card border-0">
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <CardTitle>Visual Analytics</CardTitle>
                <CardDescription>
                  Beautiful charts and graphs to understand your spending patterns
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-card border-0">
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-accent" />
                <CardTitle>Bank-Level Security</CardTitle>
                <CardDescription>
                  Your financial data is protected with enterprise-grade encryption
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}