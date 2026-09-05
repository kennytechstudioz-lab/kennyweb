import React from 'react';
import ContactHero from '@/components/home/ContactHero';
import ContactSection from '@/components/home/ContactSection';
import ContactMap from '@/components/home/ContactMap';

export const metadata = {
  title: 'Contact Us | Kenny Tech Studios',
  description: 'Get in touch with Kenny Tech Studios for your software, web, and mobile app development needs. We offer professional consultation for animation, video editing, and digital marketing.',
};

const ContactPage = () => {
  return (
    <main>
      <ContactHero />
      <ContactSection />
      <ContactMap />
    </main>
  );
};

export default ContactPage;
