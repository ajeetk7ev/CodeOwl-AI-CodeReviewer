import { Link, useLocation } from "react-router-dom";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Blog", href: "#blog" },
  { name: "About", href: "#about" },
];

export default function Navbar() {
  const { user } = useAuthStore();
  const location = useLocation();
  const currentPath = location.pathname + location.hash;

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <div className="bg-background/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 flex items-center justify-between shadow-2xl shadow-primary/5">
        <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl overflow-hidden transition-colors">
            <img src="/favicon.png" alt="CodeOwl" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
            CodeOwl
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5">
          {navItems.map((item) => {
            const isActive = currentPath === item.href || (item.href === "#" && currentPath === "/");
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                )}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Button asChild size="sm" className="rounded-full px-6 h-9 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4"
              >
                Login
              </Link>
              <Button asChild size="sm" className="rounded-full px-6 h-9 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                <Link to="/login">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
