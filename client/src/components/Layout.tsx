import { ReactNode } from "react";
import { NavBar } from "./NavBar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <NavBar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="w-full border-t border-border/50 bg-muted/20 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-xl text-primary">AgriBridge</p>
            <p className="text-sm text-muted-foreground mt-1">Connecting smallholder farmers with direct buyers.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AgriBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
