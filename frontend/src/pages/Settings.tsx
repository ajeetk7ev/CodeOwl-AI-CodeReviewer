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
  Link as LinkIcon,
  Bell,
  Shield,
  Palette,
  Key,
  Trash2,
  Download,
  Moon,
  Sun,
  Monitor,
  Eye,
  Settings as SettingsIcon,
  Smartphone,
  Plus,
  Copy,
  MoreHorizontal,
  AlertTriangle,
  LogOut,
  Crown,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import api from "@/services/api";
import type{
  User,
  UsageStats,
  GithubStatus,
  UserSettings,
  ApiKey,
  UserSession,
  TwoFactorStatus
} from "@/types/api";
import { useAuthStore } from "@/store/authStore";

export default function Settings() {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [githubStatus, setGithubStatus] = useState<GithubStatus | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usageRes,
          githubRes,
          settingsRes,
          apiKeysRes,
          sessionsRes,
          twoFactorRes
        ] = await Promise.all([
          api.get<UsageStats>("/settings/usage"),
          api.get<GithubStatus>("/settings/github-status"),
          api.get<UserSettings>("/settings/settings"),
          api.get<ApiKey[]>("/settings/api-keys"),
          api.get<UserSession[]>("/settings/sessions"),
          api.get<TwoFactorStatus>("/settings/two-factor")
        ]);
        setUsage(usageRes.data);
        setGithubStatus(githubRes.data);
        setSettings(settingsRes.data);
        setApiKeys(apiKeysRes.data);
        setSessions(sessionsRes.data);
        setTwoFactorStatus(twoFactorRes.data);
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
      toast.success("Profile updated successfully");
    } catch (error) {
       console.error("Failed to update profile", error);
       toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await api.put("/settings/settings", { settings });
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update settings", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newApiKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    try {
      const response = await api.post("/settings/api-keys", { name: newApiKeyName.trim() });
      setApiKeys([...apiKeys, response.data]);
      setNewApiKeyName("");
      setApiKeyDialogOpen(false);
      toast.success("API key created successfully");
    } catch (error) {
      console.error("Failed to create API key", error);
      toast.error("Failed to create API key");
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      await api.delete(`/settings/api-keys/${keyId}`);
      setApiKeys(apiKeys.filter(key => key.key !== keyId));
      toast.success("API key deleted successfully");
    } catch (error) {
      console.error("Failed to delete API key", error);
      toast.error("Failed to delete API key");
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await api.delete(`/settings/sessions/${sessionId}`);
      setSessions(sessions.filter(session => session.sessionId !== sessionId));
      toast.success("Session revoked successfully");
    } catch (error) {
      console.error("Failed to revoke session", error);
      toast.error("Failed to revoke session");
    }
  };

  const handleExportData = async () => {
    try {
      const response = await api.get("/settings/account/export");
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `codeowl-data-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Failed to export data", error);
      toast.error("Failed to export data");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      await api.post("/settings/account/delete", { confirmText: deleteConfirmText });
      logout();
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error("Failed to delete account", error);
      toast.error("Failed to delete account");
    }
  };

  const handleConnectGithub = () => {
    window.location.href = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/auth/github`
        : "http://localhost:5001/auth/github"; 
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="space-y-2">
                <Skeleton className="h-10 w-48 bg-secondary/10" />
                <Skeleton className="h-4 w-72 bg-secondary/10" />
            </div>
        <div className="grid gap-6">
          <Skeleton className="h-[600px] w-full bg-secondary/10 rounded-2xl" />
        </div>
        </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10">
      <div>
         <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
         <p className="text-muted-foreground mt-1">Configure your personal workspace and security preferences.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-[#0C0C0C] border border-[#1F1F1F] rounded-2xl p-1">
          <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
            <UserIcon className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-[#0C0C0C] border border-[#1F1F1F] rounded-2xl p-1">
          <TabsTrigger value="privacy" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="api" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="usage" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Usage
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
            <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
                <CardTitle className="text-lg font-bold text-white">Profile Information</CardTitle>
                <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-6 pt-8">
               <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-2 ring-[#1F1F1F] ring-offset-4 ring-offset-[#0C0C0C] shadow-2xl">
                        <AvatarImage src={profile?.avatar} />
                        <AvatarFallback className="text-2xl bg-[#141414] text-white">{profile?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <button type="button" className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-lg scale-90 group-hover:scale-100 transition-transform duration-200">
                        <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{profile?.name}</h3>
                      <p className="text-sm text-muted-foreground">Developer</p>
                      <Badge variant="secondary" className="mt-1">
                        <Crown className="w-3 h-3 mr-1" />
                        {profile?.plan === 'pro' ? 'Pro' : 'Free'} Plan
                      </Badge>
                    </div>
               </div>
               
               <div className="space-y-4">
                  <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
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
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                     <div className="relative group">
                         <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                         <Input 
                            className="h-11 pl-11 bg-[#090909] border-[#1F1F1F] rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all text-white" 
                            value={profile?.email || "Enter your email address"} 
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

            <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
                <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
                    <CardTitle className="text-lg font-bold text-white">Connections</CardTitle>
                <CardDescription>Manage your external platform integrations.</CardDescription>
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
                          ? `Connected as @${githubStatus.username}`
                          : "Link your GitHub account to get started"}
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
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
            <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
              <CardTitle className="text-lg font-bold text-white">Appearance Settings</CardTitle>
              <CardDescription>Customize how CodeOwl looks and feels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Theme</Label>
                  <Select value={settings?.theme || "system"} onValueChange={(value: "light" | "dark" | "system") => settings && setSettings({...settings, theme: value})}>
                    <SelectTrigger className="bg-[#090909] border-[#1F1F1F] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Language</Label>
                  <Select value={settings?.language || "en"} onValueChange={(value: string) => settings && setSettings({...settings, language: value})}>
                    <SelectTrigger className="bg-[#090909] border-[#1F1F1F] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Timezone</Label>
                  <Select value={settings?.timezone || "UTC"} onValueChange={(value: string) => settings && setSettings({...settings, timezone: value})}>
                    <SelectTrigger className="bg-[#090909] border-[#1F1F1F] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-6 bg-[#090909]">
              <Button disabled={saving} onClick={handleUpdateSettings} className="rounded-xl shadow-lg shadow-primary/20 px-8 h-10">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
            <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
              <CardTitle className="text-lg font-bold text-white">Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.email || false}
                    onCheckedChange={(checked: boolean) => settings && setSettings({
                      ...settings,
                      notifications: {...settings.notifications, email: checked}
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.push || false}
                    onCheckedChange={(checked: boolean) => settings && setSettings({
                      ...settings,
                      notifications: {...settings.notifications, push: checked}
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Review Comments</Label>
                    <p className="text-xs text-muted-foreground">Get notified when AI reviews comment on your PRs</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.reviewComments || false}
                    onCheckedChange={(checked: boolean) => settings && setSettings({
                      ...settings,
                      notifications: {...settings.notifications, reviewComments: checked}
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Pull Request Updates</Label>
                    <p className="text-xs text-muted-foreground">Notifications for PR status changes</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.prUpdates || false}
                    onCheckedChange={(checked: boolean) => settings && setSettings({
                      ...settings,
                      notifications: {...settings.notifications, prUpdates: checked}
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Weekly Digest</Label>
                    <p className="text-xs text-muted-foreground">Weekly summary of your activity</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.weeklyDigest || false}
                    onCheckedChange={(checked: boolean) => settings && setSettings({
                      ...settings,
                      notifications: {...settings.notifications, weeklyDigest: checked}
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Marketing Emails</Label>
                    <p className="text-xs text-muted-foreground">Product updates and feature announcements</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.marketingEmails || false}
                    onCheckedChange={(checked: boolean) => settings && setSettings({
                      ...settings,
                      notifications: {...settings.notifications, marketingEmails: checked}
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Security Alerts</Label>
                    <p className="text-xs text-muted-foreground">Important security notifications</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.securityAlerts || false}
                    onCheckedChange={(checked: boolean) => settings && setSettings({
                      ...settings,
                      notifications: {...settings.notifications, securityAlerts: checked}
                    })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-6 bg-[#090909]">
              <Button disabled={saving} onClick={handleUpdateSettings} className="rounded-xl shadow-lg shadow-primary/20 px-8 h-10">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
            <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
              <CardTitle className="text-lg font-bold text-white">Privacy Settings</CardTitle>
              <CardDescription>Control your data and privacy preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Profile Visibility</Label>
                  <Select
                    value={settings?.privacy.profileVisibility || "private"}
                    onValueChange={(value: "public" | "private") => settings && setSettings({
                      ...settings,
                      privacy: {...settings.privacy, profileVisibility: value}
                    })}
                  >
                    <SelectTrigger className="bg-[#090909] border-[#1F1F1F] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible to everyone</SelectItem>
                      <SelectItem value="private">Private - Only visible to you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Show Activity</Label>
                    <p className="text-xs text-muted-foreground">Display your activity on your public profile</p>
                  </div>
                  <Switch
                    checked={settings?.privacy.showActivity || false}
                    onCheckedChange={(checked: boolean) => settings && setSettings({
                      ...settings,
                      privacy: {...settings.privacy, showActivity: checked}
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Analytics</Label>
                    <p className="text-xs text-muted-foreground">Help improve CodeOwl by sharing usage analytics</p>
                  </div>
                  <Switch
                    checked={settings?.privacy.allowAnalytics || false}
                    onCheckedChange={(checked: boolean) => settings && setSettings({
                      ...settings,
                      privacy: {...settings.privacy, allowAnalytics: checked}
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Data Retention</Label>
                  <Select
                    value={settings?.privacy.dataRetention || "2years"}
                    onValueChange={(value: "1year" | "2years" | "forever") => settings && setSettings({
                      ...settings,
                      privacy: {...settings.privacy, dataRetention: value}
                    })}
                  >
                    <SelectTrigger className="bg-[#090909] border-[#1F1F1F] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">How long to keep your data after account deletion</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-6 bg-[#090909]">
              <Button disabled={saving} onClick={handleUpdateSettings} className="rounded-xl shadow-lg shadow-primary/20 px-8 h-10">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
                <CardTitle className="text-lg font-bold text-white">Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-white">
                      {twoFactorStatus?.enabled ? "Two-Factor Authentication Enabled" : "Enable Two-Factor Authentication"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {twoFactorStatus?.enabled
                        ? "Your account is protected with 2FA"
                        : "Add an extra layer of security to your account"}
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorStatus?.enabled || false}
                    onCheckedChange={async () => {
                      // This would be implemented with proper 2FA setup flow
                      toast.info("2FA setup coming soon!");
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
                <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
                <CardTitle className="text-lg font-bold text-white">Active Sessions</CardTitle>
                <CardDescription>Manage your active sessions across devices.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {sessions.slice(0, 3).map((session, index) => (
                    <div key={session.sessionId} className="flex items-center justify-between p-4 rounded-xl bg-[#090909] border border-[#1F1F1F]">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-[#141414]">
                          <Smartphone className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{session.device || "Unknown Device"}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.ip} • Last active {new Date(session.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevokeSession(session.sessionId)}
                          className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                  {sessions.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      And {sessions.length - 3} more sessions...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
            <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
              <CardTitle className="text-lg font-bold text-white">API Keys</CardTitle>
              <CardDescription>Manage your API keys for programmatic access.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  API keys allow you to access CodeOwl programmatically. Keep them secure!
                </p>
                <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      New API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0C0C0C] border-[#1F1F1F]">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New API Key</DialogTitle>
                      <DialogDescription>
                        Enter a name for your new API key. You can use this key to authenticate API requests.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="API Key Name (e.g., 'Production App')"
                        value={newApiKeyName}
                        onChange={(e) => setNewApiKeyName(e.target.value)}
                        className="bg-[#090909] border-[#1F1F1F] text-white"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateApiKey}>Create Key</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No API keys yet</p>
                    <p className="text-sm text-muted-foreground">Create your first API key to get started</p>
                  </div>
                ) : (
                  apiKeys.map((apiKey) => (
                    <div key={apiKey.key} className="flex items-center justify-between p-4 rounded-xl bg-[#090909] border border-[#1F1F1F]">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-[#141414]">
                            <Key className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{apiKey.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              ck_••••••••{apiKey.key.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="rounded-lg"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="rounded-lg">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#0C0C0C] border-[#1F1F1F]">
                            <DropdownMenuItem
                              onClick={() => handleDeleteApiKey(apiKey.key)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
                <CardTitle className="text-lg font-bold text-white">Account Management</CardTitle>
                <CardDescription>Manage your account settings and data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="w-full h-11 rounded-xl border-[#1F1F1F] hover:bg-white hover:text-black hover:border-white transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Your Data
                </Button>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl border-red-500/20 text-red-500/70 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 font-bold transition-all"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0C0C0C] border-[#1F1F1F]">
                    <DialogHeader>
                      <DialogTitle className="text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        Delete Account
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-400">
                          Type <strong>DELETE</strong> to confirm account deletion:
                        </p>
                        <Input
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="DELETE"
                          className="mt-2 bg-[#090909] border-[#1F1F1F] text-white"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "DELETE"}
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  onClick={logout}
                  className="w-full h-11 rounded-xl border-[#1F1F1F] text-red-500/70 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 font-bold transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-6">
                <CardTitle className="text-lg font-bold text-white">Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#090909] border border-[#1F1F1F]">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {profile?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.plan === 'pro' ? 'Unlimited repositories and reviews' : 'Up to 5 repositories'}
                    </p>
                  </div>
                  <Badge variant={profile?.plan === 'pro' ? 'default' : 'secondary'}>
                    {profile?.plan === 'pro' ? 'Active' : 'Free'}
                  </Badge>
                </div>

                {profile?.plan !== 'pro' && (
                  <Button className="w-full mt-4 rounded-xl">
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                )}
                </CardContent>
            </Card>
        </div>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-6">
          <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
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
        </TabsContent>
      </Tabs>
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
