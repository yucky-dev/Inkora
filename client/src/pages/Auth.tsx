import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth, useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isAuthLoading } = useAuth();
  const login = useLogin();
  const register = useRegister();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({ phone: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", phone: "", state: "", role: "buyer", password: "" });

  if (user) {
    setLocation(user.role?.toLowerCase() === "admin" ? "/admin" : (user.role?.toLowerCase() === "farmer" ? "/dashboard" : "/browse"));
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(loginForm, {
      onError: (err) => toast({ variant: "destructive", title: "Login Failed", description: err.message })
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(registerForm as any, {
      onError: (err) => toast({ variant: "destructive", title: "Registration Failed", description: err.message }),
      onSuccess: () => toast({ title: "Welcome!", description: "Your account has been created." })
    });
  };

  if (isAuthLoading) return null;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block relative bg-primary/10">
        <div className="absolute inset-0">
          {/* auth page scenic farmer working field */}
          <img 
            src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1974&auto=format&fit=crop" 
            alt="Farmer in field" 
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/20 mix-blend-multiply" />
        </div>
        <div className="relative z-10 h-full flex flex-col items-start justify-end p-16 text-white">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md mb-6 inline-block">
            <Sprout className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4 leading-tight">
            Grow your network.<br/>Expand your reach.
          </h1>
          <p className="text-xl text-white/80 max-w-lg">
            Join thousands of farmers and buyers conducting fair, transparent trade directly on Inkora.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Enter your details to access your account</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 mb-8 bg-muted/50 p-1">
              <TabsTrigger value="login" className="rounded-lg text-base">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg text-base">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="animate-in fade-in slide-in-from-bottom-2">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="e.g. 08012345678" 
                    required 
                    className="h-12 bg-card"
                    value={loginForm.phone}
                    onChange={e => setLoginForm({...loginForm, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="h-12 bg-card"
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-primary/20" disabled={login.isPending}>
                  {login.isPending ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="animate-in fade-in slide-in-from-bottom-2">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input 
                    id="reg-name" 
                    placeholder="John Doe" 
                    required 
                    className="h-12 bg-card"
                    value={registerForm.name}
                    onChange={e => setRegisterForm({...registerForm, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone Number</Label>
                    <Input 
                      id="reg-phone" 
                      placeholder="080..." 
                      required 
                      className="h-12 bg-card"
                      value={registerForm.phone}
                      onChange={e => setRegisterForm({...registerForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-state">State / Region</Label>
                    <Input 
                      id="reg-state" 
                      placeholder="e.g. Kano" 
                      required 
                      className="h-12 bg-card"
                      value={registerForm.state}
                      onChange={e => setRegisterForm({...registerForm, state: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-role">I am a...</Label>
                  <Select value={registerForm.role} onValueChange={(v) => setRegisterForm({...registerForm, role: v})}>
                    <SelectTrigger className="h-12 bg-card">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer (Looking to purchase crops)</SelectItem>
                      <SelectItem value="farmer">Farmer (Looking to sell harvest)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    required 
                    className="h-12 bg-card"
                    value={registerForm.password}
                    onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-primary/20 mt-2" disabled={register.isPending}>
                  {register.isPending ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
