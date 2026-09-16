import React from 'react';
import PageHero from '@/components/home/PageHero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Kenny Tech Studios',
  description: 'Read the terms and conditions for using Kenny Tech Studios services.',
};

interface Policy {
  _id: string;
  title: string;
  content: string;
  order: number;
}

async function getTermsPolicies(): Promise<Policy[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/policies?category=terms`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TermsPage() {
  const policies = await getTermsPolicies();

  return (
    <>
      <PageHero title="Terms & Conditions" currentPage="Terms" />
      <div className="py-20 container max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 space-y-10 text-slate-600 leading-relaxed">

          {/* Intro */}
          <div className="space-y-2">
            <p className="text-slate-500 text-sm font-medium">Last updated: {new Date().getFullYear()}</p>
            <p>
              Please read these Terms &amp; Conditions carefully before using the services offered by{' '}
              <strong className="text-slate-800">Kenny Tech Studios</strong>. By accessing our services, you confirm your acceptance of these terms.
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
            /* Fallback static content if API is unavailable */
            <>
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
                <p>By accessing and using the services of Kenny Tech Studios, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900">2. Services Description</h2>
                <p>Kenny Tech Studios provides software development, web &amp; mobile app development, digital marketing, animation, and video editing services. The specific scope of work for each project will be outlined in a separate agreement or proposal.</p>
              </section>
            </>
          )}

          {/* Contact footer */}
          <div className="pt-6 border-t border-slate-100 text-sm text-slate-500">
            Questions about these terms?{' '}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>{' '}
            and our team will be happy to assist.
          </div>
        </div>
      </div>
    </>
  );
}
