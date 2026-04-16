"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  images: {
    url: string;
    caption: string;
  }[];
  className?: string;
  interval?: number;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ 
  images, 
  className,
  interval = 5000 
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className={cn("relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center", className)}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-neon/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full h-full max-w-lg" style={{ perspective: "1000px" }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              rotateX: -10,
              rotateY: 20,
              x: 100,
              z: -100
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateX: 0,
              rotateY: -5,
              x: 0,
              z: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.8
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.1,
              rotateX: 10,
              rotateY: -20,
              x: -100,
              z: -50,
              transition: {
                duration: 0.6,
                ease: "easeInOut"
              }
            }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            {/* The Main Photo Frame */}
            <div className="relative group w-[280px] h-[400px] md:w-[350px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white/10 backdrop-blur-sm bg-white/5">
              {/* Ken Burns Image */}
              <motion.img
                src={images[index]!.url}
                alt={images[index]!.caption}
                initial={{ scale: 1 }}
                animate={{ scale: 1.15 }}
                transition={{ 
                  duration: interval / 1000, 
                  ease: "linear" 
                }}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

              {/* Caption Overlay */}
              <div className="absolute bottom-8 left-0 right-0 px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-neon mb-2 drop-shadow-sm">
                    Student Life
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {images[index]!.caption}
                  </h3>
                </motion.div>
              </div>

              {/* Glass Frame Reflection */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-50 z-10" />
            </div>
          </motion.div>

          {/* Background Static Cards for Depth */}
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-30 pointer-events-none">
             <div className="w-[350px] h-[500px] rounded-[2.5rem] bg-brand-800/40 border-2 border-white/10 rotate-[5deg] translate-x-12 translate-y-4" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10 pointer-events-none">
             <div className="w-[350px] h-[500px] rounded-[2.5rem] bg-brand-700/20 border-2 border-white/5 -rotate-[8deg] -translate-x-16 translate-y-8" />
          </div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="group relative h-1.5 focus:outline-none"
            >
              <div className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === index ? "w-8 bg-brand-neon" : "w-1.5 bg-white/20 group-hover:bg-white/40"
              )} />
              {i === index && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: interval / 1000, ease: "linear" }}
                  className="absolute inset-0 bg-white/40 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
