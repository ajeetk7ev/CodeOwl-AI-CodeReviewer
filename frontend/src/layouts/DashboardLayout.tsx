import { Outlet } from "react-router-dom"
import { Menu } from "lucide-react"
import { useState } from "react"

import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#000000] font-sans antialiased text-foreground">
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-[280px] md:flex-col z-50">
        <Sidebar className="w-full h-full" />
      </div>
      
      {/* Mobile Header */ }
      <div className="md:hidden flex items-center p-4 border-b border-[#1F1F1F] bg-[#0C0C0C] sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-6 w-6" />
        </Button>
        <span className="font-bold ml-4 text-lg">CodeOwl</span>
      </div>

       {/* Mobile Menu Overlay */}
       {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-[85vw] max-w-[300px] bg-[#0C0C0C] border-r border-[#1F1F1F] shadow-2xl">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-50 text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    <Menu className="h-5 w-5 rotate-90" />
                 </Button>
                 <Sidebar className="border-none w-full h-full" onClick={() => setIsMobileMenuOpen(false)}/>
            </div>
             <div className="absolute inset-0 -z-10" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
       )}

      <main className="md:pl-[280px] min-h-screen relative">
         <div className="p-4 md:p-8 pt-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Outlet />
         </div>
      </main>
    </div>
  )
}
