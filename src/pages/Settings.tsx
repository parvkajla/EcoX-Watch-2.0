import React from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Globe, Brain, Shield, Bell,
  Database, Lock, Plug, Activity, Server, Cpu, HardDrive,
  MemoryStick, Wifi, AlertTriangle, CheckCircle, ToggleLeft,
  ToggleRight, ChevronRight, Eye, Camera
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../utils';

type SettingSection = 'general' | 'organization' | 'ai' | 'incidents' | 'notifications' | 'identity' | 'retention' | 'evidence' | 'security' | 'integrations' | 'system';

interface SectionDef {
  key: SettingSection;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: SectionDef[] = [
  { key: 'general', label: 'General', icon: Globe },
  { key: 'organization', label: 'Organization', icon: Shield },
  { key: 'ai', label: 'AI Configuration', icon: Brain },
  { key: 'incidents', label: 'Incident Rules', icon: AlertTriangle },
  { key: 'notifications', label: 'Notification Settings', icon: Bell },
  { key: 'identity', label: 'Identity Verification', icon: Eye },
  { key: 'retention', label: 'Data Retention', icon: Database },
  { key: 'evidence', label: 'Evidence Management', icon: HardDrive },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'integrations', label: 'Integrations', icon: Plug },
  { key: 'system', label: 'System Health', icon: Activity },
];

function ToggleSetting({ label, description, value, onChange }: { label: string; description?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#F0F1ED] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#20211F]">{label}</p>
        {description && <p className="text-xs text-[#777A73] mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!value)} className="flex-shrink-0 mt-0.5">
        {value ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-[#A8ABA3]" />}
      </button>
    </div>
  );
}

function StatusIndicator({ label, status, value }: { label: string; status: 'ok' | 'warning' | 'error'; value?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <div className={cn('w-2 h-2 rounded-full', status === 'ok' ? 'bg-green-500' : status === 'warning' ? 'bg-amber-500 animate-pulse' : 'bg-red-500')} />
        <span className="text-sm text-[#20211F]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-[#777A73] font-tabular">{value}</span>}
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', status === 'ok' ? 'bg-green-50 text-green-700' : status === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700')}>
          {status === 'ok' ? 'Healthy' : status === 'warning' ? 'Warning' : 'Error'}
        </span>
      </div>
    </div>
  );
}

function UsageBar({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-amber-500' : 'bg-[#C8F169]';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-[#777A73]">{label}</span>
        <span className="font-semibold font-tabular text-[#20211F]">{value}{unit} / {max}{unit}</span>
      </div>
      <div className="h-2 bg-[#F0F1ED] rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );
}

export default function Settings() {
  const { addToast } = useAppStore();
  const [activeSection, setActiveSection] = React.useState<SettingSection>('general');

  // General settings state
  const [timezone, setTimezone] = React.useState('Asia/Kolkata');
  const [language, setLanguage] = React.useState('en');
  const [dateFormat, setDateFormat] = React.useState('dd MMM yyyy');

  // AI settings
  const [aiSettings, setAiSettings] = React.useState({
    detectionEnabled: true,
    autoIncidentCreation: true,
    minConfidenceThreshold: 70,
    vehicleDetection: true,
    personTracking: true,
    processOnMotionOnly: false,
    gpuAcceleration: true,
  });

  // Notification settings
  const [notifSettings, setNotifSettings] = React.useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    criticalOnly: false,
    cameraOfflineAlerts: true,
    incidentAlerts: true,
    taskAlerts: true,
    systemAlerts: false,
  });

  // Security settings
  const [secSettings, setSecSettings] = React.useState({
    mfaRequired: false,
    sessionTimeout: true,
    auditLog: true,
    ipWhitelist: false,
  });

  const handleSave = () => {
    addToast({ type: 'success', title: 'Settings Saved', message: 'Your settings have been saved successfully.' });
  };

  const section = SECTIONS.find((s) => s.key === activeSection);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-[#20211F]">Settings</h1>
        <p className="text-sm text-[#777A73] mt-1">Configure platform, AI, security, and notification preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-52 flex-shrink-0">
          <Card className="p-2">
            <nav className="space-y-0.5">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                    activeSection === s.key
                      ? 'bg-[#252622] text-white'
                      : 'text-[#777A73] hover:bg-[#F5F6F2] hover:text-[#20211F]'
                  )}
                >
                  <s.icon size={14} className="flex-shrink-0" />
                  <span>{s.label}</span>
                  {activeSection === s.key && <ChevronRight size={12} className="ml-auto text-[#C8F169]" />}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-2">
            {section && <section.icon size={18} className="text-[#777A73]" />}
            <h2 className="font-display font-bold text-lg text-[#20211F]">{section?.label}</h2>
          </div>

          {/* General */}
          {activeSection === 'general' && (
            <Card className="p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mb-4">Platform Preferences</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#20211F] mb-1.5">Timezone</label>
                      <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                        className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="Asia/Dubai">Asia/Dubai</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#20211F] mb-1.5">Language</label>
                      <select value={language} onChange={(e) => setLanguage(e.target.value)}
                        className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="mr">Marathi</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#20211F] mb-1.5">Date Format</label>
                    <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
                      <option value="dd MMM yyyy">dd MMM yyyy (01 Nov 2026)</option>
                      <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                      <option value="yyyy-MM-dd">yyyy-MM-dd (ISO)</option>
                    </select>
                  </div>
                </div>
              </div>
              <Button onClick={handleSave}>Save Preferences</Button>
            </Card>
          )}

          {/* AI Configuration */}
          {activeSection === 'ai' && (
            <Card className="p-6">
              <div className="mb-2">
                <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mb-4">Detection Settings</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                  <p className="text-xs text-amber-700">
                    <strong>Note:</strong> These settings configure AI detection behavior. Actual AI inference runs on the backend. 
                    This frontend does not perform any real AI detection.
                  </p>
                </div>
                <ToggleSetting label="Enable AI Detection" description="Master switch for all AI-based monitoring" value={aiSettings.detectionEnabled} onChange={(v) => setAiSettings((s) => ({ ...s, detectionEnabled: v }))} />
                <ToggleSetting label="Auto-create Incidents" description="Automatically create incidents when AI detects suspicious activity" value={aiSettings.autoIncidentCreation} onChange={(v) => setAiSettings((s) => ({ ...s, autoIncidentCreation: v }))} />
                <ToggleSetting label="Vehicle Detection" description="Enable AI detection of vehicles involved in dumping" value={aiSettings.vehicleDetection} onChange={(v) => setAiSettings((s) => ({ ...s, vehicleDetection: v }))} />
                <ToggleSetting label="Person Tracking" description="Enable tracking of individuals across camera feeds" value={aiSettings.personTracking} onChange={(v) => setAiSettings((s) => ({ ...s, personTracking: v }))} />
                <ToggleSetting label="Motion-only Processing" description="Only run AI when motion is detected (reduces compute load)" value={aiSettings.processOnMotionOnly} onChange={(v) => setAiSettings((s) => ({ ...s, processOnMotionOnly: v }))} />
                <ToggleSetting label="GPU Acceleration" description="Use GPU for faster inference (requires CUDA-compatible GPU)" value={aiSettings.gpuAcceleration} onChange={(v) => setAiSettings((s) => ({ ...s, gpuAcceleration: v }))} />
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-[#20211F] mb-2">Minimum Confidence Threshold: {aiSettings.minConfidenceThreshold}%</label>
                <input
                  type="range"
                  min={40}
                  max={95}
                  step={5}
                  value={aiSettings.minConfidenceThreshold}
                  onChange={(e) => setAiSettings((s) => ({ ...s, minConfidenceThreshold: Number(e.target.value) }))}
                  className="w-full accent-[#252622]"
                />
                <div className="flex justify-between text-xs text-[#A8ABA3] mt-1">
                  <span>40% (more detections)</span>
                  <span>95% (fewer, higher confidence)</span>
                </div>
              </div>
              <Button onClick={handleSave} className="mt-5">Save AI Settings</Button>
            </Card>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <Card className="p-6">
              <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mb-4">Alert Channels</p>
              <ToggleSetting label="Email Alerts" description="Receive incident alerts by email" value={notifSettings.emailAlerts} onChange={(v) => setNotifSettings((s) => ({ ...s, emailAlerts: v }))} />
              <ToggleSetting label="SMS Alerts" description="Receive critical alerts by SMS" value={notifSettings.smsAlerts} onChange={(v) => setNotifSettings((s) => ({ ...s, smsAlerts: v }))} />
              <ToggleSetting label="Push Notifications" description="Browser push notifications" value={notifSettings.pushNotifications} onChange={(v) => setNotifSettings((s) => ({ ...s, pushNotifications: v }))} />

              <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mt-6 mb-4">Alert Types</p>
              <ToggleSetting label="Incident Alerts" value={notifSettings.incidentAlerts} onChange={(v) => setNotifSettings((s) => ({ ...s, incidentAlerts: v }))} />
              <ToggleSetting label="Camera Offline Alerts" value={notifSettings.cameraOfflineAlerts} onChange={(v) => setNotifSettings((s) => ({ ...s, cameraOfflineAlerts: v }))} />
              <ToggleSetting label="Task Assignments" value={notifSettings.taskAlerts} onChange={(v) => setNotifSettings((s) => ({ ...s, taskAlerts: v }))} />
              <ToggleSetting label="System Alerts" value={notifSettings.systemAlerts} onChange={(v) => setNotifSettings((s) => ({ ...s, systemAlerts: v }))} />
              <Button onClick={handleSave} className="mt-4">Save Notification Settings</Button>
            </Card>
          )}

          {/* Identity Verification */}
          {activeSection === 'identity' && (
            <Card className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                <p className="text-sm font-semibold text-blue-700 mb-1">Privacy & Authorization Notice</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Face recognition and identity verification are backend capabilities that require explicit legal authorization, 
                  appropriate data protection compliance, and organizational policy. EcoX Watch displays verification states 
                  from the backend but does not perform autonomous identity matching in the frontend.
                  Configure backend identity policies with appropriate legal counsel.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Manual Review Required', desc: 'All identity matches require human review before confirmation' },
                  { label: 'Minimum Confidence for Suggestion', desc: 'Only suggest identity matches above 90% confidence' },
                  { label: 'Audit Log for Identity Actions', desc: 'Log all identity verification actions for compliance' },
                  { label: 'Anonymize Rejected Identities', desc: 'Automatically anonymize records with rejected verifications' },
                ].map((item) => (
                  <ToggleSetting key={item.label} label={item.label} description={item.desc} value={true} onChange={() => {}} />
                ))}
              </div>
            </Card>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <Card className="p-6">
              <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mb-4">Authentication & Access</p>
              <ToggleSetting label="Require Multi-Factor Authentication" description="Enforce MFA for all user accounts" value={secSettings.mfaRequired} onChange={(v) => setSecSettings((s) => ({ ...s, mfaRequired: v }))} />
              <ToggleSetting label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" value={secSettings.sessionTimeout} onChange={(v) => setSecSettings((s) => ({ ...s, sessionTimeout: v }))} />
              <ToggleSetting label="Full Audit Log" description="Log all user actions including reads" value={secSettings.auditLog} onChange={(v) => setSecSettings((s) => ({ ...s, auditLog: v }))} />
              <ToggleSetting label="IP Whitelist" description="Restrict access to approved IP addresses only" value={secSettings.ipWhitelist} onChange={(v) => setSecSettings((s) => ({ ...s, ipWhitelist: v }))} />
              <div className="mt-4 p-3 bg-[#F5F6F2] rounded-xl">
                <p className="text-xs text-[#777A73]">CCTV stream credentials are never stored in the frontend. Ensure your NVR/DVR uses encrypted RTSP streams where possible.</p>
              </div>
              <Button onClick={handleSave} className="mt-4">Save Security Settings</Button>
            </Card>
          )}

          {/* Data Retention */}
          {activeSection === 'retention' && (
            <Card className="p-6">
              <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mb-4">Retention Policies</p>
              <div className="space-y-4">
                {[
                  { label: 'Incident Records', value: '24 months' },
                  { label: 'Video Clips (Evidence)', value: '12 months' },
                  { label: 'Snapshots', value: '6 months' },
                  { label: 'Audit Logs', value: '36 months' },
                  { label: 'Person Tracking Records', value: '3 months' },
                  { label: 'System Logs', value: '90 days' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#F0F1ED] last:border-0">
                    <span className="text-sm text-[#20211F]">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#20211F]">{item.value}</span>
                      <button className="text-xs text-[#777A73] hover:text-[#20211F] underline">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <Card className="p-6">
              <p className="text-xs font-semibold text-[#A8ABA3] uppercase tracking-wider mb-4">External Integrations</p>
              <div className="space-y-3">
                {[
                  { name: 'Backend API (FastAPI)', status: 'Not connected', color: 'text-[#777A73]' },
                  { name: 'Video Ingestion Service', status: 'Not connected', color: 'text-[#777A73]' },
                  { name: 'AI Inference Engine', status: 'Not connected', color: 'text-[#777A73]' },
                  { name: 'Email (SMTP)', status: 'Demo mode', color: 'text-amber-600' },
                  { name: 'SMS Gateway', status: 'Not configured', color: 'text-[#777A73]' },
                  { name: 'Evidence Storage (S3/GCS)', status: 'Not configured', color: 'text-[#777A73]' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-[#F5F6F2] rounded-xl">
                    <div className="flex items-center gap-3">
                      <Plug size={14} className="text-[#777A73]" />
                      <span className="text-sm font-medium text-[#20211F]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs', item.color)}>{item.status}</span>
                      <button className="text-xs bg-[#252622] text-white px-2.5 py-1 rounded-lg hover:bg-[#353733] transition-colors">Configure</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* System Health */}
          {activeSection === 'system' && (
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-[#20211F]">System Status</p>
                  <span className="demo-badge"><Activity size={9} /> Demo Values</span>
                </div>
                <div className="divide-y divide-[#F0F1ED]">
                  <StatusIndicator label="Backend API" status="warning" value="Not connected" />
                  <StatusIndicator label="Database" status="warning" value="Demo mode" />
                  <StatusIndicator label="Video Ingestion" status="warning" value="Not connected" />
                  <StatusIndicator label="AI Inference Engine" status="warning" value="Not connected" />
                  <StatusIndicator label="Evidence Storage" status="warning" value="Demo mode" />
                  <StatusIndicator label="Frontend Application" status="ok" value="Running" />
                </div>
              </Card>

              <Card className="p-6">
                <p className="font-semibold text-[#20211F] mb-4">Resource Usage</p>
                <span className="demo-badge mb-4 inline-block"><Activity size={9} /> Simulated Values</span>
                <div className="space-y-4 mt-3">
                  <UsageBar label="CPU Usage" value={34} max={100} unit="%" />
                  <UsageBar label="GPU Usage" value={61} max={100} unit="%" />
                  <UsageBar label="Memory" value={12.4} max={32} unit=" GB" />
                  <UsageBar label="Storage" value={1.8} max={10} unit=" TB" />
                  <UsageBar label="Camera Connections" value={12} max={16} unit="" />
                  <UsageBar label="Processing Queue" value={3} max={50} unit=" jobs" />
                </div>
              </Card>

              <Card className="p-6">
                <p className="font-semibold text-[#20211F] mb-4">Camera Connection Health</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Online', value: 12, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Warning', value: 2, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Offline', value: 2, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'AI Active', value: 11, color: 'text-blue-600', bg: 'bg-blue-50' },
                  ].map((item) => (
                    <div key={item.label} className={cn('rounded-xl p-4 text-center', item.bg)}>
                      <p className={cn('text-2xl font-bold font-tabular', item.color)}>{item.value}</p>
                      <p className="text-xs text-[#777A73] mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Default content for sections without specific implementation */}
          {!['general', 'ai', 'notifications', 'identity', 'security', 'retention', 'integrations', 'system'].includes(activeSection) && (
            <Card className="p-6">
              <p className="text-sm text-[#777A73]">Settings for <strong>{section?.label}</strong> are available here.</p>
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#F0F1ED] last:border-0">
                    <div>
                      <div className="h-3 bg-[#F0F1ED] rounded w-40 mb-1" />
                      <div className="h-2 bg-[#F5F6F2] rounded w-56" />
                    </div>
                    <div className="h-6 w-12 bg-[#F0F1ED] rounded-full" />
                  </div>
                ))}
              </div>
              <Button onClick={handleSave} className="mt-4">Save Settings</Button>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
