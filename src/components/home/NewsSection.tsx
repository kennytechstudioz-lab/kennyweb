'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaRegCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { blogStore, Blog } from '@/lib/stores/BlogStore';

const NewsSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>(() => {
    return blogStore.blogs.filter(
      (b) => !['hero', 'about', 'why choose us'].includes(b.category?.trim().toLowerCase())
    );
  });

  useEffect(() => {
    async function loadBlogs() {
      const data = await blogStore.getBlogs();
      const newsBlogs = data.filter(
        (b) => !['hero', 'about', 'why choose us'].includes(b.category?.trim().toLowerCase())
      );
      setBlogs(newsBlogs);
    }
    loadBlogs();

    const unsubscribe = blogStore.subscribe(() => {
      const newsBlogs = blogStore.blogs.filter(
        (b) => !['hero', 'about', 'why choose us'].includes(b.category?.trim().toLowerCase())
      );
      setBlogs(newsBlogs);
    });

    return unsubscribe;
  }, []);

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Text (Outline) */}
      <div 
        className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03] whitespace-nowrap" 
        style={{ WebkitTextStroke: '2px #0f172a' }}
      >
        News &amp; Blogs
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <span className="text-2xl">//</span>
            <span className="uppercase tracking-widest text-sm">News &amp; Blogs</span>
          </div>
          <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
            Our Latest <span className="text-primary">News &amp; Blogs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog, index) => {
            const formattedDate = blog.date 
              ? new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : 'Recent Update';

            const summary = blog.subtitle || (
              blog.content 
                ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 110) + '...'
                : 'Explore insights and developments from Kenny Tech Studios.'
            );

            return (
              <div 
                key={blog._id || index} 
                className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {blog.image && blog.image.trim() !== '' ? (
                      <Image 
                        src={blog.image} 
                        alt={blog.title} 
                        fill 
                        unoptimized={blog.image.startsWith('data:') || blog.image.startsWith('http')}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy via-slate-900 to-primary/30 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white/40">{blog.category || 'Kenny Tech'}</span>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    {blog.category && (
                      <div className="absolute bottom-0 left-0 bg-primary text-white px-6 py-2 rounded-tr-3xl font-bold text-sm transform translate-y-1 group-hover:translate-y-0 transition-transform">
                        {blog.category}
                      </div>
                    )}
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      <FaRegCalendarAlt />
                      <span>{formattedDate}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-slate-500 leading-relaxed line-clamp-2 text-sm">
                      {summary}
                    </p>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-2">
                  <div className="pt-4 border-t border-slate-100">
                    <Link 
                      href="/blogs"
                      className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all text-sm"
                    >
                      Read More <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
