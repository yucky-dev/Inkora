import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Browse from "./pages/Browse";
import ListingDetail from "./pages/ListingDetail";
import Dashboard from "./pages/Dashboard";
import FarmProfile from "./pages/FarmProfile";
import CreateListing from "./pages/CreateListing";
import Admin from "./pages/Admin";
import SellerProfile from "./pages/SellerProfile";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/browse" component={Browse} />
        <Route path="/listing/:id" component={ListingDetail} />
        <Route path="/seller/:id" component={SellerProfile} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/farm-profile" component={FarmProfile} />
        <Route path="/create-listing" component={CreateListing} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
