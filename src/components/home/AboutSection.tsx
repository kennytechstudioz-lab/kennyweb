'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { blogStore, Blog } from '@/lib/stores/BlogStore';

const AboutSection = () => {
  const [aboutBlog, setAboutBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchAboutBlog = async () => {
      try {
        const blogs = await blogStore.getBlogs();
        const found = blogs.find(
          (blog) => blog.category && blog.category.trim().toLowerCase() === 'about'
        );
        if (found) {
          setAboutBlog(found);
        }
      } catch (error) {
        console.error('Error fetching about blog:', error);
      }
    };
    fetchAboutBlog();
  }, []);

  const hasImage = Boolean(aboutBlog?.image && aboutBlog.image.trim() !== '');

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white scroll-mt-20">
      {/* Background Text (Outline) */}
      <div
        className="absolute top-24 right-[-5%] text-[12rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03]"
        style={{ WebkitTextStroke: '2px #0f172a' }}
      >
        About Us
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Dynamic Image or Branded Showcase Card (No placeholder photos) */}
          <div className="relative">
            <div className="relative h-[360px] md:h-[420px] w-full rounded-[30px] overflow-hidden shadow-xl border-4 border-white bg-slate-100 flex items-center justify-center">
              {hasImage && aboutBlog?.image ? (
                <Image
                  src={aboutBlog.image}
                  alt={aboutBlog?.title || 'About Us'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  unoptimized={aboutBlog.image.startsWith('data:') || aboutBlog.image.startsWith('http')}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy via-slate-900 to-primary/30 p-10 flex flex-col justify-between text-white relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                    <span className="text-3xl font-black">//</span>
                  </div>
                  <div>
                    <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">Our Mission</span>
                    <h3 className="text-2xl md:text-3xl font-black leading-tight">Delivering High-Impact Digital Solutions &amp; Innovation</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Kenny Tech Studios Enterprise Solutions</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-2xl">//</span>
              <span className="uppercase tracking-widest text-sm">About Us</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.1] text-slate-900">
              {aboutBlog?.title && aboutBlog.title.trim().toLowerCase() !== 'about us' ? (
                aboutBlog.title
              ) : (
                <>
                  Transforming <span className="text-primary">Ideas</span><br />
                  <span className="text-primary">into Digital</span> Reality
                </>
              )}
            </h2>

            <p className="text-slate-500 text-lg leading-relaxed">
              {aboutBlog?.subtitle ||
                'At Kenny Tech Studios, we specialize in cutting-edge web & mobile application development, UI/UX design, brand identity, digital marketing, and video editing — turning visionary ideas into scalable digital realities that accelerate business growth.'}
            </p>

            {/* Service Highlights */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                'Web Development',
                'Mobile Apps',
                'UI/UX Design',
                'Graphic Branding',
                'Digital Marketing',
                'Video Editing'
              ].map((service, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                  {service}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
