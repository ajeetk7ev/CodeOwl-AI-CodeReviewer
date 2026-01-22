import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Github, Loader2, Code2, Sparkles, ArrowRight, ShieldCheck, Zap, GitPullRequest, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error("Login failed. Please try again.");
    }
  }, [searchParams]);

  const handleGithubLogin = () => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    console.log(baseUrl);
    
    setTimeout(() => {
        window.location.href = `${baseUrl}/auth/github`;
    }, 500);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden relative">
        <div className="absolute lg:fixed top-6 left-6 md:top-8 md:left-8 lg:top-8 lg:left-8 z-20">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="rounded-full md:rounded-xl h-12 w-12 md:h-auto md:w-auto md:px-4 md:py-2 flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-foreground bg-transparent md:bg-white/5 hover:bg-white/10 border-transparent md:border md:border-white/10 transition-all"
            >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden md:inline font-bold">Back</span>
            </Button>
        </div>
        {/* Left Side: Visual/Social Proof (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 relative flex-col justify-center p-20 overflow-hidden">
            {/* Background Mesh Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.1),transparent_50%)]" />
            <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse shadow-[0_0_100px_rgba(251,191,36,0.05)]" />
            
            <div className="relative z-10 space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
                        <Code2 className="w-7 h-7 text-primary" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic">CodeOwl</span>
                </div>

                <div className="space-y-6 max-w-xl">
                    <h2 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                        Ship Quality Code <br />
                        <span className="text-primary italic">Faster Than Ever.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Join thousands of developers using AI-powered insights to catch bugs, 
                        improve security, and automate their PR workflow.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-10">
                    <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h4 className="font-bold text-lg">Military-Grade Security</h4>
                        <p className="text-sm text-muted-foreground">Every PR is scanned for vulnerabilities and anti-patterns.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Zap className="w-5 h-5 text-amber-500" />
                        </div>
                        <h4 className="font-bold text-lg">Instant Reviews</h4>
                        <p className="text-sm text-muted-foreground">Get feedback in milliseconds, not hours or days.</p>
                    </div>
                </div>

                <div className="pt-10 flex items-center gap-6">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover opacity-80" />
                            </div>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                        <span className="text-foreground font-bold italic">500+ teams</span> already shipping better code.
                    </p>
                </div>
            </div>

            {/* Floating UI Elements */}
            <div className="absolute bottom-20 right-[-10%] w-80 p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl -rotate-6 animate-bounce-slow">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <GitPullRequest className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">PR #42 Reviewed</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Completed by CodeOwl</p>
                    </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-emerald-500/50" />
                </div>
            </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
            {/* Background Glow (Visible on Mobile) */}
            <div className="lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
                <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-secondary/15 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-[420px] space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center lg:text-left space-y-3">
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight">Welcome back</h1>
                    <p className="text-lg text-muted-foreground font-medium">Continue your journey with CodeOwl</p>
                </div>

                <Card className="bg-card/30 backdrop-blur-3xl border-white/10 shadow-3xl rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-10 space-y-10">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Github className="w-12 h-12 text-white relative z-10" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center ring-4 ring-background shadow-xl">
                                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold">Connect your GitHub</h3>
                                <p className="text-sm text-muted-foreground max-w-[200px]">Securely access your repositories and PRs</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Button 
                                variant="default" 
                                className="w-full h-16 rounded-[1.25rem] text-xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/40 relative overflow-hidden group bg-primary hover:bg-primary/90" 
                                onClick={handleGithubLogin} 
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-7 w-7" />
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <Github className="w-7 h-7" />
                                        <span>Continue with GitHub</span>
                                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                )}
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </Button>
                            
                            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest justify-center">
                                <span className="h-px flex-1 bg-white/5" />
                                <span>Zero-config setup</span>
                                <span className="h-px flex-1 bg-white/5" />
                            </div>

                            <p className="text-center text-[11px] leading-relaxed text-muted-foreground/60 px-8">
                                By signing in, you agree to our 
                                <a href="#" className="text-foreground hover:text-primary mx-1">Terms</a> and 
                                <a href="#" className="text-foreground hover:text-primary mx-1">Privacy Policy</a>.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-6 text-muted-foreground/40 font-bold text-[10px] uppercase tracking-widest">
                    <span>O(1) Access</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span>Edge Native</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span>SOC2 Ready</span>
                </div>
            </div>
        </div>
    </div>
  );
}
