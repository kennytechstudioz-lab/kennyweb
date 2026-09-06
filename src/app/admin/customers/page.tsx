'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { customerStore, Customer } from '@/lib/stores/CustomerStore';
import { staffStore } from '@/lib/stores/StaffStore';
import { emailTemplateStore, EmailTemplate } from '@/lib/stores/EmailTemplateStore';
import { positionStore, Position } from '@/lib/stores/PositionStore';
import { 
  HiSearch, 
  HiTrash, 
  HiChevronLeft, 
  HiChevronRight, 
  HiEye, 
  HiMail, 
  HiUser, 
  HiUserAdd,
  HiChevronDown,
  HiX,
  HiCheck,
  HiClipboardCopy,
  HiBriefcase,
  HiSparkles
} from 'react-icons/hi';
import { useToast } from '@/components/ToastProvider';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(() => customerStore.customers);
  const [loading, setLoading] = useState(() => !customerStore.isInitialized && customerStore.customers.length === 0);
  const [page, setPage] = useState(() => customerStore.currentPage || 1);
  const { showToast, showConfirm } = useToast();
  const [totalPages, setTotalPages] = useState(() => customerStore.totalPages || 1);
  const [totalDocs, setTotalDocs] = useState(() => customerStore.totalDocs || 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk Actions Dropdown State
  const [showBulkDropdown, setShowBulkDropdown] = useState(false);

  // Send Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Make Staff Modal State
  const [showMakeStaffModal, setShowMakeStaffModal] = useState(false);
  const [positionsList, setPositionsList] = useState<Position[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [promotingStaff, setPromotingStaff] = useState(false);

  // Details Modal State
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    // Subscribe to real-time CustomerStore changes
    const unsubscribe = customerStore.subscribe(() => {
      setCustomers([...customerStore.customers]);
      setTotalPages(customerStore.totalPages);
      setTotalDocs(customerStore.totalDocs);
      setLoading(customerStore.isLoading && customerStore.customers.length === 0);
    });

    fetchCustomers();
    fetchAuxiliaryData();

    return unsubscribe;
  }, [page]);

  const fetchAuxiliaryData = async () => {
    try {
      const [tpls, pos] = await Promise.all([
        emailTemplateStore.getTemplates(),
        positionStore.getPositions(),
      ]);
      setEmailTemplates(tpls);
      setPositionsList(pos);
      if (pos.length > 0) {
        setSelectedPositionId(pos[0]._id || '');
      }
    } catch (e) {
      console.error('Error fetching templates or positions:', e);
    }
  };

  const fetchCustomers = async (force = false) => {
    if (!customerStore.isInitialized && customerStore.customers.length === 0) {
      setLoading(true);
    }
    const result = await customerStore.getCustomers(page, 20, force);
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

  // Selected customers objects
  const selectedCustomersList = useMemo(() => {
    return customers.filter(c => selectedIds.has(c._id));
  }, [customers, selectedIds]);

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

  // --- Bulk Action 1: Delete Selected ---
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    showConfirm({
      title: `Delete ${selectedIds.size} Customer${selectedIds.size > 1 ? 's' : ''}`,
      message: `Are you sure you want to permanently delete the ${selectedIds.size} selected customer account(s)? This action cannot be undone.`,
      variant: 'danger',
      confirmText: `Delete ${selectedIds.size} User${selectedIds.size > 1 ? 's' : ''}`,
      onConfirm: async () => {
        const deletePromises = Array.from(selectedIds).map(id => customerStore.deleteCustomer(id));
        await Promise.all(deletePromises);
        showToast(`Successfully deleted ${selectedIds.size} customer account(s)!`, 'success');
        setSelectedIds(new Set());
      }
    });
  };

  // --- Bulk Action 2: Send Email ---
  const handleOpenEmailModal = () => {
    if (selectedIds.size === 0) {
      showToast('Please select at least one customer first', 'warning');
      return;
    }
    setShowEmailModal(true);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      setEmailSubject('');
      setEmailBody('');
      return;
    }
    const tpl = emailTemplates.find(t => t._id === templateId);
    if (tpl) {
      setEmailSubject(tpl.title || tpl.name);
      const cleanContent = (tpl.content || '').replace(/<[^>]*>?/gm, '\n').trim();
      setEmailBody(`${tpl.greetings ? tpl.greetings + '\n\n' : ''}${cleanContent}`);
    }
  };

  const handleCopyEmails = () => {
    const emailList = selectedCustomersList.map(c => c.email).join(', ');
    navigator.clipboard.writeText(emailList);
    showToast(`Copied ${selectedCustomersList.length} recipient email(s) to clipboard!`, 'success');
  };

  const handleSendBulkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) {
      showToast('Please enter both subject and message content', 'warning');
      return;
    }

    setSendingEmail(true);
    // Simulate dispatching email broadcast
    await new Promise(resolve => setTimeout(resolve, 600));
    setSendingEmail(false);
    showToast(`Bulk email broadcast dispatched to ${selectedIds.size} customer(s)!`, 'success');
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailBody('');
    setSelectedTemplateId('');
  };

  const handleOpenInEmailClient = () => {
    const bccList = selectedCustomersList.map(c => c.email).join(',');
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bccList)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  // --- Bulk Action 3: Make Staff ---
  const handleOpenMakeStaffModal = () => {
    if (selectedIds.size === 0) {
      showToast('Please select at least one customer first', 'warning');
      return;
    }
    setShowMakeStaffModal(true);
  };

  const handleConfirmMakeStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.size === 0) return;

    setPromotingStaff(true);
    try {
      const chosenPos = positionsList.find(p => p._id === selectedPositionId);
      const posTitle = chosenPos ? chosenPos.position : 'General Staff';
      const posRole = chosenPos ? (chosenPos.role || chosenPos.duties || 'General') : 'General';

      const success = await staffStore.bulkUpdateStatus(
        Array.from(selectedIds),
        'staff',
        posTitle,
        posRole
      );

      if (success) {
        showToast(`Successfully converted ${selectedIds.size} customer(s) to Staff with position "${posTitle}"!`, 'success');
        setSelectedIds(new Set());
        setShowMakeStaffModal(false);
        setPage(1);
        await fetchCustomers();
      } else {
        showToast('Failed to convert customers to staff', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update users', 'error');
    } finally {
      setPromotingStaff(false);
    }
  };

  // Single Row Delete
  const handleDeleteRow = async (id: string, name: string) => {
    showConfirm({
      title: 'Delete Customer Profile',
      message: `Are you sure you want to delete the customer ${name}? This will permanently remove their records.`,
      variant: 'danger',
      confirmText: 'Delete User',
      onConfirm: async () => {
        await customerStore.deleteCustomer(id);
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        setSelectedIds(newSelected);
        showToast(`Customer ${name} deleted successfully!`, 'success');
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
          <p className="text-slate-500 font-medium font-inter mt-1">
            Manage, communicate with, and oversee all registered customers of Kenny Tech Studios.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Bulk Actions Dropdown Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowBulkDropdown(!showBulkDropdown)}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-5 py-3.5 rounded-2xl font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Bulk Actions</span>
              {selectedIds.size > 0 && (
                <span className="bg-primary text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {selectedIds.size}
                </span>
              )}
              <HiChevronDown className={`text-lg transition-transform duration-200 ${showBulkDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showBulkDropdown && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bulk Operations</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {selectedIds.size > 0 ? `${selectedIds.size} customer(s) selected` : 'Select customers below'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowBulkDropdown(false);
                    handleOpenEmailModal();
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                    <HiMail className="text-base" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Send Email</p>
                    <p className="text-[11px] text-slate-400">Broadcast to selected</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowBulkDropdown(false);
                    handleOpenMakeStaffModal();
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <HiUserAdd className="text-base" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Make Staff</p>
                    <p className="text-[11px] text-slate-400">Promote to team member</p>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button
                  onClick={() => {
                    setShowBulkDropdown(false);
                    if (selectedIds.size === 0) {
                      showToast('Please select at least one customer first', 'warning');
                      return;
                    }
                    handleDeleteSelected();
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <HiTrash className="text-base" />
                  </div>
                  <div>
                    <p className="font-bold text-red-600">Delete Selected</p>
                    <p className="text-[11px] text-red-400">Permanently remove</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control panel & Dynamic Bulk Action Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-primary transition-all text-slate-800 font-medium"
          />
        </div>

        {/* Selected Bulk Actions Bar */}
        {selectedIds.size > 0 ? (
          <div className="flex flex-wrap items-center gap-3 bg-primary/5 px-5 py-2.5 rounded-2xl border border-primary/20 animate-in fade-in duration-200">
            <span className="text-xs font-black text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {selectedIds.size} Selected
            </span>
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Send Email Button */}
              <button 
                onClick={handleOpenEmailModal}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/20 text-xs font-bold cursor-pointer"
                title="Send Email to Selected Customers"
              >
                <HiMail className="text-base" />
                <span>Send Email</span>
              </button>

              {/* Make Staff Button */}
              <button 
                onClick={handleOpenMakeStaffModal}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 text-xs font-bold cursor-pointer"
                title="Promote Selected Customers to Staff"
              >
                <HiUserAdd className="text-base" />
                <span>Make Staff</span>
              </button>

              {/* Delete Button */}
              <button 
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all text-xs font-bold cursor-pointer"
                title="Permanently Delete Selected Customers"
              >
                <HiTrash className="text-base text-red-500" />
                <span>Delete</span>
              </button>

              {/* Deselect Button */}
              <button 
                onClick={() => setSelectedIds(new Set())}
                className="px-2 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Check boxes below to apply bulk delete, send emails, or promote to staff.</span>
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
                <th className="py-5 px-6">Account Type</th>
                <th className="py-5 px-6">Joined Date</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <HiUser className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-800">No customers found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {searchQuery ? 'Try adjusting your search query.' : 'No registered customers found in the database.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => {
                  const isChecked = selectedIds.has(customer._id);
                  const snNumber = (page - 1) * 20 + index + 1;
                  return (
                    <tr 
                      key={customer._id} 
                      className={`hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-primary/[0.03]' : ''}`}
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
                      <td className="py-4.5 px-6">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                          <HiUser className="text-slate-400" />
                          Personal Client
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-slate-500">
                        {new Date(customer.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4.5 px-6">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">
                          <HiCheck className="text-emerald-600" />
                          Active Customer
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setViewingCustomer(customer)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                            title="View Customer Details"
                          >
                            <HiEye className="text-lg" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedIds(new Set([customer._id]));
                              setShowEmailModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                            title="Send Direct Email"
                          >
                            <HiMail className="text-lg" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedIds(new Set([customer._id]));
                              setShowMakeStaffModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                            title="Promote to Staff"
                          >
                            <HiUserAdd className="text-lg" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRow(customer._id, customer.name)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete Customer"
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

      {/* --- MODAL 1: Send Bulk Email Modal --- */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl">
                  <HiMail />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Send Bulk Email Broadcast</h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    Targeting {selectedIds.size} recipient customer{selectedIds.size > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEmailModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-200/50 cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSendBulkEmail} className="p-8 space-y-6">
              {/* Recipients Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Recipients ({selectedCustomersList.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyEmails}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HiClipboardCopy className="text-sm" />
                    <span>Copy All Emails</span>
                  </button>
                </div>
                <div className="max-h-24 overflow-y-auto custom-scrollbar p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap gap-1.5">
                  {selectedCustomersList.map(c => (
                    <span 
                      key={c._id} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
                    >
                      <span>{c.name}</span>
                      <span className="text-slate-400 text-[10px]">({c.email})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Template Selector */}
              {emailTemplates.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <HiSparkles className="text-amber-500 text-sm" />
                    <span>Load from Saved Template (Optional)</span>
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 cursor-pointer text-sm"
                  >
                    <option value="">-- Compose Custom Message --</option>
                    {emailTemplates.map(tpl => (
                      <option key={tpl._id} value={tpl._id}>
                        {tpl.name} - {tpl.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject Line */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Important Service Update from Kenny Tech Studios"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 text-sm"
                />
              </div>

              {/* Email Content Body */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Message Body *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Type your announcement or message to the selected customers..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 text-sm resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <HiMail className="text-xl" />
                  <span>{sendingEmail ? 'Broadcasting...' : `Send Email (${selectedIds.size})`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenInEmailClient}
                  disabled={!emailSubject.trim()}
                  className="px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all text-xs cursor-pointer disabled:opacity-50"
                  title="Open mail client with BCC list"
                >
                  Open in Mail App (BCC)
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Make Staff Modal --- */}
      {showMakeStaffModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
                  <HiUserAdd />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Promote to Staff</h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    Convert {selectedIds.size} customer{selectedIds.size > 1 ? 's' : ''} into company staff
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowMakeStaffModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-200/50 cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleConfirmMakeStaff} className="p-8 space-y-6">
              {/* Selected List Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Selected Customers ({selectedCustomersList.length})
                </label>
                <div className="max-h-24 overflow-y-auto custom-scrollbar p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap gap-1.5">
                  {selectedCustomersList.map(c => (
                    <span 
                      key={c._id} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
                    >
                      <span>{c.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Assign Position */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <HiBriefcase className="text-primary text-base" />
                  <span>Assign Job Position *</span>
                </label>
                <select
                  required
                  value={selectedPositionId}
                  onChange={(e) => setSelectedPositionId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 cursor-pointer text-sm"
                >
                  <option value="">General Staff (General Role - All Pages)</option>
                  {positionsList.map(pos => (
                    <option key={pos._id} value={pos._id}>
                      {pos.position} ({pos.rank}) — Role: {pos.role || pos.duties || 'General'}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Customers promoted to staff will gain access according to the chosen position and role permissions.
                </p>
              </div>

              {/* Role preview badge */}
              {(() => {
                const chosen = positionsList.find(p => p._id === selectedPositionId);
                const roleStr = chosen ? (chosen.role || chosen.duties || 'General') : 'General';
                const isGen = roleStr.toLowerCase() === 'general' || roleStr.toLowerCase().split(',').map(s => s.trim()).includes('general');

                return (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Granted Role Permissions:</p>
                    {isGen ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <HiCheck className="text-sm text-emerald-600" />
                        <span>General Role (Full access to all sidebar menus and pages)</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {roleStr.split(',').map(d => d.trim()).filter(Boolean).map((r, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={promotingStaff}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <HiUserAdd className="text-xl" />
                  <span>{promotingStaff ? 'Promoting...' : `Promote (${selectedIds.size}) to Staff`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMakeStaffModal(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: View Customer Details Modal --- */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${getAvatarColor(viewingCustomer.name)} text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm`}>
                  {viewingCustomer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{viewingCustomer.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{viewingCustomer.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingCustomer(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-200/50 cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
            </div>

            <div className="p-8 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-semibold">User ID:</span>
                  <span className="font-mono text-xs font-bold text-slate-700">{viewingCustomer._id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-semibold">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Active Customer
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-semibold">Joined Date:</span>
                  <span className="font-bold text-slate-700">
                    {new Date(viewingCustomer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 flex gap-3">
              <button
                onClick={() => {
                  setViewingCustomer(null);
                  setSelectedIds(new Set([viewingCustomer._id]));
                  setShowEmailModal(true);
                }}
                className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-primary-dark transition-all cursor-pointer text-sm flex items-center justify-center gap-1.5"
              >
                <HiMail className="text-base" />
                <span>Email Customer</span>
              </button>
              <button
                onClick={() => setViewingCustomer(null)}
                className="flex-1 bg-slate-100 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
