import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, User, Clock, Camera, AlertTriangle, Search, Eye, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput, Select } from '../components/ui/Input';
import { DemoBadge, EmptyState, PageHeader } from '../components/ui/Misc';
import { people } from '../data/mockData';
import { formatDate, formatRelative } from '../utils';
import type { PersonVerificationStatus } from '../types';

const verificationColors: Record<PersonVerificationStatus, string> = {
  unknown: 'bg-gray-100 text-gray-600 border-gray-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  verified: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const verificationLabels: Record<PersonVerificationStatus, string> = {
  unknown: 'Unknown',
  pending: 'Pending Verification',
  verified: 'Verified',
  rejected: 'Rejected',
};

export default function People() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filtered = people.filter((p) => {
    if (search && !p.trackingId.toLowerCase().includes(search.toLowerCase()) &&
        !p.displayName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'known' && !p.isKnown) return false;
    if (filter === 'unknown' && p.isKnown) return false;
    if (filter === 'pending' && p.verificationStatus !== 'pending') return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="People Management"
        subtitle="Anonymous tracking records — AI-detected persons of interest"
        actions={<DemoBadge />}
      />

      {/* Privacy notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
        <Shield size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-800">Privacy Notice</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Tracking IDs are temporary local identifiers assigned by AI. Unknown persons are anonymous and must not be identified without authorized verification. Face recognition is a backend capability requiring explicit authorization.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <SearchInput
          placeholder="Search by ID or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52"
        />
        <div className="flex items-center gap-1 bg-white border border-[#E7E9E3] rounded-lg p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'unknown', label: 'Unknown' },
            { id: 'pending', label: 'Pending' },
            { id: 'known', label: 'Known' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                filter === f.id ? 'bg-[#252622] text-white' : 'text-[#777A73] hover:bg-[#F5F6F2]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-[#777A73]">{filtered.length} records</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={20} />} title="No records found" description="Adjust filters or search query." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((person, idx) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card
                hover
                onClick={() => navigate(`/people/${person.id}`)}
              >
                {/* Avatar placeholder */}
                <div className="w-full aspect-[3/2] bg-[#F0F1ED] rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#111210] opacity-20" />
                  <User size={32} className="text-[#A8ABA3] z-10" />
                  <div className="absolute top-2 right-2">
                    <Badge className={verificationColors[person.verificationStatus]}>
                      {verificationLabels[person.verificationStatus]}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    {person.trackingId}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-[#20211F]">{person.displayName}</p>
                    {person.clothingDescription && (
                      <p className="text-[10px] text-[#A8ABA3]">{person.clothingDescription}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-[#777A73]">
                    <div className="flex items-center gap-1">
                      <Clock size={9} />
                      <span className="truncate">{formatRelative(person.firstSeen)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={9} />
                      <span>{person.appearanceCount}× seen</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Camera size={9} />
                      <span>{person.cameraIds.length} camera{person.cameraIds.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={9} />
                      <span>{person.incidentIds.length} incident{person.incidentIds.length !== 1 ? 's' : ''}</span>
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
