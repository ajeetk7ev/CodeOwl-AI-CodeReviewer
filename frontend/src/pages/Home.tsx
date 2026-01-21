import { Link } from "react-router-dom";
import { ArrowRight, Code2, ShieldCheck, Zap, Terminal, Sparkles, Check, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 text-center">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[130px] rounded-full animate-pulse shadow-[0_0_100px_rgba(251,191,36,0.1)]" />
            <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-amber-500/10 blur-[130px] rounded-full animate-pulse delay-700" />
          </div>
          
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
             Trusted by 10,000+ developers
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl mx-auto mb-8 bg-linear-to-b from-white via-white to-white/40 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-[1.1]">
             Review Code with <span className="text-primary decoration-primary/30 underline-offset-8 underline decoration-4">AI Precision</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed">
             The ultimate AI pair programmer that audits your pull requests, catches edge cases, and suggests performance optimizations in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
             <Button size="lg" className="h-14 px-10 text-xl rounded-full shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all font-bold" asChild>
                <Link to="/login">
                   Get Started Freely <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
             </Button>
             <Button size="lg" variant="outline" className="h-14 px-10 text-xl rounded-full border-white/10 glassmorphism hover:bg-white/5 font-semibold">
                <Terminal className="mr-2 h-5 w-5" /> Live Demo
             </Button>
          </div>
          
          {/* Dashboard Preview */}
          <div className="mt-24 mx-auto max-w-6xl relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10 rounded-full" />
            <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
               <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/40" />
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/40" />
                    <div className="w-3.5 h-3.5 rounded-full bg-green-500/40" />
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-md text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    CodeOwl Analysis
                  </div>
               </div>
               <div className="p-10 md:p-14 text-left font-mono text-base md:text-lg grid lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30">01</span>
                        <div className="h-5 bg-white/10 w-full rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30">02</span>
                        <div className="h-5 bg-white/20 w-3/4 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30">03</span>
                        <div className="h-5 bg-white/10 w-5/6 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30">04</span>
                        <div className="h-5 bg-primary/30 w-full rounded-full border border-primary/20" />
                      </div>
                  </div>
                  <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 shadow-xl shadow-primary/5 animate-pulse">
                          <div className="flex items-center gap-3 mb-3 text-primary">
                              <Sparkles className="w-6 h-6" />
                              <span className="font-bold text-lg">AI Insight</span>
                          </div>
                          <p className="text-foreground/90 leading-relaxed text-lg">
                            We detected a possible race condition in line 42 when handling concurrent WebSocket connections. Consider using a <strong>Mutex</strong> lock.
                          </p>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Supercharge Your <span className="text-primary">Workflow</span></h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to ship enterprise-grade code without the manual overhead.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                   icon={Zap}
                   title="Lightning Fast"
                   description="Reviews delivered in milliseconds. No more waiting days for peer feedback to get merged."
                   gradient="from-amber-500/10 to-yellow-500/10"
                />
                <FeatureCard 
                   icon={ShieldCheck}
                   title="Security Audits"
                   description="Detect SQL injections, XSS, and broken access controls before they ever touch production."
                   gradient="from-orange-500/10 to-amber-500/10"
                />
                <FeatureCard 
                   icon={Sparkles}
                   title="Auto-Fix Suggestions"
                   description="CodeOwl doesn't just find bugs; it provides the exact code to fix them instantly."
                   gradient="from-yellow-600/10 to-amber-600/10"
                />
             </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6 bg-white/2">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Simple Pricing</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Choose the plan that fits your team size and scaling needs.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8 items-stretch">
                <PricingCard 
                   tier="Student"
                   price="$0"
                   description="Perfect for individuals and learning projects."
                   features={["5 Repositories", "100 Reviews/mo", "Basic Security Scan", "Community Support"]}
                />
                <PricingCard 
                   tier="Pro"
                   price="$29"
                   description="For professional developers and growing startups."
                   features={["Unlimited Repositories", "Unlimited Reviews", "Advanced Security", "Priority Support", "Custom AI Rules"]}
                   recommended
                />
                <PricingCard 
                   tier="Enterprise"
                   price="Custom"
                   description="Maximum security and scale for large organizations."
                   features={["On-prem Deployment", "SSO & SAML", "Dedicated Manager", "Compliance Reports"]}
                />
             </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div className="max-w-2xl text-left">
                   <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">From the <span className="text-primary">Blog</span></h2>
                   <p className="text-xl text-muted-foreground">Stay ahead of the curve with our latest engineering insights and AI updates.</p>
                </div>
                <Button variant="link" className="text-primary text-xl font-bold h-auto p-0 group">
                   View all posts <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <BlogCard 
                   title="Scaling AI Code Reviews to 1M PRs"
                   date="Jan 15, 2024"
                   category="Engineering"
                   image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
                />
                <BlogCard 
                   title="Why AI Reviews Beat Human Reviews"
                   date="Jan 12, 2024"
                   category="Opinion"
                   image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
                />
                <BlogCard 
                   title="The Future of LLMs in Software Dev"
                   date="Jan 08, 2024"
                   category="Trends"
                   image="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
                />
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
           <div className="max-w-5xl mx-auto rounded-[3rem] bg-linear-to-br from-primary via-primary/80 to-secondary p-12 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
              <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 translate-x-1/2" />
              <h2 className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight">Ready to ship better code?</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-white text-primary hover:bg-white/90 transition-all font-bold group">
                    Start Now <Github className="ml-2 w-6 h-6 group-hover:rotate-12 transition-transform" />
                 </Button>
                 <span className="text-primary-foreground/80 font-medium">Join 5,000+ teams today</span>
              </div>
           </div>
        </section>
      </main>
      
      <footer className="py-20 px-6 border-t border-white/5 bg-black/20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2 group cursor-pointer">
               <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Code2 className="w-6 h-6 text-primary" />
               </div>
               <span className="text-2xl font-bold tracking-tight">CodeOwl</span>
            </div>
            <div className="flex gap-8 text-muted-foreground font-medium">
               <a href="#" className="hover:text-primary transition-colors">Privacy</a>
               <a href="#" className="hover:text-primary transition-colors">Terms</a>
               <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-muted-foreground">© 2024 CodeOwl AI. All rights reserved.</p>
         </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, gradient }: any) {
  return (
    <div className="group relative p-8 rounded-[2rem] bg-card border border-white/5 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
      <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]`} />
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
      </div>
    </div>
  )
}

function PricingCard({ tier, price, description, features, recommended }: any) {
  return (
    <div className={`relative p-10 rounded-[2.5rem] border ${recommended ? "border-primary bg-primary/5 shadow-2xl shadow-primary/20 scale-105 z-10" : "border-white/5 bg-card/50"} flex flex-col`}>
      {recommended && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-1.5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-full">
          Most Popular
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-2xl font-black mb-2">{tier}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="mb-10 flex items-baseline gap-1">
        <span className="text-5xl font-black">{price}</span>
        {price !== "Custom" && <span className="text-muted-foreground font-medium">/month</span>}
      </div>
      <div className="space-y-4 mb-12 flex-1">
        {features.map((feature: string) => (
          <div key={feature} className="flex items-center gap-3">
            <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${recommended ? "bg-primary text-primary-foreground" : "bg-white/10 text-primary"}`}>
              <Check className="w-4 h-4" />
            </div>
            <span className="text-foreground/80 font-medium">{feature}</span>
          </div>
        ))}
      </div>
      <Button 
        variant={recommended ? "default" : "outline"} 
        className={`w-full h-14 rounded-2xl text-lg font-bold ${recommended ? "shadow-xl shadow-primary/30" : "border-white/10"}`}
      >
        Get Started
      </Button>
    </div>
  )
}

function BlogCard({ title, date, category, image }: any) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-16/10 rounded-[2rem] overflow-hidden mb-6 relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/10">
          {category}
        </div>
      </div>
      <div className="px-2">
        <div className="text-sm text-muted-foreground font-medium mb-3">{date}</div>
        <h3 className="text-2xl font-black group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>
      </div>
    </div>
  )
}
