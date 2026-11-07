import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Camera, AlertTriangle, CheckCircle, XCircle, Eye,
  TrendingUp, Clock, MapPin, ArrowRight, Wifi, WifiOff,
  Activity, Filter
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DemoBadge, PageHeader } from '../components/ui/Misc';
import {
  dashboardStats, trendData, categoryData, incidents,
  cameras, sites
} from '../data/mockData';
import {
  formatDate, formatRelative,
  getIncidentStatusColor, getIncidentSeverityColor,
  INCIDENT_CATEGORY_LABELS, INCIDENT_STATUS_LABELS, INCIDENT_SEVERITY_LABELS,
  getCameraStatusColor
} from '../utils';

const dateFilters = ['Today', 'Last 7 days', 'Last 30 days', 'Custom'];
const PIE_COLORS = ['#C8F169', '#20211F', '#A8ABA3', '#E7E9E3'];

const staggerChild = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

function StatCard({ icon: Icon, label, value, sub, color = '#20211F', iconBg = '#F5F6F2' }: {
  icon: React.ElementType; label: string; value: number | string; sub?: string; color?: string; iconBg?: string;
}) {
  return (
    <motion.div variants={staggerChild}>
      <Card className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
          <Icon size={17} style={{ color }} />
        </div>
        <div>
          <p className="text-xs text-[#777A73] font-medium">{label}</p>
          <p className="font-display text-2xl font-bold text-[#20211F] mt-0.5 font-tabular">{value}</p>
          {sub && <p className="text-xs text-[#A8ABA3] mt-0.5">{sub}</p>}
        </div>
      </Card>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-[#E7E9E3] rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-[#20211F] mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [dateFilter, setDateFilter] = React.useState('Last 7 days');
  const navigate = useNavigate();

  const recentIncidents = incidents.slice(0, 5);
  const cameraHealth = {
    online: cameras.filter((c) => c.status === 'online').length,
    offline: cameras.filter((c) => c.status === 'offline').length,
    warning: cameras.filter((c) => c.status === 'warning').length,
  };

  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        subtitle="Real-time overview of surveillance and incident activity"
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge />
            <div className="flex items-center gap-1 bg-white border border-[#E7E9E3] rounded-lg p-1">
              {dateFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                    dateFilter === f
                      ? 'bg-[#252622] text-white'
                      : 'text-[#777A73] hover:text-[#20211F]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Stats Grid */}
      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
      >
        <StatCard icon={Camera} label="Total Cameras" value={dashboardStats.totalCameras} sub={`${dashboardStats.activeAiCameras} AI active`} />
        <StatCard icon={Wifi} label="Online" value={dashboardStats.onlineCameras} iconBg="#F0FAF4" color="#4CAF72" sub="Cameras connected" />
        <StatCard icon={WifiOff} label="Offline" value={dashboardStats.offlineCameras} iconBg="#FEF2F2" color="#DC2626" sub="Need attention" />
        <StatCard icon={Activity} label="Active Sites" value={dashboardStats.activeSites} sub="Monitored locations" />
      </motion.div>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
      >
        <StatCard icon={AlertTriangle} label="Incidents Today" value={dashboardStats.incidentsToday} iconBg="#FFFBEB" color="#D97706" />
        <StatCard icon={Clock} label="Pending Review" value={dashboardStats.pendingReview} iconBg="#EFF6FF" color="#2563EB" />
        <StatCard icon={CheckCircle} label="Confirmed" value={dashboardStats.confirmedIncidents} iconBg="#F0FAF4" color="#4CAF72" />
        <StatCard icon={XCircle} label="False Alerts" value={dashboardStats.falseAlerts} iconBg="#F5F6F2" color="#A8ABA3" />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle subtitle="7-day incident detection breakdown">Incident Trend</CardTitle>
              <DemoBadge />
            </CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1ED" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#A8ABA3' }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#A8ABA3' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="confirmed" stroke="#DC2626" strokeWidth={2} dot={false} name="Confirmed" />
                <Line type="monotone" dataKey="pending" stroke="#D97706" strokeWidth={2} dot={false} name="Pending" />
                <Line type="monotone" dataKey="falseAlarm" stroke="#A8ABA3" strokeWidth={2} dot={false} name="False Alarm" />
                <Line type="monotone" dataKey="total" stroke="#252622" strokeWidth={2.5} dot={false} name="Total" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#E7E9E3]">
              {[
                { color: '#DC2626', label: 'Confirmed' },
                { color: '#D97706', label: 'Pending' },
                { color: '#A8ABA3', label: 'False Alarm' },
                { color: '#252622', label: 'Total' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-5 h-0.5 rounded" style={{ backgroundColor: l.color }} />
                  <span className="text-xs text-[#777A73]">{l.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Category Donut */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle subtitle="Incident category breakdown">Categories</CardTitle>
            </CardHeader>
            <div className="flex-1 flex items-center justify-center">
              <PieChart width={180} height={180}>
                <Pie
                  data={categoryData}
                  cx={90} cy={90}
                  innerRadius={52} outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} incidents`, n]} />
              </PieChart>
            </div>
            <div className="space-y-2 mt-2">
              {categoryData.map((cat, i) => (
                <div key={cat.category} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-xs text-[#777A73] flex-1 truncate">{cat.category}</span>
                  <span className="text-xs font-semibold text-[#20211F] font-tabular">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card padding={false}>
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <CardTitle subtitle={`${recentIncidents.length} most recent detections`}>Recent Incidents</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight size={12} />}
                onClick={() => navigate('/incidents')}
              >
                View all
              </Button>
            </div>
            <div className="divide-y divide-[#F0F1ED]">
              {recentIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => navigate(`/incidents/${inc.id}`)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5F6F2] transition-colors cursor-pointer"
                >
                  {/* Thumbnail placeholder */}
                  <div className="w-10 h-10 rounded-lg bg-[#1a1b18] flex-shrink-0 flex items-center justify-center">
                    <Eye size={14} className="text-[#C8F169]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[#20211F] truncate">{INCIDENT_CATEGORY_LABELS[inc.category]}</p>
                      <Badge className={getIncidentSeverityColor(inc.severity)}>{INCIDENT_SEVERITY_LABELS[inc.severity]}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin size={10} className="text-[#A8ABA3] flex-shrink-0" />
                      <p className="text-xs text-[#777A73] truncate">{inc.cameraName} · {inc.siteName}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge className={getIncidentStatusColor(inc.status)}>{INCIDENT_STATUS_LABELS[inc.status]}</Badge>
                    <p className="text-[10px] text-[#A8ABA3] mt-1 font-tabular">{formatRelative(inc.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Camera Health + Site Summary */}
        <div className="space-y-4">
          {/* Camera Health */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle subtitle="Connection overview">Camera Health</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {[
                  { label: 'Online', value: cameraHealth.online, total: cameras.length, color: '#4CAF72', bg: '#F0FAF4' },
                  { label: 'Offline', value: cameraHealth.offline, total: cameras.length, color: '#DC2626', bg: '#FEF2F2' },
                  { label: 'Warning', value: cameraHealth.warning, total: cameras.length, color: '#D97706', bg: '#FFFBEB' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#777A73]">{item.label}</span>
                      <span className="text-xs font-semibold text-[#20211F] font-tabular">{item.value}/{cameras.length}</span>
                    </div>
                    <div className="h-1.5 bg-[#F0F1ED] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(item.value / cameras.length) * 100}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full justify-center"
                rightIcon={<ArrowRight size={12} />}
                onClick={() => navigate('/cameras')}
              >
                Manage cameras
              </Button>
            </Card>
          </motion.div>

          {/* Site Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Card padding={false}>
              <div className="px-5 pt-4 pb-3">
                <CardTitle subtitle="Incidents by location">Site Summary</CardTitle>
              </div>
              <div className="divide-y divide-[#F0F1ED]">
                {sites.slice(0, 4).map((site) => (
                  <div key={site.id} className="flex items-center justify-between px-5 py-2.5">
                    <div>
                      <p className="text-xs font-medium text-[#20211F]">{site.name}</p>
                      <p className="text-[10px] text-[#A8ABA3]">{site.cameraCount} cameras</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold font-tabular ${site.incidentCount > 20 ? 'text-red-600' : site.incidentCount > 10 ? 'text-amber-600' : 'text-[#20211F]'}`}>
                        {site.incidentCount}
                      </span>
                      <p className="text-[10px] text-[#A8ABA3]">incidents</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
