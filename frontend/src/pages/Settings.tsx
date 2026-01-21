import { useEffect, useState } from "react";
import { 
  User as UserIcon, 
  Mail, 
  Github, 
  CreditCard, 
  CheckCircle2, 
  Loader2,
  Save,
  BarChart3,
  Camera,
  Link as LinkIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import type{ User, UsageStats, GithubStatus } from "@/types/api";
import { useAuthStore } from "@/store/authStore";

export default function Settings() {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [githubStatus, setGithubStatus] = useState<GithubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usageRes, githubRes] = await Promise.all([
          api.get<UsageStats>("/settings/usage"),
          api.get<GithubStatus>("/settings/github-status")
        ]);
        setUsage(usageRes.data);
        setGithubStatus(githubRes.data);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSaving(true);
    try {
      await api.put("/settings/profile", { name: profile.name, email: profile.email });
      alert("Profile updated successfully");
    } catch (error) {
       console.error("Failed to update profile", error);
       alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleConnectGithub = () => {
    // Redirect to GitHub OAuth
    window.location.href = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/auth/github`
        : "http://localhost:5001/auth/github"; 
  };

  if (loading) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="space-y-2">
                <Skeleton className="h-10 w-48 bg-secondary/10" />
                <Skeleton className="h-4 w-72 bg-secondary/10" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-[400px] w-full bg-secondary/10 rounded-2xl" />
                <Skeleton className="h-[400px] w-full bg-secondary/10 rounded-2xl" />
                <Skeleton className="h-[200px] w-full md:col-span-2 bg-secondary/10 rounded-2xl" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10">
      <div>
         <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
         <p className="text-muted-foreground mt-1">Configure your personal workspace and security preferences.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Settings */}
        <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden self-start">
            <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
               <CardTitle className="text-lg font-bold text-white">Profile Identity</CardTitle>
               <CardDescription>Visual and contact information.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-6 pt-8">
               <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-2 ring-[#1F1F1F] ring-offset-4 ring-offset-[#0C0C0C] shadow-2xl">
                        <AvatarImage src={profile?.avatar} />
                        <AvatarFallback className="text-2xl bg-[#141414] text-white">{profile?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <button type="button" className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-lg scale-90 group-hover:scale-100 transition-transform duration-200">
                        <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{profile?.name}</h3>
                    <p className="text-sm text-muted-foreground mr-6">Developer</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                     <div className="relative group">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            className="h-11 pl-11 bg-[#090909] border-[#1F1F1F] rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all text-white" 
                            value={profile?.name || ""} 
                            onChange={(e) => profile && setProfile({...profile, name: e.target.value})}
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                     <div className="relative group">
                         <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                         <Input 
                            className="h-11 pl-11 bg-[#090909] border-[#1F1F1F] rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all text-white" 
                            value={profile?.email || ""} 
                            onChange={(e) => profile && setProfile({...profile, email: e.target.value})}
                         />
                     </div>
                  </div>
               </div>
            </CardContent>
            <CardFooter className="flex justify-end p-6 bg-[#090909]">
               <Button type="submit" disabled={saving} className="rounded-xl shadow-lg shadow-primary/20 px-8 h-10">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
               </Button>
            </CardFooter>
            </form>
        </Card>

        <div className="space-y-8">
            {/* GitHub Integration */}
            <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
                <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
                    <CardTitle className="text-lg font-bold text-white">Connections</CardTitle>
                    <CardDescription>Power your workflow with external platforms.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] shadow-inner group">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-2xl bg-white text-black shadow-lg shadow-white/5">
                                <Github className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-white tracking-tight">GitHub</p>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {githubStatus?.connected 
                                        ? `Logged in as @${githubStatus.username}` 
                                        : "Link your GitHub account"}
                                </p>
                            </div>
                        </div>
                        {githubStatus?.connected ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Connected
                            </div>
                        ) : (
                            <Button size="sm" variant="outline" className="rounded-lg border-[#222] hover:bg-white hover:text-black hover:border-white transition-all" onClick={handleConnectGithub}>
                                <LinkIcon className="h-3.5 w-3.5 mr-2" />
                                Connect
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Account Management */}
            <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
                <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
                    <CardTitle className="text-lg font-bold text-white">Security</CardTitle>
                    <CardDescription>Authentication and session controls.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Button variant="outline" className="w-full h-11 rounded-xl border-[#1F1F1F] text-red-500/70 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 font-bold transition-all" onClick={logout}>
                        Log out of session
                    </Button>
                </CardContent>
            </Card>
        </div>

        {/* Usage Stats (Full Width) */}
         <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden md:col-span-2">
            <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
               <CardTitle className="text-xl font-bold text-white">Resource Utilization</CardTitle>
               <CardDescription>Analytics for your current billing cycle.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-3">
                  <UsageItem 
                    icon={CreditCard} 
                    label="Repositories" 
                    value={usage?.totalRepos || 0} 
                    color="text-blue-500" 
                    bgColor="bg-blue-500/10"
                    borderColor="border-blue-500/20"
                  />
                  <UsageItem 
                    icon={CheckCircle2} 
                    label="AI Reviews" 
                    value={usage?.totalReviews || 0} 
                    color="text-emerald-500" 
                    bgColor="bg-emerald-500/10"
                    borderColor="border-emerald-500/20"
                  />
                  <UsageItem 
                    icon={BarChart3} 
                    label="Pull Requests" 
                    value={usage?.totalPRs || 0} 
                    color="text-purple-500" 
                    bgColor="bg-purple-500/10"
                    borderColor="border-purple-500/20"
                  />
              </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

function UsageItem({ icon: Icon, label, value, color, bgColor, borderColor }: any) {
    return (
        <div className={`p-6 rounded-2xl bg-[#090909] border ${borderColor} shadow-inner flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-all duration-300`}>
            <div className={`p-3 rounded-2xl ${bgColor} ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white tracking-tight">{value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-60 group-hover:opacity-100 transition-opacity">{label}</div>
        </div>
    )
}
