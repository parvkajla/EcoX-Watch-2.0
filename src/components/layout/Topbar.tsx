import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, Search, Bell, HelpCircle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../utils';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/monitoring': 'Live Monitoring',
  '/incidents': 'Incident Center',
  '/evidence': 'Evidence Center',
  '/people': 'People Management',
  '/vehicles': 'Vehicle Management',
  '/map': 'Geographic Operations',
  '/zones': 'Authorized Zones',
  '/cameras': 'Camera Management',
  '/analytics': 'Analytics & Reports',
  '/tasks': 'Task Management',
  '/organization': 'Organization',
  '/users': 'Users & Access',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

interface TopbarProps {
  sidebarCollapsed: boolean;
}

export function Topbar({ sidebarCollapsed }: TopbarProps) {
  const { toggleSidebar, unreadCount, notifications, currentOrgId, organizations } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchRef = React.useRef<HTMLInputElement>(null);

  const currentOrg = organizations.find((o) => o.id === currentOrgId) ?? organizations[0];

  const pathParts = location.pathname.split('/').filter(Boolean);
  const primaryPath = '/' + (pathParts[0] ?? '');
  const pageLabel = routeLabels[primaryPath] ?? 'EcoX Watch';
  const isDetail = pathParts.length > 1;
  const parentLabel = routeLabels[primaryPath];

  React.useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className="fixed top-0 right-0 z-30 bg-white border-b border-[#E7E9E3] flex items-center justify-between px-5 transition-all duration-200"
      style={{
        left: sidebarCollapsed ? 64 : 240,
        height: 58,
      }}
    >
      {/* Left: toggle + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-[#777A73] hover:bg-[#F5F6F2] hover:text-[#20211F] transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#777A73] hover:text-[#20211F] transition-colors font-medium"
          >
            EcoX Watch
          </button>
          {isDetail ? (
            <>
              <ChevronRight size={12} className="text-[#A8ABA3]" />
              <button
                onClick={() => navigate(primaryPath)}
                className="text-[#777A73] hover:text-[#20211F] transition-colors font-medium"
              >
                {parentLabel}
              </button>
              <ChevronRight size={12} className="text-[#A8ABA3]" />
              <span className="text-[#20211F] font-semibold">Detail</span>
            </>
          ) : pathParts.length > 0 ? (
            <>
              <ChevronRight size={12} className="text-[#A8ABA3]" />
              <span className="text-[#20211F] font-semibold">{pageLabel}</span>
            </>
          ) : null}
        </nav>
      </div>

      {/* Right: search + context + notifs */}
      <div className="flex items-center gap-2">
        {/* Org context pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F6F2] rounded-lg border border-[#E7E9E3]">
          <div className="w-4 h-4 bg-[#252622] rounded flex items-center justify-center">
            <span className="text-[8px] font-bold text-[#C8F169]">{currentOrg.logoInitials[0]}</span>
          </div>
          <span className="text-xs font-medium text-[#20211F]">{currentOrg.name}</span>
        </div>

        {/* Search */}
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center">
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incidents, cameras..."
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                className="w-52 h-8 text-sm bg-[#F5F6F2] border border-[#E7E9E3] rounded-lg px-3 text-[#20211F] placeholder-[#A8ABA3] focus:outline-none focus:ring-2 focus:ring-[#C8F169]"
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 h-8 bg-[#F5F6F2] border border-[#E7E9E3] rounded-lg text-xs text-[#A8ABA3] hover:border-[#D4D7CF] transition-colors"
            >
              <Search size={12} />
              <span className="hidden sm:block">Search</span>
              <kbd className="hidden sm:block text-[9px] bg-white border border-[#E7E9E3] px-1 rounded font-mono">⌘K</kbd>
            </button>
          )}
        </div>

        {/* Help */}
        <button
          className="p-1.5 rounded-lg text-[#777A73] hover:bg-[#F5F6F2] hover:text-[#20211F] transition-colors"
          title="Help & Support"
        >
          <HelpCircle size={16} />
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-1.5 rounded-lg text-[#777A73] hover:bg-[#F5F6F2] hover:text-[#20211F] transition-colors"
          title="Notifications"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Live status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-medium text-green-700">System Live</span>
        </div>
      </div>
    </header>
  );
}
