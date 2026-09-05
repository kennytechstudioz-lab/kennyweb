'use client';

import React from 'react';
import Image from 'next/image';
import { FaStar, FaQuoteRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Jenny Wilson',
    role: 'Owner, Furniture Store',
    image: '/avatar-1.png',
    title: 'A Wonderful Experience!',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    rating: 5.0
  },
  {
    name: 'Bessie Cooper',
    role: 'CEO, Car Rental App',
    image: '/avatar-2.png',
    title: 'Highly Recommended!',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    rating: 5.0
  },
  {
    name: 'Robert Fox',
    role: 'Marketing Director',
    image: '/team-1.png',
    title: 'Top Notch Service!',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    rating: 5.0
  },
  {
    name: 'Jane Cooper',
    role: 'Product Designer',
    image: '/team-2.png',
    title: 'Simply Amazing!',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    rating: 5.0
  }
];

// Duplicate testimonials for smoother infinite loop
const allTestimonials = [...testimonials, ...testimonials];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-navy text-white">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.05] whitespace-nowrap" style={{ WebkitTextStroke: '2px #ffffff' }}>
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
            loop={true}
            speed={1500}
            autoplay={{
              delay: 3000,
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
            {allTestimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-[40px] px-[10px] py-10 md:p-10 overflow-hidden group transition-all duration-500 hover:bg-white/10"
                >
                  {/* Quote Icon Overlay */}
                  <FaQuoteRight className="absolute bottom-10 right-10 text-9xl text-white opacity-[0.03] transform group-hover:scale-110 transition-transform duration-700" />

                  <div className="relative z-10 space-y-6 text-left">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400 gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <span className="font-bold ml-2">{testimonial.rating.toFixed(1)}</span>
                    </div>

                    <h3 className="text-2xl font-bold">{testimonial.title}</h3>

                    <p className="text-white/60 leading-relaxed italic">
                      &quot;{testimonial.content}&quot;
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl">{testimonial.name}</h4>
                        <p className="text-primary text-sm font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Pagination Container */}
        <div className="custom-pagination flex justify-center gap-3 mt-4"></div>
      </div>
    </section>
  );
};


export default TestimonialsSection;
