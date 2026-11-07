import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, User, Car,
  Camera, Clock, MapPin, Eye, Bot, MessageSquare, FileVideo,
  UserCheck, Plus, Download, Send
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Textarea, Select } from '../components/ui/Input';
import { DemoBadge, PageHeader } from '../components/ui/Misc';
import { useAppStore } from '../store/appStore';
import { users } from '../data/mockData';
import {
  formatDate, formatRelative,
  getIncidentStatusColor, getIncidentSeverityColor,
  INCIDENT_CATEGORY_LABELS, INCIDENT_STATUS_LABELS, INCIDENT_SEVERITY_LABELS,
  getConfidenceColor, INCIDENT_CATEGORY_LABELS as catLabels
} from '../utils';
import type { IncidentStatus } from '../types';

const STATUS_TRANSITIONS: Record<string, { label: string; to: IncidentStatus; variant: 'primary' | 'accent' | 'danger' | 'secondary' }[]> = {
  pending: [
    { label: 'Start Investigation', to: 'under_investigation', variant: 'primary' },
    { label: 'Mark False Alarm', to: 'false_alarm', variant: 'secondary' },
  ],
  under_investigation: [
    { label: 'Confirm Incident', to: 'confirmed', variant: 'danger' },
    { label: 'Mark False Alarm', to: 'false_alarm', variant: 'secondary' },
  ],
  confirmed: [
    { label: 'Mark Resolved', to: 'resolved', variant: 'accent' },
  ],
  false_alarm: [],
  resolved: [],
};

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, updateIncidentStatus, addIncidentNote, assignIncident, currentUser, addToast } = useAppStore();
  const incident = incidents.find((i) => i.id === id);

  const [noteModal, setNoteModal] = React.useState(false);
  const [assignModal, setAssignModal] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [assignTo, setAssignTo] = React.useState('');
  const [statusConfirm, setStatusConfirm] = React.useState<IncidentStatus | null>(null);

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertTriangle size={32} className="text-[#A8ABA3] mb-3" />
        <p className="text-sm font-semibold text-[#20211F]">Incident not found</p>
        <Button variant="ghost" size="sm" className="mt-3" leftIcon={<ArrowLeft size={13} />} onClick={() => navigate('/incidents')}>
          Back to Incidents
        </Button>
      </div>
    );
  }

  const handleStatusChange = (to: IncidentStatus) => {
    updateIncidentStatus(incident.id, to);
    addToast({ type: 'success', title: 'Status Updated', message: `Incident ${incident.id} is now ${INCIDENT_STATUS_LABELS[to]}.` });
    setStatusConfirm(null);
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    addIncidentNote(incident.id, note.trim(), currentUser.name);
    addToast({ type: 'success', title: 'Note Added', message: 'Your observation has been recorded.' });
    setNote('');
    setNoteModal(false);
  };

  const handleAssign = () => {
    const u = users.find((u) => u.id === assignTo);
    if (!u) return;
    assignIncident(incident.id, u.id, u.name);
    addToast({ type: 'success', title: 'Incident Assigned', message: `Assigned to ${u.name}.` });
    setAssignModal(false);
  };

  const transitions = STATUS_TRANSITIONS[incident.status] ?? [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={13} />} onClick={() => navigate('/incidents')}>
          Incidents
        </Button>
        <span className="text-[#A8ABA3]">/</span>
        <span className="text-sm font-semibold text-[#20211F] font-mono">{incident.id}</span>
        <DemoBadge />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video placeholder */}
          <Card padding={false}>
            <div className="aspect-video bg-[#111210] rounded-t-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #C8F169 0, #C8F169 1px, transparent 0, transparent 40px)',
                  backgroundSize: '100% 40px',
                }}
              />
              <div className="text-center z-10">
                <Eye size={40} className="text-[#C8F169] mx-auto mb-3 opacity-70" />
                <p className="text-[#777A73] text-sm font-medium">Evidence Recording</p>
                <p className="text-[#A8ABA3] text-xs mt-1">DEMO · {incident.cameraName}</p>
                <Button variant="accent" size="sm" className="mt-4" leftIcon={<FileVideo size={13} />}>
                  Play Recording
                </Button>
              </div>
              {/* Simulated bounding box */}
              <div className="absolute top-16 left-24 w-24 h-36 border-2 border-[#C8F169] rounded opacity-50">
                <div className="absolute -top-5 left-0 bg-[#C8F169] text-[#20211F] text-[9px] px-1.5 py-0.5 rounded-sm font-bold">
                  PERSON · 0.87
                </div>
              </div>
              <span className="absolute top-3 right-3 text-[9px] text-[#A8ABA3] font-mono bg-black/50 px-2 py-1 rounded">
                {formatDate(incident.timestamp, 'dd MMM yyyy HH:mm:ss')} · AI OVERLAY
              </span>
            </div>
            <div className="px-5 py-3 flex items-center justify-between border-t border-[#E7E9E3]">
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" leftIcon={<Download size={13} />}>Export Evidence</Button>
                <Button variant="ghost" size="sm">View Snapshots</Button>
              </div>
              <span className="text-xs text-[#A8ABA3]">{incident.evidenceIds?.length ?? 0} evidence files</span>
            </div>
          </Card>

          {/* AI Observations + Timeline */}
          <Card>
            <CardHeader>
              <CardTitle subtitle="AI and investigator timeline">Detection Timeline</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {incident.notes?.map((note) => (
                <div key={note.id} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    note.type === 'ai_observation' ? 'bg-[#F0F1ED]' : 'bg-[#252622]'
                  }`}>
                    {note.type === 'ai_observation'
                      ? <Bot size={13} className="text-[#777A73]" />
                      : <User size={12} className="text-[#C8F169]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#20211F]">{note.authorName}</span>
                      {note.type === 'ai_observation' && (
                        <Badge className="bg-[#F0F1ED] text-[#777A73] border-[#E7E9E3]">AI Observation</Badge>
                      )}
                      <span className="text-[10px] text-[#A8ABA3] ml-auto">{formatRelative(note.createdAt)}</span>
                    </div>
                    <p className="text-xs text-[#777A73] leading-relaxed">{note.content}</p>
                  </div>
                </div>
              ))}
              {(!incident.notes || incident.notes.length === 0) && (
                <p className="text-xs text-[#A8ABA3] text-center py-4">No observations yet.</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-[#E7E9E3]">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus size={13} />}
                onClick={() => setNoteModal(true)}
              >
                Add Note
              </Button>
            </div>
          </Card>

          {/* Tracking */}
          {(incident.personIds?.length! > 0 || incident.vehicleIds?.length! > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {incident.personIds?.length! > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>People ({incident.personIds!.length})</CardTitle>
                  </CardHeader>
                  {incident.personIds?.map((pid) => (
                    <div key={pid} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-[#F5F6F2] rounded-lg px-2 -mx-2" onClick={() => navigate(`/people/${pid}`)}>
                      <div className="w-7 h-7 rounded-full bg-[#F0F1ED] flex items-center justify-center">
                        <User size={13} className="text-[#777A73]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#20211F]">{pid}</p>
                        <p className="text-[10px] text-[#A8ABA3]">Anonymous · Tracking only</p>
                      </div>
                    </div>
                  ))}
                </Card>
              )}
              {incident.vehicleIds?.length! > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicles ({incident.vehicleIds!.length})</CardTitle>
                  </CardHeader>
                  {incident.vehicleIds?.map((vid) => (
                    <div key={vid} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-[#F5F6F2] rounded-lg px-2 -mx-2" onClick={() => navigate(`/vehicles/${vid}`)}>
                      <div className="w-7 h-7 rounded-full bg-[#F0F1ED] flex items-center justify-center">
                        <Car size={13} className="text-[#777A73]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#20211F]">{vid}</p>
                        <p className="text-[10px] text-[#A8ABA3]">Vehicle · Unverified plate</p>
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Status & Actions */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getIncidentStatusColor(incident.status)} size="md">
                {INCIDENT_STATUS_LABELS[incident.status]}
              </Badge>
              <Badge className={getIncidentSeverityColor(incident.severity)}>
                {INCIDENT_SEVERITY_LABELS[incident.severity]}
              </Badge>
            </div>

            {transitions.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-[#777A73]">Actions</p>
                {transitions.map((t) => (
                  <Button
                    key={t.to}
                    variant={t.variant}
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => handleStatusChange(t.to)}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full" leftIcon={<UserCheck size={13} />} onClick={() => setAssignModal(true)}>
                {incident.assignedToName ? 'Reassign' : 'Assign Investigator'}
              </Button>
              <Button variant="secondary" size="sm" className="w-full" leftIcon={<MessageSquare size={13} />} onClick={() => setNoteModal(true)}>
                Add Note
              </Button>
              <Button variant="secondary" size="sm" className="w-full" leftIcon={<Download size={13} />}>
                Export Report
              </Button>
            </div>
          </Card>

          {/* Incident Metadata */}
          <Card>
            <CardTitle className="mb-4">Incident Details</CardTitle>
            <div className="space-y-3">
              {[
                { label: 'Incident ID', value: incident.id, mono: true },
                { label: 'Category', value: INCIDENT_CATEGORY_LABELS[incident.category] },
                { label: 'Camera', value: incident.cameraName },
                { label: 'Site', value: incident.siteName },
                { label: 'Detected', value: formatDate(incident.timestamp) },
                { label: 'AI Confidence', value: `${incident.aiConfidence}%`, highlight: getConfidenceColor(incident.aiConfidence) },
                { label: 'Assigned To', value: incident.assignedToName ?? 'Unassigned' },
                { label: 'Resolved', value: incident.resolvedAt ? formatDate(incident.resolvedAt) : '—' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <span className="text-xs text-[#A8ABA3] flex-shrink-0">{row.label}</span>
                  <span className={`text-xs font-medium text-right ${row.mono ? 'font-mono text-[#777A73]' : row.highlight ?? 'text-[#20211F]'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Description */}
          <Card>
            <CardTitle className="mb-2">AI Description</CardTitle>
            <p className="text-xs text-[#777A73] leading-relaxed">{incident.description}</p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#A8ABA3]">
              <Bot size={11} />
              Generated by EcoX AI — Not legally verified
            </div>
          </Card>
        </div>
      </div>

      {/* Note Modal */}
      <Modal isOpen={noteModal} onClose={() => setNoteModal(false)} title="Add Investigator Note" size="md">
        <ModalBody>
          <p className="text-xs text-[#777A73] mb-3">Your note will be timestamped and attributed to your account.</p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe your findings or observations..."
            rows={5}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setNoteModal(false)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleAddNote} disabled={!note.trim()} leftIcon={<Send size={13} />}>
            Save Note
          </Button>
        </ModalFooter>
      </Modal>

      {/* Assign Modal */}
      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title="Assign Investigator" size="sm">
        <ModalBody>
          <Select label="Select Investigator" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="">Choose...</option>
            {users.filter((u) => ['investigator', 'operator', 'org_admin'].includes(u.role)).map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" size="sm" onClick={() => setAssignModal(false)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleAssign} disabled={!assignTo}>
            Assign
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
