import React from 'react';
import { motion } from 'framer-motion';
import { FileVideo, Image, Download, Eye, CheckCircle, Clock, Search, Filter, Shield, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput, Select } from '../components/ui/Input';
import { DemoBadge, EmptyState, PageHeader } from '../components/ui/Misc';
import { useAppStore } from '../store/appStore';
import { evidence } from '../data/mockData';
import { formatDate, formatRelative, formatFileSize, formatDuration, EVIDENCE_TYPE_LABELS } from '../utils';
import type { Evidence, EvidenceType } from '../types';

const typeIcons: Record<EvidenceType, React.ReactNode> = {
  video_clip: <FileVideo size={20} className="text-blue-500" />,
  snapshot: <Image size={20} className="text-amber-500" />,
  recording: <FileVideo size={20} className="text-purple-500" />,
};

const integrityColors: Record<Evidence['integrityStatus'], string> = {
  verified: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  compromised: 'bg-red-50 text-red-700 border-red-200',
};

export default function EvidenceCenter() {
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [integrityFilter, setIntegrityFilter] = React.useState('all');
  const [view, setView] = React.useState<'grid' | 'table'>('grid');

  const filtered = evidence.filter((e) => {
    if (search && !e.fileName.toLowerCase().includes(search.toLowerCase()) &&
        !e.incidentId.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (integrityFilter !== 'all' && e.integrityStatus !== integrityFilter) return false;
    return true;
  });

  const totalSize = filtered.reduce((acc, e) => acc + e.fileSize, 0);

  return (
    <div>
      <PageHeader
        title="Evidence Center"
        subtitle="Centralized management of incident evidence files"
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge />
            <Button variant="secondary" size="sm" leftIcon={<Download size={13} />}>Export All</Button>
          </div>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Files', value: evidence.length },
          { label: 'Video Clips', value: evidence.filter((e) => e.type === 'video_clip').length },
          { label: 'Snapshots', value: evidence.filter((e) => e.type === 'snapshot').length },
          { label: 'Total Size', value: formatFileSize(evidence.reduce((a, e) => a + e.fileSize, 0)) },
        ].map((s) => (
          <Card key={s.label} className="!py-3">
            <p className="text-xs text-[#777A73]">{s.label}</p>
            <p className="font-display text-xl font-bold text-[#20211F] font-tabular mt-0.5">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <SearchInput
          placeholder="Search evidence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52"
        />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-36">
          <option value="all">All Types</option>
          <option value="video_clip">Video Clips</option>
          <option value="snapshot">Snapshots</option>
          <option value="recording">Recordings</option>
        </Select>
        <Select value={integrityFilter} onChange={(e) => setIntegrityFilter(e.target.value)} className="w-36">
          <option value="all">All Integrity</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="compromised">Compromised</option>
        </Select>
        <div className="ml-auto flex items-center gap-1 bg-white border border-[#E7E9E3] rounded-lg p-1">
          <button
            onClick={() => setView('grid')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${view === 'grid' ? 'bg-[#252622] text-white' : 'text-[#777A73]'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${view === 'table' ? 'bg-[#252622] text-white' : 'text-[#777A73]'}`}
          >
            Table
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FileVideo size={20} />} title="No evidence found" description="Adjust your search or filters." />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((ev, idx) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card padding={false} className="overflow-hidden" hover>
                {/* Thumbnail */}
                <div className="aspect-video bg-[#111210] flex items-center justify-center relative group">
                  <div className="z-10">{typeIcons[ev.type]}</div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-1.5 bg-white rounded-lg">
                      <Eye size={13} className="text-[#20211F]" />
                    </button>
                    <button className="p-1.5 bg-white rounded-lg">
                      <Download size={13} className="text-[#20211F]" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className={integrityColors[ev.integrityStatus]}>
                      {ev.integrityStatus === 'verified' ? '✓' : ev.integrityStatus === 'pending' ? '⏳' : '⚠'}
                    </Badge>
                  </div>
                  {ev.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                      {formatDuration(ev.duration)}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-[#20211F] truncate">{ev.fileName}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-[#777A73]">{formatFileSize(ev.fileSize)}</span>
                    <span className="text-[10px] text-[#A8ABA3] font-tabular">{formatDate(ev.timestamp, 'dd MMM HH:mm')}</span>
                  </div>
                  <p className="text-[10px] text-[#A8ABA3] mt-1 font-mono">{ev.incidentId}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E7E9E3]">
                  {['File', 'Incident', 'Camera', 'Type', 'Size', 'Timestamp', 'Integrity', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[#777A73] px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1ED]">
                {filtered.map((ev) => (
                  <tr key={ev.id} className="table-row-hover">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {typeIcons[ev.type]}
                        <span className="text-xs text-[#20211F] font-medium truncate max-w-[160px]">{ev.fileName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-[#777A73]">{ev.incidentId}</td>
                    <td className="px-4 py-3 text-xs text-[#777A73]">{ev.cameraName}</td>
                    <td className="px-4 py-3"><Badge className="bg-gray-100 text-gray-600 border-gray-200">{EVIDENCE_TYPE_LABELS[ev.type]}</Badge></td>
                    <td className="px-4 py-3 text-xs text-[#777A73] font-tabular">{formatFileSize(ev.fileSize)}</td>
                    <td className="px-4 py-3 text-xs text-[#777A73] font-tabular whitespace-nowrap">{formatDate(ev.timestamp, 'dd MMM HH:mm')}</td>
                    <td className="px-4 py-3">
                      <Badge className={integrityColors[ev.integrityStatus]}>{ev.integrityStatus}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm"><Eye size={12} /></Button>
                        <Button variant="ghost" size="sm"><Download size={12} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
