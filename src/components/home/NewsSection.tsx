import React from 'react';
import Image from 'next/image';
import { FaRegCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const blogs = [
  {
    title: 'The Future of Web Development: Trends to Watch in 2025',
    category: 'Web Development',
    date: 'February 10, 2025',
    image: '/project-2.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...'
  },
  {
    title: 'The Role of AI in Cloud Computing and Automation',
    category: 'Cloud Computing',
    date: 'February 09, 2025',
    image: '/project-3.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...'
  },
  {
    title: 'The Rise of Super Apps: What It Means for Business...',
    category: 'Mobile App',
    date: 'February 08, 2025',
    image: '/project-1.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...'
  }
];

const NewsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03] whitespace-nowrap" style={{ WebkitTextStroke: '2px #0f172a' }}>
        News & Blogs
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <span className="text-2xl">//</span>
            <span className="uppercase tracking-widest text-sm">News & Blogs</span>
          </div>
          <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
            Our Latest <span className="text-primary">News & Blogs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src={blog.image} 
                  alt={blog.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Category Badge */}
                <div className="absolute bottom-0 left-0 bg-primary text-white px-6 py-2 rounded-tr-3xl font-bold text-sm transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  {blog.category}
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <FaRegCalendarAlt />
                  <span>{blog.date}</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-slate-500 leading-relaxed line-clamp-2">
                  {blog.description}
                </p>

                <div className="pt-4 border-t border-slate-100">
                  <a 
                    href="#" 
                    className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                  >
                    Read More <FaArrowRight className="text-xs" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
