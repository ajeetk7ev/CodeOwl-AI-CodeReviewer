import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { 
  ArrowLeft, 
  GitPullRequest, 
  Github, 
  Calendar, 
  Bot,
  ExternalLink,
  Code2,
  ShieldCheck
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import type{ Review, Repository, PullRequest } from "@/types/api";

export default function ReviewDetails() {
  const { id } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await api.get<Review>(`/reviews/${id}`);
        setReview(res.data);
      } catch (error) {
        console.error("Failed to fetch review details", error);
      } finally {
        setLoading(false);
      }
    };
    if(id) fetchReview();
  }, [id]);

  if (loading) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl bg-secondary/10" />
                <Skeleton className="h-8 w-64 bg-secondary/10" />
            </div>
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Skeleton className="h-[600px] w-full rounded-2xl bg-secondary/10" />
                </div>
                <div>
                    <Skeleton className="h-[300px] w-full rounded-2xl bg-secondary/10" />
                </div>
            </div>
        </div>
    )
  }

  if (!review) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="p-6 rounded-3xl bg-[#0C0C0C] border border-[#1F1F1F] shadow-2xl">
                <h2 className="text-xl font-bold text-white">Review report not found</h2>
                <p className="text-muted-foreground mt-2">The requested analysis could not be located.</p>
            </div>
            <Button variant="ghost" asChild className="rounded-xl border border-[#1F1F1F]">
                <Link to="/dashboard/reviews">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Library
                </Link>
            </Button>
        </div>
    )
  }

  const repo = review.repositoryId as Repository;
  const pr = review.pullRequestId as PullRequest;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10">
      <div className="flex items-center gap-4 group">
         <Button variant="ghost" size="icon" asChild className="rounded-xl bg-[#0C0C0C] border border-[#1F1F1F] hover:bg-[#111] hover:border-[#333] transition-all">
            <Link to="/dashboard/reviews">
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
         </Button>
         <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Review Report</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Automated Intelligence Analysis</p>
         </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
         {/* Main Content */}
         <div className="md:col-span-2 space-y-8">
            <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-2xl overflow-hidden">
               <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] flex flex-row items-center justify-between py-6">
                  <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Code2 className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg font-bold text-white">Deep Analysis</CardTitle>
                  </div>
                  {review.aiModel && (
                     <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-[10px] font-black uppercase tracking-tighter text-muted-foreground shadow-inner">
                          <Bot className="w-3.5 h-3.5 text-primary" />
                          <span className="text-white">Powered by:</span> {review.aiModel}
                     </div>
                  )}
               </CardHeader>
               <CardContent className="p-0">
                   <div className="p-8 prose prose-invert prose-pre:bg-[#050505] prose-pre:border prose-pre:border-[#1F1F1F] prose-pre:rounded-xl prose-code:text-primary prose-a:text-primary max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ ...props }) => (
                            <h1
                              className="text-3xl font-extrabold text-blue-400 mt-8 mb-4 border-b border-gray-800 pb-2"
                              {...props}
                            />
                          ),
                          h2: ({ ...props }) => (
                            <h2
                              className="text-2xl font-bold text-purple-400 mt-8 mb-4"
                              {...props}
                            />
                          ),
                          h3: ({ ...props }) => (
                            <h3
                              className="text-xl font-bold text-teal-400 mt-6 mb-3"
                              {...props}
                            />
                          ),
                          ul: ({ ...props }) => (
                            <ul
                              className="list-disc pl-6 space-y-2 my-4 text-gray-300 marker:text-gray-500"
                              {...props}
                            />
                          ),
                          ol: ({ ...props }) => (
                            <ol
                              className="list-decimal pl-6 space-y-2 my-4 text-gray-300 marker:text-gray-500"
                              {...props}
                            />
                          ),
                          li: ({ ...props }) => (
                            <li className="leading-relaxed pl-1" {...props} />
                          ),
                          p: ({ ...props }) => (
                            <p
                              className="leading-7 text-gray-300 mb-4"
                              {...props}
                            />
                          ),
                          strong: ({ ...props }) => (
                            <strong
                              className="font-bold text-white bg-white/5 px-1 rounded"
                              {...props}
                            />
                          ),
                          blockquote: ({ ...props }) => (
                            <blockquote
                              className="border-l-4 border-primary/50 pl-4 py-1 italic text-gray-400 my-4 bg-gray-900/30 rounded-r"
                              {...props}
                            />
                          ),
                          code: ({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }: any) => {
                            const match = /language-(\w+)/.exec(
                              className || "",
                            );
                            return !inline ? (
                              <div className="relative group">
                                <code
                                  className={`${className} block bg-[#0F0F0F] p-4 rounded-lg border border-[#222] overflow-x-auto text-sm my-4`}
                                  {...props}
                                >
                                  {children}
                                </code>
                              </div>
                            ) : (
                              <code
                                className="bg-[#1A1A1A] text-primary px-1.5 py-0.5 rounded text-sm font-mono border border-[#2A2A2A]"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {review.content}
                      </ReactMarkdown>
                   </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar Info */}
         <div className="space-y-8">
             <Card className="bg-[#0C0C0C] border-[#1F1F1F] rounded-2xl shadow-xl overflow-hidden">
                <CardHeader className="bg-[#111111]/40 border-b border-[#1F1F1F] pb-4">
                    <CardTitle className="text-base font-bold text-white">Source Context</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">PR Title</label>
                        <p className="text-sm font-bold text-white leading-relaxed">{pr.title}</p>
                        <div className="mt-2">
                             <Badge variant="outline" className="bg-[#141414] border-[#262626] text-[10px] font-mono font-bold text-muted-foreground">
                                #{pr.prNumber}
                             </Badge>
                        </div>
                    </div>
                    
                    <div className="h-px bg-[#1F1F1F]" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Repository</span>
                            <div className="flex items-center text-xs font-bold text-white bg-[#141414] px-2 py-1 rounded-lg border border-[#262626]">
                                <GitPullRequest className="w-3.5 h-3.5 mr-2 text-primary/70" />
                                {repo.fullName}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Timestamp</span>
                             <div className="flex items-center text-xs font-bold text-white bg-[#141414] px-2 py-1 rounded-lg border border-[#262626]">
                                <Calendar className="w-3.5 h-3.5 mr-2 text-primary/70" />
                                {format(new Date(review.createdAt), "MMM d, HH:mm")}
                             </div>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <Button className="w-full h-11 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all font-bold group" asChild>
                           <a href={pr.githubUrl} target="_blank" rel="noopener noreferrer">
                               <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                               View Source Code
                               <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-50" />
                           </a>
                        </Button>
                    </div>
                </CardContent>
             </Card>
             
             <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center gap-3 text-center">
                 <div className="p-2 rounded-full bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                 </div>
                 <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest leading-tight">
                    This review is cryptographically<br/>verified by CodeOwl AI
                 </p>
             </div>
         </div>
      </div>
    </div>
  )
}
