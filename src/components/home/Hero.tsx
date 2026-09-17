'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { blogStore, Blog } from '@/lib/stores/BlogStore';

const Hero = () => {
  const [heroBlog, setHeroBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchHeroBlog = async () => {
      try {
        const blogs = await blogStore.getBlogs();
        const hero = blogs.find(
          (blog) => blog.category && blog.category.trim().toLowerCase() === 'hero'
        );
        if (hero) {
          setHeroBlog(hero);
        }
      } catch (error) {
        console.error('Error fetching hero blog:', error);
      }
    };
    fetchHeroBlog();
  }, []);

  const bgStyle = heroBlog?.image
    ? { backgroundImage: `url(${heroBlog.image})` }
    : {};

  return (
    <section
      className="relative h-[600px] md:h-[800px] bg-cover bg-center flex items-center text-white overflow-hidden bg-navy bg-gradient-to-br from-[#080e21] via-navy to-[#050a16]"
      style={bgStyle}
    >
      {/* Ambient background glowing accents */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/40 z-[1]"></div>
      <div className="relative z-[2] container">
        <div className="max-w-[700px]">
          <div className="flex items-center gap-2 font-semibold mb-6 text-[1.1rem]">
            <span className="text-primary text-2xl">//</span>
            <span>{heroBlog ? heroBlog.author : 'Experience The Best IT Solutions'}</span>
          </div>
          <h1 className="text-[2.5rem] md:text-[4.5rem] leading-[1.1] font-extrabold mb-8">
            {heroBlog ? (
              heroBlog.title
            ) : (
              <>
                Where Creativity<br />
                Meets Cutting-Edge<br />
                Technology
              </>
            )}
          </h1>
          <p className="text-[1.1rem] text-white/80 mb-12 max-w-[500px]">
            {heroBlog
              ? heroBlog.subtitle
              : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'}
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
            <Link href="/signup">
              <button className="bg-primary text-white px-10 py-4 rounded-full font-semibold flex items-center gap-3 transition-all hover:bg-primary-dark hover:translate-x-1.5 cursor-pointer">
                Signup <FaArrowRight className="text-lg" />
              </button>
            </Link>
            <button className="text-white font-semibold text-[1.1rem] relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white after:transition-all hover:after:bg-primary hover:after:w-1/2">
              View All Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


