"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CampusPhotoSliderProps {
  images: { url: string; alt: string }[];
  interval?: number;
  className?: string;
}

const CampusPhotoSlider: React.FC<CampusPhotoSliderProps> = ({
  images,
  interval = 5000,
  className,
}) => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const advance = useCallback(
    (next: number) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setCurrent(next);
        setFading(false);
      }, 300); // matches duration-300
    },
    [fading]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      advance((current + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [current, images.length, interval, advance]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Image frame */}
      <div className="relative w-full rounded overflow-hidden bg-brand-800" style={{ aspectRatio: "4/3" }}>
        {images.map((img, i) => (
          <img
            key={img.url}
            src={img.url}
            alt={img.alt}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out",
              i === current && !fading ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {/* Subtle dark vignette at edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.35)",
          }}
          aria-hidden="true"
        />

        {/* Prev / Next touch targets (invisible, accessible) */}
        <button
          onClick={() => advance((current - 1 + images.length) % images.length)}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold"
          aria-label="Previous image"
        />
        <button
          onClick={() => advance((current + 1) % images.length)}
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold"
          aria-label="Next image"
        />
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5" role="tablist" aria-label="Image navigation">
        {images.map((img, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Image ${i + 1}`}
            onClick={() => advance(i)}
            className={cn(
              "transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold",
              i === current
                ? "w-5 h-1.5 bg-brand-gold"
                : "w-1.5 h-1.5 bg-brand-700 hover:bg-brand-500"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default CampusPhotoSlider;
