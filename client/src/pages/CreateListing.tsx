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
import { ArrowLeft, Image as ImageIcon, Plus, X } from "lucide-react";
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
  });
  const [imageUrls, setImageUrls] = useState<string[]>(["", "", ""]);

  if (!user || user?.role?.toLowerCase() !== "farmer") return null;

  const addImageUrl = () => {
    if (imageUrls.length < 7) setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrl = (idx: number) => {
    if (imageUrls.length > 3) setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  const updateImageUrl = (idx: number, val: string) => {
    const updated = [...imageUrls];
    updated[idx] = val;
    setImageUrls(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filledUrls = imageUrls.filter(u => u.trim() !== "");
    if (filledUrls.length < 3) {
      toast({ variant: "destructive", title: "Photos Required", description: "Please add at least 3 product photo URLs." });
      return;
    }

    createListing.mutate({
      ...formData,
      quantity: formData.quantity,
      price: formData.price,
      imageUrl: filledUrls[0] || undefined,
      imageUrls: filledUrls,
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
                <Label htmlFor="price">Price ($) per {formData.unit}</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                  <Input 
                    id="price" 
                    type="number"
                    min="1"
                    placeholder="e.g. 150" 
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

              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Product Photos
                    <span className="text-xs text-muted-foreground font-normal">(min. 3, max. 7)</span>
                  </Label>
                  {imageUrls.length < 7 && (
                    <Button type="button" variant="outline" size="sm" onClick={addImageUrl} className="h-8 text-xs gap-1">
                      <Plus className="w-3 h-3" /> Add Photo
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {idx + 1}
                      </div>
                      <Input
                        placeholder={`Photo ${idx + 1} URL — e.g. https://images.unsplash.com/...`}
                        value={url}
                        onChange={e => updateImageUrl(idx, e.target.value)}
                        className="flex-1"
                        required={idx < 3}
                      />
                      {imageUrls.length > 3 && (
                        <button type="button" onClick={() => removeImageUrl(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Provide image URLs for your product. More photos build buyer trust and transparency.</p>
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
