'use client';

import React, { useEffect, useState } from 'react';
import { FaStar, FaQuoteRight } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { testimonialStore, Testimonial } from '@/lib/stores/TestimonialStore';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    clientName: 'Jenny Wilson',
    clientRole: 'CEO, Urban Auto',
    content: 'Kenny Tech Studios revamped our digital platform with incredible precision and speed. Our platform engagement and customer satisfaction skyrocketed within weeks.',
    rating: 5.0,
    clientProjectLink: '/projects',
  },
  {
    clientName: 'Bessie Cooper',
    clientRole: 'Product Lead, Horizon Logistics',
    content: 'The IT security and custom software solutions delivered by the Kenny Tech team exceeded all our expectations. Truly a top-tier technology partner.',
    rating: 5.0,
    clientProjectLink: '/projects',
  },
  {
    clientName: 'Robert Fox',
    clientRole: 'Managing Director, Apex Cloud Solutions',
    content: 'From initial architecture review to full production deployment, their engineering capability and prompt support have been exceptional.',
    rating: 5.0,
    clientProjectLink: '/projects',
  },
  {
    clientName: 'Jane Cooper',
    clientRole: 'Head of Engineering, PayFlow Global',
    content: 'Collaborating with Kenny Tech transformed our infrastructure. Their proactive communication, quality code, and attention to detail are second to none.',
    rating: 5.0,
    clientProjectLink: '/projects',
  },
];

const TestimonialsSection = () => {
  const [items, setItems] = useState<Testimonial[]>(() => {
    return testimonialStore.testimonials.length > 0
      ? testimonialStore.testimonials
      : DEFAULT_TESTIMONIALS;
  });

  useEffect(() => {
    const unsub = testimonialStore.subscribe(() => {
      if (testimonialStore.testimonials.length > 0) {
        setItems(testimonialStore.testimonials);
      }
    });

    testimonialStore.getTestimonials().then(data => {
      if (data && data.length > 0) {
        setItems(data);
      }
    });

    return unsub;
  }, []);

  // Ensure enough items for smooth infinite Swiper loop
  const displayItems = items.length > 0 ? (items.length <= 3 ? [...items, ...items] : items) : DEFAULT_TESTIMONIALS;

  return (
    <section id="testimonial" className="py-24 relative overflow-hidden bg-navy text-white scroll-mt-20">
      {/* Background Text (Outline) */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.05] whitespace-nowrap"
        style={{ WebkitTextStroke: '2px #ffffff' }}
      >
        Testimonials
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <span className="text-2xl">//</span>
            <span className="uppercase tracking-widest text-sm">Testimonials</span>
          </div>
          <h2 className="text-5xl font-extrabold leading-[1.1]">
            Testimonials: <span className="text-primary">Trusted<br />by Our Clients</span>
          </h2>
        </div>

        <div className="mb-12 testimonials-swiper">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={displayItems.length > 1}
            speed={1500}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: '.custom-pagination',
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
            }}
            className="pb-12"
          >
            {displayItems.map((testimonial, index) => {
              const initials = testimonial.clientName
                ? testimonial.clientName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : 'CL';

              return (
                <SwiperSlide key={testimonial._id || index}>
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-[40px] px-[10px] py-10 md:p-10 overflow-hidden group transition-all duration-500 hover:bg-white/10 flex flex-col justify-between h-full min-h-[340px]">
                    {/* Quote Icon Overlay */}
                    <FaQuoteRight className="absolute bottom-10 right-10 text-9xl text-white opacity-[0.03] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

                    <div className="relative z-10 space-y-6 text-left">
                      {/* Rating & Project Link Header */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400 gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={star <= (testimonial.rating || 5) ? 'text-yellow-400' : 'text-white/20'}
                              />
                            ))}
                          </div>
                          <span className="font-bold ml-1 text-sm text-yellow-400">
                            {Number(testimonial.rating || 5).toFixed(1)}
                          </span>
                        </div>

                        {testimonial.clientProjectLink && (
                          <a
                            href={testimonial.clientProjectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/15 hover:bg-primary text-primary hover:text-white border border-primary/30 text-xs font-bold transition-all cursor-pointer group/link shadow-sm"
                          >
                            <span>Client Project</span>
                            <HiExternalLink className="text-xs group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                      </div>

                      {/* Content */}
                      <p className="text-white/70 leading-relaxed italic text-base md:text-lg">
                        &quot;{testimonial.content}&quot;
                      </p>
                    </div>

                    {/* Client Footer */}
                    <div className="relative z-10 flex items-center gap-4 pt-6 mt-6 border-t border-white/10">
                      {testimonial.picture ? (
                        <img
                          src={testimonial.picture}
                          alt={testimonial.clientName}
                          className="w-14 h-14 rounded-full object-cover border-2 border-primary/50 shadow-md shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-primary-dark to-navy flex items-center justify-center text-white font-black text-lg border-2 border-primary/50 shadow-md shrink-0">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xl text-white">{testimonial.clientName}</h4>
                        {testimonial.clientRole && (
                          <p className="text-primary text-sm font-medium">{testimonial.clientRole}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Custom Pagination Container */}
        <div className="custom-pagination flex justify-center gap-3 mt-4"></div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
