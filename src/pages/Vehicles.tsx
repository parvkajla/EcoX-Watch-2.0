import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Camera, AlertTriangle, Search, Clock, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SearchInput, Select } from '../components/ui/Input';
import { DemoBadge, EmptyState, PageHeader } from '../components/ui/Misc';
import { vehicles } from '../data/mockData';
import { formatRelative, VEHICLE_TYPE_LABELS } from '../utils';
import type { Vehicle } from '../types';

const statusColors: Record<Vehicle['status'], string> = {
  active: 'bg-gray-100 text-gray-600 border-gray-200',
  inactive: 'bg-gray-100 text-gray-500 border-gray-200',
  suspect: 'bg-red-50 text-red-700 border-red-200',
};

export default function Vehicles() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filtered = vehicles.filter((v) => {
    if (search && !v.trackingId.toLowerCase().includes(search.toLowerCase()) &&
        !(v.licensePlate?.toLowerCase() ?? '').includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && v.vehicleType !== typeFilter) return false;
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Vehicle Management"
        subtitle="AI-detected vehicle tracking records"
        actions={<DemoBadge />}
      />

      <div className="flex items-center gap-2 mb-4">
        <SearchInput
          placeholder="Search by ID or plate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52"
        />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-36">
          <option value="all">All Types</option>
          <option value="van">Van</option>
          <option value="truck">Truck</option>
          <option value="car">Car</option>
          <option value="auto">Auto-Rickshaw</option>
          <option value="motorcycle">Motorcycle</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-32">
          <option value="all">All Status</option>
          <option value="suspect">Suspect</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <span className="ml-auto text-xs text-[#777A73]">{filtered.length} records</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Car size={20} />} title="No vehicle records found" description="Adjust filters to see more." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((veh, idx) => (
            <motion.div
              key={veh.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card hover onClick={() => navigate(`/vehicles/${veh.id}`)}>
                {/* Vehicle placeholder */}
                <div className="w-full aspect-video bg-[#111210] rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  <Car size={28} className="text-[#C8F169] opacity-60" />
                  <div className="absolute top-2 right-2">
                    <Badge className={statusColors[veh.status]}>{veh.status}</Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent">
                    {veh.licensePlate ? (
                      <p className="text-white text-xs font-mono font-bold">{veh.licensePlate}</p>
                    ) : (
                      <p className="text-[#A8ABA3] text-[10px]">Plate not captured</p>
                    )}
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    {veh.trackingId}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-[#20211F]">
                      {veh.color ? `${veh.color} ` : ''}{VEHICLE_TYPE_LABELS[veh.vehicleType]}
                    </p>
                    {veh.licensePlateVerified && (
                      <p className="text-[10px] text-green-600">✓ Plate Verified</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-[#777A73]">
                    <div className="flex items-center gap-1">
                      <Clock size={9} />
                      <span className="truncate">{formatRelative(veh.firstDetected)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={9} />
                      <span>{veh.detectionCount}× detected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Camera size={9} />
                      <span>{veh.cameraIds.length} camera{veh.cameraIds.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={9} />
                      <span>{veh.incidentIds.length} incident{veh.incidentIds.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
