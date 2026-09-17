import React from 'react';

const ContactMap = () => {
  return (
    <section className="h-[500px] w-full relative overflow-hidden">
      {/* <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.183474556488!2d-74.0060152!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1904ba63d7%3A0x4778f11a4a9ea55a!2sNew%20York%20City%20Hall!5e0!3m2!1sen!2sus!4v1625500000000!5m2!1sen!2sus"
        className="absolute inset-0 w-full h-full border-0 grayscale contrast-125"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      ></iframe> */}

      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.460780250757!2d7.054361047113039!3d5.498382804758732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104259ceaf381b4f%3A0xe5cfd334bb72e964!2sWAEC%20OWERRI%20ZONAL%20OFFICE!5e0!3m2!1sen!2sng!4v1789617073724!5m2!1sen!2sng"
        allowFullScreen={true}
        loading="lazy"
        title="Google Map"
        className="absolute inset-0 w-full h-full border-0 "

        referrerPolicy="strict-origin-when-cross-origin"></iframe>

      {/* Overlay to blend with design */}
      <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
    </section>
  );
};

export default ContactMap;
