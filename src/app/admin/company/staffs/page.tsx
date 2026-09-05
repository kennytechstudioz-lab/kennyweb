'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { staffStore, Staff } from '@/lib/stores/StaffStore';
import { 
  HiSearch, 
  HiTrash, 
  HiChevronLeft, 
  HiChevronRight, 
  HiPencil,
  HiUserRemove,
  HiUserGroup,
  HiBriefcase,
  HiMail,
  HiPlus
} from 'react-icons/hi';
import { useToast } from '@/components/ToastProvider';

export default function AdminStaffs() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { showToast, showConfirm } = useToast();

  // Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    status: 'staff',
  });

  useEffect(() => {
    fetchStaffs();
  }, [page]);

  const fetchStaffs = async () => {
    setLoading(true);
    const result = await staffStore.getStaffs(page, 20);
    if (result) {
      setStaffs(result.docs);
      setTotalPages(result.totalPages);
      setTotalDocs(result.totalDocs);
    }
    setLoading(false);
  };

  // Filter staffs by search query
  const filteredStaffs = useMemo(() => {
    return staffs.filter(staff => 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.position || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staffs, searchQuery]);

  // Master Checkbox Handlers
  const isAllSelected = filteredStaffs.length > 0 && selectedIds.size === filteredStaffs.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < filteredStaffs.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredStaffs.map(c => c._id);
      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleConvertToUsers = async () => {
    showConfirm({
      title: 'Demote Staff to Users',
      message: `Are you sure you want to convert the ${selectedIds.size} selected staff to regular Users? They will be demoted to standard client privileges.`,
      variant: 'warning',
      confirmText: 'Demote Staff',
      onConfirm: async () => {
        setLoading(true);
        const success = await staffStore.bulkUpdateStatus(Array.from(selectedIds), 'user');
        if (success) {
          showToast('Selected staff successfully converted to regular users!', 'success');
          setSelectedIds(new Set());
          setPage(1);
          await fetchStaffs();
        } else {
          showToast('Failed to perform bulk conversion', 'error');
          setLoading(false);
        }
      }
    });
  };

  const handleOpenEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      position: staff.position || 'General Staff',
      status: staff.status,
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.position) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    if (editingStaff?._id) {
      setLoading(true);
      const updated = await staffStore.updateStaff(editingStaff._id, formData as any);
      if (updated) {
        showToast('Staff profile updated successfully!', 'success');
        setShowModal(false);
        setEditingStaff(null);
        await fetchStaffs();
      } else {
        showToast('Failed to update staff record', 'error');
        setLoading(false);
      }
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 
      'bg-emerald-500', 
      'bg-indigo-500', 
      'bg-purple-500', 
      'bg-rose-500', 
      'bg-cyan-500', 
      'bg-amber-500', 
      'bg-violet-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (loading && staffs.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading staffs directory...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staffs Directory</h1>
          <p className="text-slate-500 font-medium font-inter">Manage roles, positions, and accounts for all administrative staffs & admins.</p>
        </div>
      </div>

      {/* Control panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Search by name, email or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-primary transition-all text-slate-800 font-medium"
          />
        </div>

        {/* Selected Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-4 bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
            <span className="text-sm font-bold text-primary">{selectedIds.size} row(s) selected</span>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleConvertToUsers}
                className="p-2 bg-white text-indigo-600 border border-slate-100 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm cursor-pointer"
                title="Convert Selected to regular Users"
              >
                <HiUserRemove className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-5 px-6 w-20">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isSomeSelected;
                      }}
                      onChange={handleSelectAll}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <span>S/N</span>
                  </div>
                </th>
                <th className="py-5 px-6">Staff Member</th>
                <th className="py-5 px-6">Position</th>
                <th className="py-5 px-6">Joined Date</th>
                <th className="py-5 px-6">Role (Status)</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredStaffs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                    {loading ? 'Fetching staffs...' : 'No staff profiles found.'}
                  </td>
                </tr>
              ) : (
                filteredStaffs.map((staff, index) => {
                  const isChecked = selectedIds.has(staff._id);
                  const snNumber = (page - 1) * 20 + index + 1;
                  return (
                    <tr 
                      key={staff._id} 
                      className={`hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-primary/[0.02]' : ''}`}
                    >
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectRow(staff._id)}
                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                          />
                          <span className="text-slate-400 font-bold">#{snNumber}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${getAvatarColor(staff.name)} text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0`}>
                            {staff.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{staff.name}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{staff.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                          <HiBriefcase className="text-slate-400" />
                          <span>{staff.position || 'General Staff'}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-500">
                        {new Date(staff.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                          staff.status === 'admin' 
                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEdit(staff)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                            title="Edit Staff"
                          >
                            <HiPencil className="text-lg" />
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

        {/* Pagination controls */}
        {totalDocs > 0 && (
          <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs font-bold text-slate-400">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, totalDocs)} of {totalDocs} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 border border-slate-200 bg-white rounded-lg text-slate-400 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <HiChevronLeft className="text-lg" />
              </button>
              
              <span className="text-sm font-bold bg-primary text-white w-9 h-9 flex items-center justify-center rounded-lg shadow-md shadow-primary/20">
                {page}
              </span>
              
              <button 
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 border border-slate-200 bg-white rounded-lg text-slate-400 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <HiChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Edit Staff Record</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <HiPlus className="text-3xl rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Professional Position *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical Lead"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">System Role (Status) *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="user">User (Demote to regular customer)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer">
                  Save Changes
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer">
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
