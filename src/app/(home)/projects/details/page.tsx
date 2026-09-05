import React, { Suspense } from 'react';
import ProjectDetailsHero from '@/components/home/ProjectDetailsHero';
import ProjectDetailsContent from '@/components/home/ProjectDetailsContent';
import ProjectCTABanner from '@/components/home/ProjectCTABanner';

export const metadata = {
  title: 'Project Details | Kenny Tech Studios',
  description: 'Detailed insights into the software, web, and mobile app projects developed by Kenny Tech Studios.',
};

const ProjectDetailsPage = () => {
  return (
    <main>
      <ProjectDetailsHero />
      <Suspense fallback={<div className="py-24 text-slate-500 font-medium text-center bg-white">Loading details...</div>}>
        <ProjectDetailsContent />
      </Suspense>
      <ProjectCTABanner />
    </main>
  );
};

export default ProjectDetailsPage;
