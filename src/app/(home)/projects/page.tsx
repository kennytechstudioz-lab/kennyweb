import React from 'react';
import ProjectsHero from '@/components/home/ProjectsHero';
import ProjectsList from '@/components/home/ProjectsList';
import ProjectCTABanner from '@/components/home/ProjectCTABanner';
import NewsletterSection from '@/components/home/NewsletterSection';

export const metadata = {
  title: 'Our Projects | Kenny Tech Studios',
  description: 'Discover the portfolio of successful projects by Kenny Tech Studios, featuring software development, web apps, mobile apps, animation, and digital marketing campaigns.',
};

const ProjectsPage = () => {
  return (
    <main>
      <ProjectsHero />
      <ProjectsList />
      <ProjectCTABanner />
      <NewsletterSection />
    </main>
  );
};

export default ProjectsPage;
