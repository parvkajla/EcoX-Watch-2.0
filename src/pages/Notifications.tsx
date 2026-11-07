import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bell, Check, CheckCheck, Filter, AlertTriangle,
  Camera, BellOff, Settings, Cpu, ClipboardList, Info
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { NOTIFICATION_TYPE_LABELS, getNotificationTypeColor, formatRelative, cn } from '../utils';
import type { NotificationType } from '../types';
import { Card } from '../components/ui/Card';

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  incident_alert: AlertTriangle,
  critical_alert: AlertTriangle,
  camera_offline: Camera,
  processing_failure: Cpu,
  task_assigned: ClipboardList,
  investigation_update: CheckCheck,
  system: Info,
};

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount, addToast } = useAppStore();
  const [filterType, setFilterType] = React.useState<string>('all');
  const [filterRead, setFilterRead] = React.useState<string>('all');

  const filtered = notifications.filter((n) => {
    const matchType = filterType === 'all' || n.type === filterType;
    const matchRead = filterRead === 'all' ||
      (filterRead === 'unread' && !n.isRead) ||
      (filterRead === 'read' && n.isRead);
    return matchType && matchRead;
  });

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    addToast({ type: 'success', title: 'All Marked as Read', message: 'All notifications have been marked as read.' });
  };

  const notifTypes: NotificationType[] = [
    'incident_alert', 'critical_alert', 'camera_offline',
    'processing_failure', 'task_assigned', 'investigation_update', 'system'
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#20211F]">Notifications</h1>
          <p className="text-sm text-[#777A73] mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[#E7E9E3] rounded-lg hover:bg-[#F5F6F2] transition-colors text-[#777A73]"
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
          <Link
            to="/settings"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[#E7E9E3] rounded-lg hover:bg-[#F5F6F2] transition-colors text-[#777A73]"
          >
            <Settings size={13} />
            Preferences
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-[#F5F6F2] rounded-lg p-0.5">
          {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilterRead(val)}
              className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', filterRead === val ? 'bg-white text-[#20211F] shadow-sm' : 'text-[#777A73] hover:text-[#20211F]')}
            >
              {label}
              {val === 'unread' && unreadCount > 0 && (
                <span className="ml-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]"
        >
          <option value="all">All Types</option>
          {notifTypes.map((t) => <option key={t} value={t}>{NOTIFICATION_TYPE_LABELS[t]}</option>)}
        </select>
        <span className="text-xs text-[#777A73] ml-auto">{filtered.length} notifications</span>
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((notif, i) => {
            const Icon = TYPE_ICONS[notif.type];
            const iconColors = getNotificationTypeColor(notif.type);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, margin: 0 }}
                transition={{ duration: 0.15, delay: i * 0.02 }}
              >
                <div
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group',
                    notif.isRead
                      ? 'bg-white border-[#E7E9E3] hover:border-[#D4D7CF]'
                      : 'bg-white border-[#252622]/10 shadow-sm ring-1 ring-[#252622]/5'
                  )}
                  onClick={() => !notif.isRead && markNotificationRead(notif.id)}
                >
                  {/* Unread indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#252622]" />
                    )}
                    {notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-transparent border border-[#D4D7CF]" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', iconColors)}>
                    <Icon size={15} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className={cn('text-sm font-semibold', notif.isRead ? 'text-[#20211F]' : 'text-[#20211F]')}>{notif.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-[#A8ABA3]">{formatRelative(notif.timestamp)}</span>
                        {!notif.isRead && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markNotificationRead(notif.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#F5F6F2] transition-all text-[#777A73]"
                            title="Mark as read"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[#777A73] mt-1">{notif.message}</p>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-[#252622] font-medium hover:underline mt-1.5 inline-block"
                      >
                        View →
                      </Link>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', iconColors)}>
                        {NOTIFICATION_TYPE_LABELS[notif.type]}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <BellOff size={40} className="text-[#D4D7CF]" />
            <p className="text-[#777A73] text-sm">No notifications match your filters</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
