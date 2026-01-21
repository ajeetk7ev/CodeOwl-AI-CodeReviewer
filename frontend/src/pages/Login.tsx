import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Github, Loader2, Code2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for error in query params
    const error = searchParams.get("error");
    if (error) {
       alert("Login failed. Please try again.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      // Placeholder for email/pass login if implemented later or just demo
      setLoading(true);
      setTimeout(() => {
          setLoading(false); 
          alert("Email login not yet implemented. Please use GitHub.");
      }, 1000);
  };

  const handleGithubLogin = () => {
    setLoading(true);
    // Redirect to backend auth endpoint
    // If VITE_API_URL includes /api, we shouldn't append it again if not needed, 
    // but usually VITE_API_URL is the base.
    // Let's be explicit: The backend mounts auth at /api/auth
    
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    // Ensure we don't double slash if env var has trailing slash
    const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    console.log(baseUrl);
    
    window.location.href = `${baseUrl}/auth/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-40 -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] opacity-40 -z-10" />

        <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                        <Code2 className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                    Enter your credentials to access your dashboard
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button 
                    variant="outline" 
                    className="w-full h-11 relative" 
                    onClick={handleGithubLogin} 
                    disabled={loading}
                >
                    <Github className="mr-2 h-4 w-4" />
                    Continue with GitHub
                    {loading && <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md"><Loader2 className="animate-spin h-5 w-5" /></div>}
                </Button>
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Input type="email" placeholder="name@example.com" disabled={loading} required />
                    </div>
                    <div className="space-y-2">
                        <Input type="password" placeholder="Password" disabled={loading} required />
                    </div>
                    <Button className="w-full h-11" type="submit" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button variant="link" size="sm" className="text-muted-foreground">
                    Forgot your password?
                </Button>
            </CardFooter>
        </Card>
    </div>
  )
}
