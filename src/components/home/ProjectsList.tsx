'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { projectStore, Project } from '@/lib/stores/ProjectStore';

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await projectStore.getProjects();
      setProjects(data);
      
      // Calculate distinct categories dynamically
      const uniqueCats = ["All", ...Array.from(new Set(data.map(p => p.category)))];
      setCategories(uniqueCats);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <section className="py-24 bg-white text-center text-slate-500 font-medium">
        Loading projects list...
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2 font-semibold text-primary">
            <span className="text-2xl">//</span>
            <span className="uppercase tracking-widest text-sm">Our Latest Projects</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Explore Our Showcase of<br />
            <span className="text-primary">Featured Works</span>
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-8 py-3 rounded-full font-semibold transition-all cursor-pointer
                ${activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-white text-slate-600 border border-slate-100 hover:border-primary hover:text-primary'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-semibold">
            No projects found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {filteredProjects.map((project) => (
              <Link key={project._id} href={`/projects/details?id=${project._id}`}>
                <div className="group relative rounded-[30px] overflow-hidden aspect-[3/4] cursor-pointer">
                  <Image 
                    src={project.image} 
                    alt={project.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent p-6 xl:p-8 flex flex-col justify-end">
                    <div className="space-y-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl xl:text-2xl font-bold text-white leading-tight">
                        {project.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] xl:text-xs font-bold rounded-full border border-white/20">
                          {project.category}
                        </span>
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] xl:text-xs font-bold rounded-full border border-white/20">
                          ${project.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Button */}
                    <div className="absolute bottom-6 right-6 xl:bottom-8 xl:right-8 w-10 h-10 xl:w-12 xl:h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl xl:text-2xl transform translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-primary shadow-xl shadow-primary/30 rotate-[-45deg] group-hover:rotate-0">
                      <HiOutlineArrowNarrowRight />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsList;
