'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { customerStore, Customer } from '@/lib/stores/CustomerStore';
import { 
  HiSearch, 
  HiTrash, 
  HiChevronLeft, 
  HiChevronRight, 
  HiEye,
  HiMail,
  HiUser,
  HiUserAdd
} from 'react-icons/hi';
import { staffStore } from '@/lib/stores/StaffStore';
import { useToast } from '@/components/ToastProvider';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { showToast, showConfirm } = useToast();
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    setLoading(true);
    const result = await customerStore.getCustomers(page, 20);
    if (result) {
      setCustomers(result.docs);
      setTotalPages(result.totalPages);
      setTotalDocs(result.totalDocs);
    }
    setLoading(false);
  };

  // Filter customers by search query
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  // Master Checkbox Handlers
  const isAllSelected = filteredCustomers.length > 0 && selectedIds.size === filteredCustomers.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < filteredCustomers.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredCustomers.map(c => c._id);
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

  const handleDeleteSelected = async () => {
    showConfirm({
      title: 'Delete Selected Customers',
      message: `Are you sure you want to delete the ${selectedIds.size} selected customer(s)? This action is permanent.`,
      variant: 'danger',
      confirmText: 'Delete Users',
      onConfirm: async () => {
        setLoading(true);
        const deletePromises = Array.from(selectedIds).map(id => customerStore.deleteCustomer(id));
        await Promise.all(deletePromises);
        showToast('Selected customer(s) deleted successfully!', 'success');
        setSelectedIds(new Set());
        setPage(1); // Reset to page 1
        await fetchCustomers();
      }
    });
  };

  const handleConvertToStaff = async () => {
    showConfirm({
      title: 'Promote Customers to Staff',
      message: `Are you sure you want to convert the ${selectedIds.size} selected customer(s) to Staff? They will receive default positions.`,
      variant: 'primary',
      confirmText: 'Convert to Staff',
      onConfirm: async () => {
        setLoading(true);
        const success = await staffStore.bulkUpdateStatus(Array.from(selectedIds), 'staff');
        if (success) {
          showToast('Selected customer(s) successfully promoted to Staff!', 'success');
          setSelectedIds(new Set());
          setPage(1);
          await fetchCustomers();
        } else {
          showToast('Failed to perform bulk conversion', 'error');
          setLoading(false);
        }
      }
    });
  };

  const handleDeleteRow = async (id: string, name: string) => {
    showConfirm({
      title: 'Delete Customer Profile',
      message: `Are you sure you want to delete the customer ${name}? This will permanently remove their records.`,
      variant: 'danger',
      confirmText: 'Delete User',
      onConfirm: async () => {
        setLoading(true);
        await customerStore.deleteCustomer(id);
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        setSelectedIds(newSelected);
        showToast(`Customer ${name} deleted successfully!`, 'success');
        await fetchCustomers();
      }
    });
  };

  // Dynamic Avatar Background Color Generator
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

  if (loading && customers.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading customers directory...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customers Management</h1>
          <p className="text-slate-500 font-medium font-inter">Manage and view all registered users of Kenny Tech Studios.</p>
        </div>
      </div>

      {/* Control panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Search by name or email..."
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
                onClick={() => showToast('Bulk communication option is under construction.', 'info')}
                className="p-2 bg-white text-primary border border-slate-100 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
                title="Send Bulk Email"
              >
                <HiMail className="text-lg" />
              </button>
              <button 
                onClick={handleConvertToStaff}
                className="p-2 bg-white text-emerald-600 border border-slate-100 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm cursor-pointer"
                title="Convert Selected to Staff"
              >
                <HiUserAdd className="text-lg" />
              </button>
              <button 
                onClick={handleDeleteSelected}
                className="p-2 bg-white text-red-500 border border-slate-100 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                title="Bulk Delete"
              >
                <HiTrash className="text-lg" />
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
                <th className="py-5 px-6">Customer</th>
                <th className="py-5 px-6">Organization</th>
                <th className="py-5 px-6">Phone Number</th>
                <th className="py-5 px-6">Joined Date</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold">
                    {loading ? 'Fetching customers...' : 'No customers found in database.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => {
                  const isChecked = selectedIds.has(customer._id);
                  const snNumber = (page - 1) * 20 + index + 1;
                  return (
                    <tr 
                      key={customer._id} 
                      className={`hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-primary/[0.02]' : ''}`}
                    >
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectRow(customer._id)}
                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                          />
                          <span className="text-slate-400 font-bold">#{snNumber}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${getAvatarColor(customer.name)} text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0`}>
                            {customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{customer.name}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-400 font-semibold italic">Personal Account</td>
                      <td className="py-4.5 px-6 text-slate-400 font-semibold italic">N/A</td>
                      <td className="py-4.5 px-6 text-slate-500">
                        {new Date(customer.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4.5 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border bg-emerald-50 text-emerald-700 border-emerald-100">
                          Active User
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => showToast(`Name: ${customer.name} | Email: ${customer.email}`, 'info')}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                            title="View Details"
                          >
                            <HiEye className="text-lg" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRow(customer._id, customer.name)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                            title="Delete"
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
    </div>
  );
}
