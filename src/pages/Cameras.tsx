import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera as CameraIcon, Plus, Search, Wifi, WifiOff,
  AlertTriangle, Edit, Trash2, RefreshCw, Brain,
  ChevronDown, Eye, Settings, Monitor, MapPin
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cameras as mockCameras, sites } from '../data/mockData';
import type { Camera } from '../types';
import {
  formatRelative, CAMERA_STATUS_LABELS, getCameraStatusColor, cn
} from '../utils';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface AddCameraForm {
  name: string;
  siteId: string;
  location: string;
  rtspUrl: string;
  description: string;
  resolution: string;
  fps: string;
}

const defaultForm: AddCameraForm = {
  name: '', siteId: '', location: '', rtspUrl: '', description: '',
  resolution: '1080p', fps: '25',
};

type ViewMode = 'table' | 'grid';

export default function Cameras() {
  const { cameras, currentOrgId, updateCameraAI, addToast } = useAppStore();
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [filterSite, setFilterSite] = React.useState<string>('all');
  const [viewMode, setViewMode] = React.useState<ViewMode>('table');
  const [sortBy, setSortBy] = React.useState<string>('name');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [testingCamera, setTestingCamera] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<AddCameraForm>(defaultForm);
  const [formErrors, setFormErrors] = React.useState<Partial<AddCameraForm>>({});
  const [detailCamera, setDetailCamera] = React.useState<Camera | null>(null);

  const orgSites = sites.filter((s) => s.orgId === currentOrgId);
  const orgCameras = cameras.filter((c) => c.orgId === currentOrgId);

  const filtered = orgCameras
    .filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchSite = filterSite === 'all' || c.siteId === filterSite;
      return matchSearch && matchStatus && matchSite;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'incidents') return b.incidentCount - a.incidentCount;
      return 0;
    });

  const stats = {
    total: orgCameras.length,
    online: orgCameras.filter((c) => c.status === 'online').length,
    offline: orgCameras.filter((c) => c.status === 'offline').length,
    warning: orgCameras.filter((c) => c.status === 'warning').length,
    aiEnabled: orgCameras.filter((c) => c.aiEnabled).length,
  };

  const validateForm = () => {
    const errors: Partial<AddCameraForm> = {};
    if (!form.name) errors.name = 'Required';
    if (!form.siteId) errors.siteId = 'Required';
    if (!form.location) errors.location = 'Required';
    if (!form.rtspUrl) errors.rtspUrl = 'Required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCamera = () => {
    if (!validateForm()) return;
    addToast({ type: 'success', title: 'Camera Added', message: `"${form.name}" has been added. Connection pending.` });
    setModalOpen(false);
    setForm(defaultForm);
    setFormErrors({});
  };

  const handleTestConnection = (camId: string) => {
    setTestingCamera(camId);
    setTimeout(() => {
      setTestingCamera(null);
      const cam = cameras.find((c) => c.id === camId);
      if (cam?.status === 'online') {
        addToast({ type: 'success', title: 'Connection Successful', message: `${cam?.name} is reachable.` });
      } else {
        addToast({ type: 'error', title: 'Connection Failed', message: `Could not reach camera. Check network or RTSP URL.` });
      }
    }, 2000);
  };

  const handleToggleAI = (camId: string, enabled: boolean) => {
    updateCameraAI(camId, !enabled);
    const cam = cameras.find((c) => c.id === camId);
    addToast({ type: 'success', title: `AI ${!enabled ? 'Enabled' : 'Disabled'}`, message: `AI processing ${!enabled ? 'started' : 'stopped'} for ${cam?.name}.` });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#20211F]">Camera Management</h1>
          <p className="text-sm text-[#777A73] mt-1">Monitor and configure your surveillance cameras</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={15} />
          Add Camera
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-[#20211F]' },
          { label: 'Online', value: stats.online, color: 'text-green-600' },
          { label: 'Offline', value: stats.offline, color: 'text-red-600' },
          { label: 'Warning', value: stats.warning, color: 'text-amber-600' },
          { label: 'AI Active', value: stats.aiEnabled, color: 'text-blue-600' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center">
            <p className={`text-2xl font-bold font-tabular ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-[#777A73] mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8ABA3]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cameras..."
            className="w-full pl-9 pr-3 h-9 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] placeholder-[#A8ABA3] focus:outline-none focus:ring-2 focus:ring-[#C8F169]"
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="warning">Warning</option>
        </select>
        <select value={filterSite} onChange={(e) => setFilterSite(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
          <option value="all">All Sites</option>
          {orgSites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
          <option value="name">Sort: Name</option>
          <option value="status">Sort: Status</option>
          <option value="incidents">Sort: Incidents</option>
        </select>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setViewMode('table')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'table' ? 'bg-[#252622] text-white' : 'text-[#777A73] hover:bg-[#F5F6F2]')}>
            <Monitor size={14} />
          </button>
          <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-[#252622] text-white' : 'text-[#777A73] hover:bg-[#F5F6F2]')}>
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Table view */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E7E9E3]">
                  {['Camera', 'Site / Location', 'Status', 'Stream', 'AI', 'Incidents', 'Last Connected', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#A8ABA3] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1ED]">
                {filtered.map((cam) => (
                  <tr key={cam.id} className="table-row-hover">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F5F6F2] flex items-center justify-center flex-shrink-0">
                          <CameraIcon size={14} className="text-[#777A73]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#20211F]">{cam.name}</p>
                          <p className="text-xs text-[#A8ABA3] font-tabular">{cam.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[#20211F]">{cam.siteName}</p>
                      <p className="text-xs text-[#A8ABA3]">{cam.location}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`status-dot ${cam.status}`} />
                        <span className="text-sm text-[#20211F]">{CAMERA_STATUS_LABELS[cam.status]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[#20211F]">{cam.resolution}</p>
                      <p className="text-xs text-[#A8ABA3]">{cam.fps} fps · {cam.streamType.toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleAI(cam.id, cam.aiEnabled)}
                        className={cn(
                          'text-xs px-2.5 py-1 rounded-full border font-medium transition-colors',
                          cam.aiEnabled ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 'bg-[#F5F6F2] text-[#777A73] border-[#E7E9E3] hover:bg-[#F0F1ED]'
                        )}
                      >
                        {cam.aiEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-tabular text-[#20211F]">{cam.incidentCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#777A73] font-tabular">{formatRelative(cam.lastConnected)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTestConnection(cam.id)}
                          className="p-1.5 rounded-lg hover:bg-[#F5F6F2] transition-colors text-[#777A73]"
                          title="Test connection"
                        >
                          {testingCamera === cam.id
                            ? <RefreshCw size={13} className="animate-spin" />
                            : <Wifi size={13} />
                          }
                        </button>
                        <button
                          onClick={() => setDetailCamera(cam)}
                          className="p-1.5 rounded-lg hover:bg-[#F5F6F2] transition-colors text-[#777A73]"
                          title="View details"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <CameraIcon size={36} className="text-[#D4D7CF]" />
              <p className="text-sm text-[#777A73]">No cameras found</p>
            </div>
          )}
        </Card>
      )}

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cam, i) => (
            <motion.div key={cam.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="p-4 hover:border-[#D4D7CF] transition-colors cursor-pointer" onClick={() => setDetailCamera(cam)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`status-dot ${cam.status}`} />
                    <span className="text-xs font-medium text-[#20211F]">{CAMERA_STATUS_LABELS[cam.status]}</span>
                  </div>
                  {cam.aiEnabled && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">AI ON</span>
                  )}
                </div>
                <div className="camera-feed mb-3">
                  <div className="camera-feed-overlay">
                    <div className="flex justify-between">
                      <span className="text-white text-[9px] font-tabular bg-black/40 px-1.5 py-0.5 rounded">{cam.resolution}</span>
                      <span className="text-white text-[9px] font-tabular bg-black/40 px-1.5 py-0.5 rounded">{cam.fps}fps</span>
                    </div>
                    <div className="flex items-center justify-center flex-1">
                      <CameraIcon size={24} className="text-white/30" />
                    </div>
                    <span className="text-white/60 text-[9px] font-tabular self-center">DEMO FEED PLACEHOLDER</span>
                  </div>
                </div>
                <p className="font-semibold text-sm text-[#20211F] truncate">{cam.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={10} className="text-[#A8ABA3]" />
                  <p className="text-xs text-[#777A73] truncate">{cam.location}</p>
                </div>
                <p className="text-[10px] text-[#A8ABA3] mt-2">{cam.incidentCount} incidents · {formatRelative(cam.lastConnected)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Camera Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setForm(defaultForm); setFormErrors({}); }} title="Add New Camera">
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Camera Name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Main Entrance Gate" error={formErrors.name} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#20211F] mb-1.5">Site *</label>
              <select
                value={form.siteId}
                onChange={(e) => setForm((f) => ({ ...f, siteId: e.target.value }))}
                className={cn('w-full h-10 px-3 text-sm bg-white border rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]', formErrors.siteId ? 'border-red-400' : 'border-[#E7E9E3]')}
              >
                <option value="">Select site...</option>
                {orgSites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <Input label="Location / Zone *" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Gate 1, North Wing" error={formErrors.location} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#20211F] mb-1.5">RTSP Stream URL *</label>
            <input
              type="password"
              value={form.rtspUrl}
              onChange={(e) => setForm((f) => ({ ...f, rtspUrl: e.target.value }))}
              placeholder="rtsp://user:password@ip:port/stream"
              className={cn('w-full h-10 px-3 text-sm bg-white border rounded-lg text-[#20211F] placeholder-[#A8ABA3] focus:outline-none focus:ring-2 focus:ring-[#C8F169]', formErrors.rtspUrl ? 'border-red-400' : 'border-[#E7E9E3]')}
            />
            <p className="text-[10px] text-[#A8ABA3] mt-1">Credentials are never stored in plain text.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#20211F] mb-1.5">Resolution</label>
              <select value={form.resolution} onChange={(e) => setForm((f) => ({ ...f, resolution: e.target.value }))}
                className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
                {['720p', '1080p', '4K'].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#20211F] mb-1.5">FPS</label>
              <select value={form.fps} onChange={(e) => setForm((f) => ({ ...f, fps: e.target.value }))}
                className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
                {['15', '20', '25', '30'].map((f) => <option key={f} value={f}>{f} fps</option>)}
              </select>
            </div>
          </div>
          <Input label="Description (optional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Notes about this camera" />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => { setModalOpen(false); setForm(defaultForm); }}>Cancel</Button>
            <Button className="flex-1" onClick={handleAddCamera}>Add Camera</Button>
          </div>
        </div>
      </Modal>

      {/* Camera Detail Modal */}
      <Modal isOpen={!!detailCamera} onClose={() => setDetailCamera(null)} title="Camera Details">
        {detailCamera && (
          <div className="space-y-4 p-1">
            <div className="camera-feed h-40">
              <div className="camera-feed-overlay">
                <div className="flex justify-between">
                  <span className="text-white text-xs font-tabular bg-black/40 px-2 py-0.5 rounded">{detailCamera.name}</span>
                  <span className="text-white text-xs font-tabular bg-black/40 px-2 py-0.5 rounded">{detailCamera.resolution} · {detailCamera.fps}fps</span>
                </div>
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center">
                    <CameraIcon size={32} className="text-white/30 mx-auto mb-1" />
                    <span className="text-white/40 text-xs">DEMO FEED PLACEHOLDER</span>
                  </div>
                </div>
                <span className="text-white/60 text-[10px] font-tabular self-start">{detailCamera.ipAddress}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Status', value: CAMERA_STATUS_LABELS[detailCamera.status] },
                { label: 'AI Status', value: detailCamera.aiStatus },
                { label: 'Model', value: detailCamera.model },
                { label: 'Manufacturer', value: detailCamera.manufacturer },
                { label: 'Install Date', value: detailCamera.installDate },
                { label: 'Stream Type', value: detailCamera.streamType.toUpperCase() },
              ].map((item) => (
                <div key={item.label} className="bg-[#F5F6F2] rounded-lg p-3">
                  <p className="text-[10px] text-[#A8ABA3] uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-[#20211F] mt-0.5 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 flex items-center gap-2 justify-center" onClick={() => { handleTestConnection(detailCamera.id); setDetailCamera(null); }}>
                <RefreshCw size={13} />
                Test Connection
              </Button>
              <Button
                className="flex-1 flex items-center gap-2 justify-center"
                onClick={() => { handleToggleAI(detailCamera.id, detailCamera.aiEnabled); setDetailCamera(null); }}
              >
                <Brain size={13} />
                {detailCamera.aiEnabled ? 'Disable AI' : 'Enable AI'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
