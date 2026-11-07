import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Camera, AlertTriangle, MapPin, Layers, Filter,
  X, Eye, Circle as CircleIcon, Shield, Trash2, ChevronRight
} from 'lucide-react';
import { cameras, sites, incidents, zones } from '../data/mockData';
import { useAppStore } from '../store/appStore';
import { formatRelative, getZoneTypeColor, ZONE_TYPE_LABELS } from '../utils';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

// Fix Leaflet default icon issue in Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createColoredIcon(color: string, type: 'camera' | 'incident' | 'site' | 'zone') {
  const size = type === 'site' ? 14 : type === 'camera' ? 10 : 12;
  const svgContent = type === 'camera'
    ? `<rect x="2" y="4" width="12" height="8" rx="1.5" fill="${color}"/><polygon points="14,6 18,4 18,12 14,10" fill="${color}"/>`
    : type === 'incident'
    ? `<path d="M8 2 L14 14 H2 Z" fill="${color}" stroke="white" stroke-width="1"/><text x="8" y="12" text-anchor="middle" font-size="7" fill="white" font-weight="bold">!</text>`
    : `<circle cx="8" cy="8" r="6" fill="${color}" stroke="white" stroke-width="1.5"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${type === 'camera' ? '20' : '16'} 16" width="${type === 'camera' ? 24 : 20}" height="20">${svgContent}</svg>`;
  return L.divIcon({
    html: `<div style="filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3))">${svg}</div>`,
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
    className: '',
  });
}

type LayerKey = 'cameras' | 'incidents' | 'zones' | 'sites';

interface SelectedMarker {
  type: 'camera' | 'incident' | 'site' | 'zone';
  id: string;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const { currentOrgId } = useAppStore();
  const [layers, setLayers] = React.useState<Record<LayerKey, boolean>>({
    cameras: true,
    incidents: true,
    zones: true,
    sites: true,
  });
  const [selected, setSelected] = React.useState<SelectedMarker | null>(null);
  const [severityFilter, setSeverityFilter] = React.useState<string>('all');

  const orgCameras = cameras.filter((c) => c.orgId === currentOrgId);
  const orgSites = sites.filter((s) => s.orgId === currentOrgId);
  const orgIncidents = incidents.filter((i) =>
    i.orgId === currentOrgId &&
    (severityFilter === 'all' || i.severity === severityFilter)
  );
  const orgZones = zones.filter((z) => orgSites.some((s) => s.id === z.siteId));

  const mapCenter: [number, number] = orgSites.length > 0
    ? [orgSites[0].lat, orgSites[0].lng]
    : [19.076, 72.877];

  const toggleLayer = (key: LayerKey) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  // Get selected item data
  const selectedCamera = selected?.type === 'camera' ? cameras.find((c) => c.id === selected.id) : null;
  const selectedIncident = selected?.type === 'incident' ? incidents.find((i) => i.id === selected.id) : null;
  const selectedSite = selected?.type === 'site' ? sites.find((s) => s.id === selected.id) : null;
  const selectedZone = selected?.type === 'zone' ? zones.find((z) => z.id === selected.id) : null;

  return (
    <div className="relative -m-6 h-[calc(100vh-58px)]">
      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />
        <MapController center={mapCenter} />

        {/* Site markers */}
        {layers.sites && orgSites.map((site) => (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            icon={createColoredIcon('#252622', 'site')}
            eventHandlers={{ click: () => setSelected({ type: 'site', id: site.id }) }}
          >
            <Popup>{site.name}</Popup>
          </Marker>
        ))}

        {/* Camera markers */}
        {layers.cameras && orgCameras.map((cam) => {
          const color = cam.status === 'online' ? '#4CAF72' : cam.status === 'offline' ? '#DC2626' : '#D97706';
          return (
            <Marker
              key={cam.id}
              position={[cam.lat, cam.lng]}
              icon={createColoredIcon(color, 'camera')}
              eventHandlers={{ click: () => setSelected({ type: 'camera', id: cam.id }) }}
            >
              <Popup>{cam.name}</Popup>
            </Marker>
          );
        })}

        {/* Incident markers */}
        {layers.incidents && orgIncidents.map((inc) => {
          const camData = cameras.find((c) => c.id === inc.cameraId);
          if (!camData) return null;
          const color = inc.severity === 'critical' ? '#DC2626' : inc.severity === 'high' ? '#EA580C' : inc.severity === 'medium' ? '#D97706' : '#6B7280';
          return (
            <Marker
              key={inc.id}
              position={[camData.lat + 0.0003, camData.lng + 0.0003]}
              icon={createColoredIcon(color, 'incident')}
              eventHandlers={{ click: () => setSelected({ type: 'incident', id: inc.id }) }}
            >
              <Popup>{inc.id}</Popup>
            </Marker>
          );
        })}

        {/* Zone circles */}
        {layers.zones && orgZones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.radius ?? 30}
            pathOptions={{
              color: getZoneTypeColor(zone.type),
              fillColor: getZoneTypeColor(zone.type),
              fillOpacity: 0.15,
              weight: 1.5,
            }}
            eventHandlers={{ click: () => setSelected({ type: 'zone', id: zone.id }) }}
          />
        ))}
      </MapContainer>

      {/* Layer controls */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="bg-white border border-[#E7E9E3] rounded-xl shadow-lg p-3 space-y-2 min-w-[160px]">
          <div className="flex items-center gap-1.5 mb-2">
            <Layers size={13} className="text-[#777A73]" />
            <span className="text-xs font-semibold text-[#20211F]">Map Layers</span>
          </div>
          {(Object.entries(layers) as [LayerKey, boolean][]).map(([key, enabled]) => (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className="flex items-center gap-2 w-full text-left"
            >
              <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-colors ${enabled ? 'bg-[#252622] border-[#252622]' : 'border-[#D4D7CF]'}`}>
                {enabled && <div className="w-1.5 h-1.5 bg-[#C8F169] rounded-sm" />}
              </div>
              <span className="text-xs capitalize text-[#20211F]">{key}</span>
            </button>
          ))}

          <div className="border-t border-[#E7E9E3] pt-2 mt-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Filter size={11} className="text-[#777A73]" />
              <span className="text-[10px] font-semibold text-[#777A73] uppercase tracking-wider">Severity</span>
            </div>
            {['all', 'critical', 'high', 'medium', 'low'].map((sv) => (
              <button
                key={sv}
                onClick={() => setSeverityFilter(sv)}
                className={`w-full text-left px-2 py-1 rounded-md text-xs capitalize transition-colors ${severityFilter === sv ? 'bg-[#F5F6F2] font-medium text-[#20211F]' : 'text-[#777A73] hover:text-[#20211F]'}`}
              >
                {sv === 'all' ? 'All Severities' : sv}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-4 z-[1000]">
        <div className="bg-white border border-[#E7E9E3] rounded-xl shadow-lg p-3 space-y-1.5">
          <p className="text-[10px] font-semibold text-[#A8ABA3] uppercase tracking-wider mb-2">Legend</p>
          {[
            { color: '#4CAF72', label: 'Camera Online' },
            { color: '#D97706', label: 'Camera Warning' },
            { color: '#DC2626', label: 'Camera Offline' },
            { color: '#DC2626', label: 'Critical Incident' },
            { color: '#D97706', label: 'Medium/Low Incident' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-[#777A73]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute top-4 right-4 z-[1000]">
        <div className="bg-white border border-[#E7E9E3] rounded-xl shadow-lg p-3 flex gap-4">
          <div className="text-center">
            <p className="text-lg font-bold font-tabular text-[#20211F]">{orgCameras.length}</p>
            <p className="text-[10px] text-[#777A73]">Cameras</p>
          </div>
          <div className="w-px bg-[#E7E9E3]" />
          <div className="text-center">
            <p className="text-lg font-bold font-tabular text-[#20211F]">{orgIncidents.length}</p>
            <p className="text-[10px] text-[#777A73]">Incidents</p>
          </div>
          <div className="w-px bg-[#E7E9E3]" />
          <div className="text-center">
            <p className="text-lg font-bold font-tabular text-[#20211F]">{orgSites.length}</p>
            <p className="text-[10px] text-[#777A73]">Sites</p>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 right-4 z-[1000] w-80"
          >
            <div className="bg-white border border-[#E7E9E3] rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7E9E3]">
                <div className="flex items-center gap-2">
                  {selected.type === 'camera' && <Camera size={14} className="text-[#777A73]" />}
                  {selected.type === 'incident' && <AlertTriangle size={14} className="text-[#777A73]" />}
                  {selected.type === 'site' && <MapPin size={14} className="text-[#777A73]" />}
                  {selected.type === 'zone' && <CircleIcon size={14} className="text-[#777A73]" />}
                  <span className="text-xs font-semibold text-[#20211F] capitalize">{selected.type}</span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1 rounded hover:bg-[#F5F6F2] text-[#A8ABA3] hover:text-[#20211F] transition-colors"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {/* Camera panel */}
                {selectedCamera && (
                  <>
                    <div>
                      <p className="font-semibold text-[#20211F]">{selectedCamera.name}</p>
                      <p className="text-xs text-[#777A73]">{selectedCamera.location}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#F5F6F2] rounded-lg p-2">
                        <p className="text-[10px] text-[#777A73]">Status</p>
                        <p className="text-sm font-semibold text-[#20211F] capitalize">{selectedCamera.status}</p>
                      </div>
                      <div className="bg-[#F5F6F2] rounded-lg p-2">
                        <p className="text-[10px] text-[#777A73]">AI Status</p>
                        <p className="text-sm font-semibold text-[#20211F] capitalize">{selectedCamera.aiStatus}</p>
                      </div>
                      <div className="bg-[#F5F6F2] rounded-lg p-2">
                        <p className="text-[10px] text-[#777A73]">Resolution</p>
                        <p className="text-sm font-semibold text-[#20211F]">{selectedCamera.resolution}</p>
                      </div>
                      <div className="bg-[#F5F6F2] rounded-lg p-2">
                        <p className="text-[10px] text-[#777A73]">Incidents</p>
                        <p className="text-sm font-semibold text-[#20211F]">{selectedCamera.incidentCount}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#777A73]">Last connected: {formatRelative(selectedCamera.lastConnected)}</p>
                    <Link
                      to="/cameras"
                      className="flex items-center justify-between w-full px-3 py-2 bg-[#252622] text-white rounded-lg text-xs font-medium hover:bg-[#353733] transition-colors"
                    >
                      <span>View Camera Details</span>
                      <ChevronRight size={12} />
                    </Link>
                  </>
                )}

                {/* Incident panel */}
                {selectedIncident && (
                  <>
                    <div>
                      <p className="font-semibold text-[#20211F]">{selectedIncident.id.toUpperCase()}</p>
                      <p className="text-xs text-[#777A73] line-clamp-2">{selectedIncident.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={selectedIncident.severity === 'critical' ? 'error' : selectedIncident.severity === 'high' ? 'warning' : 'neutral'}>
                        {selectedIncident.severity}
                      </Badge>
                      <Badge variant={selectedIncident.status === 'confirmed' ? 'error' : selectedIncident.status === 'resolved' ? 'success' : 'neutral'}>
                        {selectedIncident.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-xs text-[#777A73] space-y-1">
                      <p>Camera: {selectedIncident.cameraName}</p>
                      <p>Site: {selectedIncident.siteName}</p>
                      <p>Time: {formatRelative(selectedIncident.timestamp)}</p>
                      <p>AI Confidence: {selectedIncident.aiConfidence}%</p>
                    </div>
                    <Link
                      to={`/incidents/${selectedIncident.id}`}
                      className="flex items-center justify-between w-full px-3 py-2 bg-[#252622] text-white rounded-lg text-xs font-medium hover:bg-[#353733] transition-colors"
                    >
                      <span>Investigate Incident</span>
                      <ChevronRight size={12} />
                    </Link>
                  </>
                )}

                {/* Site panel */}
                {selectedSite && (
                  <>
                    <div>
                      <p className="font-semibold text-[#20211F]">{selectedSite.name}</p>
                      <p className="text-xs text-[#777A73]">{selectedSite.address}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-[#F5F6F2] rounded-lg p-2 text-center">
                        <p className="text-sm font-bold text-[#20211F] font-tabular">{selectedSite.cameraCount}</p>
                        <p className="text-[10px] text-[#777A73]">Cameras</p>
                      </div>
                      <div className="bg-[#F5F6F2] rounded-lg p-2 text-center">
                        <p className="text-sm font-bold text-[#20211F] font-tabular">{selectedSite.incidentCount}</p>
                        <p className="text-[10px] text-[#777A73]">Incidents</p>
                      </div>
                      <div className="bg-[#F5F6F2] rounded-lg p-2 text-center">
                        <p className="text-sm font-bold text-[#20211F] font-tabular">{selectedSite.zoneCount}</p>
                        <p className="text-[10px] text-[#777A73]">Zones</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Zone panel */}
                {selectedZone && (
                  <>
                    <div>
                      <p className="font-semibold text-[#20211F]">{selectedZone.name}</p>
                      <p className="text-xs text-[#777A73]">{selectedZone.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getZoneTypeColor(selectedZone.type) }} />
                      <span className="text-xs font-medium text-[#20211F]">{ZONE_TYPE_LABELS[selectedZone.type]}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#F5F6F2] rounded-lg p-2">
                        <p className="text-[10px] text-[#777A73]">Site</p>
                        <p className="text-xs font-semibold text-[#20211F]">{selectedZone.siteName}</p>
                      </div>
                      <div className="bg-[#F5F6F2] rounded-lg p-2">
                        <p className="text-[10px] text-[#777A73]">Status</p>
                        <p className="text-xs font-semibold text-[#20211F]">{selectedZone.isActive ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEMO badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <span className="demo-badge">
          <Eye size={9} /> Demo Data — Live map tiles from CARTO/OSM
        </span>
      </div>
    </div>
  );
}
