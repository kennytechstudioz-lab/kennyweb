'use client';

import React, { useState, useEffect } from 'react';
import { testimonialStore, Testimonial } from '@/lib/stores/TestimonialStore';
import { 
  HiPlus, 
  HiTrash, 
  HiPencil, 
  HiExternalLink, 
  HiStar, 
  HiX, 
  HiPhotograph, 
  HiUser, 
  HiBriefcase, 
  HiLink,
  HiChatAlt2
} from 'react-icons/hi';
import { useToast } from '@/components/ToastProvider';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => testimonialStore.testimonials);
  const [loading, setLoading] = useState(() => !testimonialStore.isInitialized && testimonialStore.testimonials.length === 0);
  const { showToast, showConfirm } = useToast();
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    clientName: string;
    clientRole: string;
    picture: string;
    content: string;
    rating: number;
    clientProjectLink: string;
  }>({
    clientName: '',
    clientRole: '',
    picture: '',
    content: '',
    rating: 5,
    clientProjectLink: '',
  });

  useEffect(() => {
    const unsubscribe = testimonialStore.subscribe(() => {
      setTestimonials([...testimonialStore.testimonials]);
      setLoading(testimonialStore.isLoading && testimonialStore.testimonials.length === 0);
    });

    testimonialStore.getTestimonials();

    return unsubscribe;
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      clientName: '',
      clientRole: '',
      picture: '',
      content: '',
      rating: 5,
      clientProjectLink: '',
    });
    setShowModal(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName || '',
      clientRole: item.clientRole || '',
      picture: item.picture || '',
      content: item.content || '',
      rating: item.rating || 5,
      clientProjectLink: item.clientProjectLink || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.content.trim()) {
      showToast('Client name and content are required', 'error');
      return;
    }

    setSubmitting(true);
    let success = false;

    if (editingItem?._id) {
      const res = await testimonialStore.updateTestimonial(editingItem._id, formData);
      success = res !== null;
      if (success) showToast('Testimonial updated successfully!', 'success');
    } else {
      const res = await testimonialStore.createTestimonial(formData);
      success = res !== null;
      if (success) showToast('Testimonial created successfully!', 'success');
    }

    setSubmitting(false);

    if (success) {
      setShowModal(false);
      setEditingItem(null);
    } else {
      showToast('Failed to save testimonial', 'error');
    }
  };

  const handleDelete = (id: string, name: string) => {
    showConfirm({
      title: 'Delete Testimonial',
      message: `Are you sure you want to delete the testimonial from "${name}"? This action cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete Testimonial',
      onConfirm: async () => {
        const success = await testimonialStore.deleteTestimonial(id);
        if (success) {
          showToast('Testimonial deleted successfully!', 'success');
        } else {
          showToast('Failed to delete testimonial', 'error');
        }
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('Image file size should be less than 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, picture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 px-[10px] sm:px-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <HiChatAlt2 className="text-2xl" />
            </span>
            Testimonials
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage customer reviews, satisfaction ratings, and project links shown on the homepage.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer self-start sm:self-auto"
        >
          <HiPlus className="text-xl" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 font-medium flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Loading testimonials...</span>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto text-3xl">
              <HiChatAlt2 />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">No testimonials yet</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Add your first client testimonial to display reviews and showcase projects on the website.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all cursor-pointer"
            >
              <HiPlus /> Add Testimonial
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Feedback / Quote</th>
                  <th className="py-4 px-6">Client Project</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {testimonials.map((item) => {
                  const initials = item.clientName
                    ? item.clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'CL';

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Client Avatar + Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {item.picture ? (
                            <img
                              src={item.picture}
                              alt={item.clientName}
                              className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary via-primary-dark to-navy text-white font-black text-xs flex items-center justify-center border border-primary/20 shrink-0">
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                              {item.clientName}
                            </div>
                            {item.clientRole && (
                              <div className="text-xs text-slate-400 font-medium">
                                {item.clientRole}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="flex text-amber-400 text-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <HiStar
                                key={star}
                                className={star <= (item.rating || 5) ? 'text-amber-400' : 'text-slate-200'}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-slate-800 text-xs ml-1">
                            {Number(item.rating || 5).toFixed(1)}
                          </span>
                        </div>
                      </td>

                      {/* Content excerpt */}
                      <td className="py-4 px-6 max-w-md">
                        <p className="line-clamp-2 text-slate-600 text-xs italic">
                          &ldquo;{item.content}&rdquo;
                        </p>
                      </td>

                      {/* Project Link */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {item.clientProjectLink ? (
                          <a
                            href={item.clientProjectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all"
                          >
                            <HiLink className="text-sm" />
                            <span>View Project</span>
                            <HiExternalLink className="text-xs" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No link</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit Testimonial"
                            className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                          >
                            <HiPencil className="text-lg" />
                          </button>
                          <button
                            onClick={() => item._id && handleDelete(item._id, item.clientName)}
                            title="Delete Testimonial"
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          >
                            <HiTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HiChatAlt2 className="text-primary" />
                <span>{editingItem ? 'Edit Testimonial' : 'Create New Testimonial'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
              >
                <HiX className="text-xl" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
              {/* Picture Upload / Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Client Picture (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {formData.picture ? (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm shrink-0 group">
                      <img
                        src={formData.picture}
                        alt="Client Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, picture: '' }))}
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <HiPhotograph className="text-2xl" />
                      <span className="text-[10px] font-semibold mt-1">No Photo</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer">
                      <HiPhotograph />
                      <span>{formData.picture ? 'Change Picture' : 'Upload Client Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      Square JPG or PNG, max 3MB. If omitted, initials badge will be displayed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Client Name *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiUser />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jenny Wilson"
                      value={formData.clientName}
                      onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Role / Company
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiBriefcase />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. CEO, Urban Auto"
                      value={formData.clientRole}
                      onChange={e => setFormData({ ...formData, clientRole: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Rating & Client Project Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Rating (Stars)
                  </label>
                  <div className="flex items-center gap-1.5 py-2 px-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="text-2xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                      >
                        <HiStar
                          className={star <= formData.rating ? 'text-amber-400' : 'text-slate-200'}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-slate-700 ml-2">
                      {formData.rating}.0 / 5.0
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Client Project Link
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiLink />
                    </div>
                    <input
                      type="url"
                      placeholder="https://clientproject.com"
                      value={formData.clientProjectLink}
                      onChange={e => setFormData({ ...formData, clientProjectLink: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Testimonial Feedback / Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share the client's detailed feedback regarding the service, quality, delivery, and support..."
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none leading-relaxed"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Save Changes' : 'Create Testimonial'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
