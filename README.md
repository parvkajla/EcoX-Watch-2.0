# EcoX Watch 2.0

AI-powered CCTV monitoring and illegal waste-dumping detection platform.

## Overview

EcoX Watch 2.0 is a modern web-based monitoring platform designed to operate as an intelligent software layer over existing CCTV infrastructure.

The platform is designed to centralize CCTV monitoring, review suspected illegal waste-dumping incidents, manage evidence, track people and vehicles, configure monitoring zones, and analyze environmental activity.

The current version focuses on the frontend monitoring and management interface. The architecture is prepared for future integration with AI-powered video analytics, authorized CCTV/RTSP streams, backend APIs, and database services.

## Key Features

### Dashboard
- Monitoring overview
- Incident statistics
- Camera status monitoring
- Recent incidents
- Activity summaries
- Operational KPIs

### Camera Management
- CCTV camera management
- Camera status monitoring
- Camera information and configuration
- Monitoring interface
- Camera-level activity overview

### Incident Management
- Centralized incident list
- Incident severity and status
- Detailed incident view
- Suspected illegal dumping records
- Incident assignment and workflow
- Incident review and resolution

### Evidence Management
- Evidence collection and organization
- Incident-linked evidence
- Evidence review interface
- CCTV footage references
- Investigation workflow

### People Management
- Person records
- Person activity history
- Person details
- Identity-related monitoring interface
- Cross-incident activity tracking

### Vehicle Management
- Vehicle records
- Vehicle activity
- Vehicle-linked incidents
- Vehicle monitoring interface

### Zone Management
- Monitoring zones
- Authorized and restricted areas
- Zone configuration
- Location-based incident management

### Analytics
- Incident analytics
- Monitoring statistics
- Activity trends
- Camera performance overview
- Environmental monitoring insights

### Notifications
- Incident notifications
- System alerts
- Monitoring updates
- Notification management

### Organization & Users
- Organization management
- User management
- Role-based interface
- Account settings

### Settings
- Application configuration
- Monitoring preferences
- User preferences
- System settings

## Planned AI Integration

EcoX Watch is designed to integrate with an AI video analytics pipeline capable of processing authorized CCTV streams or recorded footage.

### Planned AI Stack

- **YOLO26** — Object detection
- **BoT-SORT** — Multi-object tracking
- **YOLO26 ReID** — Appearance-based person re-identification
- **RetinaFace** — Face detection
- **AdaFace** — Face recognition
- **Cosine Similarity** — Embedding comparison
- **Custom Identity Verification Engine** — Identity linking and verification
- **PostgreSQL + pgvector** — Identity and embedding storage

The planned AI system is intended to identify suspicious waste-dumping behaviour rather than simply detecting the presence of garbage.

## Target Detection Scenarios

- Person dumping garbage
- Vehicle-based garbage dumping
- Person carrying garbage
- Authorized garbage collection
- Person picking up garbage
- Municipal cleaning activity
- Garbage placement and persistence
- Suspicious waste-related activity

AI-generated incidents are intended to be treated as suspected events requiring human review, rather than automatic determinations of wrongdoing.

## System Architecture

```text
Existing CCTV / NVR
        |
        | RTSP / Authorized Video Feed
        v
Video Processing Layer
        |
        v
AI Detection & Tracking
        |
        +-- YOLO26
        +-- BoT-SORT
        +-- YOLO26 ReID
        +-- RetinaFace
        +-- AdaFace
        |
        v
Event & Identity Verification
        |
        v
Backend API / Database
        |
        v
EcoX Watch Web Dashboard
        |
        +-- Cameras
        +-- Monitoring
        +-- Incidents
        +-- Evidence
        +-- People
        +-- Vehicles
        +-- Zones
        +-- Analytics
        +-- Notifications
```

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Responsive UI
- Component-based architecture

### Planned Backend

- FastAPI
- Python
- REST APIs
- WebSocket-based real-time updates

### Planned AI / Computer Vision

- YOLO26
- BoT-SORT
- YOLO26 ReID
- RetinaFace
- AdaFace
- OpenCV
- PyTorch

### Database

- PostgreSQL
- pgvector

### Infrastructure

- Docker
- GPU-accelerated inference
- RTSP/NVR video integration
- Local or cloud object storage

## Project Structure

```text
EcoX-Watch-2.0/
|
+-- public/
+-- src/
|   +-- assets/
|   +-- components/
|   |   +-- layout/
|   |   +-- ui/
|   +-- data/
|   +-- pages/
|   |   +-- Analytics.tsx
|   |   +-- Cameras.tsx
|   |   +-- Dashboard.tsx
|   |   +-- Evidence.tsx
|   |   +-- IncidentDetail.tsx
|   |   +-- Incidents.tsx
|   |   +-- MapPage.tsx
|   |   +-- Monitoring.tsx
|   |   +-- Notifications.tsx
|   |   +-- Organization.tsx
|   |   +-- People.tsx
|   |   +-- PersonDetail.tsx
|   |   +-- Settings.tsx
|   |   +-- Tasks.tsx
|   |   +-- Users.tsx
|   |   +-- Vehicles.tsx
|   |   +-- Zones.tsx
|   +-- store/
|   +-- types/
|   +-- utils/
+-- index.html
+-- package.json
+-- vite.config.ts
+-- tsconfig.json
+-- README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/parvkajla/EcoX-Watch-2.0.git
cd EcoX-Watch-2.0
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application starts using the Vite development server.

## Development Status

| Module | Status |
|---|---|
| Dashboard | Completed |
| Camera Management UI | Completed |
| Monitoring UI | Completed |
| Incident Management UI | Completed |
| Evidence Management UI | Completed |
| People Management UI | Completed |
| Vehicle Management UI | Completed |
| Zone Management UI | Completed |
| Analytics UI | Completed |
| Notifications UI | Completed |
| User Management UI | Completed |
| AI Detection Pipeline | Planned |
| CCTV / RTSP Integration | Planned |
| Person Re-Identification | Planned |
| Face Recognition | Planned |
| Backend API | Planned |
| PostgreSQL + pgvector | Planned |

## CCTV Integration

EcoX Watch is designed to operate as an independent software layer over existing authorized CCTV infrastructure.

It does not require modification of CCTV camera firmware, existing camera hardware, or NVR/DVR hardware.

### Supported / Planned Video Sources

- RTSP streams
- NVR/DVR network streams
- Authorized recorded footage

## Detection Philosophy

EcoX Watch is not designed to classify every occurrence of garbage as illegal dumping.

The planned system evaluates activities over time to distinguish between different scenarios and reduce false alerts.

Examples include:

- Normal pedestrian movement
- Carrying garbage
- Dumping garbage
- Picking up garbage
- Authorized waste collection
- Municipal cleaning
- Vehicle movement
- Vehicle-based dumping
- Pre-existing garbage

## Identity & Re-Identification

The planned identity pipeline is designed to provide temporary tracking IDs for people appearing in CCTV footage and, where appropriately authorized, associate observations with persistent identities.

### Identity Pipeline

1. Person detection
2. Local multi-object tracking
3. Appearance-based ReID
4. Face detection
5. Face recognition
6. Embedding similarity
7. Identity verification

Identity matching will use confidence thresholds and verification logic rather than blindly assigning permanent identities from a single observation.

## Privacy & Responsible AI

EcoX Watch may process video containing people, vehicles, and potentially identity-related information.

Any real-world deployment should comply with applicable privacy, surveillance, data-protection, and organizational requirements.

Identity recognition should only be enabled where there is an appropriate legal and organizational basis.

AI-generated incidents should be treated as reviewable system outputs and not as automatic determinations of wrongdoing.

## Roadmap

- [x] Design modern monitoring dashboard
- [x] Implement frontend architecture
- [x] Implement camera management interface
- [x] Implement incident management interface
- [x] Implement evidence interface
- [x] Implement people and vehicle management
- [x] Implement analytics interface
- [ ] Connect authorized CCTV / RTSP streams
- [ ] Build video processing service
- [ ] Integrate YOLO26 detection
- [ ] Integrate BoT-SORT tracking
- [ ] Integrate YOLO26 ReID
- [ ] Implement dumping-event detection
- [ ] Integrate RetinaFace
- [ ] Integrate AdaFace
- [ ] Build identity verification engine
- [ ] Integrate PostgreSQL + pgvector
- [ ] Implement real-time incident alerts
- [ ] Generate incident evidence clips
- [ ] Implement multi-camera monitoring
- [ ] Evaluate AI performance on real CCTV footage
- [ ] Production deployment

## Project Goals

- Detect suspicious waste-dumping activities
- Reduce manual CCTV monitoring effort
- Centralize environmental incidents
- Organize evidence
- Monitor people and vehicles involved in incidents
- Analyze activity across monitored locations
- Support faster investigation and response

## Future Scope

- Multi-camera cross-location intelligence
- Advanced temporal action recognition
- Automated evidence generation
- Real-time alerting
- Geospatial incident analytics
- AI-assisted incident investigation
- Camera health monitoring
- Advanced reporting
- Scalable GPU inference
- Enterprise deployment support

## License

This project is currently under active development. License information will be added in a future release.

## Project

**EcoX Watch 2.0**

Intelligent CCTV-based monitoring for cleaner and safer public spaces.
