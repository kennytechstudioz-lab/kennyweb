'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaHandHoldingUsd, FaBusinessTime, FaHeadset, FaPlay } from 'react-icons/fa';
import { HiOutlineUserGroup, HiX } from 'react-icons/hi';
import { blogStore, Blog } from '@/lib/stores/BlogStore';

const benefits = [
  {
    title: 'Affordable Price',
    description: 'Premium-quality tech solutions at rates that respect your budget, with no hidden fees.',
    icon: <FaHandHoldingUsd className="text-4xl text-white" />
  },
  {
    title: 'Professional Team',
    description: 'A dedicated crew of skilled developers, designers, and strategists on every project.',
    icon: <HiOutlineUserGroup className="text-4xl text-white" />
  },
  {
    title: 'Regular Service Update',
    description: 'We keep your products fresh with consistent updates, improvements, and maintenance.',
    icon: <FaBusinessTime className="text-4xl text-white" />
  },
  {
    title: '24/7 Online Support',
    description: 'Round-the-clock assistance so you\'re never left waiting when something needs attention.',
    icon: <FaHeadset className="text-4xl text-white" />
  }
];

const WhyChooseUsSection = () => {
  const [whyChooseUsBlog, setWhyChooseUsBlog] = useState<Blog | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogs = await blogStore.getBlogs();
        const found = blogs.find(
          (b) => b.category && b.category.trim().toLowerCase() === 'why choose us'
        );
        if (found) {
          setWhyChooseUsBlog(found);
        }
      } catch (error) {
        console.error('Error fetching Why Choose Us blog:', error);
      }
    };
    fetchBlog();

    const unsubscribe = blogStore.subscribe(() => {
      const found = blogStore.blogs.find(
        (b) => b.category && b.category.trim().toLowerCase() === 'why choose us'
      );
      if (found) {
        setWhyChooseUsBlog(found);
      }
    });

    return unsubscribe;
  }, []);

  // Lock scroll and handle Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVideoModalOpen(false);
      }
    };
    if (isVideoModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVideoModalOpen]);

  const hasImage = Boolean(whyChooseUsBlog?.image && whyChooseUsBlog.image.trim() !== '');
  const videoUrl = whyChooseUsBlog?.videoUrl?.trim() || '';
  const hasVideo = Boolean(videoUrl);
  const tagText = whyChooseUsBlog?.subtitle || 'Why Choose Us';
  const titleText = whyChooseUsBlog?.title;

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      } else if (url.includes('youtube.com/watch')) {
        const id = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      } else if (url.includes('youtube.com/embed/')) {
        return url.includes('autoplay=1') ? url : `${url}${url.includes('?') ? '&' : '?'}autoplay=1&rel=0`;
      } else if (url.includes('vimeo.com/')) {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : url;
      }
      return url;
    } catch {
      return url;
    }
  };

  const isEmbeddable =
    hasVideo &&
    (videoUrl.includes('youtube.com') ||
      videoUrl.includes('youtu.be') ||
      videoUrl.includes('vimeo.com'));

  return (
    <section className="py-24 relative overflow-hidden bg-navy text-white">
      {/* Background Text (Outline) */}
      <div
        className="absolute top-12 left-[-2%] text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.05]"
        style={{ WebkitTextStroke: '2px #ffffff' }}
      >
        Why Choose Us
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8">
          <div className="flex flex-col gap-4 max-w-[600px]">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-2xl">//</span>
              <span className="uppercase tracking-widest text-sm">{tagText}</span>
            </div>
            <h2 className="text-5xl font-extrabold leading-[1.1]">
              {titleText ? (
                titleText
              ) : (
                <>
                  Why Trust Us for<br />
                  Your IT Needs?
                </>
              )}
            </h2>
          </div>
          <button className="bg-primary text-white px-10 py-4 rounded-full font-semibold transition-all hover:bg-primary-dark hover:-translate-y-1 shadow-lg hover:shadow-primary/30 mt-4 lg:mt-0">
            Get A Quote
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Video Preview Container */}
          <div
            className={`relative group ${hasVideo ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (hasVideo) setIsVideoModalOpen(true);
            }}
            role={hasVideo ? 'button' : undefined}
            tabIndex={hasVideo ? 0 : undefined}
            aria-label={hasVideo ? 'Play introduction video' : undefined}
            onKeyDown={(e) => {
              if (hasVideo && (e.key === 'Enter' || e.key === ' ')) {
                setIsVideoModalOpen(true);
              }
            }}
          >
            <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-[#0c1938] via-navy to-[#060b18] flex items-center justify-center">
              {hasImage && whyChooseUsBlog?.image ? (
                <>
                  <Image
                    src={whyChooseUsBlog.image}
                    alt={titleText || 'Why Choose Us'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={whyChooseUsBlog.image.startsWith('data:') || whyChooseUsBlog.image.startsWith('http')}
                  />
                  <div className="absolute inset-0 bg-navy/25 group-hover:bg-navy/40 transition-colors"></div>
                </>
              ) : (
                <div className="w-full h-full p-10 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-primary animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Enterprise Standard</span>
                  </div>

                  <div className="relative z-10 my-auto text-center px-4">
                    <h4 className="text-2xl md:text-3xl font-black text-white mb-2">Architected For Scale &amp; Reliability</h4>
                    <p className="text-white/60 text-sm max-w-sm mx-auto">Engineered with high performance, top security protocols, and 24/7 dedicated support.</p>
                  </div>

                  <div className="relative z-10 flex justify-between items-center text-xs text-white/50 border-t border-white/10 pt-4">
                    <span>99.9% Uptime SLA</span>
                    <span className="text-primary font-bold">Kenny Tech Studios</span>
                  </div>
                </div>
              )}

              {/* Play Button - shown only if video is actually available */}
              {hasVideo && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-500 shadow-2xl z-20">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-xl">
                    <FaPlay className="ml-1 text-xl" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col gap-5 group">
                <div className="w-16 h-16 flex items-center justify-start transition-transform duration-500 group-hover:translate-x-2">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-11 h-11 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/20 backdrop-blur-sm"
              aria-label="Close video"
            >
              <HiX className="text-2xl" />
            </button>

            {isEmbeddable ? (
              <iframe
                src={getEmbedUrl(videoUrl)}
                title={titleText || 'Why Choose Us Video'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default WhyChooseUsSection;
