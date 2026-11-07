import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Organization, Incident, Camera, Task, AppNotification, User
} from '../types';
import {
  organizations as mockOrgs,
  incidents as mockIncidents,
  cameras as mockCameras,
  tasks as mockTasks,
  notifications as mockNotifications,
  currentUser as mockCurrentUser,
} from '../data/mockData';

interface AppState {
  // Organization context
  currentOrgId: string;
  organizations: Organization[];
  setCurrentOrg: (orgId: string) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Incidents
  incidents: Incident[];
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  addIncidentNote: (incidentId: string, content: string, authorName: string) => void;
  assignIncident: (incidentId: string, userId: string, userName: string) => void;

  // Cameras
  cameras: Camera[];
  updateCameraAI: (id: string, enabled: boolean) => void;

  // Tasks
  tasks: Task[];
  updateTaskStatus: (id: string, status: Task['status']) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  // Current user
  currentUser: User;

  // Toast
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Organization
      currentOrgId: 'org-1',
      organizations: mockOrgs,
      setCurrentOrg: (orgId) => set({ currentOrgId: orgId }),

      // Sidebar
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Incidents
      incidents: mockIncidents,
      updateIncidentStatus: (id, status) =>
        set((s) => ({
          incidents: s.incidents.map((inc) =>
            inc.id === id ? { ...inc, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : inc.resolvedAt } : inc
          ),
        })),
      addIncidentNote: (incidentId, content, authorName) =>
        set((s) => ({
          incidents: s.incidents.map((inc) =>
            inc.id === incidentId
              ? {
                  ...inc,
                  notes: [
                    ...(inc.notes || []),
                    {
                      id: `note-${Date.now()}`,
                      incidentId,
                      authorId: s.currentUser.id,
                      authorName,
                      content,
                      createdAt: new Date().toISOString(),
                      type: 'investigator_note' as const,
                    },
                  ],
                }
              : inc
          ),
        })),
      assignIncident: (incidentId, userId, userName) =>
        set((s) => ({
          incidents: s.incidents.map((inc) =>
            inc.id === incidentId ? { ...inc, assignedTo: userId, assignedToName: userName } : inc
          ),
        })),

      // Cameras
      cameras: mockCameras,
      updateCameraAI: (id, enabled) =>
        set((s) => ({
          cameras: s.cameras.map((cam) =>
            cam.id === id ? { ...cam, aiEnabled: enabled, aiStatus: enabled ? 'processing' : 'disabled' } : cam
          ),
        })),

      // Tasks
      tasks: mockTasks,
      updateTaskStatus: (id, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status, completedAt: status === 'completed' ? new Date().toISOString() : t.completedAt } : t
          ),
        })),
      addTask: (task) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { ...task, id: `task-${Date.now()}`, createdAt: new Date().toISOString() },
          ],
        })),

      // Notifications
      notifications: mockNotifications,
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          unreadCount: Math.max(0, s.unreadCount - 1),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),
      unreadCount: mockNotifications.filter((n) => !n.isRead).length,

      // Current user
      currentUser: mockCurrentUser,

      // Toast
      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}`;
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        const duration = toast.duration ?? 4000;
        if (duration > 0) {
          setTimeout(() => get().removeToast(id), duration);
        }
      },
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'ecox-watch-state',
      partialize: (state) => ({
        currentOrgId: state.currentOrgId,
        sidebarCollapsed: state.sidebarCollapsed,
        incidents: state.incidents,
        tasks: state.tasks,
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
