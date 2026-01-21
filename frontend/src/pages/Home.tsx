import { Link } from "react-router-dom";
import { ArrowRight, Code2, ShieldCheck, Zap, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
              <Code2 className="w-5 h-5 text-primary" />
           </div>
           <span className="text-xl font-bold tracking-tight">CodeOwl</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
           <a href="#features" className="hover:text-primary transition-colors">Features</a>
           <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
           <a href="#about" className="hover:text-primary transition-colors">About</a>
        </nav>
        <div className="flex items-center gap-4">
           <Link to="/login" className="text-sm font-medium hover:text-primary">Login</Link>
           <Button asChild size="sm" className="hidden sm:flex">
              <Link to="/login">Get Started</Link>
           </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1">
         <section className="relative py-20 md:py-32 px-6 text-center">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />
            
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
               </span>
               v2.0 is now live
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto mb-6 bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
               Intelligent Code Reviews for <span className="text-primary">Modern Teams</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
               Automate your code review process with AI-driven insights. Catch bugs early, improve code quality, and ship faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
               <Button size="lg" className="h-12 px-8 text-lg" asChild>
                  <Link to="/login">
                     Start Reviewing Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
               </Button>
               <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                  View Demo
               </Button>
            </div>
            
            {/* Code Preview Mockup */}
            <div className="mt-20 mx-auto max-w-5xl rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
               <div className="flex items-center px-4 py-3 border-b border-white/10 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
               </div>
               <div className="p-8 text-left font-mono text-sm md:text-base grid md:grid-cols-2 gap-8">
                  <div className="space-y-4 opacity-50">
                      <div className="h-4 bg-white/10 w-3/4 rounded" />
                      <div className="h-4 bg-white/10 w-1/2 rounded" />
                      <div className="h-4 bg-white/10 w-5/6 rounded" />
                      <div className="h-4 bg-white/10 w-full rounded" />
                  </div>
                   <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                          <div className="mt-1 p-1 bg-primary text-primary-foreground rounded">
                              <Zap className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="font-semibold text-primary mb-1">Performance Issue Detected</p>
                              <p className="text-muted-foreground">This loop allows O(n^2) complexity. Consider using a hash map for O(n) lookup.</p>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
         </section>
         
         {/* Features Section */}
         <section id="features" className="py-24 px-6 bg-secondary/5">
            <div className="max-w-6xl mx-auto">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to ship quality code</h2>
                  <p className="text-muted-foreground">Comprehensive features designed for the modern developer workflow.</p>
               </div>
               
               <div className="grid md:grid-cols-3 gap-8">
                  <FeatureCard 
                     icon={Zap}
                     title="Instant Feedback"
                     description="Get code reviews in seconds, not hours. Eliminate bottlenecks in your PR workflow."
                  />
                  <FeatureCard 
                     icon={ShieldCheck}
                     title="Security First"
                     description="Automatically detect vulnerabilities and security anti-patterns before they reach production."
                  />
                  <FeatureCard 
                     icon={GitBranch}
                     title="Seamless Integration"
                     description="Connects directly with GitHub. Comments appear right in your pull requests where you need them."
                  />
               </div>
            </div>
         </section>
      </main>
      
      <footer className="py-8 px-6 border-t border-white/5 text-center text-sm text-muted-foreground">
         <p>© 2024 CodeOwl AI. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: any) {
    return (
        <div className="p-6 rounded-xl bg-card/50 border border-white/5 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    )
}
