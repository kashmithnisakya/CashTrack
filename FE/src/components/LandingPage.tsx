import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CashTrackLogo } from "@/components/CashTrackLogo";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Shield, BarChart3, Loader2 } from "lucide-react";
import { ApiError } from "@/types/api";
import heroImage from "@/assets/hero-image.jpg";

export function LandingPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register, clearError } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      console.log('👤 LandingPage: Login form submitted:', { email: loginEmail });
      await login({ email: loginEmail, password: loginPassword });
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      // Reset form
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Login Failed",
        description: apiError.message || "Unable to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !registerName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      console.log('👤 LandingPage: Registration form submitted:', { email: registerEmail, name: registerName });
      await register({ 
        email: registerEmail, 
        password: registerPassword, 
        name: registerName 
      });
      
      toast({
        title: "Welcome to CashTrack!",
        description: "Your account has been created successfully.",
      });
      
      // Reset form
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterName("");
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Registration Failed",
        description: apiError.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero animate-glow">
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20"></div>
        <div className="absolute inset-0 animate-float">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24">
          {/* Theme Toggle */}
          <div className="absolute top-6 right-6 z-10">
            <ThemeToggle />
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="flex-1 text-white text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-8 animate-float">
                <CashTrackLogo 
                  size={80} 
                  variant="full"
                  className="text-5xl md:text-7xl drop-shadow-2xl"
                />
              </div>
              <p className="text-2xl md:text-3xl mb-12 opacity-95 font-light leading-relaxed drop-shadow-lg">
                Transform your financial journey with <span className="font-semibold text-yellow-200">intelligent</span> expense tracking
              </p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Shield className="w-6 h-6 text-green-300" />
                  <span className="font-medium">Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <BarChart3 className="w-6 h-6 text-blue-300" />
                  <span className="font-medium">AI-Powered Analytics</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <TrendingUp className="w-6 h-6 text-yellow-300" />
                  <span className="font-medium">Wealth Growth</span>
                </div>
              </div>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-lg">
              <Card className="glass-effect shadow-premium border-0 backdrop-blur-xl bg-white/95 dark:bg-black/90">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl font-bold gradient-text mb-2">Welcome to Wealth</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    Join <span className="font-semibold text-primary">50,000+</span> users building financial freedom
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/60 p-1 h-12 rounded-xl">
                      <TabsTrigger value="login" className="rounded-lg font-medium">Sign In</TabsTrigger>
                      <TabsTrigger value="register" className="rounded-lg font-medium">Join Now</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="min-h-[320px] mt-8">
                      <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          variant="hero" 
                          disabled={isSubmitting}
                          className="w-full h-12 rounded-xl text-lg font-semibold shadow-wealth hover:shadow-hover transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
                          size="lg"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            'Enter Dashboard'
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="register" className="min-h-[320px] mt-8">
                      <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-foreground/80">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email" className="text-sm font-medium text-foreground/80">Email Address</Label>
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="your@email.com"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password" className="text-sm font-medium text-foreground/80">Password</Label>
                          <Input
                            id="reg-password"
                            type="password"
                            placeholder="••••••••"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          variant="hero" 
                          disabled={isSubmitting}
                          className="w-full h-12 rounded-xl text-lg font-semibold bg-gradient-wealth shadow-wealth hover:shadow-hover transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
                          size="lg"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            'Start Building Wealth'
                          )}
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
      <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Why Top Earners Choose CashTrack
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Premium features engineered for serious wealth builders and financial professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="group shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card hover:scale-105 cursor-pointer">
              <CardHeader className="text-center p-8">
                <div className="relative mb-6">
                  <DollarSign className="w-16 h-16 mx-auto text-primary drop-shadow-lg" />
                  <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardTitle className="text-2xl mb-4 group-hover:text-primary transition-colors">Smart Categorization</CardTitle>
                <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                  AI-powered expense recognition with <span className="font-semibold text-primary">99.7% accuracy</span>. Never miss a transaction again.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card hover:scale-105 cursor-pointer">
              <CardHeader className="text-center p-8">
                <div className="relative mb-6">
                  <BarChart3 className="w-16 h-16 mx-auto text-secondary drop-shadow-lg" />
                  <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardTitle className="text-2xl mb-4 group-hover:text-secondary transition-colors">Wealth Analytics</CardTitle>
                <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                  Real-time insights with <span className="font-semibold text-secondary">predictive modeling</span>. See your financial future clearly.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group shadow-premium hover:shadow-hover transition-all duration-500 border-0 bg-gradient-card hover:scale-105 cursor-pointer">
              <CardHeader className="text-center p-8">
                <div className="relative mb-6">
                  <Shield className="w-16 h-16 mx-auto text-accent drop-shadow-lg" />
                  <div className="absolute -inset-4 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardTitle className="text-2xl mb-4 group-hover:text-accent transition-colors">Fortress Security</CardTitle>
                <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-accent">Military-grade encryption</span> with multi-factor authentication. Your wealth stays protected.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}