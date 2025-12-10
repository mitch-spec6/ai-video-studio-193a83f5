import { 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Share2,
  Clock,
  Users,
  BarChart3
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const viewsData = [
  { name: 'Mon', views: 2400 },
  { name: 'Tue', views: 1398 },
  { name: 'Wed', views: 9800 },
  { name: 'Thu', views: 3908 },
  { name: 'Fri', views: 4800 },
  { name: 'Sat', views: 3800 },
  { name: 'Sun', views: 4300 },
];

const platformData = [
  { name: 'YouTube', value: 45, color: '#ff0000' },
  { name: 'TikTok', value: 30, color: '#00f2ea' },
  { name: 'Instagram', value: 15, color: '#833ab4' },
  { name: 'Twitter', value: 10, color: '#1da1f2' },
];

const stats = [
  { label: 'Total Views', value: '124.5K', change: '+12.5%', icon: Eye, color: 'primary' },
  { label: 'Engagement', value: '8.2%', change: '+3.1%', icon: ThumbsUp, color: 'secondary' },
  { label: 'Comments', value: '2.4K', change: '+18%', icon: MessageSquare, color: 'accent' },
  { label: 'Shares', value: '856', change: '+5.2%', icon: Share2, color: 'primary' },
];

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your video performance across platforms</p>
        </div>
        <select className="glass rounded-lg px-4 py-2 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className="glass rounded-xl p-5 transition-all duration-300 hover:border-primary/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <span className="text-sm text-green-500 font-medium">{stat.change}</span>
            </div>
            <div className="font-display font-bold text-3xl mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Views Chart */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Views Over Time</h3>
                <p className="text-sm text-muted-foreground">Daily video views</p>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(185 85% 55%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(185 85% 55%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
                <XAxis dataKey="name" stroke="hsl(220 15% 55%)" fontSize={12} />
                <YAxis stroke="hsl(220 15% 55%)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(220 20% 9%)', 
                    border: '1px solid hsl(220 15% 18%)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(185 85% 55%)" 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold">Platform Split</h3>
              <p className="text-sm text-muted-foreground">Views by platform</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {platformData.map((platform, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm">{platform.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{platform.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Videos Performance */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold">Recent Videos</h3>
            <p className="text-sm text-muted-foreground">Performance of your latest content</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Video</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Likes</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">CTR</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'How to Cook Perfect Pasta', views: '45.2K', likes: '3.2K', ctr: '12.5%', status: 'Trending' },
                { title: '10 Morning Habits for Success', views: '28.1K', likes: '1.8K', ctr: '8.3%', status: 'Active' },
                { title: 'JavaScript Tips and Tricks', views: '15.6K', likes: '892', ctr: '6.1%', status: 'Active' },
              ].map((video, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded bg-gradient-to-br from-primary/20 to-secondary/20" />
                      <span className="font-medium">{video.title}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4">{video.views}</td>
                  <td className="text-right py-4 px-4">{video.likes}</td>
                  <td className="text-right py-4 px-4">{video.ctr}</td>
                  <td className="text-right py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      video.status === 'Trending' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {video.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
