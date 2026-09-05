'use client';

import React, { useState, useEffect } from 'react';
import { faqStore, Faq } from '@/lib/stores/FaqStore';
import { HiPlus, HiTrash, HiPencil, HiQuestionMarkCircle, HiFolder } from 'react-icons/hi';
import { useToast } from '@/components/ToastProvider';

export default function AdminFaq() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast, showConfirm } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [formData, setFormData] = useState<Partial<Faq>>({
    category: '',
    question: '',
    answer: '',
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const data = await faqStore.getFaqs();
    setFaqs(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let success = false;
    if (editingFaq?._id) {
      const res = await faqStore.updateFaq(editingFaq._id, formData);
      success = res !== null;
      if (success) showToast('FAQ updated successfully!', 'success');
    } else {
      const res = await faqStore.createFaq(formData as Faq);
      success = res !== null;
      if (success) showToast('FAQ created successfully!', 'success');
    }
    if (!success) {
      showToast('Failed to save FAQ', 'error');
    }
    setShowModal(false);
    setEditingFaq(null);
    setFormData({ category: '', question: '', answer: '' });
    await fetchFaqs();
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: 'Delete FAQ',
      message: 'Are you sure you want to delete this FAQ? This action is permanent.',
      variant: 'danger',
      confirmText: 'Delete FAQ',
      onConfirm: async () => {
        setLoading(true);
        const success = await faqStore.deleteFaq(id);
        if (success !== false) {
          showToast('FAQ deleted successfully!', 'success');
        } else {
          showToast('Failed to delete FAQ', 'error');
        }
        await fetchFaqs();
      }
    });
  };

  const openEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setFormData(faq);
    setShowModal(true);
  };

  if (loading) return <div className="p-8 text-center">Loading FAQs...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">FAQ Management</h1>
          <p className="text-slate-500 font-medium">Manage frequently asked questions and their answers.</p>
        </div>
        <button
          onClick={() => {
            setEditingFaq(null);
            setFormData({ category: '', question: '', answer: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <HiPlus className="text-xl" />
          Add New FAQ
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {faqs.map((faq) => (
          <div key={faq._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full w-fit text-sm font-bold">
                <HiFolder />
                {faq.category}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <HiQuestionMarkCircle className="text-primary flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-slate-500 leading-relaxed pl-7">{faq.answer}</p>
              </div>
            </div>
            <div className="flex md:flex-col gap-2 items-center justify-center md:border-l md:border-slate-100 md:pl-6">
              <button
                onClick={() => openEdit(faq)}
                className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <HiPencil className="text-xl" />
              </button>
              <button
                onClick={() => handleDelete(faq._id!)}
                className="p-3 bg-slate-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <HiTrash className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <HiPlus className="text-3xl rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Services, Billing, General"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Question</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Answer</label>
                <textarea
                  required
                  rows={6}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all resize-none"
                ></textarea>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                  {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">
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
