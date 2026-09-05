'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { jobStore, Job } from '@/lib/stores/JobStore';
import { 
  HiPlus, 
  HiTrash, 
  HiPencil, 
  HiBriefcase, 
  HiLink, 
  HiUser, 
  HiPhone, 
  HiMail, 
  HiCalendar, 
  HiCurrencyDollar 
} from 'react-icons/hi';
import { useToast } from '@/components/ToastProvider';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { showToast, showConfirm } = useToast();

  const [formData, setFormData] = useState<Partial<Job>>({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    name: '',
    domain: '',
    price: 0,
    duration: '',
    type: 'Web App',
    description: '',
  });

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  }), []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const data = await jobStore.getJobs();
    setJobs(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.clientName || 
      !formData.clientPhone || 
      !formData.clientEmail || 
      !formData.name || 
      !formData.duration || 
      !formData.type || 
      formData.price === undefined
    ) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    if (editingJob?._id) {
      await jobStore.updateJob(editingJob._id, formData);
    } else {
      await jobStore.createJob(formData as Job);
    }
    setShowModal(false);
    setEditingJob(null);
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      name: '',
      domain: '',
      price: 0,
      duration: '',
      type: 'Web App',
      description: '',
    });
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: 'Delete Job Record',
      message: 'Are you sure you want to delete this job record? This action is permanent and cannot be undone.',
      variant: 'danger',
      confirmText: 'Delete Record',
      onConfirm: async () => {
        setLoading(true);
        const success = await jobStore.deleteJob(id);
        if (success) {
          showToast('Job record deleted successfully!', 'success');
          fetchJobs();
        } else {
          showToast('Failed to delete job record', 'error');
          setLoading(false);
        }
      }
    });
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      ...job,
      domain: job.domain || '',
      description: job.description || '',
    });
    setShowModal(true);
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Web App':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Mobile App':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Video Editing':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'Digital Marketing':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Animation':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading jobs...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Client Jobs</h1>
          <p className="text-slate-500 font-medium">Manage and track jobs completed for all clients of Kenny Tech Studios.</p>
        </div>
        <button
          onClick={() => {
            setEditingJob(null);
            setFormData({
              clientName: '',
              clientPhone: '',
              clientEmail: '',
              name: '',
              domain: '',
              price: 0,
              duration: '',
              type: 'Web App',
              description: '',
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          <HiPlus className="text-xl" />
          Add Completed Job
        </button>
      </div>

      {/* Table List Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-5 px-6 w-20">S/N</th>
                <th className="py-5 px-6">Client Info</th>
                <th className="py-5 px-6">Job Details</th>
                <th className="py-5 px-6">Job Type</th>
                <th className="py-5 px-6">Duration</th>
                <th className="py-5 px-6">Price</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold">
                    No jobs registered yet. Click the button above to add your first completed job.
                  </td>
                </tr>
              ) : (
                jobs.map((job, idx) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6 text-slate-400 font-bold">#{idx + 1}</td>
                    <td className="py-4.5 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                          <HiUser className="text-slate-400" />
                          {job.clientName}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <HiMail className="text-slate-400" />
                          {job.clientEmail}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <HiPhone className="text-slate-400" />
                          {job.clientPhone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                          <HiBriefcase className="text-sm" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{job.name}</span>
                          {job.domain && (
                            <a 
                              href={job.domain.startsWith('http') ? job.domain : `https://${job.domain}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[11px] text-primary hover:underline font-bold flex items-center gap-0.5 mt-0.5"
                            >
                              <HiLink /> {job.domain}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getJobTypeColor(job.type)}`}>
                        {job.type}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <HiCalendar className="text-slate-400 text-base" />
                        <span>{job.duration}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-slate-900 font-black flex items-center gap-0.5">
                      <HiCurrencyDollar className="text-slate-400 text-lg" />
                      <span>{job.price.toLocaleString()}</span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(job)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                          title="Edit"
                        >
                          <HiPencil className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id!)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <HiTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <h2 className="text-2xl font-black text-slate-900">{editingJob ? 'Edit Job Record' : 'Add Completed Job Record'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <HiPlus className="text-3xl rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <h3 className="text-base font-black text-slate-950 tracking-wide uppercase border-b border-slate-100 pb-2">Client Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Client Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Client Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 234 567 890"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <h3 className="text-base font-black text-slate-955 tracking-wide uppercase border-b border-slate-100 pb-2 pt-2">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Job Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. E-Commerce Platform"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Job Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Animation">Animation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Weeks or 2 Months"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Price ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Job URL/Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. www.clientwebsite.com"
                    value={formData.domain || ''}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Job Description (Optional)</label>
                <div className="quill-wrapper">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(val) => setFormData({ ...formData, description: val })}
                    modules={quillModules}
                    className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4 flex-shrink-0">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer">
                  {editingJob ? 'Update Job Record' : 'Create Job Record'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .quill-wrapper .ql-container {
          min-height: 180px;
          font-family: inherit;
          font-size: 0.95rem;
          border: none !important;
        }
        .quill-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}
