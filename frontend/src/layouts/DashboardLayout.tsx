import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#000000] font-sans antialiased text-foreground">
      {/* Sidebar for desktop and bottom bar for mobile */}
      <div className="md:fixed md:inset-y-0 md:flex md:w-[280px] md:flex-col z-50">
        <Sidebar className="w-full h-full" />
      </div>
      
      {/* Main content */}
      <main className="md:pl-[280px] pb-20 md:pb-0 min-h-screen relative">
         <div className="p-4 md:p-8 pt-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Outlet />
         </div>
      </main>
    </div>
  )
}
