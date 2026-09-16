import React from 'react';
import PageHero from '@/components/home/PageHero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Kenny Tech Studios',
  description: 'Learn how Kenny Tech Studios collects, uses, and protects your personal information.',
};

interface Policy {
  _id: string;
  title: string;
  content: string;
  order: number;
}

async function getPrivacyPolicies(): Promise<Policy[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/policies?category=privacy`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function PrivacyPolicyPage() {
  const policies = await getPrivacyPolicies();

  return (
    <>
      <PageHero title="Privacy Policy" currentPage="Privacy Policy" />
      <div className="py-20 container max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 space-y-10 text-slate-600 leading-relaxed">

          {/* Intro */}
          <div className="space-y-2">
            <p className="text-slate-500 text-sm font-medium">Last updated: {new Date().getFullYear()}</p>
            <p>
              At <strong className="text-slate-800">Kenny Tech Studios</strong>, your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, and the steps we take to protect it.
            </p>
          </div>

          {/* Dynamic sections */}
          {policies.length > 0 ? (
            policies.map((policy, index) => (
              <section key={policy._id} className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900">
                  {index + 1}. {policy.title}
                </h2>
                <p>{policy.content}</p>
              </section>
            ))
          ) : (
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
              <p>We collect personal information you voluntarily provide when registering for an account, submitting a project inquiry, or contacting us.</p>
            </section>
          )}

          {/* Contact footer */}
          <div className="pt-6 border-t border-slate-100 text-sm text-slate-500">
            Have questions about this policy?{' '}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>{' '}
            and we&apos;ll be happy to help.
          </div>
        </div>
      </div>
    </>
  );
}
