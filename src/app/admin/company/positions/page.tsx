'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { positionStore, Position } from '@/lib/stores/PositionStore';
import { customerStore, Customer } from '@/lib/stores/CustomerStore';
import { staffStore } from '@/lib/stores/StaffStore';
import { useSession } from 'next-auth/react';
import { 
  HiSearch, 
  HiTrash, 
  HiPencil, 
  HiBriefcase, 
  HiPlus, 
  HiCurrencyDollar, 
  HiStar, 
  HiUserGroup, 
  HiInformationCircle,
  HiEye,
  HiX,
  HiUserAdd,
  HiCheck
} from 'react-icons/hi';
import { useToast } from '@/components/ToastProvider';

const AVAILABLE_ROLES = [
  'General',
  'Blogs',
  'Jobs',
  'Projects',
  'FAQ',
  'Customers',
  'Terms & Conditions',
  'Staffs',
  'Positions',
  'Settings',
  'Email Templates',
  'Notification Templates',
];

const RANK_OPTIONS = [
  'Executive / C-Suite',
  'Director / Head',
  'Lead / Principal',
  'Senior Level',
  'Mid-Level',
  'Junior Level',
  'Intern / Trainee',
];

export default function AdminPositions() {
  const { data: session } = useSession();
  const userStatus = (session?.user as any)?.status;
  const isMainAdmin = userStatus === 'admin';

  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRankFilter, setSelectedRankFilter] = useState('all');

  const { showToast, showConfirm } = useToast();

  // Create / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [formData, setFormData] = useState({
    position: '',
    rank: 'Mid-Level',
    salary: '',
    role: 'General',
    assignCustomerId: '',
  });

  // Assign to Customer Modal State
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignPositionId, setAssignPositionId] = useState('');
  const [assignCustomerId, setAssignCustomerId] = useState('');
  const [assigning, setAssigning] = useState(false);

  // View Role Modal State
  const [viewingPosition, setViewingPosition] = useState<Position | null>(null);

  useEffect(() => {
    fetchPositions();
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await customerStore.getCustomers(1, 100);
      if (res && res.docs) {
        setCustomersList(res.docs);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const data = await positionStore.getPositions();
      setPositions(data);
    } catch (error) {
      showToast('Failed to load positions', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter positions
  const filteredPositions = useMemo(() => {
    return positions.filter(p => {
      const posRole = p.role || p.duties || 'General';
      const matchesSearch = 
        p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
        posRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.salary).includes(searchQuery);

      const matchesRank = selectedRankFilter === 'all' || p.rank.toLowerCase() === selectedRankFilter.toLowerCase();

      return matchesSearch && matchesRank;
    });
  }, [positions, searchQuery, selectedRankFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = positions.length;
    if (total === 0) return { total: 0, avgSalary: 0, maxSalary: 0, uniqueRanks: 0 };
    const salaries = positions.map(p => Number(p.salary) || 0);
    const avg = salaries.reduce((a, b) => a + b, 0) / total;
    const max = Math.max(...salaries);
    const ranks = new Set(positions.map(p => p.rank)).size;
    return { total, avgSalary: Math.round(avg), maxSalary: max, uniqueRanks: ranks };
  }, [positions]);

  const toggleRole = (roleItem: string) => {
    if (roleItem.toLowerCase() === 'general') {
      setFormData({ ...formData, role: 'General' });
      return;
    }

    const currentList = formData.role
      .split(',')
      .map(d => d.trim())
      .filter(d => Boolean(d) && d.toLowerCase() !== 'general');

    const exists = currentList.some(d => d.toLowerCase() === roleItem.toLowerCase());
    let newList: string[];
    if (exists) {
      newList = currentList.filter(d => d.toLowerCase() !== roleItem.toLowerCase());
      if (newList.length === 0) {
        newList = ['General'];
      }
    } else {
      newList = [...currentList, roleItem];
    }
    setFormData({ ...formData, role: newList.join(', ') });
  };

  const handleSelectGeneralRole = () => {
    setFormData({ ...formData, role: 'General' });
  };

  const handleClearRoles = () => {
    setFormData({ ...formData, role: '' });
  };

  const handleOpenCreate = () => {
    setEditingPosition(null);
    setFormData({
      position: '',
      rank: 'Mid-Level',
      salary: '',
      role: 'General',
      assignCustomerId: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (pos: Position) => {
    setEditingPosition(pos);
    setFormData({
      position: pos.position,
      rank: pos.rank,
      salary: String(pos.salary),
      role: pos.role || pos.duties || 'General',
      assignCustomerId: '',
    });
    setShowModal(true);
  };

  const handleOpenAssignModal = (pos?: Position | null) => {
    if (pos?._id) {
      setAssignPositionId(pos._id);
    } else if (positions.length > 0) {
      setAssignPositionId(positions[0]._id || '');
    } else {
      setAssignPositionId('');
    }
    setAssignCustomerId(customersList.length > 0 ? customersList[0]._id : '');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignPositionId || !assignCustomerId) {
      showToast('Please select both a position and a customer', 'warning');
      return;
    }

    const targetPos = positions.find(p => p._id === assignPositionId);
    const targetCust = customersList.find(c => c._id === assignCustomerId);

    if (!targetPos || !targetCust) {
      showToast('Invalid selection', 'error');
      return;
    }

    const targetRole = targetPos.role || targetPos.duties || 'General';
    setAssigning(true);
    try {
      const updated = await staffStore.updateStaff(assignCustomerId, {
        position: targetPos.position,
        role: targetRole,
        duties: targetRole,
        status: 'staff',
      });

      if (updated) {
        showToast(`Assigned "${targetPos.position}" to ${targetCust.name} and promoted to staff!`, 'success');
        setShowAssignModal(false);
        await fetchCustomers();
      } else {
        showToast('Failed to assign position to customer', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error assigning position', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.position.trim() || !formData.role.trim() || !formData.rank || !formData.salary) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    const finalRole = formData.role.trim() || 'General';
    const payload = {
      position: formData.position.trim(),
      role: finalRole,
      duties: finalRole,
      rank: formData.rank.trim(),
      salary: Number(formData.salary),
    };

    setLoading(true);
    try {
      if (editingPosition?._id) {
        await positionStore.updatePosition(editingPosition._id, payload);
        showToast('Position updated successfully!', 'success');
      } else {
        const newPos = await positionStore.createPosition(payload);
        showToast('New position created successfully!', 'success');

        // If customer was selected to assign immediately
        if (formData.assignCustomerId) {
          const targetCust = customersList.find(c => c._id === formData.assignCustomerId);
          if (targetCust) {
            await staffStore.updateStaff(targetCust._id, {
              position: payload.position,
              role: payload.role,
              duties: payload.duties,
              status: 'staff',
            });
            showToast(`Assigned "${payload.position}" to ${targetCust.name} and promoted to staff!`, 'success');
          }
        }
      }
      setShowModal(false);
      setEditingPosition(null);
      await fetchPositions();
      await fetchCustomers();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
      setLoading(false);
    }
  };

  const handleDelete = (pos: Position) => {
    showConfirm({
      title: 'Delete Position',
      message: `Are you sure you want to delete the "${pos.position}" position? This cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete Position',
      onConfirm: async () => {
        setLoading(true);
        const success = await positionStore.deletePosition(pos._id!);
        if (success) {
          showToast('Position deleted successfully', 'success');
          await fetchPositions();
        } else {
          showToast('Failed to delete position', 'error');
          setLoading(false);
        }
      }
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getRankBadgeClass = (rank: string) => {
    const r = rank.toLowerCase();
    if (r.includes('executive') || r.includes('c-suite') || r.includes('director')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (r.includes('lead') || r.includes('principal')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    if (r.includes('senior')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (r.includes('mid')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (r.includes('junior')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Positions Management</h1>
            <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Active Positions
            </span>
          </div>
          <p className="text-slate-500 font-medium font-inter mt-1">
            Configure company job positions, staff roles, organizational ranks, and salary scales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenAssignModal(null)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-3.5 rounded-2xl font-bold transition-all shadow-lg cursor-pointer flex-shrink-0"
            title="Assign Position to a Customer"
          >
            <HiUserAdd className="text-xl text-primary" />
            <span>Assign to Customer</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer flex-shrink-0"
            title="Create a new Position"
          >
            <HiPlus className="text-xl" />
            <span>Create Position</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            <HiBriefcase />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Positions</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            <HiCurrencyDollar />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Salary</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{formatCurrency(stats.avgSalary)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            <HiStar />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Compensation</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{formatCurrency(stats.maxSalary)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            <HiUserGroup />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Ranks</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.uniqueRanks}</p>
          </div>
        </div>
      </div>

      {/* Control Panel (Search & Filter) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Search by position title, rank, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-primary transition-all text-slate-800 font-medium"
          />
        </div>

        {/* Rank Filter */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Rank:</label>
          <select
            value={selectedRankFilter}
            onChange={(e) => setSelectedRankFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">All Ranks</option>
            {RANK_OPTIONS.map((rank) => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-5 px-6 w-20">S/N</th>
                <th className="py-5 px-6">Position Title</th>
                <th className="py-5 px-6">Rank Level</th>
                <th className="py-5 px-6">Salary (Annual / Standard)</th>
                <th className="py-5 px-6">Staff Role & Access</th>
                <th className="py-5 px-6">Created Date</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {loading && positions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold">
                    Loading positions directory...
                  </td>
                </tr>
              ) : filteredPositions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <HiBriefcase className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-800">No positions found</p>
                    <p className="text-sm text-slate-400 mt-1 mb-5">
                      {searchQuery ? 'Try adjusting your search query or filter.' : 'Get started by creating your company\'s first job position.'}
                    </p>
                    <button
                      onClick={handleOpenCreate}
                      className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 cursor-pointer"
                    >
                      <HiPlus className="text-lg" />
                      <span>Create Position</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredPositions.map((pos, index) => {
                  const posRole = (pos.role || pos.duties || 'General').trim();
                  const roleTokens = posRole.split(',').map(d => d.trim()).filter(Boolean);
                  const isGeneral = roleTokens.some(r => r.toLowerCase() === 'general') || posRole.toLowerCase() === 'general';

                  return (
                    <tr key={pos._id || index} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4.5 px-6">
                        <span className="text-slate-400 font-bold">#{index + 1}</span>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                            <HiBriefcase />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{pos.position}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Role ID: {pos._id?.substring(pos._id.length - 6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getRankBadgeClass(pos.rank)}`}>
                          {pos.rank}
                        </span>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="font-black text-slate-900 flex items-center gap-1">
                          <span className="text-primary font-bold">{formatCurrency(pos.salary)}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 max-w-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-wrap items-center gap-1.5 flex-1">
                            {isGeneral ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                                <HiCheck className="text-sm text-emerald-600" />
                                General (All Pages)
                              </span>
                            ) : roleTokens.length === 0 ? (
                              <span className="text-slate-400 text-xs italic">No specific role</span>
                            ) : (
                              roleTokens.map((r, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20"
                                >
                                  {r}
                                </span>
                              ))
                            )}
                          </div>
                          <button
                            onClick={() => setViewingPosition(pos)}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                            title="View Full Role Permissions"
                          >
                            <HiEye className="text-base" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-500 text-xs">
                        {pos.createdAt ? new Date(pos.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '—'}
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAssignModal(pos)}
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                            title="Assign to Customer"
                          >
                            <HiUserAdd className="text-lg text-emerald-500" />
                            <span className="hidden xl:inline text-[11px]">Assign</span>
                          </button>
                          <button
                            onClick={() => handleOpenEdit(pos)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer"
                            title="Edit Position"
                          >
                            <HiPencil className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(pos)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete Position"
                          >
                            <HiTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingPosition ? 'Edit Job Position' : 'Create New Position'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingPosition ? 'Update staff role permissions, rank level, and compensation' : 'Add a new company position with designated role permissions'}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-200/50 cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Position Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full-Stack Engineer"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Rank / Seniority Level *</label>
                  <select
                    required
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 cursor-pointer"
                  >
                    {RANK_OPTIONS.map((rank) => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                    <option value="Custom">Other (Custom Rank)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Salary (USD / Standard) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="100"
                      placeholder="e.g. 75000"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Role Selector & Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Staff Role (Page Access Permissions) *</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectGeneralRole}
                      className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <HiCheck className="text-sm" />
                      General (Full Access)
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleClearRoles}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Clickable Role Chips */}
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {AVAILABLE_ROLES.map((roleItem) => {
                    const isGeneral = roleItem.toLowerCase() === 'general';
                    const isSelected = formData.role
                      .split(',')
                      .map(d => d.trim().toLowerCase())
                      .includes(roleItem.toLowerCase());

                    return (
                      <button
                        key={roleItem}
                        type="button"
                        onClick={() => toggleRole(roleItem)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? isGeneral
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 scale-105'
                              : 'bg-primary text-white shadow-sm shadow-primary/20 scale-105'
                            : isGeneral
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/50'
                        }`}
                      >
                        {isSelected && <HiCheck className="text-sm" />}
                        <span>{roleItem}{isGeneral ? ' (All Pages)' : ''}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Comma-separated Input */}
                <input
                  type="text"
                  required
                  placeholder="e.g. General, or Blogs, Jobs, Projects (comma-separated)"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 text-sm"
                />
                <p className="text-[11px] text-slate-500 font-medium">
                  If role is <strong className="text-emerald-700 font-bold">General</strong>, the staff can see every sidebar menu and access all pages. Specific roles restrict access only to the selected pages.
                </p>
              </div>

              {/* Assign to Customer during creation (Optional) */}
              {!editingPosition && customersList.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <HiUserAdd className="text-primary text-lg" />
                    <span>Assign to Customer Immediately (Optional)</span>
                  </label>
                  <select
                    value={formData.assignCustomerId}
                    onChange={(e) => setFormData({ ...formData, assignCustomerId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 cursor-pointer text-sm"
                  >
                    <option value="">-- Do Not Assign Yet (Create Role Only) --</option>
                    {customersList.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400">
                    If selected, the customer will immediately be appointed to this position and promoted to staff.
                  </p>
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  {editingPosition ? 'Save Changes' : (formData.assignCustomerId ? 'Create & Assign Position' : 'Create Position')}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Role Modal */}
      {viewingPosition && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-lg">
                  <HiBriefcase />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{viewingPosition.position}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{viewingPosition.rank} • {formatCurrency(viewingPosition.salary)}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingPosition(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
            </div>

            <div className="p-8 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Role & Page Permissions:</h4>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {(() => {
                  const roleStr = (viewingPosition.role || viewingPosition.duties || 'General').trim();
                  const isGen = roleStr.toLowerCase() === 'general' || roleStr.toLowerCase().split(',').map(s => s.trim()).includes('general');
                  if (isGen) {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <HiCheck className="text-lg text-emerald-600" />
                          <span>General Staff Role</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Staff assigned this position have unrestricted access to all pages and can see all sidebar menus.
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {roleStr.split(',').map(r => r.trim()).filter(Boolean).map((r, i) => (
                          <span key={i} className="px-3 py-1 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            {r}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Staff assigned this position can only see and access the sections listed above.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="px-8 pb-8">
              <button
                onClick={() => setViewingPosition(null)}
                className="w-full bg-slate-100 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Position to Customer Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl">
                  <HiUserAdd />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Assign Position to Customer</h3>
                  <p className="text-xs text-slate-400 font-semibold">Select a customer and appoint them to a position</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAssignModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-200/50 cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-8 space-y-6">
              {/* Select Position */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Position *</label>
                <select
                  required
                  value={assignPositionId}
                  onChange={(e) => setAssignPositionId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="">-- Choose a Position --</option>
                  {positions.map((pos) => (
                    <option key={pos._id} value={pos._id}>
                      {pos.position} ({pos.rank})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Position Role Preview */}
              {(() => {
                const selectedPos = positions.find(p => p._id === assignPositionId);
                if (!selectedPos) return null;
                const posRole = (selectedPos.role || selectedPos.duties || 'General').trim();
                const isGen = posRole.toLowerCase() === 'general' || posRole.toLowerCase().split(',').map(s => s.trim()).includes('general');

                return (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Role Permissions:</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getRankBadgeClass(selectedPos.rank)}`}>
                        {selectedPos.rank}
                      </span>
                    </div>
                    {isGen ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <HiCheck className="text-sm text-emerald-600" />
                        <span>General Role (Full access to all sidebar menus & pages)</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {posRole.split(',').map(d => d.trim()).filter(Boolean).map((r, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Select Customer */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Customer *</label>
                <select
                  required
                  value={assignCustomerId}
                  onChange={(e) => setAssignCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="">-- Choose a Customer --</option>
                  {customersList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  The selected customer will be promoted to Staff and granted the role permissions above.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={assigning || !assignPositionId || !assignCustomerId}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
                >
                  {assigning ? 'Assigning...' : 'Confirm & Assign Position'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
