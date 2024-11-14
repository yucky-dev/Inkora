import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateListing } from "@/hooks/use-listings";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";

export default function CreateListing() {
  const [, setLocation] = useLocation();
  const { data: user } = useAuth();
  const createListing = useCreateListing();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cropName: "",
    category: "Food crop",
    quantity: "",
    unit: "kg",
    price: "",
    harvestDate: "",
    imageUrl: "",
  });

  if (!user || user.role !== "farmer") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createListing.mutate({
      ...formData,
      quantity: formData.quantity,
      price: formData.price,
      harvestDate: formData.harvestDate ? new Date(formData.harvestDate).toISOString() : undefined,
    } as any, {
      onSuccess: () => {
        toast({ title: "Success", description: "Your listing has been published!" });
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
        <CardHeader className="border-b bg-primary/5">
          <CardTitle className="text-2xl font-display">New Crop Listing</CardTitle>
          <CardDescription>Post your harvest to the marketplace.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cropName">Crop Name</Label>
                <Input 
                  id="cropName" 
                  placeholder="e.g. White Maize" 
                  required 
                  value={formData.cropName}
                  onChange={e => setFormData({...formData, cropName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food crop">Food Crop</SelectItem>
                    <SelectItem value="Cash crop">Cash Crop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Available</Label>
                <Input 
                  id="quantity" 
                  type="number"
                  min="1"
                  placeholder="e.g. 50" 
                  required 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit of Measurement</Label>
                <Select value={formData.unit} onValueChange={v => setFormData({...formData, unit: v})}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="tons">Tons</SelectItem>
                    <SelectItem value="baskets">Baskets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="price">Price (₦) per {formData.unit}</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
                  <Input 
                    id="price" 
                    type="number"
                    min="1"
                    placeholder="e.g. 15000" 
                    className="pl-8"
                    required 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="harvestDate">Estimated Harvest/Availability Date</Label>
                <Input 
                  id="harvestDate" 
                  type="date"
                  value={formData.harvestDate}
                  onChange={e => setFormData({...formData, harvestDate: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Image URL (Optional)</Label>
                <Input 
                  id="imageUrl" 
                  placeholder="https://images.unsplash.com/..." 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">Provide a link to a photo of your crop. Good photos attract more buyers.</p>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg mt-4 shadow-md shadow-primary/20" disabled={createListing.isPending}>
              {createListing.isPending ? "Publishing..." : "Publish Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
