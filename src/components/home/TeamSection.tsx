import React from 'react';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram } from 'react-icons/fa';

const team = [
  {
    name: 'Jenny Alexander',
    role: 'Chief Executive Officer',
    image: '/team-1.png',
    highlight: true
  },
  {
    name: 'Olivia Hughes',
    role: 'Chief Technology Officer',
    image: '/team-2.png',
    highlight: false
  },
  {
    name: 'Sophia Lewis',
    role: 'IT Project Manager',
    image: '/avatar-1.png',
    highlight: false
  }
];

const TeamSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-[2%] text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03]" style={{ WebkitTextStroke: '2px #0f172a' }}>
        Team
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-2xl">//</span>
              <span className="uppercase tracking-widest text-sm">Our Team</span>
            </div>
            <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
              Meet Our <span className="text-primary">Expert Team</span>
            </h2>
          </div>
          <button className="bg-primary text-white px-10 py-4 rounded-full font-semibold transition-all hover:bg-primary-dark hover:-translate-y-1 shadow-lg hover:shadow-primary/30">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div 
              key={index} 
              className={`group relative rounded-[40px] overflow-hidden bg-white border border-slate-100 shadow-xl transition-all duration-500 hover:-translate-y-2 ${member.highlight ? 'border-b-4 border-l-4 border-primary' : ''}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Social Icons Overlay (Bottom of Image) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {[FaFacebookF, FaTwitter, FaPinterestP, FaInstagram].map((Icon, i) => (
                    <a 
                      key={i} 
                      href="#" 
                      className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-primary hover:border-primary transition-all"
                    >
                      <Icon className="text-sm" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-8 text-center bg-white">
                <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-slate-400 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
