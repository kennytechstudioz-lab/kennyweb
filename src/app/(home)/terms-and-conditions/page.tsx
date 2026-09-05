import React from 'react';
import PageHero from '@/components/home/PageHero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Kenny Tech Studios',
  description: 'Read the terms and conditions for using Kenny Tech Studios services.',
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" currentPage="Terms" />
      <div className="py-20 container max-w-4xl">
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 text-slate-600 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the services of Kenny Tech Studios, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">2. Services Description</h2>
            <p>
              Kenny Tech Studios provides software development, web & mobile app development, digital marketing, animation, and video editing services. The specific scope of work for each project will be outlined in a separate agreement or proposal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">3. Intellectual Property</h2>
            <p>
              Unless otherwise agreed in writing, all intellectual property rights for work created by Kenny Tech Studios remain the property of Kenny Tech Studios until full payment is received. Upon full payment, ownership of the final deliverables will be transferred to the client.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">4. Payment Terms</h2>
            <p>
              Payment schedules will be defined in the project proposal. Late payments may result in suspension of work or additional fees as specified in the agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              Kenny Tech Studios shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">6. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Kenny Tech Studios operates.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
