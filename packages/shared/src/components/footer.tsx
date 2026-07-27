"use client";

import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-brand-900 text-white border-t border-brand-800/50 pt-10 pb-6 mt-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-brand-800/60">
          
          {/* Brand & Mission Column (Col 1-5) */}
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 group outline-none">
              <img src="/logo.png" alt="KWASU SU Logo" className="h-9 w-9 object-contain" />
              <span className="font-extrabold text-sm uppercase tracking-wider text-white group-hover:text-brand-gold transition-colors">
                KWASU Students' Union
              </span>
            </Link>
            <p className="text-xs text-brand-100/70 leading-relaxed max-w-sm">
              Empowering student voices, driving academic excellence, and fostering a vibrant campus community at Kwara State University.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { icon: "fa-brands fa-x-twitter", href: "https://x.com/thekwasusu", label: "X" },
                { icon: "fa-brands fa-instagram", href: "https://instagram.com/thekwasusu", label: "Instagram" },
                { icon: "fa-brands fa-facebook-f", href: "https://facebook.com/thekwasusu", label: "Facebook" },
                { icon: "fa-brands fa-linkedin-in", href: "https://linkedin.com/company/thekwasusu", label: "LinkedIn" },
                { icon: "fa-brands fa-tiktok", href: "https://tiktok.com/@thekwasusu", label: "TikTok" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-7 h-7 rounded-lg bg-brand-800/60 hover:bg-brand-gold hover:text-brand-900 text-brand-100 flex items-center justify-center text-xs transition-all shadow-sm"
                >
                  <i className={s.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation (Col 6-8) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              {[
                { name: "About SU", href: "/about" },
                { name: "News & Notices", href: "/news" },
                { name: "Campus Events", href: "/events" },
                { name: "Executive Councils", href: "/executives/central" },
                { name: "Partners", href: "/partners" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-brand-100/80 hover:text-brand-gold transition-colors inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Services (Col 9-12) */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
              Student Services
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {[
                { name: "Services Hub", href: "/services" },
                { name: "Submit Complaint", href: "/services/complaints" },
                { name: "Opportunities", href: "/services/opportunities" },
                { name: "Downloads Vault", href: "/services/downloads" },
                { name: "Suggestion Box", href: "/services/suggestion-box" },
                { name: "Contact Union", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-brand-100/80 hover:text-brand-gold transition-colors inline-block truncate"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Minimal Copyright & Back To Top */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-brand-100/50">
          <p>© {new Date().getFullYear()} KWASU Students' Union. Built by Malete Tech Forum.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-brand-gold transition-colors bg-brand-800/40 hover:bg-brand-800 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
          >
            <span>Back to top</span>
            <i className="fa-solid fa-arrow-up text-[9px]"></i>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;