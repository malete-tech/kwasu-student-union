"use client";

import React from "react";

const AboutHero: React.FC = () => {
  return (
    <section className="relative w-full bg-brand-900 border-b border-brand-800 overflow-hidden">
      {/* Subtle textural grid — not decorative, structural context */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px)",
        }}
        aria-hidden="true"
      />

      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold" aria-hidden="true" />

      <div className="container relative py-16 md:py-20 lg:py-24">
        <div className="max-w-2xl">
          {/* Breadcrumb */}
          <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-6">
            KWASU Students' Union
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
            About the{" "}
            <span
              className="text-brand-gold"
              style={{ textDecoration: "underline", textDecorationColor: "hsl(40 80% 60% / 0.35)", textUnderlineOffset: "6px" }}
            >
              Students' Union
            </span>
          </h1>

          <p className="text-brand-200 text-base md:text-lg leading-relaxed max-w-xl">
            The official representative body of Kwara State University students — 
            advocating, empowering, and governing since the 2017/2018 academic session.
          </p>

          {/* Divider */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-brand-700" />
            <span className="text-brand-500 text-xs font-bold uppercase tracking-widest">Est. 2017</span>
            <div className="h-px w-8 bg-brand-700" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;