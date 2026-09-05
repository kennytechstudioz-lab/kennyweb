'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { serviceStore, Service } from '@/lib/stores/ServiceStore';
import { 
  HiPlus, 
  HiTrash, 
  HiPencil, 
  HiVideoCamera, 
  HiCode, 
  HiCamera, 
  HiServer, 
  HiDatabase, 
  HiShieldCheck, 
  HiDeviceMobile, 
  HiDesktopComputer, 
  HiTrendingUp, 
  HiLightningBolt, 
  HiSupport, 
  HiTemplate, 
  HiGlobe, 
  HiBriefcase, 
  HiSparkles,
  HiQuestionMarkCircle
} from 'react-icons/hi';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useToast } from '@/components/ToastProvider';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const AVAILABLE_ICONS = [
  { name: 'HiCode', label: 'Development', icon: HiCode },
  { name: 'HiCamera', label: 'Photography', icon: HiCamera },
  { name: 'HiVideoCamera', label: 'Videography', icon: HiVideoCamera },
  { name: 'HiServer', label: 'Cloud/Server', icon: HiServer },
  { name: 'HiDatabase', label: 'Database', icon: HiDatabase },
  { name: 'HiShieldCheck', label: 'Security', icon: HiShieldCheck },
  { name: 'HiDeviceMobile', label: 'Mobile Apps', icon: HiDeviceMobile },
  { name: 'HiDesktopComputer', label: 'Desktop/Web', icon: HiDesktopComputer },
  { name: 'HiTrendingUp', label: 'Marketing/SEO', icon: HiTrendingUp },
  { name: 'HiLightningBolt', label: 'Performance', icon: HiLightningBolt },
  { name: 'HiSupport', label: 'IT Support', icon: HiSupport },
  { name: 'HiTemplate', label: 'UI/UX Design', icon: HiTemplate },
  { name: 'HiGlobe', label: 'Web/Global', icon: HiGlobe },
  { name: 'HiBriefcase', label: 'Business', icon: HiBriefcase },
  { name: 'HiSparkles', label: 'Creative', icon: HiSparkles },
];

const IconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  HiCode,
  HiCamera,
  HiVideoCamera,
  HiServer,
  HiDatabase,
  HiShieldCheck,
  HiDeviceMobile,
  HiDesktopComputer,
  HiTrendingUp,
  HiLightningBolt,
  HiSupport,
  HiTemplate,
  HiGlobe,
  HiBriefcase,
  HiSparkles
};

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = IconMap[name] || HiQuestionMarkCircle;
  return <IconComponent className={className} />;
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast, showConfirm } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    subtitle: '',
    image: '',
    icon: 'HiCode',
    content: '',
    videoUrl: '',
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
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const data = await serviceStore.getServices();
    setServices(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subtitle || !formData.image || !formData.content) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    // Automatically determine appropriate icon based on title keywords
    const titleLower = (formData.title || '').toLowerCase();
    let computedIcon = 'HiSparkles';
    if (titleLower.includes('web') || titleLower.includes('cod') || titleLower.includes('soft') || titleLower.includes('dev')) {
      computedIcon = 'HiCode';
    } else if (titleLower.includes('mobil') || titleLower.includes('app') || titleLower.includes('phone')) {
      computedIcon = 'HiDeviceMobile';
    } else if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux') || titleLower.includes('layout')) {
      computedIcon = 'HiTemplate';
    } else if (titleLower.includes('market') || titleLower.includes('seo') || titleLower.includes('advertis')) {
      computedIcon = 'HiTrendingUp';
    } else if (titleLower.includes('video') || titleLower.includes('edit') || titleLower.includes('film') || titleLower.includes('animat')) {
      computedIcon = 'HiVideoCamera';
    } else if (titleLower.includes('phot') || titleLower.includes('cam')) {
      computedIcon = 'HiCamera';
    } else if (titleLower.includes('sec') || titleLower.includes('protect') || titleLower.includes('cyber')) {
      computedIcon = 'HiShieldCheck';
    } else if (titleLower.includes('serv') || titleLower.includes('cloud') || titleLower.includes('host')) {
      computedIcon = 'HiServer';
    } else if (titleLower.includes('db') || titleLower.includes('data')) {
      computedIcon = 'HiDatabase';
    }

    const payload = {
      ...formData,
      icon: computedIcon
    };

    if (editingService?._id) {
      await serviceStore.updateService(editingService._id, payload);
    } else {
      await serviceStore.createService(payload as Service);
    }
    setShowModal(false);
    setEditingService(null);
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      icon: 'HiCode',
      content: '',
      videoUrl: '',
    });
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: 'Delete Service',
      message: 'Are you sure you want to delete this service? This action is permanent.',
      variant: 'danger',
      confirmText: 'Delete Service',
      onConfirm: async () => {
        setLoading(true);
        const success = await serviceStore.deleteService(id);
        if (success !== false) {
          showToast('Service deleted successfully!', 'success');
        } else {
          showToast('Failed to delete service', 'error');
        }
        await fetchServices();
      }
    });
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setShowModal(true);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading services...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Services Management</h1>
          <p className="text-slate-500 font-medium">Manage the core services offered by Kenny Tech Studios.</p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            setFormData({
              title: '',
              subtitle: '',
              image: '',
              icon: 'HiCode',
              content: '',
              videoUrl: '',
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          <HiPlus className="text-xl" />
          Add New Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500">
          <p className="text-lg font-semibold">No services found.</p>
          <p className="text-sm">Click the button above to add your first service.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="relative h-48 w-full bg-slate-100 flex-shrink-0">
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {/* Float Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => openEdit(service)}
                    className="p-2 bg-white text-primary rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all cursor-pointer"
                    title="Edit Service"
                  >
                    <HiPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id!)}
                    className="p-2 bg-white text-red-500 rounded-lg shadow-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    title="Delete Service"
                  >
                    <HiTrash />
                  </button>
                </div>
                {/* Visual Icon Badge */}
                <div className="absolute bottom-4 left-4 p-3 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center z-10">
                  <DynamicIcon name={service.icon} className="text-2xl" />
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-sm font-semibold text-slate-400">{service.subtitle}</p>
                  </div>
                  <div 
                    className="text-slate-500 text-sm line-clamp-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: service.content }}
                  />
                </div>
                
                {service.videoUrl && (
                  <div className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs font-bold text-red-500">
                    <HiVideoCamera className="text-sm" />
                    <a href={service.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Watch Video Introduction
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <h2 className="text-2xl font-black text-slate-900">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <HiPlus className="text-3xl rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Graphic Design"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Service Subtitle *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High-quality print & digital assets"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
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
              </div>



              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Service Description / Content *</label>
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
                  {editingService ? 'Update Service' : 'Create Service'}
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
