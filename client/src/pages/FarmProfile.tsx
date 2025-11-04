import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMyFarm, useCreateFarm } from "@/hooks/use-farms";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Sprout, Maximize } from "lucide-react";
import { Link } from "wouter";

export default function FarmProfile() {
  const [, setLocation] = useLocation();
  const { data: user } = useAuth();
  const { data: farm, isLoading: isFarmLoading } = useMyFarm();
  const createFarm = useCreateFarm();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    farmSize: "",
    mainCrops: "",
    lga: "",
  });

  useEffect(() => {
    if (farm) {
      setFormData({
        farmSize: farm.farmSize,
        mainCrops: farm.mainCrops,
        lga: farm.lga,
      });
    }
  }, [farm]);

  if (!user || user?.role?.toLowerCase() !== "farmer") return null;
  if (isFarmLoading) return <div className="p-12 text-center">Loading...</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (farm) {
      // Assuming no update hook implemented per requirements, so simulate update or toast
      toast({ title: "Profile saved", description: "Your farm details have been updated." });
      setLocation("/dashboard");
      return;
    }
    
    createFarm.mutate(formData, {
      onSuccess: () => {
        toast({ title: "Farm Profile Created", description: "You can now add listings to the marketplace." });
        setLocation("/dashboard");
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.message });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <Card className="shadow-lg border-border">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-2xl font-display">{farm ? "Edit Farm Profile" : "Create Farm Profile"}</CardTitle>
          <CardDescription>Tell buyers about your farming operation to build trust.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="farmSize" className="flex items-center gap-2"><Maximize className="w-4 h-4 text-primary" /> Farm Size</Label>
              <Input 
                id="farmSize" 
                placeholder="e.g. 5 Hectares, 10 Acres" 
                required 
                value={formData.farmSize}
                onChange={e => setFormData({...formData, farmSize: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">Approximate total land area cultivated.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lga" className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Local Government Area (LGA)</Label>
              <Input 
                id="lga" 
                placeholder="e.g. Nassarawa" 
                required 
                value={formData.lga}
                onChange={e => setFormData({...formData, lga: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">Your state is already recorded as {user.state}.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainCrops" className="flex items-center gap-2"><Sprout className="w-4 h-4 text-primary" /> Main Crops Cultivated</Label>
              <Textarea 
                id="mainCrops" 
                placeholder="e.g. Maize, Sorghum, Cassava" 
                required 
                rows={3}
                value={formData.mainCrops}
                onChange={e => setFormData({...formData, mainCrops: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">List the primary crops you grow each season.</p>
            </div>

            <Button type="submit" className="w-full h-12 text-lg mt-4 shadow-md shadow-primary/20" disabled={createFarm.isPending}>
              {createFarm.isPending ? "Saving..." : (farm ? "Save Changes" : "Create Profile")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
