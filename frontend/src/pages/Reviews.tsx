import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  GitPullRequest, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Hash
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import type{ Review, ReviewsResponse, Repository, PullRequest } from "@/types/api";
import { cn } from "@/lib/utils";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get<ReviewsResponse>(`/reviews?page=${page}&limit=10`);
      setReviews(res.data.data);
      if (res.data.pagination) {
          setMaxPage(res.data.pagination.pages);
          setTotal(res.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Reviews</h1>
          <p className="text-muted-foreground mt-1">Audit trail of AI-generated code analysis.</p>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-[#141414] border border-[#262626] text-xs font-semibold text-white shadow-inner">
            Total AI Audits: {total}
        </div>
      </div>

      <Card className="bg-[#0C0C0C] border-[#1F1F1F] shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#1F1F1F] bg-[#101010]/30">
           <CardTitle className="text-xl">Review History</CardTitle>
           <CardDescription>Comprehensive log of pull request evaluations.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#1F1F1F]">
             {loading ? (
                Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-6">
                       <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-xl bg-secondary/10" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-[300px] bg-secondary/10" />
                            <Skeleton className="h-4 w-[200px] bg-secondary/10" />
                          </div>
                       </div>
                       <Skeleton className="h-8 w-24 rounded-full bg-secondary/10" />
                    </div>
                ))
             ) : reviews.length === 0 ? (
                <div className="text-center py-24 px-6 flex flex-col items-center">
                    <div className="p-4 rounded-3xl bg-[#141414] mb-6">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No reviews found</h3>
                    <p className="text-muted-foreground max-w-sm">Connect a repository to automatically start analyzing your code submissions.</p>
                </div>
             ) : (
                <div className="divide-y divide-[#1F1F1F]">
                   {reviews.map((review) => {
                      const repo = review.repositoryId as Repository;
                      const pr = review.pullRequestId as PullRequest;

                      return (
                      <Link 
                        key={review._id} 
                        to={`/dashboard/reviews/${review._id}`}
                        className="flex items-center justify-between p-5 hover:bg-[#111111] transition-all group relative overflow-hidden"
                      >
                         <div className="flex items-center space-x-4 overflow-hidden relative z-10">
                            <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div className="space-y-1.5 min-w-0">
                               <div className="flex items-center gap-2">
                                  <h4 className="text-[15px] font-bold text-white truncate max-w-[200px] sm:max-w-md group-hover:text-primary transition-colors">
                                    {pr?.title || "Untitled PR"}
                                  </h4>
                                  <div className="flex items-center gap-1 text-[10px] bg-[#1a1a1a] text-muted-foreground px-1.5 py-0.5 rounded border border-[#2a2a2a] font-mono">
                                     <Hash className="w-2.5 h-2.5" />
                                     {pr?.prNumber}
                                  </div>
                               </div>
                               <div className="flex items-center text-xs text-muted-foreground gap-4">
                                  <span className="flex items-center gap-1.5 font-medium">
                                      <GitPullRequest className="w-3.5 h-3.5 text-muted-foreground/50" />
                                      {repo?.fullName}
                                  </span>
                                  <span className="flex items-center gap-1.5 font-medium">
                                      <Calendar className="w-3.5 h-3.5 text-muted-foreground/50" />
                                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                                  </span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-6 shrink-0 relative z-10">
                             {review.status === "completed" ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Audited
                                </div>
                             ) : (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    Failed
                                </div>
                             )}
                             <div className="p-1 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                             </div>
                         </div>
                         
                         {/* Hover glow effect */}
                         <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-full" />
                      </Link>
                   )})}
                </div>
             )}
          </div>
        </CardContent>
        
        {/* Pagination */}
        {maxPage > 1 && (
            <div className="flex items-center justify-between p-6 bg-[#101010]/30 border-t border-[#1F1F1F]">
                <div className="text-xs text-muted-foreground font-medium">
                    Showing <span className="text-white">{(page-1)*10 + 1}</span> to <span className="text-white">{Math.min(page*10, total)}</span> of <span className="text-white">{total}</span> reviews
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page === 1}
                    className="h-9 px-4 rounded-lg bg-[#0C0C0C] border-[#222]"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                    Previous
                    </Button>
                    <div className="flex items-center gap-1 mx-2">
                        {Array.from({length: maxPage}, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={cn(
                                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                                    page === p ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-[#222] hover:text-white"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="h-9 px-4 rounded-lg bg-[#0C0C0C] border-[#222]"
                        disabled={page === maxPage}
                        onClick={() => setPage(p => Math.min(maxPage, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            </div>
        )}
      </Card>
    </div>
  )
}
