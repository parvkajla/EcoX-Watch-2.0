import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Plus, Search, Filter, Eye, Edit, Trash2,
  MapPin, Circle, CheckCircle, XCircle, ToggleLeft, ToggleRight
} from 'lucide-react';
import { zones, sites } from '../data/mockData';
import { useAppStore } from '../store/appStore';
import { Zone, ZoneType } from '../types';
import {
  formatDate, ZONE_TYPE_LABELS, getZoneTypeColor, cn
} from '../utils';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const ZONE_TYPE_OPTIONS: ZoneType[] = [
  'authorized_disposal', 'restricted', 'collection_point', 'dustbin', 'detection_region'
];

interface ZoneFormData {
  name: string;
  type: ZoneType;
  siteId: string;
  description: string;
  isActive: boolean;
}

const defaultForm: ZoneFormData = {
  name: '', type: 'authorized_disposal', siteId: '', description: '', isActive: true,
};

export default function Zones() {
  const { currentOrgId, addToast } = useAppStore();
  const [search, setSearch] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('all');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editZone, setEditZone] = React.useState<Zone | null>(null);
  const [form, setForm] = React.useState<ZoneFormData>(defaultForm);
  const [localZones, setLocalZones] = React.useState<Zone[]>(zones);

  const orgSites = sites.filter((s) => s.orgId === currentOrgId);
  const orgZones = localZones.filter((z) => orgSites.some((s) => s.id === z.siteId));

  const filtered = orgZones.filter((z) => {
    const matchSearch = z.name.toLowerCase().includes(search.toLowerCase()) ||
      z.siteName.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || z.type === filterType;
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && z.isActive) ||
      (filterStatus === 'inactive' && !z.isActive);
    return matchSearch && matchType && matchStatus;
  });

  const openAdd = () => { setEditZone(null); setForm({ ...defaultForm, siteId: orgSites[0]?.id ?? '' }); setModalOpen(true); };
  const openEdit = (z: Zone) => {
    setEditZone(z);
    setForm({ name: z.name, type: z.type, siteId: z.siteId, description: z.description, isActive: z.isActive });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.siteId) return;
    const site = orgSites.find((s) => s.id === form.siteId);
    if (editZone) {
      setLocalZones((prev) => prev.map((z) => z.id === editZone.id ? {
        ...z, ...form, siteName: site?.name ?? z.siteName
      } : z));
      addToast({ type: 'success', title: 'Zone Updated', message: `"${form.name}" has been updated.` });
    } else {
      const newZone: Zone = {
        id: `zone-${Date.now()}`,
        ...form,
        siteName: site?.name ?? '',
        lat: site?.lat ?? 0,
        lng: site?.lng ?? 0,
        radius: 30,
        createdAt: new Date().toISOString(),
      };
      setLocalZones((prev) => [...prev, newZone]);
      addToast({ type: 'success', title: 'Zone Added', message: `"${form.name}" has been created.` });
    }
    setModalOpen(false);
  };

  const handleDelete = (z: Zone) => {
    setLocalZones((prev) => prev.filter((item) => item.id !== z.id));
    addToast({ type: 'info', title: 'Zone Removed', message: `"${z.name}" has been removed.` });
  };

  const toggleStatus = (z: Zone) => {
    setLocalZones((prev) => prev.map((item) => item.id === z.id ? { ...item, isActive: !item.isActive } : item));
    addToast({ type: 'success', title: 'Zone Status Updated', message: `"${z.name}" is now ${z.isActive ? 'inactive' : 'active'}.` });
  };

  const counts: Record<ZoneType, number> = ZONE_TYPE_OPTIONS.reduce((acc, t) => {
    acc[t] = orgZones.filter((z) => z.type === t).length;
    return acc;
  }, {} as Record<ZoneType, number>);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#20211F]">Authorized Zones</h1>
          <p className="text-sm text-[#777A73] mt-1">Manage disposal zones, restricted areas and detection regions</p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2">
          <Plus size={15} />
          Add Zone
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ZONE_TYPE_OPTIONS.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(filterType === type ? 'all' : type)}
            className={cn(
              'card p-4 text-left transition-all',
              filterType === type ? 'ring-2 ring-[#252622]' : 'hover:border-[#D4D7CF]'
            )}
          >
            <div className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: getZoneTypeColor(type) + '20' }}>
              <Circle size={14} style={{ color: getZoneTypeColor(type) }} />
            </div>
            <p className="text-xl font-bold font-tabular text-[#20211F]">{counts[type]}</p>
            <p className="text-xs text-[#777A73] mt-0.5 leading-tight">{ZONE_TYPE_LABELS[type]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8ABA3]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search zones..."
            className="w-full pl-9 pr-3 h-9 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] placeholder-[#A8ABA3] focus:outline-none focus:ring-2 focus:ring-[#C8F169]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className="text-xs text-[#777A73] ml-auto">{filtered.length} zones</span>
      </div>

      {/* Zone list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, delay: i * 0.03 }}
            >
              <Card className="p-4 hover:border-[#D4D7CF] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: getZoneTypeColor(zone.type) + '15' }}>
                    <Circle size={18} style={{ color: getZoneTypeColor(zone.type) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#20211F] text-sm">{zone.name}</p>
                        <p className="text-xs text-[#777A73] mt-0.5">{zone.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => toggleStatus(zone)}
                          className="p-1 rounded hover:bg-[#F5F6F2] transition-colors"
                          title={zone.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {zone.isActive
                            ? <ToggleRight size={18} className="text-green-500" />
                            : <ToggleLeft size={18} className="text-[#A8ABA3]" />
                          }
                        </button>
                        <button onClick={() => openEdit(zone)} className="p-1 rounded hover:bg-[#F5F6F2] transition-colors text-[#777A73]">
                          <Edit size={13} />
                        </button>
                        <button onClick={() => handleDelete(zone)} className="p-1 rounded hover:bg-red-50 transition-colors text-[#A8ABA3] hover:text-red-500">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getZoneTypeColor(zone.type) }} />
                        <span className="text-xs text-[#777A73]">{ZONE_TYPE_LABELS[zone.type]}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#777A73]">
                        <MapPin size={10} />
                        {zone.siteName}
                      </div>
                      {zone.radius && (
                        <span className="text-xs text-[#777A73]">Radius: {zone.radius}m</span>
                      )}
                      <div className="ml-auto">
                        {zone.isActive
                          ? <span className="flex items-center gap-1 text-xs text-green-700"><CheckCircle size={11} /> Active</span>
                          : <span className="flex items-center gap-1 text-xs text-[#A8ABA3]"><XCircle size={11} /> Inactive</span>
                        }
                      </div>
                    </div>
                    <p className="text-[10px] text-[#A8ABA3] mt-2">Created {formatDate(zone.createdAt, 'dd MMM yyyy')}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Shield size={40} className="text-[#D4D7CF]" />
          <p className="text-[#777A73] text-sm">No zones match your filters</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editZone ? 'Edit Zone' : 'Add New Zone'}
      >
        <div className="space-y-4 p-1">
          <Input
            label="Zone Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Market Collection Point"
          />
          <div>
            <label className="block text-xs font-medium text-[#20211F] mb-1.5">Zone Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ZoneType }))}
              className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]"
            >
              {ZONE_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{ZONE_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#20211F] mb-1.5">Site</label>
            <select
              value={form.siteId}
              onChange={(e) => setForm((f) => ({ ...f, siteId: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]"
            >
              {orgSites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief description of this zone"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-[#20211F]">Active</label>
            <button
              onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              className="p-0.5"
            >
              {form.isActive
                ? <ToggleRight size={24} className="text-green-500" />
                : <ToggleLeft size={24} className="text-[#A8ABA3]" />
              }
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={!form.name || !form.siteId}>
              {editZone ? 'Save Changes' : 'Create Zone'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
