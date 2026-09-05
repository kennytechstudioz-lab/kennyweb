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

  const imageUrl = aboutBlog?.image || '/about-1.png';

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Text (Outline) */}
      <div
        className="absolute top-24 right-[-5%] text-[12rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03]"
        style={{ WebkitTextStroke: '2px #0f172a' }}
      >
        About Us
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Single Picture dynamically loaded from category 'About' blog post (Cards removed, reduced height) */}
          <div className="relative">
            <div className="relative h-[360px] md:h-[420px] w-full rounded-[30px] overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <Image
                src={imageUrl}
                alt={aboutBlog?.title || 'About Us'}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                unoptimized={imageUrl.startsWith('data:') || imageUrl.startsWith('http')}
              />
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-2xl">//</span>
              <span className="uppercase tracking-widest text-sm">About Us</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.1] text-slate-900">
              {aboutBlog ? (
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
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
