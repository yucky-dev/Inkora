import { Link, useLocation } from "wouter";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sprout, Menu, X, User as UserIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavBar() {
  const [location] = useLocation();
  const { data: user, isLoading } = useAuth();
  const logout = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/browse" },
  ];

  if (user?.role === "farmer") {
    navLinks.push({ name: "Dashboard", href: "/dashboard" });
  } else if (user?.role === "admin") {
    navLinks.push({ name: "Admin Panel", href: "/admin" });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                AgriBridge
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              {!isLoading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2 px-2 hover:bg-primary/10 hover:text-primary transition-all">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Logged in as {user.role}
                        </div>
                        <DropdownMenuItem asChild>
                          <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="cursor-pointer w-full text-left">
                            {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => logout.mutate()}
                          className="text-destructive focus:bg-destructive/10 cursor-pointer"
                        >
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                        <Link href="/auth">Log in</Link>
                      </Button>
                      <Button asChild className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                        <Link href="/auth">Sign up</Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                location === link.href ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            {user ? (
              <Button variant="destructive" onClick={() => { logout.mutate(); setIsMobileMenuOpen(false); }} className="w-full">
                Log out
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/auth">Log in</Link>
                </Button>
                <Button asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/auth">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
