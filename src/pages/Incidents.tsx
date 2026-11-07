import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Eye, MapPin, User, Car, Search, Filter, ChevronDown, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput, Select } from '../components/ui/Input';
import { DemoBadge, EmptyState, PageHeader } from '../components/ui/Misc';
import { useAppStore } from '../store/appStore';
import { sites, cameras } from '../data/mockData';
import {
  formatDate, formatRelative,
  getIncidentStatusColor, getIncidentSeverityColor,
  INCIDENT_CATEGORY_LABELS, INCIDENT_STATUS_LABELS, INCIDENT_SEVERITY_LABELS,
  getConfidenceColor
} from '../utils';

const statusOptions = ['All', 'Pending Review', 'Under Investigation', 'Confirmed', 'False Alarm', 'Resolved'];
const severityOptions = ['All', 'Low', 'Medium', 'High', 'Critical'];
const categoryOptions = ['All', 'Individual Dumping', 'Vehicle Dumping', 'Suspicious Waste', 'Other Suspicious'];

export default function Incidents() {
  const { incidents } = useAppStore();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [severityFilter, setSeverityFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [siteFilter, setSiteFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const filtered = incidents.filter((inc) => {
    if (search && !inc.description.toLowerCase().includes(search.toLowerCase()) &&
        !inc.cameraName.toLowerCase().includes(search.toLowerCase()) &&
        !inc.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && inc.category !== categoryFilter) return false;
    if (siteFilter !== 'all' && inc.siteId !== siteFilter) return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const statusCounts = {
    pending: incidents.filter((i) => i.status === 'pending').length,
    confirmed: incidents.filter((i) => i.status === 'confirmed').length,
    investigating: incidents.filter((i) => i.status === 'under_investigation').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
  };

  return (
    <div>
      <PageHeader
        title="Incident Center"
        subtitle="Review and manage all detected incidents"
        actions={<DemoBadge />}
      />

      {/* Quick stat chips */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {[
          { label: 'Pending', value: statusCounts.pending, color: 'text-amber-700 bg-amber-50 border-amber-200', filter: 'pending' },
          { label: 'Under Investigation', value: statusCounts.investigating, color: 'text-blue-700 bg-blue-50 border-blue-200', filter: 'under_investigation' },
          { label: 'Confirmed', value: statusCounts.confirmed, color: 'text-red-700 bg-red-50 border-red-200', filter: 'confirmed' },
          { label: 'Resolved', value: statusCounts.resolved, color: 'text-green-700 bg-green-50 border-green-200', filter: 'resolved' },
        ].map((chip) => (
          <button
            key={chip.label}
            onClick={() => setStatusFilter(statusFilter === chip.filter ? 'all' : chip.filter)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              statusFilter === chip.filter ? chip.color : 'bg-white border-[#E7E9E3] text-[#777A73] hover:border-[#D4D7CF]'
            }`}
          >
            <span className="font-tabular font-bold">{chip.value}</span>
            {chip.label}
          </button>
        ))}
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="text-xs text-[#777A73] hover:text-[#20211F] transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <SearchInput
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56"
        />
        <Select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} className="w-44">
          <option value="all">All Sites</option>
          {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="w-32">
          <option value="all">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </Select>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-44">
          <option value="all">All Categories</option>
          <option value="individual_dumping">Individual Dumping</option>
          <option value="vehicle_dumping">Vehicle Dumping</option>
          <option value="suspicious_waste">Suspicious Waste</option>
          <option value="other_suspicious">Other Suspicious</option>
        </Select>
        <span className="ml-auto text-xs text-[#777A73]">
          {filtered.length} incident{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Incident table */}
      <Card padding={false}>
        {paginated.length === 0 ? (
          <EmptyState
            icon={<AlertTriangle size={20} />}
            title="No incidents found"
            description="Try adjusting your search filters or date range."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E7E9E3]">
                    {['Incident', 'Camera / Site', 'Time', 'Severity', 'AI Conf.', 'Status', 'Investigator', ''].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-[#777A73] px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F1ED]">
                  {paginated.map((inc, idx) => (
                    <motion.tr
                      key={inc.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                      className="table-row-hover"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#111210] flex items-center justify-center flex-shrink-0">
                            <Eye size={13} className="text-[#C8F169]" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#20211F]">{INCIDENT_CATEGORY_LABELS[inc.category]}</p>
                            <p className="text-[10px] text-[#A8ABA3] font-mono">{inc.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-[#20211F]">{inc.cameraName}</p>
                        <p className="text-[10px] text-[#A8ABA3]">{inc.siteName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-[#20211F] font-tabular whitespace-nowrap">{formatDate(inc.timestamp, 'dd MMM, HH:mm')}</p>
                        <p className="text-[10px] text-[#A8ABA3]">{formatRelative(inc.timestamp)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getIncidentSeverityColor(inc.severity)}>
                          {INCIDENT_SEVERITY_LABELS[inc.severity]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold font-tabular ${getConfidenceColor(inc.aiConfidence)}`}>
                          {inc.aiConfidence}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getIncidentStatusColor(inc.status)}>
                          {INCIDENT_STATUS_LABELS[inc.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {inc.assignedToName ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#252622] flex items-center justify-center flex-shrink-0">
                              <span className="text-[8px] font-bold text-[#C8F169]">{inc.assignedToName.split(' ').map(n=>n[0]).join('')}</span>
                            </div>
                            <span className="text-xs text-[#777A73] truncate max-w-[80px]">{inc.assignedToName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#A8ABA3]">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/incidents/${inc.id}`); }}>
                          Review
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#E7E9E3]">
                <p className="text-xs text-[#777A73]">
                  Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    Prev
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-7 h-7 text-xs rounded-md transition-colors ${
                        page === i + 1 ? 'bg-[#252622] text-white' : 'text-[#777A73] hover:bg-[#F5F6F2]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
