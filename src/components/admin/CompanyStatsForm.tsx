'use client';

import React, { useState, useEffect } from 'react';
import { companyStore, Company } from '@/lib/stores/CompanyStore';
import { HiChartBar, HiBriefcase, HiUserGroup, HiBadgeCheck, HiClock, HiSave } from 'react-icons/hi';

interface Props {
  company: Company | null;
  onUpdate: (data: Company) => void;
}

export default function CompanyStatsForm({ company, onUpdate }: Props) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<{
    yearsExperience: string;
    completedJobs: string;
    clients: string;
    customerSatisfaction: string;
  }>({
    yearsExperience: '18+',
    completedJobs: '150+',
    clients: '2000+',
    customerSatisfaction: '99%',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        yearsExperience: company.yearsExperience || '18+',
        completedJobs: company.completedJobs || '150+',
        clients: company.clients || '2000+',
        customerSatisfaction: company.customerSatisfaction || '99%',
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

    // Format customer satisfaction if user omitted % sign
    let formattedSatisfaction = formData.customerSatisfaction.trim();
    if (formattedSatisfaction && !formattedSatisfaction.endsWith('%') && !isNaN(Number(formattedSatisfaction))) {
      formattedSatisfaction = `${formattedSatisfaction}%`;
    }

    const payload = {
      ...formData,
      customerSatisfaction: formattedSatisfaction,
    };

    const updated = await companyStore.updateCompany(payload);
    if (updated) {
      onUpdate(updated);
      setFormData(prev => ({ ...prev, customerSatisfaction: formattedSatisfaction }));
      setMessage({ type: 'success', text: 'Metrics updated successfully!' });
      setTimeout(() => setMessage(null), 3500);
    } else {
      setMessage({ type: 'error', text: 'Failed to update metrics.' });
    }
    setSaving(false);
  };

  const statFields = [
    {
      name: 'completedJobs',
      label: 'Completed Jobs',
      subtext: 'Replaces "Team Members" in the Home stats section',
      icon: HiBriefcase,
      placeholder: 'e.g. 150+',
    },
    {
      name: 'clients',
      label: 'Happy Clients',
      subtext: 'Total satisfied clients served',
      icon: HiUserGroup,
      placeholder: 'e.g. 2000+',
    },
    {
      name: 'customerSatisfaction',
      label: 'Customer Satisfaction (%)',
      subtext: 'Client approval rating percentage',
      icon: HiBadgeCheck,
      placeholder: 'e.g. 99%',
    },
    {
      name: 'yearsExperience',
      label: 'Years of Experience',
      subtext: 'Total years in the IT & tech industry',
      icon: HiClock,
      placeholder: 'e.g. 18+',
    },
  ];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="px-[10px] sm:px-8 py-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HiChartBar className="text-primary text-xl" />
          Company Metrics & Statistics
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Manage the key numbers displayed on the homepage stats section.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-[10px] sm:p-8 flex flex-col flex-1 space-y-5">
        {statFields.map(({ name, label, subtext, icon: Icon, placeholder }) => (
          <div key={name} className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">
                {label}
              </label>
              <span className="text-[11px] text-slate-400 font-medium ml-1 sm:ml-0">
                {subtext}
              </span>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                <Icon />
              </div>
              <input
                type="text"
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-900 text-sm"
                placeholder={placeholder}
              />
            </div>
          </div>
        ))}

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-semibold transition-all ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="pt-4 mt-auto">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Metrics...</span>
              </>
            ) : (
              <>
                <HiSave className="text-lg" />
                <span>Save Metrics</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
