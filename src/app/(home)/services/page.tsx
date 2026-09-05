import React from 'react';
import ServicesHero from '@/components/home/ServicesHero';
import ServicesList from '@/components/home/ServicesList';
import ServicesMarquee from '@/components/home/ServicesMarquee';

export const metadata = {
  title: 'Our Services | Kenny Tech Studios',
  description: 'Explore the wide range of services Kenny Tech Studios provides, including software development, web apps, mobile apps, animation, video editing, and digital marketing.',
};

const ServicesPage = () => {
  return (
    <main>
      <ServicesHero />
      <ServicesList />
      <ServicesMarquee />
    </main>
  );
};

export default ServicesPage;
