'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { projectStore, Project } from '@/lib/stores/ProjectStore';

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>(() => projectStore.projects.slice(0, 4));
  const [loading, setLoading] = useState(projectStore.projects.length === 0);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await projectStore.getProjects();
      // Show top 4 projects on homepage
      setProjects(data.slice(0, 4));
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading && projects.length === 0) {
    return null;
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03] whitespace-nowrap" style={{ WebkitTextStroke: '2px #0f172a' }}>
        Latest Projects
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <span className="text-2xl">//</span>
            <span className="uppercase tracking-widest text-sm">Our Latest Projects</span>
          </div>
          <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
            Explore Our Showcase of<br />
            <span className="text-primary">Featured Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {projects.map((project) => (
            <Link 
              key={project._id}
              href={`/projects/details?id=${project._id}`}
              className="group relative aspect-square rounded-[40px] overflow-hidden shadow-2xl cursor-pointer block"
            >
              {project.image && project.image.trim() !== '' ? (
                <Image 
                  src={project.image} 
                  alt={project.name} 
                  fill 
                  unoptimized={project.image.startsWith('data:') || project.image.startsWith('http')}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy via-slate-900 to-primary/40 flex items-center justify-center">
                  <span className="text-4xl font-black text-white/30">{project.category || 'Project'}</span>
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <h3 className="text-3xl font-bold text-white mb-6 leading-tight max-w-[85%]">
                  {project.name}
                </h3>
                
                <div className="flex flex-wrap gap-3">
                  <span className="px-6 py-2 border border-white/30 rounded-full text-white text-sm font-medium backdrop-blur-sm bg-white/5">
                    {project.category}
                  </span>
                  <span className="px-6 py-2 border border-white/30 rounded-full text-white text-sm font-medium backdrop-blur-sm bg-white/5">
                    Assigned: {project.staff}
                  </span>
                </div>
                
                {/* Floating Arrow Button */}
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-xl transform rotate-[-45deg] group-hover:rotate-0 transition-transform duration-500">
                  <FaArrowRight className="text-xl" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link 
            href="/projects"
            className="bg-primary text-white px-12 py-5 rounded-full font-bold text-lg transition-all hover:bg-primary-dark hover:-translate-y-1 shadow-lg hover:shadow-primary/40 flex items-center gap-3 cursor-pointer"
          >
            View All Works <HiOutlineArrowNarrowRight className="text-2xl" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
