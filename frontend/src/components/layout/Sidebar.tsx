import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  GitBranch,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Code2,
  Github,
  ChevronRight
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const pathname = location.pathname;

  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          label: "Dashboard",
          icon: LayoutGrid,
          href: "/dashboard",
          active: pathname === "/dashboard",
        },
        {
          label: "Repository",
          icon: GitBranch,
          href: "/dashboard/repositories",
          active: pathname.includes("/dashboard/repositories"),
        },
        {
          label: "Reviews",
          icon: FileText,
          href: "/dashboard/reviews",
          active: pathname.includes("/dashboard/reviews"),
        },
        {
          label: "Subscription",
          icon: CreditCard,
          href: "/dashboard/subscription",
          active: pathname.includes("/dashboard/subscription"),
        },
      ]
    },
    {
      title: "Others", // logical grouping 
      items: [
        {
          label: "Settings",
          icon: Settings,
          href: "/dashboard/settings",
          active: pathname.includes("/dashboard/settings"),
        },
      ]
    }
  ];

  return (
    <div className={cn("flex flex-col h-full bg-[#0C0C0C] border-r border-[#1F1F1F] relative overflow-hidden", className)}>
       {/* Ambient glow effect */}
       <div className="absolute top-0 left-0 w-full h-40 bg-primary/5 blur-[100px] pointer-events-none" />

      {/* Profile Section */}
      <div className="p-6 pb-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141414] border border-[#272727] shadow-sm mb-6">
            <div className="relative">
                 <Avatar className="h-10 w-10 border border-border/50">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#141414] rounded-full" />
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate text-white">
                    {user?.name || "CodeOwl User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    @{user?.githubId || "codeowl"}
                </p>
            </div>
        </div>
        
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 scrollbar-hide">
        {menuItems.map((group, idx) => (
            <div key={idx}>
                {group.title !== "Others" && (
                     <h4 className="text-xs font-semibold text-muted-foreground/50 tracking-wider mb-4 px-2 uppercase">
                        {group.title}
                     </h4>
                )}
               
                <div className="space-y-1">
                    {group.items.map((route) => (
                        <Link
                            key={route.href}
                            to={route.href}
                            className="block relative group"
                        >
                            {route.active && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                             <div className={cn(
                                "relative flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 group-hover:translate-x-1",
                                route.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                <route.icon className={cn(
                                    "w-5 h-5 mr-3 transition-colors",
                                    route.active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                )} />
                                <span className="font-medium">{route.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-[#1F1F1F] bg-[#0C0C0C]">
         <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl pl-3"
            onClick={() => logout()}
        >
             <LogOut className="w-5 h-5 mr-3" />
             Log Out
         </Button>
      </div>
    </div>
  );
}
