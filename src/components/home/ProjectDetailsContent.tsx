'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { HiCheckCircle, HiVideoCamera, HiCurrencyDollar, HiBriefcase, HiUserGroup } from 'react-icons/hi';
import { projectStore, Project } from '@/lib/stores/ProjectStore';

const ProjectDetailsContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const allProjects = await projectStore.getProjects();
      const current = allProjects.find((p) => p._id === id);
      if (current) {
        setProject(current);
      } else if (allProjects.length > 0) {
        // Fallback to first project if no id matches
        setProject(allProjects[0]);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 font-medium bg-white">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-24 text-center text-slate-500 font-semibold bg-white">
        No project details registered.
      </div>
    );
  }

  const checkItems = [
    "Experienced agile team delivery",
    "Continuous software updates",
    "Clean typescript code architecture",
    "Robust cloud server deployments",
    "Interactive UI/UX layouts",
    "Comprehensive security audits"
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container">
        {/* Project Large Image */}
        <div className="relative aspect-[16/9] rounded-2xl md:rounded-[40px] overflow-hidden mb-16 shadow-2xl bg-slate-100">
          <Image 
            src={project.image} 
            alt={project.name} 
            fill 
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold text-slate-900">
                {project.name}
              </h2>
              
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {project.name[0]}
                </div>
                <p className="text-slate-600 leading-relaxed text-lg italic font-medium">
                  {project.category} tailored specifically to streamline business workflow.
                </p>
              </div>

              {/* Dynamic HTML Content */}
              <div 
                className="text-slate-500 text-base leading-relaxed prose prose-blue max-w-none prose-p:mb-4"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </div>

            {project.videoUrl && (
              <div className="p-6 px-[10px] md:px-6 bg-red-50/50 rounded-3xl border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 min-w-[3rem] flex-shrink-0 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-md">
                    <HiVideoCamera className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Video Demo Available</p>
                    <p className="text-sm text-slate-500">Watch the direct interactive visual video of the software demo.</p>
                  </div>
                </div>
                <a 
                  href={project.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-md shadow-red-500/20 text-center w-full sm:w-auto"
                >
                  Watch Video
                </a>
              </div>
            )}

            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-900">Project Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(project.features && project.features.length > 0 ? project.features : checkItems).map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-700 font-semibold">
                    <HiCheckCircle className="text-primary text-2xl flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Meta Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-navy rounded-[30px] px-[10px] md:px-10 py-10 text-white relative overflow-hidden shadow-xl sticky top-24">
              <div className="absolute inset-0 opacity-10 bg-repeat bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <HiBriefcase className="text-primary text-sm" /> Project Category :
                  </p>
                  <p className="text-xl font-bold">{project.category}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <HiUserGroup className="text-primary text-sm" /> Assigned Lead :
                  </p>
                  <p className="text-xl font-bold">{project.staff}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <HiCurrencyDollar className="text-primary text-sm" /> Project Value :
                  </p>
                  <p className="text-2xl font-black text-primary">${project.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailsContent;
