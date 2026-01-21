import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import { 
  GitBranch, 
  GitPullRequest, 
  MessageSquare, 
  GitCommit,
  Database,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { format, differenceInDays } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import type { DashboardStats, ActivityData, MonthlyData } from "@/types/api";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hoveredValue, setHoveredValue] = useState<{ date: string; count: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [statsRes, monthlyRes] = await Promise.all([
          api.get<DashboardStats>("/dashboard/stats"),
          api.get<MonthlyData[]>("/dashboard/monthly"),
        ]);
        
        setStats(statsRes.data);
        setMonthly(monthlyRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchBaseData();
  }, []);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const res = await api.get<ActivityData>(`/dashboard/activity?year=${selectedYear}`);
        setActivity(res.data);
      } catch (error) {
        console.error("Failed to fetch activity heatmap data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [selectedYear]);

  // Prepare Heatmap Data
  const heatmapValues = (() => {
      if (!activity) return [];
      const values: { date: string; count: number }[] = [];
      const map = new Map<string, number>();

      activity.reviews.forEach(r => map.set(r._id, r.count));

      const startDate = new Date(selectedYear, 0, 1);
      const endDate = new Date(selectedYear, 11, 31);
      const numDays = differenceInDays(endDate, startDate) + 1;

      for (let i = 0; i < numDays; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          
          const dateStr = format(date, 'yyyy-MM-dd');
          const realCount = map.get(dateStr) || 0;
          values.push({ date: dateStr, count: realCount });
      }
      return values;
  })();

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
         <div>
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Overview
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
               Your coding command center.
            </p>
         </div>
         <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] border border-primary/20 transition-all duration-300 hover:scale-105">
             <Link to="/dashboard/repositories?tab=all">
                 <GitBranch className="mr-2 h-5 w-5" />
                 Connect Repository
             </Link>
         </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
           title="Total Repositories" 
           value={stats?.totalRepos} 
           icon={Database} 
           loading={loading && !stats}
           trend="+2" // You might want to calculate this dynamically if possible
           color="text-blue-400"
           gradient="from-blue-500/20 to-blue-600/5"
           borderColor="border-blue-500/20"
        />
        <StatsCard 
           title="Total Commits" 
           value={stats?.totalCommits} 
           icon={GitCommit} 
           loading={loading && !stats}
           trend="+15"
           color="text-emerald-400"
           gradient="from-emerald-500/20 to-emerald-600/5"
           borderColor="border-emerald-500/20"
        />
        <StatsCard 
           title="Pull Requests" 
           value={stats?.totalPRs} 
           icon={GitPullRequest} 
           loading={loading && !stats}
           trend="+5"
           color="text-purple-400"
           gradient="from-purple-500/20 to-purple-600/5"
           borderColor="border-purple-500/20"
        />
        <StatsCard 
           title="AI Reviews" 
           value={stats?.totalReviews} 
           icon={MessageSquare} 
           loading={loading && !stats}
           trend="+12"
           color="text-orange-400"
           gradient="from-orange-500/20 to-orange-600/5"
           borderColor="border-orange-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Heatmap Section */}
        <Card className="lg:col-span-3 bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between relative z-10">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Contribution Activity
                    </CardTitle>
                    <CardDescription>Visualizing your coding frequency over time</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="bg-zinc-900 border border-white/10 text-white text-sm font-medium rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all cursor-pointer hover:border-white/20"
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                {loading ? (
                    <Skeleton className="h-[200px] w-full bg-secondary/10" />
                ) : (
                    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                        <div className="min-w-[800px]">
                            <CalendarHeatmap
                                startDate={new Date(selectedYear, 0, 1)}
                                endDate={new Date(selectedYear, 11, 31)}
                                values={heatmapValues}
                                classForValue={(value) => {
                                    if (!value || value.count === 0) {
                                        return 'color-empty';
                                    }
                                    return `color-scale-${Math.min(value.count, 4)}`;
                                }}
                                titleForValue={(value) => value ? `${value.count} contributions on ${value.date}` : 'No contributions'}
                                onMouseOver={(_, value: any) => {
                                    if (value && value.date) setHoveredValue(value);
                                }}
                                onMouseLeave={() => {
                                    setHoveredValue(null);
                                }}
                                showWeekdayLabels
                            />
                            
                            {/* Custom Tooltip */}
                            {hoveredValue && (
                                <div className="absolute top-0 right-0 z-50 pointer-events-none p-4 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/10 shadow-xl animate-in fade-in zoom-in duration-200">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{format(new Date(hoveredValue.date + 'T00:00:00'), 'EEEE, MMM do')}</p>
                                    <p className="text-lg font-bold text-white flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
                                        <span>{hoveredValue.count}</span> <span className="text-zinc-400 font-medium text-sm">contributions</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Charts Section */}
        <Card className="lg:col-span-3 bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Commits, Pull Requests, and AI Reviews</CardDescription>
              </CardHeader>
              <CardContent className="pl-0 relative z-10">
                {loading ? (
                   <Skeleton className="h-[400px] w-full bg-secondary/10" />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPrs" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} stroke="#525252" />
                        <XAxis 
                            dataKey="month" 
                            stroke="#737373" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis 
                            stroke="#737373" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.03)'}}
                            contentStyle={{ 
                                backgroundColor: '#09090b', 
                                borderColor: 'rgba(255,255,255,0.1)', 
                                borderRadius: '12px',
                                color: '#EDEDED',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                            itemStyle={{ fontWeight: 500 }}
                            labelStyle={{ color: '#A1A1AA', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                        <Bar 
                            dataKey="commits" 
                            name="Commits" 
                            fill="url(#colorCommits)" 
                            radius={[4, 4, 0, 0]} 
                            maxBarSize={60} 
                        />
                        <Bar 
                            dataKey="prs" 
                            name="Pull Requests" 
                            fill="url(#colorPrs)" 
                            radius={[4, 4, 0, 0]} 
                            maxBarSize={60} 
                        />
                        <Bar 
                            dataKey="reviews" 
                            name="AI Reviews" 
                            fill="url(#colorReviews)" 
                            radius={[4, 4, 0, 0]} 
                            maxBarSize={60} 
                        />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, loading, trend, color, gradient, borderColor }: any) {
    return (
        <Card className={`relative overflow-hidden bg-black/40 backdrop-blur-md border ${borderColor} shadow-lg group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Icon className={`w-24 h-24 ${color}`} />
            </div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
               <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{title}</CardTitle>
               <div className={`p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm ${color} shadow-inner`}>
                   <Icon className="h-5 w-5" />
               </div>
            </CardHeader>
            <CardContent className="relative z-10">
               {loading ? (
                  <Skeleton className="h-8 w-24 bg-secondary/10" />
               ) : (
                 <>
                   <div className="text-4xl font-black text-white tracking-tight">{value?.toLocaleString() || 0}</div>
                   <div className="flex items-center mt-2 gap-2">
                       <div className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                           <ArrowUpRight className="w-3 h-3 mr-0.5" />
                           {trend}%
                       </div>
                       <span className="text-xs text-zinc-500">vs last month</span>
                   </div>
                 </>
               )}
            </CardContent>
        </Card>
    )
}
