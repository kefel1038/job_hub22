import { Link, useLocation } from "wouter";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Briefcase className="h-5 w-5 text-primary" />
          <span>JobBoard</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">Jobs</Link>
          </Button>
          {user && (user.role === "employer" || user.role === "admin") && (
            <Button variant="ghost" asChild>
              <Link href="/post-job">Post Job</Link>
            </Button>
          )}
          {user ? (
            <>
              <Badge variant="secondary" className="hidden sm:inline-flex capitalize">
                {user.role}
              </Badge>
              <span className="hidden md:inline text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
