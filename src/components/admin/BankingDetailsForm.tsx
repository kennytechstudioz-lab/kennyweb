'use client';

import React, { useState, useEffect } from 'react';
import { companyStore, Company } from '@/lib/stores/CompanyStore';
import { HiLibrary, HiUser, HiIdentification } from 'react-icons/hi';

interface Props {
  company: Company | null;
  onUpdate: (data: Company) => void;
}

export default function BankingDetailsForm({ company, onUpdate }: Props) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState<Partial<Company>>({
    bankName: '',
    accountName: '',
    accountNumber: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        bankName: company.bankName || '',
        accountName: company.accountName || '',
        accountNumber: company.accountNumber || '',
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const updated = await companyStore.updateCompany(formData);
    if (updated) {
      onUpdate(updated);
      setMessage({ type: 'success', text: 'Banking details updated!' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to update.' });
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HiLibrary className="text-primary" />
          Banking Details
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-8 flex flex-col flex-1 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Bank Name</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <HiLibrary />
            </div>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-900"
              placeholder="Enter bank name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Account Name</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <HiUser />
            </div>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-900"
              placeholder="Enter account name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Account Number</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <HiIdentification />
            </div>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-900"
              placeholder="Enter account number"
            />
          </div>
        </div>

        <div className="pt-4 mt-auto">
          {message && (
            <div className={`mb-4 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              {message.text}
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Updating...' : 'Update Banking'}
          </button>
        </div>
      </form>
    </div>
  );
}
