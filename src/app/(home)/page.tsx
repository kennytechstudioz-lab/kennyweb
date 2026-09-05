import React from 'react';
import Hero from '@/components/home/Hero';
import ServicesScroll from '@/components/home/ServicesScroll';
import AboutSection from '@/components/home/AboutSection';
import ServicesGridSection from '@/components/home/ServicesGridSection';
import WorkProcessSection from '@/components/home/WorkProcessSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TeamSection from '@/components/home/TeamSection';
import StatsSection from '@/components/home/StatsSection';
import NewsSection from '@/components/home/NewsSection';
import FaqSection from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesScroll />
      <AboutSection />
      <ServicesGridSection />
      <WorkProcessSection />
      <ServicesScroll />
      <WhyChooseUsSection />
      <ProjectsSection />
      <ServicesScroll />
      <TestimonialsSection />
      <TeamSection />
      <StatsSection />
      <NewsSection />
    </>
  );
}











