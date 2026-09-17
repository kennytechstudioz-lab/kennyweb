'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaInstagram, 
  FaYoutube, 
  FaTiktok 
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { companyStore, Company } from '@/lib/stores/CompanyStore';

const ContactSection = () => {
  const [company, setCompany] = useState<Company | null>(companyStore.company);
  const [loading, setLoading] = useState(!companyStore.isInitialized);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const data = await companyStore.getCompany();
      setCompany(data);
      setLoading(false);
    };
    fetchCompany();
  }, []);

  const socialLinks = [
    { key: 'linkedin', icon: FaLinkedinIn, url: company?.linkedin, label: 'LinkedIn' },
    { key: 'facebook', icon: FaFacebookF, url: company?.facebook, label: 'Facebook' },
    { key: 'x', icon: FaXTwitter, url: company?.x, label: 'X (Twitter)' },
    { key: 'instagram', icon: FaInstagram, url: company?.instagram, label: 'Instagram' },
    { key: 'youtube', icon: FaYoutube, url: company?.youtube, label: 'YouTube' },
    { key: 'tiktok', icon: FaTiktok, url: company?.tiktok, label: 'TikTok' },
  ].filter((item) => Boolean(item.url && item.url.trim() !== ''));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanMessage = formData.message.trim();
    if (cleanMessage.length < 30) {
      setFeedback({
        type: 'error',
        message: `Your message must be at least 30 characters long (currently ${cleanMessage.length} characters).`,
      });
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const res = await fetch(`${apiUrl}/api/emails/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({
          type: 'success',
          message: data.message || 'Thank you! Your message has been sent successfully to our mailbox. Our team will contact you shortly.',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Failed to submit your message. Please check your details and try again.',
        });
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setFeedback({
        type: 'error',
        message: 'Could not connect to the server. Please check your internet connection or reach out directly at support@kennytechstudios.com.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Text (Outline) */}
      <div 
        className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03] whitespace-nowrap" 
        style={{ WebkitTextStroke: '2px #0f172a' }}
      >
        Contact Us
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Info Card */}
          <div className="lg:col-span-5 relative bg-navy rounded-[40px] overflow-hidden px-[10px] py-12 md:p-12 text-white shadow-2xl min-h-[600px] flex flex-col justify-between">
            {/* Topographic Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('/topo-pattern.png')] bg-cover bg-center mix-blend-overlay"></div>
            
            <div className="relative z-10 space-y-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold border-l-4 border-primary pl-4">Address</h3>
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 w-48 bg-white/10 rounded-full"></div>
                    <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                  </div>
                ) : (
                  <p className="text-white/70 text-lg leading-relaxed max-w-[300px]">
                    {company?.address || 'Plot 7 ECWA Avenue, Prefab Owerri Imo State, Nigeria.'}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold border-l-4 border-primary pl-4">Contact</h3>
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 w-56 bg-white/10 rounded-full"></div>
                    <div className="h-4 w-48 bg-white/10 rounded-full"></div>
                  </div>
                ) : (
                  <div className="text-white/70 text-lg space-y-2">
                    <p>Phone : {company?.phoneNumber || '+234 904 783 367'}</p>
                    <p>Email : {company?.email || 'support@kennytechstudios.com'}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold border-l-4 border-primary pl-4">Open Time</h3>
                <p className="text-white/70 text-lg">
                  Monday - Friday : 10:00 - 20:00
                </p>
              </div>
            </div>

            {/* Stay Connected: Dynamic Social Icons from API */}
            {socialLinks.length > 0 && (
              <div className="relative z-10 space-y-6 pt-12">
                <h3 className="text-xl font-bold">Stay Connected</h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map(({ key, icon: Icon, url, label }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white transition-all hover:bg-white hover:text-primary hover:-translate-y-2 cursor-pointer shadow-md"
                    >
                      <Icon className="text-lg" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <span className="text-2xl">//</span>
                <span className="uppercase tracking-widest text-sm">Contact Us</span>
              </div>
              <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
                Get Your <span className="text-primary">Free Quote</span> Today!
              </h2>
            </div>

            {/* Feedback Alert Message */}
            {feedback && (
              <div
                className={`p-5 rounded-2xl flex items-start gap-4 text-sm font-medium transition-all ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-red-50 text-red-900 border border-red-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <HiCheckCircle className="text-2xl text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HiExclamationCircle className="text-2xl text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold text-base mb-1">
                    {feedback.type === 'success' ? 'Message Sent Successfully' : 'Notice'}
                  </p>
                  <p className="leading-relaxed">{feedback.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Your Name *</label>
                <input 
                  type="text" 
                  required
                  disabled={submitting}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex. John Doe" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300 disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email *</label>
                <input 
                  type="email" 
                  required
                  disabled={submitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@gmail.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300 disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone</label>
                <input 
                  type="tel" 
                  disabled={submitting}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter Phone Number (optional)" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300 disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Your Message *</label>
                  <span className={`text-xs font-semibold ${formData.message.trim().length > 0 && formData.message.trim().length < 30 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {formData.message.trim().length < 30
                      ? `Minimum 30 characters (${formData.message.trim().length}/30)`
                      : `${formData.message.trim().length} characters`}
                  </span>
                </div>
                <textarea 
                  required
                  minLength={30}
                  disabled={submitting}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project, goals, and how we can help you... (minimum 30 characters)" 
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300 resize-none disabled:opacity-60"
                ></textarea>
              </div>

              <div className="md:col-span-2 pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-primary text-white px-12 py-5 rounded-full font-bold text-lg transition-all hover:bg-primary-dark hover:-translate-y-1 shadow-lg hover:shadow-primary/40 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
