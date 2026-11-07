import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Monitor, AlertTriangle, Users, Car,
  FileVideo, Map, Shield, Camera, BarChart3, CheckSquare,
  Building2, UserCog, Bell, Settings, ChevronRight,
  ChevronDown, LogOut, Eye,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../utils';

const navItems = [
  { label: 'Overview', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/monitoring', icon: Monitor, label: 'Live Monitoring' },
  ]},
  { label: 'Incidents', items: [
    { to: '/incidents', icon: AlertTriangle, label: 'Incident Center' },
    { to: '/evidence', icon: FileVideo, label: 'Evidence' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  ]},
  { label: 'Tracking', items: [
    { to: '/people', icon: Users, label: 'People' },
    { to: '/vehicles', icon: Car, label: 'Vehicles' },
  ]},
  { label: 'Operations', items: [
    { to: '/map', icon: Map, label: 'Geographic Ops' },
    { to: '/zones', icon: Shield, label: 'Authorized Zones' },
    { to: '/cameras', icon: Camera, label: 'Camera Management' },
  ]},
  { label: 'Administration', items: [
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/organization', icon: Building2, label: 'Organization' },
    { to: '/users', icon: UserCog, label: 'Users & Access' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]},
];

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const { currentOrgId, organizations, setCurrentOrg, currentUser } = useAppStore();
  const currentOrg = organizations.find((o) => o.id === currentOrgId) ?? organizations[0];
  const [orgMenuOpen, setOrgMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-[#E7E9E3] flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className={cn('flex items-center h-[58px] border-b border-[#E7E9E3] flex-shrink-0', collapsed ? 'justify-center px-0' : 'px-4 gap-2.5')}>
        <div className="w-8 h-8 bg-[#252622] rounded-lg flex items-center justify-center flex-shrink-0">
          <Eye size={16} className="text-[#C8F169]" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <span className="font-display font-bold text-sm text-[#20211F] whitespace-nowrap">EcoX Watch</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Org Selector */}
      {!collapsed && (
        <div className="px-3 py-2.5 border-b border-[#E7E9E3] flex-shrink-0">
          <button
            onClick={() => setOrgMenuOpen((v) => !v)}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F5F6F2] transition-colors text-left"
          >
            <div className="w-7 h-7 bg-[#F0F1ED] rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-[#20211F]">{currentOrg.logoInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#20211F] truncate">{currentOrg.name}</p>
              <p className="text-[10px] text-[#777A73] capitalize">{currentOrg.type}</p>
            </div>
            <ChevronDown size={12} className={cn('text-[#777A73] transition-transform', orgMenuOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {orgMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="mt-1 overflow-hidden"
              >
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => { setCurrentOrg(org.id); setOrgMenuOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors',
                      org.id === currentOrgId
                        ? 'bg-[#F5F6F2] text-[#20211F]'
                        : 'text-[#777A73] hover:bg-[#F5F6F2] hover:text-[#20211F]'
                    )}
                  >
                    <div className="w-5 h-5 bg-[#E9ECE6] rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] font-bold text-[#20211F]">{org.logoInitials}</span>
                    </div>
                    <span className="text-xs truncate">{org.name}</span>
                    {org.id === currentOrgId && <div className="w-1.5 h-1.5 rounded-full bg-[#C8F169] ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map((section) => (
          <div key={section.label} className="mb-1">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-[#A8ABA3] uppercase tracking-wider px-2 py-1.5 mt-2">
                {section.label}
              </p>
            )}
            {collapsed && <div className="my-1 mx-2 h-px bg-[#E7E9E3]" />}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all duration-100 text-sm font-medium group',
                    collapsed ? 'justify-center' : '',
                    isActive
                      ? 'bg-[#252622] text-white'
                      : 'text-[#777A73] hover:bg-[#F5F6F2] hover:text-[#20211F]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={15} className="flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && isActive && <ChevronRight size={12} className="ml-auto flex-shrink-0 text-[#C8F169]" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-[#E7E9E3] flex-shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F5F6F2] transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-[#252622] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-[#C8F169]">
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#20211F] truncate">{currentUser.name}</p>
              <p className="text-[10px] text-[#777A73] truncate">{currentUser.email}</p>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="p-1 rounded text-[#A8ABA3] hover:text-[#20211F] transition-colors"
              title="Settings"
            >
              <LogOut size={12} />
            </button>
          </div>
        </div>
      )}
    </motion.aside>
  );
}

// Need to import React for useState
import React from 'react';
