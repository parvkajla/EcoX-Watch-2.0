import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Download, Filter, Calendar,
  AlertTriangle, CheckCircle, XCircle, Clock, Camera
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAppStore } from '../store/appStore';
import { incidents, cameras as mockCameras, sites, trendData, categoryData } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { INCIDENT_CATEGORY_LABELS, formatDate, cn } from '../utils';

const PIE_COLORS = ['#252622', '#C8F169', '#D97706', '#A8ABA3'];

const siteData = sites.slice(0, 6).map((s) => ({
  name: s.name.split(' ').slice(0, 2).join(' '),
  incidents: s.incidentCount,
  cameras: s.cameraCount,
}));

const uptimeData = [
  { date: '10/26', uptime: 94.2 },
  { date: '10/27', uptime: 96.8 },
  { date: '10/28', uptime: 91.5 },
  { date: '10/29', uptime: 98.2 },
  { date: '10/30', uptime: 95.6 },
  { date: '10/31', uptime: 93.1 },
  { date: '11/01', uptime: 87.5 },
];

const resolutionTimeData = [
  { day: 'Mon', avgHours: 4.2 },
  { day: 'Tue', avgHours: 3.8 },
  { day: 'Wed', avgHours: 5.1 },
  { day: 'Thu', avgHours: 2.9 },
  { day: 'Fri', avgHours: 6.3 },
  { day: 'Sat', avgHours: 7.1 },
  { day: 'Sun', avgHours: 8.4 },
];

type DateRange = '7d' | '30d' | 'custom';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; name: string; color: string}>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E7E9E3] rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-[#20211F] mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-[#777A73]">{p.name}:</span>
            <span className="font-semibold text-[#20211F]">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { currentOrgId, incidents: storeIncidents } = useAppStore();
  const [dateRange, setDateRange] = React.useState<DateRange>('7d');
  const [filterSite, setFilterSite] = React.useState('all');
  const [filterCategory, setFilterCategory] = React.useState('all');

  const orgSites = sites.filter((s) => s.orgId === currentOrgId);
  const orgIncidents = storeIncidents.filter((i) => i.orgId === currentOrgId);

  const confirmed = orgIncidents.filter((i) => i.status === 'confirmed').length;
  const falseAlarm = orgIncidents.filter((i) => i.status === 'false_alarm').length;
  const pending = orgIncidents.filter((i) => i.status === 'pending').length;
  const resolved = orgIncidents.filter((i) => i.status === 'resolved').length;
  const accuracy = orgIncidents.length > 0
    ? Math.round((confirmed / (confirmed + falseAlarm)) * 100) || 0
    : 0;

  const handleExport = (type: 'csv' | 'pdf') => {
    if (type === 'csv') {
      const rows = [
        ['Date', 'Confirmed', 'False Alarm', 'Pending', 'Total'],
        ...trendData.map((d) => [d.date, d.confirmed, d.falseAlarm, d.pending, d.total]),
      ];
      const csv = rows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ecox-watch-analytics.csv';
      a.click();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#20211F]">Analytics & Reports</h1>
          <p className="text-sm text-[#777A73] mt-1">Incident trends, detection performance and camera health</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => handleExport('csv')}>
            <Download size={14} />
            Export CSV
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => handleExport('pdf')}>
            <Download size={14} />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-[#F5F6F2] rounded-lg p-0.5">
          {([['7d', 'Last 7 Days'], ['30d', 'Last 30 Days']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setDateRange(val)}
              className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', dateRange === val ? 'bg-white text-[#20211F] shadow-sm' : 'text-[#777A73] hover:text-[#20211F]')}
            >
              {label}
            </button>
          ))}
        </div>
        <select value={filterSite} onChange={(e) => setFilterSite(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
          <option value="all">All Sites</option>
          {orgSites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
          <option value="all">All Categories</option>
          {Object.entries(INCIDENT_CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="demo-badge ml-auto"><Calendar size={9} /> Demo Data</span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Incidents', value: orgIncidents.length, icon: AlertTriangle, color: 'text-[#20211F]', bg: 'bg-[#F5F6F2]' },
          { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'False Alarms', value: falseAlarm, icon: XCircle, color: 'text-[#777A73]', bg: 'bg-[#F5F6F2]' },
          { label: 'Pending Review', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'AI Accuracy', value: `${accuracy}%`, icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className={`text-2xl font-bold font-tabular ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-[#777A73] mt-1">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Trend Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-semibold text-[#20211F]">Daily Incident Trend</p>
            <p className="text-xs text-[#777A73] mt-0.5">Confirmed, false alarms, and pending review over time</p>
          </div>
          <TrendingUp size={16} className="text-[#A8ABA3]" />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1ED" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A8ABA3' }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: '#A8ABA3' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="confirmed" stroke="#252622" strokeWidth={2} dot={{ r: 3, fill: '#252622' }} name="Confirmed" />
            <Line type="monotone" dataKey="falseAlarm" stroke="#A8ABA3" strokeWidth={2} dot={{ r: 3, fill: '#A8ABA3' }} name="False Alarm" />
            <Line type="monotone" dataKey="pending" stroke="#D97706" strokeWidth={2} dot={{ r: 3, fill: '#D97706' }} name="Pending" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Row 2: Category distribution + Site comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <p className="font-semibold text-[#20211F] mb-1">Incident Category Distribution</p>
          <p className="text-xs text-[#777A73] mb-5">Breakdown by incident type</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="count"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((item, i) => (
                <div key={item.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-[#20211F]">{item.category}</span>
                    </div>
                    <span className="font-semibold font-tabular text-[#20211F]">{item.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-[#F0F1ED] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-semibold text-[#20211F] mb-1">Site-wise Incident Count</p>
          <p className="text-xs text-[#777A73] mb-5">Comparing incident volume across sites</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={siteData} margin={{ top: 5, right: 5, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1ED" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#A8ABA3' }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#A8ABA3' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="incidents" name="Incidents" fill="#252622" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 3: Camera uptime + Resolution time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <p className="font-semibold text-[#20211F] mb-1">Camera Uptime</p>
          <p className="text-xs text-[#777A73] mb-5">Average uptime percentage across the fleet</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={uptimeData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1ED" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A8ABA3' }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#A8ABA3' }} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="uptime" stroke="#4CAF72" strokeWidth={2} dot={{ r: 3, fill: '#4CAF72' }} name="Uptime %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <p className="font-semibold text-[#20211F] mb-1">Avg. Incident Resolution Time</p>
          <p className="text-xs text-[#777A73] mb-5">Hours from detection to resolution by day</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={resolutionTimeData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1ED" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#A8ABA3' }} />
              <YAxis tick={{ fontSize: 11, fill: '#A8ABA3' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgHours" name="Avg Hours" fill="#C8F169" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </motion.div>
  );
}
