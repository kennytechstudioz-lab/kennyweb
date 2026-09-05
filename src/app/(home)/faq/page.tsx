import React from 'react';
import PageHero from '@/components/home/PageHero';
import FaqSection from '@/components/home/FaqSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Kenny Tech Studios',
  description: 'Frequently asked questions about Kenny Tech Studios services, development process, and more.',
};

export default function FaqPage() {
  return (
    <>
      <PageHero title="Frequently Asked Questions" currentPage="FAQ" />
      <FaqSection />
    </>
  );
}
