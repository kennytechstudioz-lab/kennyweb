'use client';

import React, { useState, useEffect } from 'react';
import { companyStore, Company } from '@/lib/stores/CompanyStore';
import CompanyDetailsForm from '@/components/admin/CompanyDetailsForm';
import BankingDetailsForm from '@/components/admin/BankingDetailsForm';

export default function CompanySettings() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    const data = await companyStore.getCompany();
    if (data) {
      setCompany(data);
    }
    setLoading(false);
  };

  const handleUpdate = (updatedCompany: Company) => {
    setCompany(updatedCompany);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Company Settings</h1>
        <p className="text-slate-500 font-medium">Manage your company's core information and banking details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <CompanyDetailsForm company={company} onUpdate={handleUpdate} />
        <BankingDetailsForm company={company} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
