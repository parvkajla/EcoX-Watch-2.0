import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCog, Plus, Search, Shield, Mail, Phone,
  Building2, Clock, Edit, MoreVertical, CheckCircle,
  XCircle, AlertCircle, Eye
} from 'lucide-react';
import { users as mockUsers, organizations } from '../data/mockData';
import { useAppStore } from '../store/appStore';
import type { User, UserRole, UserStatus } from '../types';
import { formatRelative, USER_ROLE_LABELS, cn } from '../utils';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: 'Full platform access across all organizations',
  org_admin: 'Full access within their organization',
  operator: 'Monitor cameras and incidents',
  investigator: 'Review and investigate incidents',
  field_officer: 'Receive and complete field tasks',
  viewer: 'Read-only access to dashboards',
};

const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-red-50 text-red-700 border-red-200',
  org_admin: 'bg-purple-50 text-purple-700 border-purple-200',
  operator: 'bg-blue-50 text-blue-700 border-blue-200',
  investigator: 'bg-amber-50 text-amber-700 border-amber-200',
  field_officer: 'bg-green-50 text-green-700 border-green-200',
  viewer: 'bg-gray-100 text-gray-600 border-gray-200',
};

interface AddUserForm {
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  phone: string;
  department: string;
}

const defaultUserForm: AddUserForm = {
  name: '', email: '', role: 'operator', orgId: 'org-1', phone: '', department: '',
};

export default function Users() {
  const { currentOrgId, addToast } = useAppStore();
  const [localUsers, setLocalUsers] = React.useState(mockUsers);
  const [search, setSearch] = React.useState('');
  const [filterRole, setFilterRole] = React.useState<string>('all');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [filterOrg, setFilterOrg] = React.useState<string>('all');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState<AddUserForm>(defaultUserForm);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [activeMenuUser, setActiveMenuUser] = React.useState<string | null>(null);

  const filtered = localUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    const matchOrg = filterOrg === 'all' || u.orgId === filterOrg;
    return matchSearch && matchRole && matchStatus && matchOrg;
  });

  const handleAddUser = () => {
    if (!form.name || !form.email) return;
    const org = organizations.find((o) => o.id === form.orgId);
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: form.name,
      email: form.email,
      role: form.role,
      orgId: form.orgId,
      orgName: org?.name ?? '',
      siteIds: [],
      status: 'active',
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString().split('T')[0],
      phone: form.phone,
      department: form.department,
    };
    setLocalUsers((prev) => [...prev, newUser]);
    addToast({ type: 'success', title: 'User Added', message: `${form.name} has been added to the platform.` });
    setModalOpen(false);
    setForm(defaultUserForm);
  };

  const handleStatusToggle = (userId: string, currentStatus: UserStatus) => {
    const newStatus: UserStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setLocalUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
    addToast({ type: 'info', title: 'User Status Updated', message: `User has been ${newStatus}.` });
    setActiveMenuUser(null);
  };

  const usersByRole = Object.keys(USER_ROLE_LABELS).reduce((acc, role) => {
    acc[role] = localUsers.filter((u) => u.role === role).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#20211F]">Users & Access Management</h1>
          <p className="text-sm text-[#777A73] mt-1">Manage platform users, roles, and permissions</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={15} />
          Add User
        </Button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.entries(USER_ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => (
          <button
            key={role}
            onClick={() => setFilterRole(filterRole === role ? 'all' : role)}
            className={cn('card p-3 text-left transition-all', filterRole === role ? 'ring-2 ring-[#252622]' : 'hover:border-[#D4D7CF]')}
          >
            <p className="text-lg font-bold font-tabular text-[#20211F]">{usersByRole[role] ?? 0}</p>
            <p className="text-[10px] text-[#777A73] mt-0.5 leading-tight">{label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8ABA3]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full pl-9 pr-3 h-9 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] placeholder-[#A8ABA3] focus:outline-none focus:ring-2 focus:ring-[#C8F169]" />
        </div>
        <select value={filterOrg} onChange={(e) => setFilterOrg(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none">
          <option value="all">All Organizations</option>
          {organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <span className="text-xs text-[#777A73] ml-auto">{filtered.length} users</span>
      </div>

      {/* Users table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E7E9E3]">
                {['User', 'Role', 'Organization', 'Status', 'Last Active', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#A8ABA3] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F1ED]">
              {filtered.map((user) => (
                <tr key={user.id} className="table-row-hover">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#252622] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#C8F169]">
                          {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#20211F]">{user.name}</p>
                        <p className="text-xs text-[#A8ABA3]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', ROLE_COLORS[user.role])}>
                      {USER_ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[#20211F]">{user.orgName}</p>
                    {user.department && <p className="text-xs text-[#A8ABA3]">{user.department}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={cn('w-2 h-2 rounded-full', user.status === 'active' ? 'bg-green-500' : user.status === 'suspended' ? 'bg-red-500' : 'bg-gray-400')} />
                      <span className={cn('text-xs capitalize', user.status === 'active' ? 'text-green-700' : user.status === 'suspended' ? 'text-red-700' : 'text-[#777A73]')}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[#777A73]">{formatRelative(user.lastActive)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 relative">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 rounded-lg hover:bg-[#F5F6F2] text-[#777A73] transition-colors"
                        title="View details"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => setActiveMenuUser(activeMenuUser === user.id ? null : user.id)}
                        className="p-1.5 rounded-lg hover:bg-[#F5F6F2] text-[#777A73] transition-colors"
                      >
                        <MoreVertical size={13} />
                      </button>
                      <AnimatePresence>
                        {activeMenuUser === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-8 z-20 bg-white border border-[#E7E9E3] rounded-xl shadow-xl py-1 min-w-[140px]"
                          >
                            <button
                              onClick={() => handleStatusToggle(user.id, user.status)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-[#F5F6F2] transition-colors text-[#20211F]"
                            >
                              {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                            </button>
                            <button className="w-full text-left px-3 py-2 text-xs hover:bg-[#F5F6F2] transition-colors text-[#20211F]">
                              Edit User
                            </button>
                            <button className="w-full text-left px-3 py-2 text-xs hover:bg-[#F5F6F2] transition-colors text-red-600">
                              Remove
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <UserCog size={36} className="text-[#D4D7CF]" />
              <p className="text-sm text-[#777A73]">No users match your filters</p>
            </div>
          )}
        </div>
      </Card>

      {/* Role permissions reference */}
      <Card className="p-6">
        <p className="font-semibold text-[#20211F] mb-4">Role & Permission Reference</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.entries(USER_ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => (
            <div key={role} className="flex items-start gap-3 p-3 bg-[#F5F6F2] rounded-xl">
              <Shield size={14} className="text-[#777A73] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#20211F]">{label}</p>
                <p className="text-xs text-[#777A73] mt-0.5">{ROLE_DESCRIPTIONS[role]}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* User Detail Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
        {selectedUser && (
          <div className="space-y-4 p-1">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#252622] flex items-center justify-center">
                <span className="text-xl font-bold text-[#C8F169]">
                  {selectedUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-display font-bold text-lg text-[#20211F]">{selectedUser.name}</p>
                <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', ROLE_COLORS[selectedUser.role])}>
                  {USER_ROLE_LABELS[selectedUser.role]}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { icon: Mail, label: 'Email', value: selectedUser.email },
                { icon: Phone, label: 'Phone', value: selectedUser.phone ?? 'Not provided' },
                { icon: Building2, label: 'Organization', value: selectedUser.orgName },
                { icon: Shield, label: 'Department', value: selectedUser.department ?? 'Not assigned' },
                { icon: Clock, label: 'Last Active', value: formatRelative(selectedUser.lastActive) },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 py-2 border-b border-[#F0F1ED]">
                  <item.icon size={14} className="text-[#A8ABA3] flex-shrink-0" />
                  <span className="text-sm text-[#777A73] w-24">{item.label}</span>
                  <span className="text-sm text-[#20211F] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#A8ABA3]">Role: {ROLE_DESCRIPTIONS[selectedUser.role]}</p>
          </div>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setForm(defaultUserForm); }} title="Add New User">
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Full Name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. John Doe" />
            </div>
            <div className="col-span-2">
              <Input label="Email Address *" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#20211F] mb-1.5">Role *</label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
                {(Object.entries(USER_ROLE_LABELS) as [UserRole, string][]).filter(([r]) => r !== 'super_admin').map(([r, l]) => (
                  <option key={r} value={r}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#20211F] mb-1.5">Organization *</label>
              <select value={form.orgId} onChange={(e) => setForm((f) => ({ ...f, orgId: e.target.value }))}
                className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
                {organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
            <Input label="Department (optional)" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} placeholder="e.g. Enforcement" />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700">An invite email would be sent to the user in the live system. This is a demo environment.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAddUser} disabled={!form.name || !form.email}>Add User</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
