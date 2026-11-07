import type {
  Organization, Site, Camera, Incident, Person, Vehicle,
  Evidence, Zone, Task, User, AppNotification, TrendDataPoint,
  CategoryDataPoint, DashboardStats
} from '../types';

// ─── Organizations ───────────────────────────────────────────────────────────
export const organizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Greater Mumbai Municipal Corp.',
    type: 'municipal',
    city: 'Mumbai',
    logoInitials: 'GMC',
    siteCount: 8,
    cameraCount: 64,
    userCount: 24,
    createdAt: '2024-01-15',
  },
  {
    id: 'org-2',
    name: 'Delhi Municipal Corp.',
    type: 'municipal',
    city: 'Delhi',
    logoInitials: 'DMC',
    siteCount: 6,
    cameraCount: 48,
    userCount: 18,
    createdAt: '2024-03-10',
  },
  {
    id: 'org-3',
    name: 'IIT Delhi Campus',
    type: 'private',
    city: 'Delhi',
    logoInitials: 'IIT',
    siteCount: 3,
    cameraCount: 28,
    userCount: 12,
    createdAt: '2024-06-01',
  },
  {
    id: 'org-4',
    name: 'Lodha Palava City',
    type: 'private',
    city: 'Thane',
    logoInitials: 'LPC',
    siteCount: 4,
    cameraCount: 36,
    userCount: 10,
    createdAt: '2024-08-20',
  },
];

// ─── Sites ────────────────────────────────────────────────────────────────────
export const sites: Site[] = [
  { id: 'site-1', orgId: 'org-1', name: 'Andheri Ward K-West', address: 'Andheri (W), Mumbai 400058', lat: 19.1136, lng: 72.8697, cameraCount: 12, zoneCount: 5, incidentCount: 23, status: 'active' },
  { id: 'site-2', orgId: 'org-1', name: 'Bandra Kurla Complex', address: 'BKC, Mumbai 400051', lat: 19.0596, lng: 72.8657, cameraCount: 8, zoneCount: 4, incidentCount: 11, status: 'active' },
  { id: 'site-3', orgId: 'org-1', name: 'Dharavi Zone', address: 'Dharavi, Mumbai 400017', lat: 19.0406, lng: 72.8505, cameraCount: 10, zoneCount: 6, incidentCount: 34, status: 'active' },
  { id: 'site-4', orgId: 'org-2', name: 'Connaught Place Zone', address: 'CP, New Delhi 110001', lat: 28.6289, lng: 77.2065, cameraCount: 9, zoneCount: 4, incidentCount: 15, status: 'active' },
  { id: 'site-5', orgId: 'org-2', name: 'Lajpat Nagar Ward', address: 'Lajpat Nagar, Delhi 110024', lat: 28.5664, lng: 77.2378, cameraCount: 7, zoneCount: 3, incidentCount: 9, status: 'active' },
  { id: 'site-6', orgId: 'org-3', name: 'IIT Delhi Main Campus', address: 'Hauz Khas, New Delhi 110016', lat: 28.5450, lng: 77.1926, cameraCount: 15, zoneCount: 8, incidentCount: 6, status: 'active' },
  { id: 'site-7', orgId: 'org-4', name: 'Palava Phase 1', address: 'Dombivli, Thane 421204', lat: 19.2165, lng: 73.0861, cameraCount: 14, zoneCount: 7, incidentCount: 8, status: 'active' },
  { id: 'site-8', orgId: 'org-4', name: 'Palava Phase 2', address: 'Dombivli, Thane 421204', lat: 19.2210, lng: 73.0921, cameraCount: 10, zoneCount: 5, incidentCount: 4, status: 'inactive' },
];

// ─── Cameras ─────────────────────────────────────────────────────────────────
export const cameras: Camera[] = [
  { id: 'cam-001', name: 'Andheri Main Gate', siteId: 'site-1', siteName: 'Andheri Ward K-West', orgId: 'org-1', location: 'Main Entrance, Gate 1', lat: 19.1140, lng: 72.8700, status: 'online', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '192.168.1.101', model: 'DS-2CD2185G1-I', manufacturer: 'Hikvision', installDate: '2024-02-10', incidentCount: 8 },
  { id: 'cam-002', name: 'Andheri Market Rear', siteId: 'site-1', siteName: 'Andheri Ward K-West', orgId: 'org-1', location: 'Market Back Alley', lat: 19.1128, lng: 72.8688, status: 'online', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '192.168.1.102', model: 'DS-2CD2185G1-I', manufacturer: 'Hikvision', installDate: '2024-02-10', incidentCount: 12 },
  { id: 'cam-003', name: 'JP Road Crossing', siteId: 'site-1', siteName: 'Andheri Ward K-West', orgId: 'org-1', location: 'JP Road Junction', lat: 19.1145, lng: 72.8712, status: 'warning', streamType: 'rtsp', resolution: '720p', fps: 15, lastConnected: '2026-11-01T00:15:00Z', aiEnabled: true, aiStatus: 'idle', ipAddress: '192.168.1.103', model: 'GV-BL8700', manufacturer: 'GeoVision', installDate: '2024-03-15', incidentCount: 3 },
  { id: 'cam-004', name: 'Versova Naka', siteId: 'site-1', siteName: 'Andheri Ward K-West', orgId: 'org-1', location: 'Versova Junction', lat: 19.1098, lng: 72.8673, status: 'offline', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-10-31T18:30:00Z', aiEnabled: false, aiStatus: 'disabled', ipAddress: '192.168.1.104', model: 'DS-2CD2T47G2-L', manufacturer: 'Hikvision', installDate: '2024-04-01', incidentCount: 0 },
  { id: 'cam-005', name: 'BKC Gate A', siteId: 'site-2', siteName: 'Bandra Kurla Complex', orgId: 'org-1', location: 'Gate A, BKC', lat: 19.0600, lng: 72.8660, status: 'online', streamType: 'rtsp', resolution: '4K', fps: 30, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '192.168.2.101', model: 'DS-2CD2T87G2-L', manufacturer: 'Hikvision', installDate: '2024-05-01', incidentCount: 5 },
  { id: 'cam-006', name: 'Dharavi Main Road', siteId: 'site-3', siteName: 'Dharavi Zone', orgId: 'org-1', location: '90 Feet Rd, Dharavi', lat: 19.0400, lng: 72.8510, status: 'online', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-11-01T00:17:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '192.168.3.101', model: 'DS-2CD2185G1-I', manufacturer: 'Hikvision', installDate: '2024-01-20', incidentCount: 18 },
  { id: 'cam-007', name: 'Dharavi Kumbharwada', siteId: 'site-3', siteName: 'Dharavi Zone', orgId: 'org-1', location: 'Kumbharwada, Dharavi', lat: 19.0395, lng: 72.8498, status: 'online', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '192.168.3.102', model: 'GV-BL8700', manufacturer: 'GeoVision', installDate: '2024-01-20', incidentCount: 9 },
  { id: 'cam-008', name: 'CP Central Park', siteId: 'site-4', siteName: 'Connaught Place Zone', orgId: 'org-2', location: 'Inner Circle, CP', lat: 28.6285, lng: 77.2070, status: 'online', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '10.0.1.101', model: 'DS-2CD2185G1-I', manufacturer: 'Hikvision', installDate: '2024-04-15', incidentCount: 7 },
  { id: 'cam-009', name: 'Lajpat Market Gate', siteId: 'site-5', siteName: 'Lajpat Nagar Ward', orgId: 'org-2', location: 'Market Gate, Lajpat Nagar', lat: 28.5660, lng: 77.2380, status: 'online', streamType: 'rtsp', resolution: '720p', fps: 20, lastConnected: '2026-11-01T00:16:00Z', aiEnabled: true, aiStatus: 'idle', ipAddress: '10.0.2.101', model: 'GV-BL4700', manufacturer: 'GeoVision', installDate: '2024-05-10', incidentCount: 4 },
  { id: 'cam-010', name: 'IIT Main Gate', siteId: 'site-6', siteName: 'IIT Delhi Main Campus', orgId: 'org-3', location: 'Main Gate, Hauz Khas', lat: 28.5450, lng: 77.1930, status: 'online', streamType: 'rtsp', resolution: '1080p', fps: 30, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '172.16.1.101', model: 'DS-2CD2T87G2-L', manufacturer: 'Hikvision', installDate: '2024-07-01', incidentCount: 2 },
  { id: 'cam-011', name: 'IIT Hostel Block', siteId: 'site-6', siteName: 'IIT Delhi Main Campus', orgId: 'org-3', location: 'Hostel Zone', lat: 28.5440, lng: 77.1920, status: 'online', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '172.16.1.102', model: 'DS-2CD2185G1-I', manufacturer: 'Hikvision', installDate: '2024-07-01', incidentCount: 3 },
  { id: 'cam-012', name: 'Palava North Gate', siteId: 'site-7', siteName: 'Palava Phase 1', orgId: 'org-4', location: 'North Entrance', lat: 19.2170, lng: 73.0865, status: 'online', streamType: 'rtsp', resolution: '4K', fps: 30, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '192.168.10.101', model: 'DS-2CD2T87G2-L', manufacturer: 'Hikvision', installDate: '2024-09-01', incidentCount: 4 },
  { id: 'cam-013', name: 'Palava Park Area', siteId: 'site-7', siteName: 'Palava Phase 1', orgId: 'org-4', location: 'Central Park', lat: 19.2160, lng: 73.0855, status: 'warning', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-11-01T00:12:00Z', aiEnabled: true, aiStatus: 'idle', ipAddress: '192.168.10.102', model: 'GV-BL8700', manufacturer: 'GeoVision', installDate: '2024-09-01', incidentCount: 2 },
  { id: 'cam-014', name: 'Andheri Station Road', siteId: 'site-1', siteName: 'Andheri Ward K-West', orgId: 'org-1', location: 'Station Road East', lat: 19.1135, lng: 72.8695, status: 'online', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '192.168.1.105', model: 'DS-2CD2185G1-I', manufacturer: 'Hikvision', installDate: '2024-02-10', incidentCount: 6 },
  { id: 'cam-015', name: 'Dharavi Transit Point', siteId: 'site-3', siteName: 'Dharavi Zone', orgId: 'org-1', location: 'Transit Road', lat: 19.0415, lng: 72.8518, status: 'offline', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-10-30T12:00:00Z', aiEnabled: false, aiStatus: 'disabled', ipAddress: '192.168.3.103', model: 'DS-2CD2185G1-I', manufacturer: 'Hikvision', installDate: '2024-01-20', incidentCount: 5 },
  { id: 'cam-016', name: 'CP Block A Alley', siteId: 'site-4', siteName: 'Connaught Place Zone', orgId: 'org-2', location: 'Block A Back Alley', lat: 28.6290, lng: 77.2060, status: 'online', streamType: 'rtsp', resolution: '1080p', fps: 25, lastConnected: '2026-11-01T00:18:00Z', aiEnabled: true, aiStatus: 'processing', ipAddress: '10.0.1.102', model: 'DS-2CD2185G1-I', manufacturer: 'Hikvision', installDate: '2024-04-15', incidentCount: 5 },
];

// ─── Incidents ────────────────────────────────────────────────────────────────
export const incidents: Incident[] = [
  {
    id: 'inc-001', cameraId: 'cam-002', cameraName: 'Andheri Market Rear', siteId: 'site-1', siteName: 'Andheri Ward K-West', orgId: 'org-1',
    timestamp: '2026-11-01T00:03:22Z', category: 'vehicle_dumping', severity: 'high', status: 'pending',
    aiConfidence: 91, description: 'A white van observed depositing garbage bags at the rear of market area. Vehicle stopped for approximately 4 minutes.', assignedTo: 'user-4', assignedToName: 'Riya Desai',
    personIds: ['person-002'], vehicleIds: ['veh-001'], evidenceIds: ['ev-001', 'ev-002'],
    notes: [{ id: 'note-1', incidentId: 'inc-001', authorId: 'ai', authorName: 'EcoX AI', content: 'Detected vehicle stopping for 4m 12s. Garbage bags detected: 3 large, 2 small. Confidence: 91%.', createdAt: '2026-11-01T00:03:25Z', type: 'ai_observation' }],
  },
  {
    id: 'inc-002', cameraId: 'cam-006', cameraName: 'Dharavi Main Road', siteId: 'site-3', siteName: 'Dharavi Zone', orgId: 'org-1',
    timestamp: '2026-10-31T23:47:10Z', category: 'individual_dumping', severity: 'medium', status: 'confirmed',
    aiConfidence: 87, description: 'Individual observed carrying garbage and dumping on the roadside in a restricted zone.', assignedTo: 'user-4', assignedToName: 'Riya Desai',
    personIds: ['person-001'], evidenceIds: ['ev-003'],
    notes: [{ id: 'note-2', incidentId: 'inc-002', authorId: 'ai', authorName: 'EcoX AI', content: 'Person detected: single individual. Duration: 52 seconds. Waste type: Mixed household.', createdAt: '2026-10-31T23:47:14Z', type: 'ai_observation' }, { id: 'note-3', incidentId: 'inc-002', authorId: 'user-4', authorName: 'Riya Desai', content: 'Confirmed by manual review. Footage is clear. Proceeding to generate challan.', createdAt: '2026-10-31T23:58:00Z', type: 'investigator_note' }],
  },
  {
    id: 'inc-003', cameraId: 'cam-007', cameraName: 'Dharavi Kumbharwada', siteId: 'site-3', siteName: 'Dharavi Zone', orgId: 'org-1',
    timestamp: '2026-10-31T22:15:44Z', category: 'suspicious_waste', severity: 'critical', status: 'under_investigation',
    aiConfidence: 78, description: 'Multiple individuals observed with industrial-type waste containers near non-authorized zone. Potential illegal industrial waste disposal.', assignedTo: 'user-3', assignedToName: 'Arjun Mehta',
    personIds: ['person-003', 'person-004'], vehicleIds: ['veh-002'], evidenceIds: ['ev-004', 'ev-005'],
    notes: [{ id: 'note-4', incidentId: 'inc-003', authorId: 'ai', authorName: 'EcoX AI', content: 'Multiple persons: 3. Unregistered container type detected. Possible industrial waste. Requires verification.', createdAt: '2026-10-31T22:15:50Z', type: 'ai_observation' }],
  },
  {
    id: 'inc-004', cameraId: 'cam-001', cameraName: 'Andheri Main Gate', siteId: 'site-1', siteName: 'Andheri Ward K-West', orgId: 'org-1',
    timestamp: '2026-10-31T20:30:00Z', category: 'individual_dumping', severity: 'low', status: 'false_alarm',
    aiConfidence: 52, description: 'Individual detected carrying objects near waste zone. On review confirmed as authorized sanitation worker.', assignedTo: 'user-4', assignedToName: 'Riya Desai',
    personIds: [], evidenceIds: ['ev-006'],
    notes: [{ id: 'note-5', incidentId: 'inc-004', authorId: 'user-4', authorName: 'Riya Desai', content: 'On manual review, the individual is an authorized sanitation worker in uniform. Marking as false alarm.', createdAt: '2026-10-31T20:45:00Z', type: 'investigator_note' }],
  },
  {
    id: 'inc-005', cameraId: 'cam-008', cameraName: 'CP Central Park', siteId: 'site-4', siteName: 'Connaught Place Zone', orgId: 'org-2',
    timestamp: '2026-10-31T19:55:30Z', category: 'vehicle_dumping', severity: 'high', status: 'confirmed',
    aiConfidence: 94, description: 'Blue pickup truck stopped on road adjacent to CP park. Two individuals unloaded construction debris and left.', assignedTo: 'user-5', assignedToName: 'Priya Sharma',
    personIds: ['person-005'], vehicleIds: ['veh-003'], evidenceIds: ['ev-007', 'ev-008'],
    notes: [],
  },
  {
    id: 'inc-006', cameraId: 'cam-016', cameraName: 'CP Block A Alley', siteId: 'site-4', siteName: 'Connaught Place Zone', orgId: 'org-2',
    timestamp: '2026-10-31T18:22:11Z', category: 'individual_dumping', severity: 'medium', status: 'resolved',
    aiConfidence: 83, description: 'Individual depositing garbage bags in alley behind commercial block A.', assignedTo: 'user-5', assignedToName: 'Priya Sharma', resolvedAt: '2026-10-31T21:00:00Z',
    personIds: ['person-006'], evidenceIds: ['ev-009'],
    notes: [],
  },
  {
    id: 'inc-007', cameraId: 'cam-010', cameraName: 'IIT Main Gate', siteId: 'site-6', siteName: 'IIT Delhi Main Campus', orgId: 'org-3',
    timestamp: '2026-10-31T16:44:00Z', category: 'other_suspicious', severity: 'low', status: 'false_alarm',
    aiConfidence: 45, description: 'Student activity detected near drainage area. Confirmed as authorized maintenance by campus staff.',
    personIds: [], evidenceIds: ['ev-010'],
    notes: [],
  },
  {
    id: 'inc-008', cameraId: 'cam-012', cameraName: 'Palava North Gate', siteId: 'site-7', siteName: 'Palava Phase 1', orgId: 'org-4',
    timestamp: '2026-10-31T14:30:20Z', category: 'vehicle_dumping', severity: 'medium', status: 'pending',
    aiConfidence: 88, description: 'Auto-rickshaw observed near gate with unusual cargo. Driver left bags near compound wall.',
    personIds: ['person-007'], vehicleIds: ['veh-004'], evidenceIds: ['ev-011'],
    notes: [],
  },
  {
    id: 'inc-009', cameraId: 'cam-006', cameraName: 'Dharavi Main Road', siteId: 'site-3', siteName: 'Dharavi Zone', orgId: 'org-1',
    timestamp: '2026-10-31T12:10:00Z', category: 'individual_dumping', severity: 'medium', status: 'confirmed',
    aiConfidence: 89, description: 'Two individuals seen dumping garbage bags near blocked storm drain.', assignedTo: 'user-4', assignedToName: 'Riya Desai',
    personIds: ['person-001', 'person-003'], evidenceIds: ['ev-012'],
    notes: [],
  },
  {
    id: 'inc-010', cameraId: 'cam-002', cameraName: 'Andheri Market Rear', siteId: 'site-1', siteName: 'Andheri Ward K-West', orgId: 'org-1',
    timestamp: '2026-10-30T23:15:00Z', category: 'individual_dumping', severity: 'low', status: 'resolved',
    aiConfidence: 76, description: 'Late night garbage dumping detected at market rear entrance.', resolvedAt: '2026-10-31T08:00:00Z',
    personIds: [], evidenceIds: ['ev-013'],
    notes: [],
  },
];

// ─── People ───────────────────────────────────────────────────────────────────
export const people: Person[] = [
  { id: 'person-001', trackingId: 'TRK-P-1001', displayName: 'Unknown Person A', isKnown: false, verificationStatus: 'unknown', firstSeen: '2026-10-20T10:00:00Z', lastSeen: '2026-10-31T23:47:10Z', siteIds: ['site-3'], cameraIds: ['cam-006', 'cam-007'], incidentIds: ['inc-002', 'inc-009'], appearanceCount: 8, clothingDescription: 'Blue shirt, grey trousers', estimatedAge: '30-40' },
  { id: 'person-002', trackingId: 'TRK-P-1002', displayName: 'Unknown Person B', isKnown: false, verificationStatus: 'unknown', firstSeen: '2026-11-01T00:03:22Z', lastSeen: '2026-11-01T00:07:30Z', siteIds: ['site-1'], cameraIds: ['cam-002'], incidentIds: ['inc-001'], appearanceCount: 1, clothingDescription: 'Dark jacket, cap', estimatedAge: '25-35' },
  { id: 'person-003', trackingId: 'TRK-P-1003', displayName: 'Unknown Person C', isKnown: false, verificationStatus: 'pending', firstSeen: '2026-10-31T22:15:44Z', lastSeen: '2026-10-31T22:25:00Z', siteIds: ['site-3'], cameraIds: ['cam-007'], incidentIds: ['inc-003', 'inc-009'], appearanceCount: 3, clothingDescription: 'Red t-shirt, jeans', estimatedAge: '20-30' },
  { id: 'person-004', trackingId: 'TRK-P-1004', displayName: 'Unknown Person D', isKnown: false, verificationStatus: 'unknown', firstSeen: '2026-10-31T22:15:44Z', lastSeen: '2026-10-31T22:22:00Z', siteIds: ['site-3'], cameraIds: ['cam-007'], incidentIds: ['inc-003'], appearanceCount: 1, clothingDescription: 'Black shirt', estimatedAge: '30-45' },
  { id: 'person-005', trackingId: 'TRK-P-2001', displayName: 'Unknown Person E', isKnown: false, verificationStatus: 'unknown', firstSeen: '2026-10-31T19:55:30Z', lastSeen: '2026-10-31T20:02:00Z', siteIds: ['site-4'], cameraIds: ['cam-008'], incidentIds: ['inc-005'], appearanceCount: 2, clothingDescription: 'Orange vest, trousers', estimatedAge: '35-50' },
  { id: 'person-006', trackingId: 'TRK-P-2002', displayName: 'Unknown Person F', isKnown: false, verificationStatus: 'unknown', firstSeen: '2026-10-31T18:22:11Z', lastSeen: '2026-10-31T18:28:00Z', siteIds: ['site-4'], cameraIds: ['cam-016'], incidentIds: ['inc-006'], appearanceCount: 1, clothingDescription: 'White kurta', estimatedAge: '40-55' },
  { id: 'person-007', trackingId: 'TRK-P-4001', displayName: 'Unknown Person G', isKnown: false, verificationStatus: 'unknown', firstSeen: '2026-10-31T14:30:20Z', lastSeen: '2026-10-31T14:38:00Z', siteIds: ['site-7'], cameraIds: ['cam-012'], incidentIds: ['inc-008'], appearanceCount: 1, clothingDescription: 'Yellow t-shirt, shorts', estimatedAge: '20-30' },
];

// ─── Vehicles ─────────────────────────────────────────────────────────────────
export const vehicles: Vehicle[] = [
  { id: 'veh-001', trackingId: 'TRK-V-1001', vehicleType: 'van', color: 'White', licensePlate: 'MH04 AX 7732', licensePlateVerified: true, firstDetected: '2026-11-01T00:03:00Z', lastDetected: '2026-11-01T00:07:30Z', siteIds: ['site-1'], cameraIds: ['cam-002'], incidentIds: ['inc-001'], detectionCount: 1, status: 'suspect' },
  { id: 'veh-002', trackingId: 'TRK-V-1002', vehicleType: 'truck', color: 'Blue', licensePlate: undefined, licensePlateVerified: false, firstDetected: '2026-10-31T22:15:00Z', lastDetected: '2026-10-31T22:26:00Z', siteIds: ['site-3'], cameraIds: ['cam-007'], incidentIds: ['inc-003'], detectionCount: 1, status: 'suspect' },
  { id: 'veh-003', trackingId: 'TRK-V-2001', vehicleType: 'truck', color: 'Blue', licensePlate: 'DL01 CA 3310', licensePlateVerified: true, firstDetected: '2026-10-31T19:55:00Z', lastDetected: '2026-10-31T20:05:00Z', siteIds: ['site-4'], cameraIds: ['cam-008'], incidentIds: ['inc-005'], detectionCount: 2, status: 'suspect' },
  { id: 'veh-004', trackingId: 'TRK-V-4001', vehicleType: 'auto', color: 'Yellow-Black', licensePlate: 'MH05 ZZ 0091', licensePlateVerified: false, firstDetected: '2026-10-31T14:30:00Z', lastDetected: '2026-10-31T14:40:00Z', siteIds: ['site-7'], cameraIds: ['cam-012'], incidentIds: ['inc-008'], detectionCount: 1, status: 'active' },
];

// ─── Evidence ─────────────────────────────────────────────────────────────────
export const evidence: Evidence[] = [
  { id: 'ev-001', incidentId: 'inc-001', cameraId: 'cam-002', cameraName: 'Andheri Market Rear', siteId: 'site-1', siteName: 'Andheri Ward K-West', type: 'video_clip', fileName: 'INC-001_cam002_20261101_000322.mp4', fileSize: 48500000, duration: 252, timestamp: '2026-11-01T00:03:22Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-002', incidentId: 'inc-001', cameraId: 'cam-002', cameraName: 'Andheri Market Rear', siteId: 'site-1', siteName: 'Andheri Ward K-West', type: 'snapshot', fileName: 'INC-001_cam002_snapshot_000340.jpg', fileSize: 1250000, timestamp: '2026-11-01T00:03:40Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-003', incidentId: 'inc-002', cameraId: 'cam-006', cameraName: 'Dharavi Main Road', siteId: 'site-3', siteName: 'Dharavi Zone', type: 'video_clip', fileName: 'INC-002_cam006_20261031_234710.mp4', fileSize: 12000000, duration: 60, timestamp: '2026-10-31T23:47:10Z', integrityStatus: 'verified', accessLog: [{ userId: 'user-4', userName: 'Riya Desai', action: 'viewed', timestamp: '2026-10-31T23:50:00Z' }] },
  { id: 'ev-004', incidentId: 'inc-003', cameraId: 'cam-007', cameraName: 'Dharavi Kumbharwada', siteId: 'site-3', siteName: 'Dharavi Zone', type: 'video_clip', fileName: 'INC-003_cam007_20261031_221544.mp4', fileSize: 65000000, duration: 600, timestamp: '2026-10-31T22:15:44Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-005', incidentId: 'inc-003', cameraId: 'cam-007', cameraName: 'Dharavi Kumbharwada', siteId: 'site-3', siteName: 'Dharavi Zone', type: 'snapshot', fileName: 'INC-003_cam007_snapshot_221600.jpg', fileSize: 980000, timestamp: '2026-10-31T22:16:00Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-006', incidentId: 'inc-004', cameraId: 'cam-001', cameraName: 'Andheri Main Gate', siteId: 'site-1', siteName: 'Andheri Ward K-West', type: 'snapshot', fileName: 'INC-004_cam001_snapshot_203000.jpg', fileSize: 870000, timestamp: '2026-10-31T20:30:00Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-007', incidentId: 'inc-005', cameraId: 'cam-008', cameraName: 'CP Central Park', siteId: 'site-4', siteName: 'Connaught Place Zone', type: 'video_clip', fileName: 'INC-005_cam008_20261031_195530.mp4', fileSize: 52000000, duration: 420, timestamp: '2026-10-31T19:55:30Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-008', incidentId: 'inc-005', cameraId: 'cam-008', cameraName: 'CP Central Park', siteId: 'site-4', siteName: 'Connaught Place Zone', type: 'snapshot', fileName: 'INC-005_cam008_snapshot_195545.jpg', fileSize: 1100000, timestamp: '2026-10-31T19:55:45Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-009', incidentId: 'inc-006', cameraId: 'cam-016', cameraName: 'CP Block A Alley', siteId: 'site-4', siteName: 'Connaught Place Zone', type: 'video_clip', fileName: 'INC-006_cam016_20261031_182211.mp4', fileSize: 28000000, duration: 180, timestamp: '2026-10-31T18:22:11Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-010', incidentId: 'inc-007', cameraId: 'cam-010', cameraName: 'IIT Main Gate', siteId: 'site-6', siteName: 'IIT Delhi Main Campus', type: 'snapshot', fileName: 'INC-007_cam010_snapshot_164400.jpg', fileSize: 760000, timestamp: '2026-10-31T16:44:00Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-011', incidentId: 'inc-008', cameraId: 'cam-012', cameraName: 'Palava North Gate', siteId: 'site-7', siteName: 'Palava Phase 1', type: 'video_clip', fileName: 'INC-008_cam012_20261031_143020.mp4', fileSize: 36000000, duration: 300, timestamp: '2026-10-31T14:30:20Z', integrityStatus: 'pending', accessLog: [] },
  { id: 'ev-012', incidentId: 'inc-009', cameraId: 'cam-006', cameraName: 'Dharavi Main Road', siteId: 'site-3', siteName: 'Dharavi Zone', type: 'video_clip', fileName: 'INC-009_cam006_20261031_121000.mp4', fileSize: 22000000, duration: 120, timestamp: '2026-10-31T12:10:00Z', integrityStatus: 'verified', accessLog: [] },
  { id: 'ev-013', incidentId: 'inc-010', cameraId: 'cam-002', cameraName: 'Andheri Market Rear', siteId: 'site-1', siteName: 'Andheri Ward K-West', type: 'snapshot', fileName: 'INC-010_cam002_snapshot_231500.jpg', fileSize: 920000, timestamp: '2026-10-30T23:15:00Z', integrityStatus: 'verified', accessLog: [] },
];

// ─── Zones ────────────────────────────────────────────────────────────────────
export const zones: Zone[] = [
  { id: 'zone-1', name: 'Andheri Market Collection Point', type: 'collection_point', siteId: 'site-1', siteName: 'Andheri Ward K-West', description: 'Authorized garbage collection point near market', isActive: true, lat: 19.1130, lng: 72.8692, radius: 30, createdAt: '2024-02-15' },
  { id: 'zone-2', name: 'Station Road Restricted Zone', type: 'restricted', siteId: 'site-1', siteName: 'Andheri Ward K-West', description: 'No dumping – traffic intersection', isActive: true, lat: 19.1138, lng: 72.8700, radius: 50, createdAt: '2024-02-15' },
  { id: 'zone-3', name: 'Dharavi Central Dustbin Row', type: 'dustbin', siteId: 'site-3', siteName: 'Dharavi Zone', description: 'Row of municipal dustbins at 90 Feet Rd', isActive: true, lat: 19.0402, lng: 72.8508, radius: 20, createdAt: '2024-01-25' },
  { id: 'zone-4', name: 'BKC Authorized Disposal', type: 'authorized_disposal', siteId: 'site-2', siteName: 'Bandra Kurla Complex', description: 'Authorized disposal area for commercial offices', isActive: true, lat: 19.0602, lng: 72.8658, radius: 40, createdAt: '2024-05-10' },
  { id: 'zone-5', name: 'CP Park Restricted', type: 'restricted', siteId: 'site-4', siteName: 'Connaught Place Zone', description: 'No commercial waste permitted in park area', isActive: true, lat: 28.6287, lng: 77.2068, radius: 80, createdAt: '2024-04-20' },
  { id: 'zone-6', name: 'IIT South Gate Detection Region', type: 'detection_region', siteId: 'site-6', siteName: 'IIT Delhi Main Campus', cameraId: 'cam-010', description: 'AI detection zone for cam-010 near south gate', isActive: true, lat: 28.5448, lng: 77.1928, radius: 25, createdAt: '2024-07-05' },
  { id: 'zone-7', name: 'Palava North Gate Restricted', type: 'restricted', siteId: 'site-7', siteName: 'Palava Phase 1', description: 'No waste disposal near gate entrance', isActive: true, lat: 19.2168, lng: 73.0862, radius: 35, createdAt: '2024-09-05' },
  { id: 'zone-8', name: 'Dharavi Industrial Watch Zone', type: 'detection_region', siteId: 'site-3', siteName: 'Dharavi Zone', cameraId: 'cam-007', description: 'High-vigilance zone for industrial waste monitoring', isActive: true, lat: 19.0395, lng: 72.8500, radius: 60, createdAt: '2024-01-25' },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasks: Task[] = [
  { id: 'task-001', title: 'Investigate Inc-001: White Van Dumping', description: 'Review footage and track vehicle registration for incident inc-001.', incidentId: 'inc-001', incidentTitle: 'Vehicle Dumping – Andheri Market', assignedTo: 'user-4', assignedToName: 'Riya Desai', assignedBy: 'user-2', assignedByName: 'Suresh Nair', siteId: 'site-1', siteName: 'Andheri Ward K-West', status: 'in_progress', priority: 'high', dueDate: '2026-11-02', createdAt: '2026-11-01T00:10:00Z', location: 'Andheri Market Rear' },
  { id: 'task-002', title: 'File FIR for Inc-003: Industrial Waste', description: 'Coordinate with MPCB and local police to file FIR for suspected illegal industrial waste disposal.', incidentId: 'inc-003', incidentTitle: 'Suspicious Waste – Dharavi Kumbharwada', assignedTo: 'user-3', assignedToName: 'Arjun Mehta', assignedBy: 'user-2', assignedByName: 'Suresh Nair', siteId: 'site-3', siteName: 'Dharavi Zone', status: 'in_progress', priority: 'urgent', dueDate: '2026-11-01', createdAt: '2026-10-31T22:30:00Z', location: 'Dharavi Kumbharwada' },
  { id: 'task-003', title: 'Clean up CP Park Debris', description: 'Dispatch sanitation team to remove construction debris dumped at CP park (Inc-005).', incidentId: 'inc-005', incidentTitle: 'Vehicle Dumping – CP Central Park', assignedTo: 'user-6', assignedToName: 'Deepak Kumar', assignedBy: 'user-5', assignedByName: 'Priya Sharma', siteId: 'site-4', siteName: 'Connaught Place Zone', status: 'completed', priority: 'high', dueDate: '2026-11-01', createdAt: '2026-10-31T20:00:00Z', completedAt: '2026-11-01T00:00:00Z', location: 'CP Central Park' },
  { id: 'task-004', title: 'Offline Camera – Dharavi Transit', description: 'Cam-015 is offline. Inspect connection and restore stream.', assignedTo: 'user-3', assignedToName: 'Arjun Mehta', assignedBy: 'user-2', assignedByName: 'Suresh Nair', siteId: 'site-3', siteName: 'Dharavi Zone', status: 'pending', priority: 'medium', dueDate: '2026-11-01', createdAt: '2026-10-31T09:00:00Z', location: 'Dharavi Transit Point' },
  { id: 'task-005', title: 'Review Inc-008: Palava Gate Dumping', description: 'Review auto-rickshaw dumping incident at Palava North Gate.', incidentId: 'inc-008', incidentTitle: 'Vehicle Dumping – Palava North Gate', assignedTo: 'user-7', assignedToName: 'Kavitha Reddy', assignedBy: 'user-8', assignedByName: 'Amit Shah', siteId: 'site-7', siteName: 'Palava Phase 1', status: 'pending', priority: 'medium', dueDate: '2026-11-02', createdAt: '2026-10-31T15:00:00Z', location: 'Palava North Gate' },
  { id: 'task-006', title: 'Monthly Camera Audit – Andheri K-West', description: 'Conduct monthly camera health check for all 12 cameras in Andheri K-West.', assignedTo: 'user-3', assignedToName: 'Arjun Mehta', assignedBy: 'user-2', assignedByName: 'Suresh Nair', siteId: 'site-1', siteName: 'Andheri Ward K-West', status: 'pending', priority: 'low', dueDate: '2026-11-05', createdAt: '2026-10-28T10:00:00Z', location: 'Andheri Ward K-West' },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const users: User[] = [
  { id: 'user-1', name: 'Platform Admin', email: 'admin@ecoxwatch.io', role: 'super_admin', orgId: 'org-1', orgName: 'EcoX Platform', siteIds: [], status: 'active', lastActive: '2026-11-01T00:20:00Z', createdAt: '2024-01-01' },
  { id: 'user-2', name: 'Suresh Nair', email: 'suresh.nair@mcgm.gov.in', role: 'org_admin', orgId: 'org-1', orgName: 'Greater Mumbai Municipal Corp.', siteIds: ['site-1', 'site-2', 'site-3'], status: 'active', lastActive: '2026-10-31T23:00:00Z', createdAt: '2024-01-15', phone: '+91 98765 43210', department: 'Solid Waste Management' },
  { id: 'user-3', name: 'Arjun Mehta', email: 'arjun.mehta@mcgm.gov.in', role: 'operator', orgId: 'org-1', orgName: 'Greater Mumbai Municipal Corp.', siteIds: ['site-1', 'site-3'], status: 'active', lastActive: '2026-10-31T22:30:00Z', createdAt: '2024-02-10', department: 'Surveillance Operations' },
  { id: 'user-4', name: 'Riya Desai', email: 'riya.desai@mcgm.gov.in', role: 'investigator', orgId: 'org-1', orgName: 'Greater Mumbai Municipal Corp.', siteIds: ['site-1', 'site-2', 'site-3'], status: 'active', lastActive: '2026-10-31T23:58:00Z', createdAt: '2024-02-10', department: 'Enforcement' },
  { id: 'user-5', name: 'Priya Sharma', email: 'priya.sharma@mcd.delhi.gov.in', role: 'org_admin', orgId: 'org-2', orgName: 'Delhi Municipal Corp.', siteIds: ['site-4', 'site-5'], status: 'active', lastActive: '2026-10-31T21:00:00Z', createdAt: '2024-03-10', department: 'Environment & Sanitation' },
  { id: 'user-6', name: 'Deepak Kumar', email: 'deepak.kumar@mcd.delhi.gov.in', role: 'field_officer', orgId: 'org-2', orgName: 'Delhi Municipal Corp.', siteIds: ['site-4'], status: 'active', lastActive: '2026-11-01T00:05:00Z', createdAt: '2024-04-01', department: 'Sanitation Field Team' },
  { id: 'user-7', name: 'Kavitha Reddy', email: 'kavitha.reddy@lodhapalava.com', role: 'operator', orgId: 'org-4', orgName: 'Lodha Palava City', siteIds: ['site-7', 'site-8'], status: 'active', lastActive: '2026-10-31T20:00:00Z', createdAt: '2024-08-25' },
  { id: 'user-8', name: 'Amit Shah', email: 'amit.shah@lodhapalava.com', role: 'org_admin', orgId: 'org-4', orgName: 'Lodha Palava City', siteIds: ['site-7', 'site-8'], status: 'active', lastActive: '2026-10-31T18:00:00Z', createdAt: '2024-08-20', department: 'Facility Management' },
  { id: 'user-9', name: 'Dr. Anand Kumar', email: 'anand.kumar@iitd.ac.in', role: 'org_admin', orgId: 'org-3', orgName: 'IIT Delhi Campus', siteIds: ['site-6'], status: 'active', lastActive: '2026-10-31T17:00:00Z', createdAt: '2024-06-05', department: 'Campus Administration' },
  { id: 'user-10', name: 'Sneha Patil', email: 'sneha.patil@mcgm.gov.in', role: 'viewer', orgId: 'org-1', orgName: 'Greater Mumbai Municipal Corp.', siteIds: ['site-1'], status: 'active', lastActive: '2026-10-30T10:00:00Z', createdAt: '2024-06-01', department: 'Planning & Analysis' },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications: AppNotification[] = [
  { id: 'notif-1', type: 'incident_alert', title: 'New Incident Detected', message: 'Vehicle dumping detected at Andheri Market Rear (cam-002). Confidence: 91%.', timestamp: '2026-11-01T00:03:25Z', isRead: false, link: '/incidents/inc-001' },
  { id: 'notif-2', type: 'critical_alert', title: 'Suspicious Industrial Waste', message: 'Critical: Potential illegal industrial waste disposal detected at Dharavi Kumbharwada.', timestamp: '2026-10-31T22:15:50Z', isRead: false, link: '/incidents/inc-003' },
  { id: 'notif-3', type: 'camera_offline', title: 'Camera Offline: Versova Naka', message: 'cam-004 (Versova Naka) has gone offline. Last connected 5h 48m ago.', timestamp: '2026-10-31T18:30:00Z', isRead: true, link: '/cameras' },
  { id: 'notif-4', type: 'task_assigned', title: 'Task Assigned to You', message: 'Suresh Nair assigned you: "Investigate Inc-001: White Van Dumping"', timestamp: '2026-11-01T00:10:00Z', isRead: false, link: '/tasks/task-001' },
  { id: 'notif-5', type: 'investigation_update', title: 'Incident Confirmed: Inc-002', message: 'Riya Desai confirmed incident Inc-002 (Individual Dumping – Dharavi Main Road).', timestamp: '2026-10-31T23:58:00Z', isRead: true, link: '/incidents/inc-002' },
  { id: 'notif-6', type: 'camera_offline', title: 'Camera Offline: Dharavi Transit', message: 'cam-015 (Dharavi Transit Point) has been offline since 30 Oct 12:00.', timestamp: '2026-10-30T12:05:00Z', isRead: true, link: '/cameras' },
  { id: 'notif-7', type: 'system', title: 'AI Processing Resumed', message: 'cam-003 AI processing resumed after temporary suspension.', timestamp: '2026-10-31T15:00:00Z', isRead: true },
  { id: 'notif-8', type: 'incident_alert', title: 'New Incident Detected', message: 'Vehicle dumping detected at CP Central Park (cam-008). Confidence: 94%.', timestamp: '2026-10-31T19:55:35Z', isRead: true, link: '/incidents/inc-005' },
];

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const dashboardStats: DashboardStats = {
  totalCameras: 16,
  onlineCameras: 12,
  offlineCameras: 2,
  warningCameras: 2,
  incidentsToday: 4,
  pendingReview: 3,
  confirmedIncidents: 4,
  falseAlerts: 2,
  activeSites: 7,
  activeAiCameras: 11,
};

// ─── Trend Data ───────────────────────────────────────────────────────────────
export const trendData: TrendDataPoint[] = [
  { date: '2026-10-26', confirmed: 3, falseAlarm: 1, pending: 2, total: 6 },
  { date: '2026-10-27', confirmed: 5, falseAlarm: 2, pending: 1, total: 8 },
  { date: '2026-10-28', confirmed: 2, falseAlarm: 0, pending: 3, total: 5 },
  { date: '2026-10-29', confirmed: 6, falseAlarm: 2, pending: 2, total: 10 },
  { date: '2026-10-30', confirmed: 4, falseAlarm: 1, pending: 2, total: 7 },
  { date: '2026-10-31', confirmed: 7, falseAlarm: 1, pending: 2, total: 10 },
  { date: '2026-11-01', confirmed: 1, falseAlarm: 0, pending: 3, total: 4 },
];

// ─── Category Distribution ────────────────────────────────────────────────────
export const categoryData: CategoryDataPoint[] = [
  { category: 'Individual Dumping', count: 18, percentage: 45 },
  { category: 'Vehicle Dumping', count: 14, percentage: 35 },
  { category: 'Suspicious Waste', count: 6, percentage: 15 },
  { category: 'Other Activity', count: 2, percentage: 5 },
];

// ─── Current User (logged in) ─────────────────────────────────────────────────
export const currentUser = users[1]; // Suresh Nair (Org Admin)
