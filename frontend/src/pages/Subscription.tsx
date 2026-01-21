import { Check, Zap, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import { useState } from "react";

export default function Subscription() {
  const { user, fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (plan: string, amount: number) => {
    if (!user) {
        toast.error("Please login to subscribe.");
        return;
    }

    setLoading(true);
    try {
      // 0. Check if Razorpay SDK is loaded
      if (!(window as any).Razorpay) {
         toast.error("Razorpay SDK failed to load. Please check your internet connection or disable adblockers.");
         setLoading(false);
         return;
      }

      // 1. Create Order on Backend
      const { data } = await api.post("/subscription/create-order", { amount });

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKey) {
        console.error("VITE_RAZORPAY_KEY_ID is missing from environment variables");
        toast.error("Configuration error: Razorpay Key ID is missing.");
        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        name: "CodeOwl AI",
        description: `${plan} Plan Subscription (UPI & Netbanking Supported)`,
        order_id: data.orderId,
        handler: async (response: any) => {
          console.log("[Razorpay] Payment successful, verifying...");
          try {
            // 2. Verify Payment on Backend
            const verifyRes = await api.post("/subscription/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.toLowerCase()
            });

            if (verifyRes.data.success) {
              toast.success("Congratulations! Your plan has been upgraded to Pro.");
              await fetchUser(); // Refresh user state
            }
          } catch (error: any) {
            console.error("Verification failed", error);
            toast.error("Payment verification failed: " + (error.response?.data?.message || error.message));
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name || user.githubUsername,
          email: user.email || "",
          contact: "", // Optional: add contact field if needed
        },
        theme: {
          color: "#FBBF24", // Gold theme color
        },
      };

      console.log(`[Razorpay] Opening checkout for ${data.amount} ${data.currency}`);
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
          toast.error(`Payment Failed: ${response.error.description}`);
          setLoading(false);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Order creation failed", error);
      toast.error("Failed to initiate payment: " + (error.response?.data?.message || error.message));
    } finally {
      // We don't set loading to false here because rzp.open is async and the modal might be open.
      // We set it to false in handle, ondismiss, and catch blocks.
    }
  };

  const isPro = user?.plan === "pro";

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
                      5 Connected Repositories
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
               <Button
                className="w-full h-12 rounded-2xl border-[#262626] text-muted-foreground hover:bg-[#111] hover:text-white transition-all font-bold"
                variant="outline"
                disabled={!isPro}
               >
                    {!isPro ? "Current Plan" : "Downgrade (Contact Support)"}
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
                   <span className="text-5xl font-bold text-white">$29</span>
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
               <Button 
                className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all"
                disabled={isPro || loading}
                onClick={() => handlePayment("Pro", 29)}
               >
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : isPro ? (
                    "Current Plan"
                ) : (
                    "Get Started with Pro"
                )}
               </Button>
            </CardFooter>
        </Card>
      </div>

      <div className="text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Secure payments powered by Razorpay
          </p>
      </div>
    </div>
  )
}
