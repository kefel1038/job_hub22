import { Link, useLocation } from "wouter";
import { Shield, Briefcase, Building, LayoutDashboard, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Shield },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Companies", href: "/companies", icon: Building },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">JobBridge</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Button asChild variant="default" size="sm">
                <Link href="/post-job">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Job
                </Link>
              </Button>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                  <Button asChild className="mt-4 w-full" onClick={() => setOpen(false)}>
                    <Link href="/post-job">
                      <Plus className="mr-2 h-4 w-4" />
                      Post Job
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/40 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">JobBridge</span>
          </div>
          <p className="text-muted-foreground mb-6">
            The hiring platform Qatar professionals trust.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
            <Link href="/companies" className="hover:text-primary transition-colors">Companies</Link>
            <Link href="/post-job" className="hover:text-primary transition-colors">Post a Job</Link>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JobBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
