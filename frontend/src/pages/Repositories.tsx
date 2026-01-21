import { useEffect, useState } from "react";
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
  Globe
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import  type { Repository, GithubRepository } from "@/types/api";
import { cn } from "@/lib/utils";

export default function Repositories() {
  const [activeTab, setActiveTab] = useState<"connected" | "all">("connected");
  const [connectedRepos, setConnectedRepos] = useState<Repository[]>([]);
  const [githubRepos, setGithubRepos] = useState<GithubRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchConnectedRepos();
  }, []);

  useEffect(() => {
    if (activeTab === "all" && githubRepos.length === 0) {
      fetchGithubRepos();
    }
  }, [activeTab]);

  const fetchConnectedRepos = async () => {
    setLoading(true);
    try {
      const res = await api.get<Repository[]>("/repositories/connected");
      setConnectedRepos(res.data);
    } catch (error) {
      console.error("Failed to fetch connected repos", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGithubRepos = async () => {
    setLoading(true);
    try {
      const res = await api.get<GithubRepository[]>("/repositories/github");
      setGithubRepos(res.data);
    } catch (error) {
       console.error("Failed to fetch github repos", error);
    } finally {
      setLoading(false);
    }
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
      setActiveTab("connected");
    } catch (error) {
      console.error("Failed to connect repo", error);
      alert("Failed to connect repository. It might already be connected.");
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
        <div className="flex items-center gap-1 p-1 bg-[#141414] border border-[#262626] rounded-xl shadow-inner">
           <button 
              onClick={() => setActiveTab("connected")}
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
              onClick={() => setActiveTab("all")}
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

      <div className="flex items-center w-full max-w-md relative group">
         <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
         <Input 
            placeholder="Search repositories..." 
            className="pl-10 h-11 bg-[#0C0C0C] border-[#1F1F1F] rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all shadow-lg" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
         />
      </div>

      <AnimatePresence mode="wait">
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
                            <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20 px-8" onClick={() => setActiveTab("all")}>
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
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {filteredGithubRepos.map((repo) => (
                        <Card key={repo.id} className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl hover:border-primary/30 transition-all duration-300">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-1">
                                    <CardTitle className="text-lg font-bold text-white truncate pr-4">{repo.name}</CardTitle>
                                    <Badge variant="outline" className="border-[#262626]">{repo.private ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}</Badge>
                                </div>
                                <CardDescription className="text-muted-foreground truncate text-xs">{repo.full_name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button 
                                    className="w-full h-11 rounded-xl shadow-lg shadow-primary/5 hover:scale-[1.01] transition-transform active:scale-[0.99]" 
                                    onClick={() => handleConnect(repo)}
                                    disabled={processingId === repo.id}
                                >
                                    {processingId === repo.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Connect Repository
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredGithubRepos.length === 0 && !loading && (
                        <div className="col-span-full text-center text-muted-foreground py-20 bg-[#0C0C0C]/30 border border-[#1F1F1F] border-dashed rounded-3xl">
                            No repositories found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
