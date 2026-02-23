"use client";

import React from "react";

const AboutHero: React.FC = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-brand-700 to-brand-900 py-16 md:py-24 lg:py-32 text-white overflow-hidden">
      <div className="container flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full bg-brand-neon/20 px-4 py-2 text-sm font-medium text-white mb-6">
          <i className="fa-solid fa-users-line mr-2"></i> Our Story, Our Commitment
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
          About the <span className="text-brand-gold">KWASU Students' Union</span>
        </h1>
        <p className="text-lg md:text-xl text-brand-100 max-w-3xl mb-8">
          Dedicated to empowering students, fostering community, and advocating for your success at Kwara State University.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-brand-100">
            <i className="fa-solid fa-lightbulb text-brand-gold"></i>
            <span className="font-medium">Visionary Leadership</span>
          </div>
          <div className="flex items-center gap-2 text-brand-100">
            <i className="fa-solid fa-handshake text-brand-gold"></i>
            <span className="font-medium">Strong Community</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;