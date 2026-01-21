import { Check, Zap, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Subscription() {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Simple, <span className="text-primary italic">Transparent</span> Pricing
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
           Empower your workflow with AI-driven insights. Choose the plan that scales with your ambition.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:max-w-5xl lg:mx-auto px-4">
        {/* Free Plan */}
        <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-3xl relative overflow-hidden group hover:border-[#333] transition-all duration-300 shadow-2xl">
            <CardHeader className="pb-8">
                <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-bold text-white">Starter</CardTitle>
                    <div className="p-2 rounded-xl bg-[#141414] border border-[#262626]">
                        <Zap className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
                <CardDescription className="text-muted-foreground text-sm font-medium">Perfect for hobbyists and individual exploration.</CardDescription>
                <div className="mt-6 flex items-baseline gap-1">
                   <span className="text-5xl font-bold text-white">$0</span>
                   <span className="text-muted-foreground font-medium">/mo</span>
                </div>
            </CardHeader>
            <CardContent>
               <ul className="space-y-4 text-sm font-medium">
                  <li className="flex items-center text-muted-foreground group-hover:text-white transition-colors">
                      <div className="mr-3 p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check className="h-4 w-4" />
                      </div>
                      3 Connected Repositories
                  </li>
                  <li className="flex items-center text-muted-foreground group-hover:text-white transition-colors">
                      <div className="mr-3 p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check className="h-4 w-4" />
                      </div>
                      50 AI Reviews / month
                  </li>
                  <li className="flex items-center text-muted-foreground group-hover:text-white transition-colors">
                      <div className="mr-3 p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check className="h-4 w-4" />
                      </div>
                      Community Support
                  </li>
                  <li className="flex items-center text-muted-foreground/40 line-through">
                      <div className="mr-3 p-1 rounded-full bg-secondary/10 text-secondary/40">
                        <Check className="h-4 w-4" />
                      </div>
                      Advanced Analytics
                  </li>
               </ul>
            </CardContent>
            <CardFooter className="pt-8">
               <Button className="w-full h-12 rounded-2xl border-[#262626] text-muted-foreground hover:bg-[#111] hover:text-white transition-all font-bold" variant="outline">
                    Current Plan
               </Button>
            </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="bg-[#0C0C0C] border-primary/20 rounded-3xl relative overflow-hidden shadow-[0_0_50px_-12px_rgba(99,102,241,0.15)] group hover:border-primary/40 transition-all duration-500 scale-[1.02]">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
            
            <div className="absolute top-0 right-0 p-5">
               <div className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md">
                   Popular Choice
               </div>
            </div>
            
            <CardHeader className="pb-8">
                <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                        Pro
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    </CardTitle>
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                </div>
                <CardDescription className="text-muted-foreground text-sm font-medium">For professional developers and scaling teams.</CardDescription>
                <div className="mt-6 flex items-baseline gap-1">
                   <span className="text-5xl font-bold text-white">$19</span>
                   <span className="text-muted-foreground font-medium">/mo</span>
                </div>
            </CardHeader>
            <CardContent>
               <ul className="space-y-4 text-sm font-medium">
                  <li className="flex items-center text-white">
                      <div className="mr-3 p-1 rounded-full bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      Unlimited Repositories
                  </li>
                  <li className="flex items-center text-white">
                      <div className="mr-3 p-1 rounded-full bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      Unlimited AI Reviews
                  </li>
                  <li className="flex items-center text-white">
                      <div className="mr-3 p-1 rounded-full bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      Priority Email Support
                  </li>
                  <li className="flex items-center text-white">
                      <div className="mr-3 p-1 rounded-full bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      Advanced Analytics & Insights
                  </li>
                  <li className="flex items-center text-white">
                      <div className="mr-3 p-1 rounded-full bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      Custom AI Models
                  </li>
               </ul>
            </CardContent>
            <CardFooter className="pt-8">
               <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all">
                   Get Started with Pro
               </Button>
            </CardFooter>
        </Card>
      </div>

      <div className="text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Secure payments powered by Stripe
          </p>
      </div>
    </div>
  )
}
