import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  GitBranch, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  Trash2, 
  RefreshCw,
  ExternalLink,
  Lock,
  Globe,
  Sparkles,
  ShieldCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import  type { Repository, GithubRepository } from "@/types/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";

export default function Repositories() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as "connected" | "all") || "connected";
  const [activeTab, setActiveTab] = useState<"connected" | "all">(initialTab);
  const [connectedRepos, setConnectedRepos] = useState<Repository[]>([]);
  const [githubRepos, setGithubRepos] = useState<GithubRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "public" | "private">("all");
  const [processingId, setProcessingId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleTabChange = (tab: "connected" | "all") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    fetchConnectedRepos();
  }, []);

  // Poll for indexing status if any repo is not indexed
  useEffect(() => {
    const hasIndexingRepos = connectedRepos.some(repo => !repo.indexed);
    if (hasIndexingRepos) {
      const interval = setInterval(() => {
        api.get<Repository[]>("/repositories/connected").then(res => {
          setConnectedRepos(res.data);
        }).catch(err => console.error("Polling failed", err));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [connectedRepos]);

  useEffect(() => {
    if (activeTab === "all") {
      refreshGithubRepos();
    }
  }, [activeTab, visibilityFilter]);

  const fetchConnectedRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Repository[]>("/repositories/connected");
      setConnectedRepos(res.data);
    } catch (error: any) {
      console.error("Failed to fetch connected repos", error);
      setError("Failed to load connected repositories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGithubRepos = async (page = 1, append = false) => {
    if (page === 1) setLoading(true);
    else setFetchingMore(true);
    
    setError(null);
    try {
      const perPage = 15;
      const res = await api.get<GithubRepository[]>(`/repositories/github?page=${page}&perPage=${perPage}&visibility=${visibilityFilter}`);
      
      if (append) {
        setGithubRepos(prev => [...prev, ...res.data]);
      } else {
        setGithubRepos(res.data);
      }
      
      setHasMore(res.data.length === perPage);
      setCurrentPage(page);
    } catch (error: any) {
       console.error("Failed to fetch github repos", error);
       setError(error.response?.data?.message || "Failed to fetch repositories from GitHub.");
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const lastRepoRef = useCallback((node: HTMLDivElement) => {
    if (loading || fetchingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchGithubRepos(currentPage + 1, true);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, fetchingMore, hasMore, currentPage]);

  const refreshGithubRepos = () => {
    setCurrentPage(1);
    setHasMore(true);
    fetchGithubRepos(1, false);
  };

  const handleConnect = async (repo: GithubRepository) => {
    setProcessingId(repo.id);
    try {
      const payload = {
        githubRepoId: String(repo.id),
        name: repo.name,
        fullName: repo.full_name,
        owner: repo.owner.login,
        private: repo.private,
        defaultBranch: repo.default_branch
      };
      
      const res = await api.post<Repository>("/repositories/connect", payload);
      setConnectedRepos([...connectedRepos, res.data]);
      handleTabChange("connected");
    } catch (error: any) {
      console.error("Failed to connect repo", error);
      if (error.response?.status === 403) {
        alert(error.response.data.message);
      } else {
        alert("Failed to connect repository. It might already be connected.");
      }
    } finally {
      setProcessingId(null);
    }
  };


  const handleDisconnect = async (id: string) => {
    if (!confirm("Are you sure you want to disconnect this repository? Reviews will be preserved but sync will stop.")) return;
    
    setProcessingId(id);
    try {
      await api.delete(`/repositories/${id}`);
      setConnectedRepos(connectedRepos.filter(r => r._id !== id));
    } catch (error) {
      console.error("Failed to disconnect", error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredGithubRepos = githubRepos.filter(repo => {
    const isConnected = connectedRepos.some(c => c.githubRepoId === String(repo.id));
    const matchesSearch = repo.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    return !isConnected && matchesSearch;
  });

  const filteredConnectedRepos = connectedRepos.filter(repo => 
    repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-white">Repositories</h1>
           <p className="text-muted-foreground mt-1">Manage your codebase connections and sync status.</p>
        </div>
        <div className="flex items-center gap-3">
            {activeTab === "all" && (
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl bg-[#0C0C0C] border-[#1F1F1F] hover:bg-primary/5 hover:text-primary transition-all shadow-lg"
                    onClick={() => refreshGithubRepos()}
                    disabled={loading || fetchingMore}
                >
                    <RefreshCw className={cn("h-4 w-4", (loading || fetchingMore) && "animate-spin")} />
                </Button>
            )}
            <div className="flex items-center gap-1 p-1 bg-[#141414] border border-[#262626] rounded-xl shadow-inner h-10">
                <button 
                    onClick={() => handleTabChange("connected")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        activeTab === "connected" 
                            ? "bg-[#262626] text-white shadow-sm" 
                            : "text-muted-foreground hover:text-white"
                    )}
                >
                    Connected
                </button>
                <button 
                    onClick={() => handleTabChange("all")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        activeTab === "all" 
                            ? "bg-[#262626] text-white shadow-sm" 
                            : "text-muted-foreground hover:text-white"
                    )}
                >
                    Add New
                </button>
            </div>
        </div>
      </div>

      {user?.plan === "free" && (
        <div className="bg-[#141414] border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Free Tier Usage</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        You've connected <span className="text-primary font-bold">{connectedRepos.length}</span> out of <span className="text-white font-bold">5</span> available repositories.
                    </p>
                </div>
            </div>
            
            <div className="w-full md:w-64 h-3 bg-[#0C0C0C] rounded-full overflow-hidden border border-[#262626]">
                <div 
                    className="h-full bg-primary shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-1000" 
                    style={{ width: `${Math.min((connectedRepos.length / 5) * 100, 100)}%` }}
                />
            </div>
            
            <Button asChild className="w-full md:w-auto rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-black font-bold">
                <Link to="/dashboard/subscription">Upgrade for Unlimited</Link>
            </Button>
        </div>
      )}

      {user?.plan === "pro" && (
        <div className="bg-[#141414] border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between shadow-2xl shadow-emerald-500/5">
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Pro Plan Active</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Enjoy unlimited repository connections and prioritized reviews.</p>
                </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Ultimate Precision Enabled
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center w-full max-w-md relative group">
           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
           <Input 
              placeholder="Search repositories..." 
              className="pl-10 h-11 bg-[#0C0C0C] border-[#1F1F1F] rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all shadow-lg" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>

        {activeTab === "all" && (
            <div className="flex items-center gap-1 p-1 bg-[#141414] border border-[#262626] rounded-xl h-11 w-full md:w-auto">
                <button 
                    onClick={() => setVisibilityFilter("all")}
                    className={cn(
                        "flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 uppercase tracking-wider",
                        visibilityFilter === "all" ? "bg-[#262626] text-white shadow-sm" : "text-muted-foreground hover:text-white"
                    )}
                >
                    All
                </button>
                <button 
                    onClick={() => setVisibilityFilter("public")}
                    className={cn(
                        "flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 uppercase tracking-wider",
                        visibilityFilter === "public" ? "bg-[#262626] text-white shadow-sm" : "text-muted-foreground hover:text-white"
                    )}
                >
                    Public
                </button>
                <button 
                    onClick={() => setVisibilityFilter("private")}
                    className={cn(
                        "flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 uppercase tracking-wider",
                        visibilityFilter === "private" ? "bg-[#262626] text-white shadow-sm" : "text-muted-foreground hover:text-white"
                    )}
                >
                    Private
                </button>
            </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium flex items-center justify-between"
            >
                <span>{error}</span>
                <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:bg-red-500/10" onClick={() => error.includes("GitHub") ? (window.location.href="/api/auth/github") : fetchConnectedRepos()}>
                    {error.includes("GitHub") ? "Connect GitHub" : "Retry"}
                </Button>
            </motion.div>
        )}
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            {loading && activeTab === "all" && githubRepos.length === 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-44 w-full bg-secondary/10 rounded-2xl" />)}
                </div>
            ) : activeTab === "connected" ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {filteredConnectedRepos.length === 0 && !loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-16 border-2 border-dashed border-[#262626] rounded-3xl bg-[#0C0C0C]/50 backdrop-blur-sm">
                            <div className="p-4 rounded-2xl bg-primary/5 mb-6">
                                <GitBranch className="h-12 w-12 text-primary/50" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No repositories connected</h3>
                            <p className="text-muted-foreground mb-8 text-center max-w-sm">Connect a repository to start generating AI reviews for your pull requests.</p>
                            <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20 px-8" onClick={() => handleTabChange("all")}>
                                <Plus className="mr-2 h-5 w-5" />
                                Connect Your First Repo
                            </Button>
                        </div>
                    ) : (
                        filteredConnectedRepos.map((repo) => (
                            <Card key={repo._id} className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl hover:border-[#333] transition-all duration-300 group overflow-hidden">
                                <CardHeader className="flex flex-row items-start justify-between pb-4">
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-lg font-bold text-white truncate max-w-[200px] sm:max-w-none">
                                                {repo.fullName}
                                            </CardTitle>
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5 border-[#262626]">
                                                {repo.private ? <Lock className="h-2.5 w-2.5 mr-1" /> : <Globe className="h-2.5 w-2.5 mr-1" />}
                                                {repo.private ? "Private" : "Public"}
                                            </Badge>
                                        </div>
                                        <CardDescription className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
                                            <GitBranch className="h-3 w-3" />
                                            {repo.defaultBranch}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {repo.indexed ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-tight">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Active
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase tracking-tight animate-pulse">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Indexing
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="pt-4 flex items-center justify-between border-t border-[#1F1F1F]">
                                        <div className="flex items-center gap-3">
                                            <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground hover:text-white rounded-lg" disabled>
                                                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                                Sync
                                            </Button>
                                            <a 
                                                href={`https://github.com/${repo.fullName}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="p-2 text-muted-foreground hover:text-white transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-9 text-xs text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded-lg"
                                            onClick={() => handleDisconnect(repo._id)}
                                            disabled={processingId === repo._id}
                                        >
                                            {processingId === repo._id ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                            )}
                                            Disconnect
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-3 grid-cols-1">
                        {filteredGithubRepos.map((repo) => (
                        <Card 
                            key={repo.id} 
                            className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                                        <GitBranch className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CardTitle className="text-base font-bold text-white truncate">{repo.name}</CardTitle>
                                            <Badge variant="outline" className="h-5 text-[10px] border-[#262626] font-mono">
                                                {repo.private ? <Lock className="h-2.5 w-2.5 mr-1" /> : <Globe className="h-2.5 w-2.5 mr-1" />}
                                                {repo.private ? "PRIVATE" : "PUBLIC"}
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-muted-foreground truncate text-xs font-mono">{repo.full_name}</CardDescription>
                                    </div>
                                </div>
                                
                                <Button 
                                    className="w-full sm:w-auto h-11 rounded-xl px-8 shadow-lg shadow-primary/5 hover:scale-[1.02] transition-transform active:scale-[0.98]" 
                                    onClick={() => handleConnect(repo)}
                                    disabled={processingId === repo.id || (user?.plan === "free" && connectedRepos.length >= 5)}
                                >
                                    {processingId === repo.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Connect
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    ))}
                    
                    {/* Infinite Scroll Trigger */}
                    {hasMore && !loading && (
                        <div ref={lastRepoRef} className="h-10 flex items-center justify-center">
                            {fetchingMore && <Loader2 className="h-6 w-6 text-primary animate-spin" />}
                        </div>
                    )}

                    {filteredGithubRepos.length === 0 && !loading && !fetchingMore && (
                        <div className="col-span-full flex flex-col items-center justify-center text-center py-20 bg-[#0C0C0C]/30 border border-[#1F1F1F] border-dashed rounded-3xl">
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                {searchQuery 
                                    ? `No repositories found matching "${searchQuery}"`
                                    : "No repositories discovered. You might need to reconnect your GitHub account to refresh permissions."}
                            </p>
                            {!searchQuery && (
                                <Button 
                                    variant="secondary" 
                                    className="rounded-xl shadow-lg"
                                    onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reconnect GitHub
                                </Button>
                            )}
                        </div>
                    )}
                    </div>
                </div>
            )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
