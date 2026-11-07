import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Users, Camera, MapPin, Plus, Edit,
  Globe, Shield, Layers, ChevronRight, CheckCircle
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { organizations, sites } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils';

export default function Organization() {
  const { currentOrgId, setCurrentOrg } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<'details' | 'sites' | 'structure'>('details');

  const currentOrg = organizations.find((o) => o.id === currentOrgId) ?? organizations[0];
  const orgSites = sites.filter((s) => s.orgId === currentOrgId);

  const municipalStructure = [
    { level: 'City', value: 'Mumbai' },
    { level: 'Corporation', value: 'MCGM (Greater Mumbai)' },
    { level: 'Ward', value: 'K-West, G-South, F-North' },
    { level: 'Department', value: 'Solid Waste Management' },
    { level: 'Enforcement Team', value: '3 active teams' },
  ];

  const privateStructure = [
    { level: 'Organization', value: 'IIT Delhi Campus' },
    { level: 'Campus', value: 'Hauz Khas Main Campus' },
    { level: 'Zones', value: 'Academic, Hostel, Admin' },
    { level: 'Department', value: 'Campus Administration' },
    { level: 'Camera Groups', value: 'Entry Points, Common Areas' },
  ];

  const structure = currentOrg.type === 'municipal' ? municipalStructure : privateStructure;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#20211F]">Organization Management</h1>
          <p className="text-sm text-[#777A73] mt-1">Configure your organization structure, sites, and preferences</p>
        </div>
      </div>

      {/* Organization selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {organizations.map((org) => (
          <button
            key={org.id}
            onClick={() => setCurrentOrg(org.id)}
            className={cn(
              'text-left p-4 rounded-2xl border transition-all',
              currentOrgId === org.id
                ? 'border-[#252622] bg-[#252622] text-white shadow-lg'
                : 'border-[#E7E9E3] bg-white hover:border-[#D4D7CF]'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', currentOrgId === org.id ? 'bg-[#C8F169]/20' : 'bg-[#F5F6F2]')}>
                <span className={cn('text-sm font-bold', currentOrgId === org.id ? 'text-[#C8F169]' : 'text-[#20211F]')}>{org.logoInitials}</span>
              </div>
              {currentOrgId === org.id && <CheckCircle size={16} className="text-[#C8F169]" />}
            </div>
            <p className={cn('text-sm font-semibold truncate', currentOrgId === org.id ? 'text-white' : 'text-[#20211F]')}>{org.name}</p>
            <p className={cn('text-xs mt-0.5 capitalize', currentOrgId === org.id ? 'text-white/60' : 'text-[#777A73]')}>{org.type} · {org.city}</p>
            <div className={cn('flex gap-3 mt-3 text-xs', currentOrgId === org.id ? 'text-white/70' : 'text-[#777A73]')}>
              <span>{org.siteCount} sites</span>
              <span>{org.cameraCount} cams</span>
              <span>{org.userCount} users</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F5F6F2] rounded-xl p-1 w-fit">
        {([['details', 'Details'], ['sites', 'Sites'], ['structure', 'Structure']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors', activeTab === key ? 'bg-white text-[#20211F] shadow-sm' : 'text-[#777A73] hover:text-[#20211F]')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Details tab */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#252622] rounded-2xl flex items-center justify-center">
                  <span className="text-lg font-bold text-[#C8F169]">{currentOrg.logoInitials}</span>
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-[#20211F]">{currentOrg.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={currentOrg.type === 'municipal' ? 'info' : 'neutral'}>
                      {currentOrg.type === 'municipal' ? 'Municipal' : 'Private'}
                    </Badge>
                    <span className="text-xs text-[#777A73]">{currentOrg.city}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#E7E9E3] rounded-lg hover:bg-[#F5F6F2] transition-colors text-[#777A73]">
                <Edit size={12} />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Sites', value: currentOrg.siteCount, icon: MapPin },
                { label: 'Cameras', value: currentOrg.cameraCount, icon: Camera },
                { label: 'Users', value: currentOrg.userCount, icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-[#F5F6F2] rounded-xl">
                  <stat.icon size={18} className="text-[#777A73] mx-auto mb-2" />
                  <p className="text-2xl font-bold font-tabular text-[#20211F]">{stat.value}</p>
                  <p className="text-xs text-[#777A73]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#F0F1ED]">
                <span className="text-sm text-[#777A73]">Organization Type</span>
                <span className="text-sm font-medium text-[#20211F] capitalize">{currentOrg.type}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#F0F1ED]">
                <span className="text-sm text-[#777A73]">City</span>
                <span className="text-sm font-medium text-[#20211F]">{currentOrg.city}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#F0F1ED]">
                <span className="text-sm text-[#777A73]">Platform Since</span>
                <span className="text-sm font-medium text-[#20211F]">{currentOrg.createdAt}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#777A73]">Organization ID</span>
                <span className="text-sm font-mono text-[#20211F]">{currentOrg.id}</span>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="space-y-2">
                {[
                  { label: 'Manage Sites', icon: MapPin },
                  { label: 'View Camera Groups', icon: Camera },
                  { label: 'User Management', icon: Users },
                  { label: 'Organization Settings', icon: Shield },
                ].map((item) => (
                  <button key={item.label} className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-[#F5F6F2] transition-colors text-left">
                    <item.icon size={14} className="text-[#777A73]" />
                    <span className="text-sm text-[#20211F]">{item.label}</span>
                    <ChevronRight size={12} className="text-[#A8ABA3] ml-auto" />
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mb-3">Platform Status</p>
              <div className="space-y-2">
                {[
                  { label: 'EcoX Watch', status: 'Active' },
                  { label: 'AI Processing', status: 'Active' },
                  { label: 'Evidence Storage', status: 'Active' },
                  { label: 'Notifications', status: 'Active' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-[#20211F]">{item.label}</span>
                    <span className="flex items-center gap-1 text-xs text-green-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Sites tab */}
      {activeTab === 'sites' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[#777A73]">{orgSites.length} sites in this organization</p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#252622] text-white rounded-lg hover:bg-[#353733] transition-colors">
              <Plus size={12} />
              Add Site
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {orgSites.map((site, i) => (
              <motion.div key={site.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="p-5 hover:border-[#D4D7CF] transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-[#20211F]">{site.name}</p>
                      <p className="text-xs text-[#777A73] flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />{site.address}
                      </p>
                    </div>
                    <Badge variant={site.status === 'active' ? 'success' : 'neutral'}>{site.status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Cameras', value: site.cameraCount },
                      { label: 'Zones', value: site.zoneCount },
                      { label: 'Incidents', value: site.incidentCount },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-[#F5F6F2] rounded-lg py-2">
                        <p className="text-sm font-bold font-tabular text-[#20211F]">{stat.value}</p>
                        <p className="text-[10px] text-[#777A73]">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Structure tab */}
      {activeTab === 'structure' && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Layers size={16} className="text-[#777A73]" />
            <p className="font-semibold text-[#20211F]">{currentOrg.type === 'municipal' ? 'Municipal' : 'Private'} Organization Hierarchy</p>
          </div>
          <div className="space-y-0">
            {structure.map((item, i) => (
              <div key={item.level} className="flex items-start gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-8 h-8 bg-[#252622] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {i + 1}
                  </div>
                  {i < structure.length - 1 && <div className="w-0.5 h-8 bg-[#E7E9E3]" />}
                </div>
                <div className="pb-6">
                  <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider">{item.level}</p>
                  <p className="text-sm font-medium text-[#20211F] mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
