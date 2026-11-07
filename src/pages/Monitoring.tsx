import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid2X2, LayoutGrid, MonitorPlay, Wifi, WifiOff, AlertTriangle,
  Maximize2, ChevronDown, Circle, Activity, Clock, Eye,
  Video, ZoomIn, ZoomOut, RotateCcw, Search, Filter
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchInput, Select } from '../components/ui/Input';
import { DemoBadge, PageHeader } from '../components/ui/Misc';
import { cameras, incidents, sites } from '../data/mockData';
import { formatRelative, INCIDENT_CATEGORY_LABELS, getCameraStatusColor, getCameraStatusDotColor } from '../utils';
import type { Camera } from '../types';

const layouts = [
  { id: 1, icon: MonitorPlay, label: '1 Camera' },
  { id: 4, icon: Grid2X2, label: '4 Cameras' },
  { id: 9, icon: LayoutGrid, label: '9 Cameras' },
  { id: 16, icon: LayoutGrid, label: '16 Cameras' },
];

function CameraFeedPlaceholder({
  camera, selected, onClick, small
}: {
  camera: Camera; selected: boolean; onClick: () => void; small?: boolean;
}) {
  const isOnline = camera.status === 'online';
  const isWarning = camera.status === 'warning';

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: small ? 1 : 1.01 }}
      className={`camera-feed cursor-pointer transition-all duration-150 ${
        selected ? 'ring-2 ring-[#C8F169]' : isWarning ? 'ring-1 ring-amber-400' : ''
      }`}
    >
      {/* Feed placeholder */}
      <div className="absolute inset-0 bg-[#111210]">
        {isOnline ? (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Simulated video grid */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #C8F169 0, #C8F169 1px, transparent 0, transparent 50%)',
                backgroundSize: '100% 30px',
              }}
            />
            {!small && (
              <div className="text-center">
                <Eye size={28} className="text-[#C8F169] mx-auto mb-2 opacity-60" />
                <p className="text-[#777A73] text-xs">DEMO FEED — {camera.resolution} @ {camera.fps}fps</p>
                <p className="text-[#C8F169] text-[10px] mt-1 font-mono">{camera.id.toUpperCase()}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {!small && (
              <div className="text-center">
                <WifiOff size={24} className="text-[#777A73] mx-auto mb-2" />
                <p className="text-[#777A73] text-xs">Camera Offline</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="camera-feed-overlay">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: getCameraStatusDotColor(camera.status) }}
            />
            {!small && <span className="text-white text-[10px] font-medium truncate max-w-[120px]">{camera.name}</span>}
          </div>
          {!small && isOnline && (
            <span className="text-[10px] font-mono text-red-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* AI overlay (demo) */}
        {!small && isOnline && camera.aiEnabled && (
          <div>
            {/* Simulated bounding box */}
            <div className="absolute bottom-14 left-8 w-20 h-28 border border-[#C8F169] rounded opacity-60">
              <div className="absolute -top-4 left-0 bg-[#C8F169] text-[#20211F] text-[9px] px-1 py-0.5 rounded font-bold">
                PERSON · 0.87
              </div>
            </div>
          </div>
        )}

        {/* Bottom info */}
        {!small && (
          <div className="flex items-center justify-between">
            <span className="text-[#A8ABA3] text-[9px] font-tabular font-mono">
              {new Date().toISOString().slice(11, 19)}
            </span>
            <div className="flex items-center gap-1">
              {camera.aiEnabled && (
                <span className="text-[9px] bg-[#C8F169] text-[#20211F] px-1.5 py-0.5 rounded-sm font-bold">AI</span>
              )}
              <span className="text-[#A8ABA3] text-[9px]">{camera.fps}fps</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Monitoring() {
  const [layout, setLayout] = React.useState(4);
  const [selectedCam, setSelectedCam] = React.useState(cameras[0]);
  const [siteFilter, setSiteFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [fullscreen, setFullscreen] = React.useState(false);

  const filteredCameras = cameras.filter((c) => {
    if (siteFilter !== 'all' && c.siteId !== siteFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const displayCameras = filteredCameras.slice(0, layout);
  const cols = layout === 1 ? 'grid-cols-1' : layout === 4 ? 'grid-cols-2' : layout === 9 ? 'grid-cols-3' : 'grid-cols-4';

  const recentActivity = incidents.slice(0, 6);

  return (
    <div className="flex gap-4 h-[calc(100vh-100px)]">
      {/* Main area */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <PageHeader
          title="Live CCTV Monitoring"
          subtitle="Multi-camera surveillance view"
          actions={
            <div className="flex items-center gap-2">
              <DemoBadge />
              {/* Layout selector */}
              <div className="flex items-center gap-1 bg-white border border-[#E7E9E3] rounded-lg p-1">
                {layouts.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLayout(l.id)}
                    title={l.label}
                    className={`p-1.5 rounded-md transition-all ${
                      layout === l.id ? 'bg-[#252622] text-white' : 'text-[#777A73] hover:bg-[#F5F6F2]'
                    }`}
                  >
                    <l.icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          }
        />

        {/* Filters */}
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search cameras..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
          <Select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="warning">Warning</option>
          </Select>
        </div>

        {/* Camera grid */}
        <div className={`flex-1 grid ${cols} gap-2 overflow-hidden`}>
          {displayCameras.map((cam) => (
            <CameraFeedPlaceholder
              key={cam.id}
              camera={cam}
              selected={selectedCam?.id === cam.id}
              onClick={() => setSelectedCam(cam)}
              small={layout >= 9}
            />
          ))}
          {displayCameras.length === 0 && (
            <div className="col-span-full flex items-center justify-center bg-[#111210] rounded-lg aspect-video">
              <p className="text-[#777A73] text-sm">No cameras match the selected filters</p>
            </div>
          )}
        </div>

        {/* Selected camera info */}
        {selectedCam && (
          <div className="flex items-center gap-4 px-4 py-2.5 bg-white border border-[#E7E9E3] rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getCameraStatusDotColor(selectedCam.status) }}
              />
              <span className="font-semibold text-[#20211F]">{selectedCam.name}</span>
            </div>
            <span className="text-[#A8ABA3]">·</span>
            <span className="text-[#777A73]">{selectedCam.siteName}</span>
            <span className="text-[#A8ABA3]">·</span>
            <span className="text-[#777A73]">{selectedCam.resolution} @ {selectedCam.fps}fps</span>
            <span className="text-[#A8ABA3]">·</span>
            <span className="text-[#777A73]">Last: {formatRelative(selectedCam.lastConnected)}</span>
            {selectedCam.aiEnabled && (
              <span className="ml-auto bg-[#C8F169] text-[#20211F] text-[10px] font-bold px-2 py-0.5 rounded-md">
                AI ACTIVE
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
        {/* Camera selection */}
        <Card padding={false} className="flex-shrink-0">
          <div className="px-4 py-3 border-b border-[#E7E9E3]">
            <p className="text-xs font-semibold text-[#20211F]">Camera Selection</p>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredCameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setSelectedCam(cam)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                  selectedCam?.id === cam.id ? 'bg-[#F5F6F2]' : 'hover:bg-[#F5F6F2]'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getCameraStatusDotColor(cam.status) }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#20211F] truncate">{cam.name}</p>
                  <p className="text-[10px] text-[#A8ABA3] truncate">{cam.siteName}</p>
                </div>
                {cam.aiEnabled && (
                  <span className="text-[8px] bg-[#F0F1ED] text-[#777A73] px-1 py-0.5 rounded font-bold flex-shrink-0">AI</span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Activity feed */}
        <Card padding={false} className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-[#E7E9E3] flex items-center justify-between flex-shrink-0">
            <p className="text-xs font-semibold text-[#20211F]">Recent Activity</p>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#F0F1ED]">
            {recentActivity.map((inc) => (
              <div key={inc.id} className="px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#20211F] leading-snug">
                      {INCIDENT_CATEGORY_LABELS[inc.category]}
                    </p>
                    <p className="text-[10px] text-[#777A73] truncate">{inc.cameraName}</p>
                    <p className="text-[9px] text-[#A8ABA3] mt-0.5 font-tabular">{formatRelative(inc.timestamp)}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                    inc.aiConfidence >= 85 ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'
                  }`}>
                    {inc.aiConfidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
