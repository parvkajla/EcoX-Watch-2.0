import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckSquare, Plus, Search, Filter, AlertTriangle,
  User, MapPin, Calendar, Clock, ChevronDown, Eye
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { users } from '../data/mockData';
import type { Task, TaskStatus, TaskPriority } from '../types';
import {
  formatDate, formatRelative, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS,
  getTaskStatusColor, getTaskPriorityColor, cn
} from '../utils';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

type TabKey = TaskStatus | 'all';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All Tasks' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

interface AddTaskForm {
  title: string;
  description: string;
  assignedTo: string;
  priority: TaskPriority;
  dueDate: string;
  location: string;
}

const defaultTaskForm: AddTaskForm = {
  title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', location: '',
};

export default function Tasks() {
  const { tasks, updateTaskStatus, addTask, addToast, currentOrgId, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<TabKey>('all');
  const [search, setSearch] = React.useState('');
  const [filterPriority, setFilterPriority] = React.useState<string>('all');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState<AddTaskForm>(defaultTaskForm);
  const [expandedTask, setExpandedTask] = React.useState<string | null>(null);

  const orgUsers = users.filter((u) => u.orgId === currentOrgId && u.role !== 'super_admin');

  const filtered = tasks.filter((t) => {
    const matchTab = activeTab === 'all' || t.status === activeTab;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedToName.toLowerCase().includes(search.toLowerCase()) ||
      (t.location ?? '').toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchTab && matchSearch && matchPriority;
  });

  const counts: Record<TabKey, number> = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    cancelled: tasks.filter((t) => t.status === 'cancelled').length,
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
    addToast({ type: 'success', title: 'Task Updated', message: `Status changed to ${TASK_STATUS_LABELS[status]}.` });
  };

  const handleAddTask = () => {
    if (!form.title || !form.assignedTo) return;
    const assignedUser = users.find((u) => u.id === form.assignedTo);
    addTask({
      title: form.title,
      description: form.description,
      assignedTo: form.assignedTo,
      assignedToName: assignedUser?.name ?? '',
      assignedBy: currentUser.id,
      assignedByName: currentUser.name,
      siteId: 'site-1',
      siteName: 'Andheri Ward K-West',
      status: 'pending',
      priority: form.priority,
      dueDate: form.dueDate,
      location: form.location,
    });
    addToast({ type: 'success', title: 'Task Created', message: `"${form.title}" has been assigned.` });
    setModalOpen(false);
    setForm(defaultTaskForm);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#20211F]">Task Management</h1>
          <p className="text-sm text-[#777A73] mt-1">Assign and track field tasks for sanitation teams</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={15} />
          New Task
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Pending', value: counts.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'In Progress', value: counts.in_progress, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', value: counts.completed, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Tasks', value: counts.all, color: 'text-[#20211F]', bg: 'bg-[#F5F6F2]' },
        ].map((item) => (
          <Card key={item.label} className="p-4">
            <p className={`text-2xl font-bold font-tabular ${item.color}`}>{item.value}</p>
            <p className="text-xs text-[#777A73] mt-0.5">{item.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs + Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-1 bg-[#F5F6F2] rounded-xl p-1 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors relative',
                activeTab === tab.key ? 'bg-white text-[#20211F] shadow-sm' : 'text-[#777A73] hover:text-[#20211F]'
              )}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={cn('ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full', activeTab === tab.key ? 'bg-[#F0F1ED] text-[#20211F]' : 'bg-white text-[#777A73]')}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A8ABA3]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..."
              className="pl-8 pr-3 h-9 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] placeholder-[#A8ABA3] focus:outline-none focus:ring-2 focus:ring-[#C8F169] w-48" />
          </div>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
            <option value="all">All Priorities</option>
            {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((p) => (
              <option key={p} value={p}>{TASK_PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15, delay: i * 0.03 }}
            >
              <Card className="overflow-hidden hover:border-[#D4D7CF] transition-colors">
                <div
                  className="flex items-start gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                >
                  {/* Priority dot */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={cn('w-2.5 h-2.5 rounded-full', task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-400')} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-[#20211F]">{task.title}</p>
                          {task.incidentId && (
                            <Link
                              to={`/incidents/${task.incidentId}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
                            >
                              <AlertTriangle size={8} />
                              {task.incidentId.toUpperCase()}
                            </Link>
                          )}
                        </div>
                        <p className="text-xs text-[#777A73] mt-0.5 line-clamp-1">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', getTaskStatusColor(task.status))}>
                          {TASK_STATUS_LABELS[task.status]}
                        </span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium capitalize', getTaskPriorityColor(task.priority))}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-[#777A73]">
                      <div className="flex items-center gap-1">
                        <User size={11} />
                        <span>{task.assignedToName}</span>
                      </div>
                      {task.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={11} />
                          <span>{task.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar size={11} />
                        <span>Due {task.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{formatRelative(task.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronDown size={14} className={cn('text-[#A8ABA3] flex-shrink-0 transition-transform mt-1', expandedTask === task.id && 'rotate-180')} />
                </div>

                {/* Expanded section */}
                <AnimatePresence>
                  {expandedTask === task.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-[#F0F1ED]">
                        <div className="pt-3 space-y-3">
                          {task.notes && (
                            <div className="bg-[#F5F6F2] rounded-lg p-3">
                              <p className="text-xs text-[#777A73] font-semibold mb-1">Notes</p>
                              <p className="text-sm text-[#20211F]">{task.notes}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs text-[#777A73] font-semibold">Update Status:</p>
                            {(['pending', 'in_progress', 'completed', 'cancelled'] as TaskStatus[]).map((s) => (
                              <button
                                key={s}
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, s); }}
                                disabled={task.status === s}
                                className={cn(
                                  'text-xs px-2.5 py-1 rounded-full border font-medium transition-all',
                                  task.status === s ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105',
                                  getTaskStatusColor(s)
                                )}
                              >
                                {TASK_STATUS_LABELS[s]}
                              </button>
                            ))}
                          </div>
                          {task.completedAt && (
                            <p className="text-xs text-green-600">Completed {formatRelative(task.completedAt)}</p>
                          )}
                          <p className="text-xs text-[#A8ABA3]">Assigned by {task.assignedByName} · Created {formatDate(task.createdAt)}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <CheckSquare size={40} className="text-[#D4D7CF]" />
            <p className="text-sm text-[#777A73]">No tasks match your current filters</p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Task">
        <div className="space-y-4 p-1">
          <Input label="Task Title *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Investigate garbage dumping at..." />
          <div>
            <label className="block text-xs font-medium text-[#20211F] mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe what needs to be done..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] placeholder-[#A8ABA3] focus:outline-none focus:ring-2 focus:ring-[#C8F169] resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#20211F] mb-1.5">Assign To *</label>
              <select value={form.assignedTo} onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
                <option value="">Select person...</option>
                {orgUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#20211F] mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                className="w-full h-10 px-3 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#C8F169]">
                {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((p) => <option key={p} value={p}>{TASK_PRIORITY_LABELS[p]}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            <Input label="Location (optional)" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. North Gate Area" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAddTask} disabled={!form.title || !form.assignedTo}>Create Task</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
