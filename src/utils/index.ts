import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import type {
  IncidentCategory, IncidentStatus, IncidentSeverity,
  CameraStatus, TaskStatus, TaskPriority, UserRole,
  VehicleType, ZoneType, EvidenceType, NotificationType
} from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, fmt = 'dd MMM yyyy, HH:mm') {
  try {
    return format(new Date(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatRelative(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// ─── Label maps ─────────────────────────────────────────────────────────────
export const INCIDENT_CATEGORY_LABELS: Record<IncidentCategory, string> = {
  individual_dumping: 'Individual Dumping',
  vehicle_dumping: 'Vehicle Dumping',
  suspicious_waste: 'Suspicious Waste',
  other_suspicious: 'Other Suspicious',
};

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  pending: 'Pending Review',
  under_investigation: 'Under Investigation',
  confirmed: 'Confirmed',
  false_alarm: 'False Alarm',
  resolved: 'Resolved',
};

export const INCIDENT_SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const CAMERA_STATUS_LABELS: Record<CameraStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  warning: 'Warning',
  idle: 'Idle',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Platform Admin',
  org_admin: 'Org Admin',
  operator: 'Operator',
  investigator: 'Investigator',
  field_officer: 'Field Officer',
  viewer: 'Viewer',
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: 'Car',
  truck: 'Truck',
  van: 'Van',
  motorcycle: 'Motorcycle',
  auto: 'Auto-Rickshaw',
  unknown: 'Unknown',
};

export const ZONE_TYPE_LABELS: Record<ZoneType, string> = {
  authorized_disposal: 'Authorized Disposal',
  restricted: 'Restricted Zone',
  collection_point: 'Collection Point',
  dustbin: 'Dustbin Location',
  detection_region: 'Detection Region',
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  video_clip: 'Video Clip',
  snapshot: 'Snapshot',
  recording: 'Recording',
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  incident_alert: 'Incident Alert',
  critical_alert: 'Critical Alert',
  camera_offline: 'Camera Offline',
  processing_failure: 'Processing Failure',
  task_assigned: 'Task Assigned',
  investigation_update: 'Investigation Update',
  system: 'System',
};

// ─── Color helpers ──────────────────────────────────────────────────────────
export function getIncidentStatusColor(status: IncidentStatus) {
  const map: Record<IncidentStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    under_investigation: 'bg-blue-50 text-blue-700 border-blue-200',
    confirmed: 'bg-red-50 text-red-700 border-red-200',
    false_alarm: 'bg-gray-100 text-gray-600 border-gray-200',
    resolved: 'bg-green-50 text-green-700 border-green-200',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

export function getIncidentSeverityColor(severity: IncidentSeverity) {
  const map: Record<IncidentSeverity, string> = {
    low: 'bg-gray-100 text-gray-600 border-gray-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  };
  return map[severity] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

export function getCameraStatusColor(status: CameraStatus) {
  const map: Record<CameraStatus, string> = {
    online: 'bg-green-50 text-green-700 border-green-200',
    offline: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    idle: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

export function getTaskStatusColor(status: TaskStatus) {
  const map: Record<TaskStatus, string> = {
    pending: 'bg-gray-100 text-gray-600 border-gray-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

export function getTaskPriorityColor(priority: TaskPriority) {
  const map: Record<TaskPriority, string> = {
    low: 'bg-gray-100 text-gray-600 border-gray-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    urgent: 'bg-red-50 text-red-700 border-red-200',
  };
  return map[priority] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

export function getNotificationTypeColor(type: NotificationType) {
  const map: Record<NotificationType, string> = {
    incident_alert: 'text-amber-600 bg-amber-50',
    critical_alert: 'text-red-600 bg-red-50',
    camera_offline: 'text-orange-600 bg-orange-50',
    processing_failure: 'text-red-600 bg-red-50',
    task_assigned: 'text-blue-600 bg-blue-50',
    investigation_update: 'text-green-600 bg-green-50',
    system: 'text-gray-600 bg-gray-100',
  };
  return map[type] ?? 'text-gray-600 bg-gray-100';
}

export function getConfidenceColor(confidence: number) {
  if (confidence >= 85) return 'text-green-700';
  if (confidence >= 65) return 'text-amber-700';
  return 'text-red-700';
}

export function getCameraStatusDotColor(status: CameraStatus) {
  const map: Record<CameraStatus, string> = {
    online: '#4CAF72',
    offline: '#DC2626',
    warning: '#D97706',
    idle: '#A8ABA3',
  };
  return map[status];
}

export function getZoneTypeColor(type: ZoneType) {
  const map: Record<ZoneType, string> = {
    authorized_disposal: '#4CAF72',
    restricted: '#DC2626',
    collection_point: '#2563EB',
    dustbin: '#D97706',
    detection_region: '#7C3AED',
  };
  return map[type] ?? '#A8ABA3';
}

// ─── Misc ────────────────────────────────────────────────────────────────────
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}
