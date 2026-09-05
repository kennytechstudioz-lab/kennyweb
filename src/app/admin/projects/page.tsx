'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { projectStore, Project } from '@/lib/stores/ProjectStore';
import { HiPlus, HiTrash, HiPencil, HiCollection, HiVideoCamera, HiTag, HiUser } from 'react-icons/hi';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useToast } from '@/components/ToastProvider';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast, showConfirm } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    image: '',
    videoUrl: '',
    description: '',
    category: '',
    staff: '',
    price: 0,
    features: [],
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
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const data = await projectStore.getProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image || !formData.description || !formData.category || !formData.staff || formData.price === undefined) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    if (editingProject?._id) {
      await projectStore.updateProject(editingProject._id, formData);
    } else {
      await projectStore.createProject(formData as Project);
    }
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      name: '',
      image: '',
      videoUrl: '',
      description: '',
      category: '',
      staff: '',
      price: 0,
      features: [],
    });
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action is permanent.',
      variant: 'danger',
      confirmText: 'Delete Project',
      onConfirm: async () => {
        setLoading(true);
        const success = await projectStore.deleteProject(id);
        if (success !== false) {
          showToast('Project deleted successfully!', 'success');
        } else {
          showToast('Failed to delete project', 'error');
        }
        await fetchProjects();
      }
    });
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      ...project,
      features: project.features || [],
    });
    setShowModal(true);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading projects...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Projects Directory</h1>
          <p className="text-slate-500 font-medium">Manage and monitor all development projects of Kenny Tech Studios.</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setFormData({ name: '', image: '', videoUrl: '', description: '', category: '', staff: '', price: 0, features: [] });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          <HiPlus className="text-xl" />
          Add New Project
        </button>
      </div>

      {/* Table List Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-5 px-6 w-20">S/N</th>
                <th className="py-5 px-6">Image</th>
                <th className="py-5 px-6">Project Name</th>
                <th className="py-5 px-6">Category</th>
                <th className="py-5 px-6">Assigned Staff</th>
                <th className="py-5 px-6">Budget (Price)</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold">
                    No projects registered yet. Click the button above to add your first project.
                  </td>
                </tr>
              ) : (
                projects.map((project, idx) => (
                  <tr key={project._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6 text-slate-400 font-bold">#{idx + 1}</td>
                    <td className="py-4.5 px-6">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                        {project.image && (
                          <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                          <HiCollection className="text-sm" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{project.name}</span>
                          {project.videoUrl && (
                            <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5 mt-0.5">
                              <HiVideoCamera /> Has Video Presenter
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">
                        <HiTag className="text-slate-400" />
                        {project.category}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2 text-slate-600 font-semibold">
                        <HiUser className="text-slate-400 text-base" />
                        <span>{project.staff}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-slate-900 font-black">${project.price.toLocaleString()}</td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(project)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                          title="Edit"
                        >
                          <HiPencil className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id!)}
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
              <h2 className="text-2xl font-black text-slate-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <HiPlus className="text-3xl rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Care Connect App"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mobile App Development"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Project Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="project-image-upload"
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
                    <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center group">
                      <img
                        src={formData.image}
                        alt="Uploaded project preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label
                          htmlFor="project-image-upload"
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
                      htmlFor="project-image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/50 hover:border-primary transition-all p-4 text-center gap-2 group"
                    >
                      <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                        <HiPlus className="text-xl" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Click to upload image</span>
                      <span className="text-[10px] text-slate-400">Supports PNG, JPG, WEBP</span>
                    </label>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Video URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. YouTube, Vimeo or direct video link"
                    value={formData.videoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Assigned Staff *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ava Mitchell"
                    value={formData.staff}
                    onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Price ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Project Description *</label>
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

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Project Features</label>
                  <button
                    type="button"
                    onClick={() => {
                      const currentFeatures = formData.features || [];
                      setFormData({ ...formData, features: [...currentFeatures, ''] });
                    }}
                    className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <HiPlus className="text-sm" /> Add Feature
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(!formData.features || formData.features.length === 0) ? (
                    <p className="text-xs text-slate-400 font-medium italic">No features added yet. Click "Add Feature" above to list key features of this project.</p>
                  ) : (
                    formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          required
                          placeholder={`Feature #${index + 1}`}
                          value={feature}
                          onChange={(e) => {
                            const updated = [...(formData.features || [])];
                            updated[index] = e.target.value;
                            setFormData({ ...formData, features: updated });
                          }}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all font-medium text-slate-800 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.features || []).filter((_, idx) => idx !== index);
                            setFormData({ ...formData, features: updated });
                          }}
                          className="p-3 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                          title="Remove Feature"
                        >
                          <HiTrash className="text-lg" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-4 flex-shrink-0">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer">
                  {editingProject ? 'Update Project' : 'Create Project'}
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
