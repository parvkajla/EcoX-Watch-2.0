import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, User, Eye, AlertTriangle, Camera,
  Clock, Shield, MapPin, Info
} from 'lucide-react';
import { people, incidents, cameras } from '../data/mockData';
import { formatDate, formatRelative } from '../utils';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const person = people.find((p) => p.id === id);

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <User size={48} className="text-[#A8ABA3]" />
        <p className="text-[#777A73]">Person not found</p>
        <button onClick={() => navigate('/people')} className="text-sm text-[#20211F] underline">
          Back to People
        </button>
      </div>
    );
  }

  const personIncidents = incidents.filter((i) => person.incidentIds.includes(i.id));
  const personCameras = cameras.filter((c) => person.cameraIds.includes(c.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/people')}
          className="p-2 rounded-lg hover:bg-[#F0F1ED] transition-colors text-[#777A73] hover:text-[#20211F]"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-display font-bold text-xl text-[#20211F]">{person.displayName}</h1>
          <p className="text-sm text-[#777A73]">Tracking ID: {person.trackingId}</p>
        </div>
        <div className="ml-auto">
          <Badge variant={person.verificationStatus === 'verified' ? 'success' : person.verificationStatus === 'pending' ? 'warning' : 'neutral'}>
            {person.verificationStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6 text-center">
            <div className="w-24 h-24 rounded-2xl bg-[#F0F1ED] flex items-center justify-center mx-auto mb-4">
              <User size={40} className="text-[#A8ABA3]" />
            </div>
            <p className="font-semibold text-[#20211F] mb-1">{person.displayName}</p>
            <p className="text-xs text-[#777A73] mb-4">{person.trackingId}</p>

            {!person.isKnown && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-left mb-4">
                <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  This is a temporary tracking ID. Identity is unconfirmed. 
                  Manual verification required before linking to any personal record.
                </p>
              </div>
            )}

            <div className="space-y-3 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-[#777A73]">Appearances</span>
                <span className="font-semibold text-[#20211F] font-tabular">{person.appearanceCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#777A73]">Associated Incidents</span>
                <span className="font-semibold text-[#20211F] font-tabular">{person.incidentIds.length}</span>
              </div>
              {person.estimatedAge && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#777A73]">Est. Age</span>
                  <span className="font-semibold text-[#20211F]">{person.estimatedAge}</span>
                </div>
              )}
              {person.clothingDescription && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#777A73]">Description</span>
                  <span className="font-semibold text-[#20211F] text-right max-w-[60%]">{person.clothingDescription}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mb-3">Timeline</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={13} className="text-[#A8ABA3]" />
                <div>
                  <p className="text-[#777A73] text-xs">First seen</p>
                  <p className="text-[#20211F] font-medium">{formatDate(person.firstSeen, 'dd MMM yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye size={13} className="text-[#A8ABA3]" />
                <div>
                  <p className="text-[#777A73] text-xs">Last seen</p>
                  <p className="text-[#20211F] font-medium">{formatRelative(person.lastSeen)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cameras */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Camera size={15} className="text-[#777A73]" />
              <p className="font-semibold text-[#20211F] text-sm">Camera Sightings</p>
            </div>
            {personCameras.length === 0 ? (
              <p className="text-sm text-[#A8ABA3]">No camera records.</p>
            ) : (
              <div className="space-y-2">
                {personCameras.map((cam) => (
                  <div key={cam.id} className="flex items-center gap-3 p-3 bg-[#F5F6F2] rounded-lg">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cam.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#20211F]">{cam.name}</p>
                      <p className="text-xs text-[#777A73]">{cam.siteName}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#777A73]">
                      <MapPin size={11} />
                      <span>{cam.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Incidents */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={15} className="text-[#777A73]" />
              <p className="font-semibold text-[#20211F] text-sm">Associated Incidents</p>
            </div>
            {personIncidents.length === 0 ? (
              <p className="text-sm text-[#A8ABA3]">No incident records.</p>
            ) : (
              <div className="space-y-2">
                {personIncidents.map((inc) => (
                  <Link
                    key={inc.id}
                    to={`/incidents/${inc.id}`}
                    className="flex items-center gap-3 p-3 bg-[#F5F6F2] rounded-lg hover:bg-[#F0F1ED] transition-colors"
                  >
                    <AlertTriangle size={14} className={
                      inc.severity === 'critical' ? 'text-red-500' :
                      inc.severity === 'high' ? 'text-orange-500' :
                      inc.severity === 'medium' ? 'text-amber-500' : 'text-gray-400'
                    } />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#20211F]">{inc.id.toUpperCase()}</p>
                      <p className="text-xs text-[#777A73] truncate">{inc.description.slice(0, 60)}…</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-[#777A73]">{formatRelative(inc.timestamp)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Verification status */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={15} className="text-[#777A73]" />
              <p className="font-semibold text-[#20211F] text-sm">Identity Verification</p>
            </div>
            <div className="flex items-start gap-3 bg-[#F5F6F2] rounded-lg p-4">
              <Shield size={20} className="text-[#A8ABA3] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#20211F] mb-1">Backend Integration Required</p>
                <p className="text-xs text-[#777A73] leading-relaxed">
                  Face verification and identity matching are backend capabilities requiring 
                  authorized integration, appropriate legal authorization, and manual review. 
                  This UI displays the current verification state as returned by the backend system.
                  Current status: <span className="font-semibold capitalize">{person.verificationStatus}</span>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
