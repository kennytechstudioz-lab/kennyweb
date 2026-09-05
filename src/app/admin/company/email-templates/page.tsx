'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { emailTemplateStore, EmailTemplate } from '@/lib/stores/EmailTemplateStore';
import { HiPlus, HiTrash, HiPencil, HiTemplate, HiEye } from 'react-icons/hi';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useToast } from '@/components/ToastProvider';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AdminEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast, showConfirm } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const [formData, setFormData] = useState<Partial<EmailTemplate>>({
    name: '',
    title: '',
    greetings: '',
    bannerImage: '',
    content: '',
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
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const data = await emailTemplateStore.getTemplates();
    setTemplates(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.title || !formData.greetings || !formData.bannerImage || !formData.content) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    if (editingTemplate?._id) {
      await emailTemplateStore.updateTemplate(editingTemplate._id, formData);
    } else {
      await emailTemplateStore.createTemplate(formData as EmailTemplate);
    }
    setShowModal(false);
    setEditingTemplate(null);
    setFormData({
      name: '',
      title: '',
      greetings: '',
      bannerImage: '',
      content: '',
    });
    fetchTemplates();
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: 'Delete Email Template',
      message: 'Are you sure you want to delete this email template? This action is permanent.',
      variant: 'danger',
      confirmText: 'Delete Template',
      onConfirm: async () => {
        setLoading(true);
        const success = await emailTemplateStore.deleteTemplate(id);
        if (success !== false) {
          showToast('Email template deleted successfully!', 'success');
        } else {
          showToast('Failed to delete email template', 'error');
        }
        await fetchTemplates();
      }
    });
  };

  const openEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData(template);
    setShowModal(true);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading templates...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Email Templates</h1>
          <p className="text-slate-500 font-medium">Design and customize all email templates sent out to clients and staff.</p>
        </div>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setFormData({ name: '', title: '', greetings: '', bannerImage: '', content: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          <HiPlus className="text-xl" />
          Add New Template
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-5 px-6 w-20">S/N</th>
                <th className="py-5 px-6">Banner</th>
                <th className="py-5 px-6">Template Name</th>
                <th className="py-5 px-6">Subject (Title)</th>
                <th className="py-5 px-6">Greeting Format</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                    No email templates found. Click the button above to add your first template.
                  </td>
                </tr>
              ) : (
                templates.map((template, idx) => (
                  <tr key={template._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6 text-slate-400 font-bold">#{idx + 1}</td>
                    <td className="py-4.5 px-6">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                        {template.bannerImage && (
                          <Image
                            src={template.bannerImage}
                            alt={template.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                          <HiTemplate className="text-sm" />
                        </div>
                        <span className="font-bold text-slate-900">{template.name}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-slate-600 font-semibold truncate max-w-xs" title={template.title}>
                      {template.title}
                    </td>
                    <td className="py-4.5 px-6 text-slate-500 italic">"{template.greetings}"</td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(template)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                          title="Edit"
                        >
                          <HiPencil className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(template._id!)}
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
              <h2 className="text-2xl font-black text-slate-900">{editingTemplate ? 'Edit Email Template' : 'Add New Email Template'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <HiPlus className="text-3xl rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Template Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Welcome onboard"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Subject Line (Title) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Welcome to Kenny Tech Studios!"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Greetings Format *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dear [Customer Name],"
                    value={formData.greetings}
                    onChange={(e) => setFormData({ ...formData, greetings: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Banner Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Content / Body *</label>
                <div className="quill-wrapper">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val })}
                    modules={quillModules}
                    className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4 flex-shrink-0">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer">
                  {editingTemplate ? 'Update Template' : 'Create Template'}
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
