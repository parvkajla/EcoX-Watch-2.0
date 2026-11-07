// ─── Organization Types ─────────────────────────────────────────────────────
export type OrgType = 'municipal' | 'private';

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  city: string;
  logoInitials: string;
  accentColor?: string;
  siteCount: number;
  cameraCount: number;
  userCount: number;
  createdAt: string;
}

export interface Site {
  id: string;
  orgId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  cameraCount: number;
  zoneCount: number;
  incidentCount: number;
  status: 'active' | 'inactive';
}

// ─── Camera Types ────────────────────────────────────────────────────────────
export type CameraStatus = 'online' | 'offline' | 'warning' | 'idle';
export type StreamType = 'rtsp' | 'http' | 'webrtc';

export interface Camera {
  id: string;
  name: string;
  siteId: string;
  siteName: string;
  orgId: string;
  location: string;
  lat: number;
  lng: number;
  status: CameraStatus;
  streamType: StreamType;
  resolution: string;
  fps: number;
  lastConnected: string;
  aiEnabled: boolean;
  aiStatus: 'processing' | 'idle' | 'error' | 'disabled';
  ipAddress: string;
  model: string;
  manufacturer: string;
  installDate: string;
  incidentCount: number;
}

// ─── Incident Types ──────────────────────────────────────────────────────────
export type IncidentCategory =
  | 'individual_dumping'
  | 'vehicle_dumping'
  | 'suspicious_waste'
  | 'other_suspicious';

export type IncidentStatus =
  | 'pending'
  | 'under_investigation'
  | 'confirmed'
  | 'false_alarm'
  | 'resolved';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  cameraId: string;
  cameraName: string;
  siteId: string;
  siteName: string;
  orgId: string;
  timestamp: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  aiConfidence: number;
  thumbnailUrl?: string;
  description: string;
  assignedTo?: string;
  assignedToName?: string;
  resolvedAt?: string;
  personIds?: string[];
  vehicleIds?: string[];
  notes?: IncidentNote[];
  evidenceIds?: string[];
}

export interface IncidentNote {
  id: string;
  incidentId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  type: 'ai_observation' | 'investigator_note' | 'status_change';
}

// ─── Person Types ────────────────────────────────────────────────────────────
export type PersonVerificationStatus = 'unknown' | 'pending' | 'verified' | 'rejected';

export interface Person {
  id: string;
  trackingId: string;
  displayName: string;
  isKnown: boolean;
  verificationStatus: PersonVerificationStatus;
  firstSeen: string;
  lastSeen: string;
  siteIds: string[];
  cameraIds: string[];
  incidentIds: string[];
  appearanceCount: number;
  thumbnailUrl?: string;
  gender?: string;
  estimatedAge?: string;
  clothingDescription?: string;
}

// ─── Vehicle Types ───────────────────────────────────────────────────────────
export type VehicleType = 'car' | 'truck' | 'van' | 'motorcycle' | 'auto' | 'unknown';

export interface Vehicle {
  id: string;
  trackingId: string;
  vehicleType: VehicleType;
  color?: string;
  licensePlate?: string;
  licensePlateVerified: boolean;
  firstDetected: string;
  lastDetected: string;
  siteIds: string[];
  cameraIds: string[];
  incidentIds: string[];
  detectionCount: number;
  thumbnailUrl?: string;
  status: 'active' | 'inactive' | 'suspect';
}

// ─── Evidence Types ──────────────────────────────────────────────────────────
export type EvidenceType = 'video_clip' | 'snapshot' | 'recording';

export interface Evidence {
  id: string;
  incidentId: string;
  cameraId: string;
  cameraName: string;
  siteId: string;
  siteName: string;
  type: EvidenceType;
  fileName: string;
  fileSize: number;
  duration?: number;
  timestamp: string;
  integrityStatus: 'verified' | 'pending' | 'compromised';
  downloadUrl?: string;
  thumbnailUrl?: string;
  accessLog: EvidenceAccess[];
}

export interface EvidenceAccess {
  userId: string;
  userName: string;
  action: 'viewed' | 'downloaded' | 'exported';
  timestamp: string;
}

// ─── Zone Types ──────────────────────────────────────────────────────────────
export type ZoneType =
  | 'authorized_disposal'
  | 'restricted'
  | 'collection_point'
  | 'dustbin'
  | 'detection_region';

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  siteId: string;
  siteName: string;
  cameraId?: string;
  description: string;
  isActive: boolean;
  lat: number;
  lng: number;
  radius?: number;
  createdAt: string;
}

// ─── Task Types ──────────────────────────────────────────────────────────────
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  incidentId?: string;
  incidentTitle?: string;
  assignedTo: string;
  assignedToName: string;
  assignedBy: string;
  assignedByName: string;
  siteId: string;
  siteName: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  location?: string;
  notes?: string;
}

// ─── User Types ──────────────────────────────────────────────────────────────
export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'operator'
  | 'investigator'
  | 'field_officer'
  | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  orgName: string;
  siteIds: string[];
  status: UserStatus;
  lastActive: string;
  createdAt: string;
  avatar?: string;
  phone?: string;
  department?: string;
}

// ─── Notification Types ──────────────────────────────────────────────────────
export type NotificationType =
  | 'incident_alert'
  | 'critical_alert'
  | 'camera_offline'
  | 'processing_failure'
  | 'task_assigned'
  | 'investigation_update'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, string>;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export interface DashboardStats {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  warningCameras: number;
  incidentsToday: number;
  pendingReview: number;
  confirmedIncidents: number;
  falseAlerts: number;
  activeSites: number;
  activeAiCameras: number;
}

// ─── Analytics Types ─────────────────────────────────────────────────────────
export interface TrendDataPoint {
  date: string;
  confirmed: number;
  falseAlarm: number;
  pending: number;
  total: number;
}

export interface CategoryDataPoint {
  category: string;
  count: number;
  percentage: number;
}
