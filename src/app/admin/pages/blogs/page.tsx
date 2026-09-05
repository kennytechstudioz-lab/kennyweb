'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { blogStore, Blog } from '@/lib/stores/BlogStore';
import { HiPlus, HiTrash, HiPencil, HiDocumentText, HiTag, HiUser, HiCalendar } from 'react-icons/hi';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useToast } from '@/components/ToastProvider';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast, showConfirm } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Blog>>({
    title: '',
    subtitle: '',
    category: '',
    author: '',
    content: '',
    date: new Date().toISOString().substring(0, 10),
    image: '',
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
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const data = await blogStore.getBlogs();
    setBlogs(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subtitle || !formData.category || !formData.author || !formData.content || !formData.date || !formData.image) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBlog?._id) {
        await blogStore.updateBlog(editingBlog._id, formData);
        showToast('Blog post updated successfully!', 'success');
      } else {
        await blogStore.createBlog(formData as Blog);
        showToast('Blog post created successfully!', 'success');
      }
      setShowModal(false);
      setEditingBlog(null);
      setFormData({
        title: '',
        subtitle: '',
        category: '',
        author: '',
        content: '',
        date: new Date().toISOString().substring(0, 10),
        image: '',
      });
      fetchBlogs();
    } catch (err: any) {
      showToast(err.message || 'Failed to save blog post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: 'Delete Blog Post',
      message: 'Are you sure you want to delete this blog post? This action is permanent.',
      variant: 'danger',
      confirmText: 'Delete Post',
      onConfirm: async () => {
        setLoading(true);
        const success = await blogStore.deleteBlog(id);
        if (success !== false) {
          showToast('Blog post deleted successfully!', 'success');
        } else {
          showToast('Failed to delete blog post', 'error');
        }
        await fetchBlogs();
      }
    });
  };

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog);
    
    // Format date correctly for HTML input (YYYY-MM-DD)
    const formattedDate = blog.date ? new Date(blog.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10);
    
    setFormData({
      ...blog,
      date: formattedDate
    });
    setShowModal(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading blog directory...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blogs Directory</h1>
          <p className="text-slate-500 font-medium">Manage and publish articles, news updates, and insights of Kenny Tech Studios.</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null);
            setFormData({
              title: '',
              subtitle: '',
              category: '',
              author: '',
              content: '',
              date: new Date().toISOString().substring(0, 10),
              image: '',
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer animate-fade-in"
        >
          <HiPlus className="text-xl" />
          Write Blog Post
        </button>
      </div>

      {/* Table List Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-slide-up">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-5 px-6 w-20">S/N</th>
                <th className="py-5 px-6">Image</th>
                <th className="py-5 px-6">Blog Title</th>
                <th className="py-5 px-6">Author</th>
                <th className="py-5 px-6">Category</th>
                <th className="py-5 px-6">Publish Date</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold">
                    No articles written yet. Click the button above to publish your first blog post.
                  </td>
                </tr>
              ) : (
                blogs.map((blog, idx) => (
                  <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6 text-slate-400 font-bold">#{idx + 1}</td>
                    <td className="py-4.5 px-6">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                        {blog.image && (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                          <HiDocumentText className="text-sm" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block max-w-xs truncate">{blog.title}</span>
                          <span className="text-[10px] text-slate-400 font-bold block truncate max-w-xs">{blog.subtitle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2 text-slate-600 font-semibold">
                        <HiUser className="text-slate-400 text-base" />
                        <span>{blog.author}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">
                        <HiTag className="text-slate-400" />
                        {blog.category}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-slate-500">
                      <div className="flex items-center gap-1 text-xs">
                        <HiCalendar className="text-slate-400" />
                        <span>{formatDate(blog.date)}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(blog)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                          title="Edit"
                        >
                          <HiPencil className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id!)}
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-up">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <h2 className="text-2xl font-black text-slate-900">{editingBlog ? 'Edit Blog Post' : 'Write Blog Post'}</h2>
              <button onClick={() => !isSubmitting && setShowModal(false)} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50">
                <HiPlus className="text-3xl rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js 16 Server Components"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-55 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Web Development, Mobile Apps"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Author Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophia Mitchell"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Publish Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Short Summary / Subtitle *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Explore modern page scaling, headless Stripe integration and faster builds."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Cover Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  id="blog-image-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {formData.image ? (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center group">
                    <img
                      src={formData.image}
                      alt="Uploaded cover preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label
                        htmlFor="blog-image-upload"
                        className="bg-white/90 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-md"
                      >
                        Change
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="bg-red-500/90 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-all cursor-pointer shadow-md"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="blog-image-upload"
                    className="flex flex-col items-center justify-center w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/50 hover:border-primary transition-all p-4 text-center gap-2 group"
                  >
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                      <HiPlus className="text-xl" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Click to upload cover image</span>
                    <span className="text-[10px] text-slate-400">Supports PNG, JPG, WEBP</span>
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Article Content *</label>
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{editingBlog ? 'Updating Post...' : 'Publishing Post...'}</span>
                    </>
                  ) : (
                    <span>{editingBlog ? 'Update Post' : 'Publish Post'}</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
