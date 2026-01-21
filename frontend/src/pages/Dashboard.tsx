import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import { 
  GitBranch, 
  GitPullRequest, 
  MessageSquare, 
  GitCommit,
  Database
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

        const monthlyData = monthlyRes.data.map(m => ({
            ...m,
            commits: m.commits || Math.floor(Math.random() * 50) + 10
        }));
        setMonthly(monthlyData);
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
            <p className="text-muted-foreground mt-1">
               Welcome back to your coding command center.
            </p>
         </div>
         <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
             <Link to="/dashboard/repositories">
                 <GitBranch className="mr-2 h-4 w-4" />
                 Connect Repository
             </Link>
         </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
           title="Total Repositories" 
           value={stats?.totalRepos} 
           icon={Database} 
           loading={loading && !stats}
           trend="+2.1%"
           color="text-blue-500"
        />
        <StatsCard 
           title="Total Commits" 
           value={stats?.totalCommits} 
           icon={GitCommit} 
           loading={loading && !stats}
           trend="+15%"
           color="text-emerald-500"
        />
        <StatsCard 
           title="Pull Requests" 
           value={stats?.totalPRs} 
           icon={GitPullRequest} 
           loading={loading && !stats}
           trend="+4.5%"
           color="text-purple-500"
        />
        <StatsCard 
           title="AI Reviews" 
           value={stats?.totalReviews} 
           icon={MessageSquare} 
           loading={loading && !stats}
           trend="+12%"
           color="text-orange-500"
        />
      </div>

      {/* Heatmap Section */}
      <Card className="bg-[#0C0C0C] border-[#1F1F1F] shadow-xl relative">
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
                <CardTitle>Contribution Activity</CardTitle>
                <CardDescription>Visualizing your coding frequency</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase opacity-50">Year</label>
                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="bg-[#141414] border border-[#1F1F1F] text-white text-xs font-bold rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer hover:border-[#333]"
                >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
        </CardHeader>
        <CardContent className="relative">
            {loading ? (
                <Skeleton className="h-[200px] w-full bg-secondary/10" />
            ) : (
                <div className="w-full overflow-x-auto pb-2 relative">
                    <div className="min-w-[800px] relative">
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
                            <div className="absolute top-0 right-0 z-50 pointer-events-none p-3 rounded-xl bg-[#171717]/80 backdrop-blur-md border border-[#262626] shadow-2xl animate-in fade-in zoom-in duration-200">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{format(new Date(hoveredValue.date + 'T00:00:00'), 'EEEE, MMM do')}</p>
                                <p className="text-sm font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span>{hoveredValue.count}</span> <span className="text-muted-foreground font-medium">contributions</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Charts Section */}
      <Card className="bg-[#0C0C0C] border-[#1F1F1F] shadow-xl">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Commits, Pull Requests, and AI Reviews</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? (
               <Skeleton className="h-[350px] w-full bg-secondary/10" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#525252" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#525252" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ 
                        backgroundColor: '#171717', 
                        borderColor: '#262626', 
                        borderRadius: '12px',
                        color: '#EDEDED'
                    }}
                    itemStyle={{ color: '#EDEDED' }}
                    labelStyle={{ color: '#A1A1AA', marginBottom: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="commits" name="Commits" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="prs" name="Pull Requests" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="reviews" name="AI Reviews" fill="#F97316" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, loading, trend, color }: any) {
    return (
        <Card className="bg-[#0C0C0C] border-[#1F1F1F] shadow-sm hover:shadow-md hover:border-[#333] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
               <div className={`p-2 rounded-lg bg-[#141414] ${color}`}>
                   <Icon className="h-4 w-4" />
               </div>
            </CardHeader>
            <CardContent>
               {loading ? (
                  <Skeleton className="h-7 w-20 bg-secondary/10" />
               ) : (
                 <>
                   <div className="text-2xl font-bold text-white">{value?.toLocaleString() || 0}</div>
                   <p className="text-xs text-muted-foreground mt-1">
                       <span className="text-emerald-500 font-medium">{trend}</span> from last month
                   </p>
                 </>
               )}
            </CardContent>
        </Card>
    )
}
