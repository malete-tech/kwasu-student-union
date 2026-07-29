"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  href: string;
  buttonText: string;
  isExternal?: boolean;
}

interface SectionProps {
  label: string;
  title: string;
  items: ServiceItem[];
  featured?: boolean;
}

// ── Service Card ──────────────────────────────────────────────────────────────

const ServiceCard: React.FC<ServiceItem & { featured?: boolean }> = ({
  icon,
  title,
  description,
  href,
  buttonText,
  isExternal = false,
  featured = false,
}) => {
  const content = (
    <div
      className={cn(
        "group flex flex-col h-full border rounded p-5 transition-colors duration-150",
        featured
          ? "bg-brand-900 border-brand-800 hover:border-brand-gold/50"
          : "bg-white border-gray-100 hover:border-gray-300"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded mb-4",
          featured
            ? "bg-brand-gold/15 text-brand-gold"
            : "bg-brand-50 text-brand-600"
        )}
      >
        <i className={`${icon} text-base`} aria-hidden="true" />
      </div>

      {/* Text */}
      <p
        className={cn(
          "text-sm font-bold mb-1.5 leading-snug",
          featured ? "text-white" : "text-gray-900"
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "text-xs leading-relaxed flex-grow mb-5",
          featured ? "text-brand-300" : "text-gray-500"
        )}
      >
        {description}
      </p>

      {/* CTA */}
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-bold transition-colors",
          featured
            ? "text-brand-gold group-hover:text-brand-gold/80"
            : "text-brand-600 group-hover:text-brand-700"
        )}
      >
        {buttonText}
        {isExternal ? (
          <i className="fa-brands fa-whatsapp text-sm" aria-hidden="true" />
        ) : (
          <i
            className="fa-solid fa-arrow-right text-[10px]"
            aria-hidden="true"
          />
        )}
      </span>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full no-underline"
        id={`service-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={href}
      className="block h-full no-underline"
      id={`service-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {content}
    </Link>
  );
};

// ── Section Block ─────────────────────────────────────────────────────────────

const ServiceSection: React.FC<SectionProps> = ({
  label,
  title,
  items,
  featured = false,
}) => (
  <div className="mb-14">
    {/* Section header */}
    <div className="mb-6">
      <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.15em] mb-1">
        {label}
      </p>
      <h2 className="text-lg font-bold text-gray-900 leading-snug">{title}</h2>
    </div>

    {/* Grid */}
    <div
      className={cn(
        "grid gap-3",
        featured
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2"
      )}
    >
      {items.map((item) => (
        <ServiceCard key={item.title} {...item} featured={featured} />
      ))}
    </div>
  </div>
);

// ── Emergency Banner ──────────────────────────────────────────────────────────

const emergencyNumbers = [
  { label: "Ambulance", icon: "fa-solid fa-ambulance", tel: "+2349033124706" },
  {
    label: "Safety Unit",
    icon: "fa-solid fa-shield-halved",
    tel: "+2347034356532",
  },
  {
    label: "Fire Service 1",
    icon: "fa-solid fa-fire-extinguisher",
    tel: "+2348169770435",
  },
  {
    label: "Fire Service 2",
    icon: "fa-solid fa-fire-extinguisher",
    tel: "+23470535435475",
  },
];

const EmergencyBanner: React.FC = () => (
  <div className="border border-red-100 rounded bg-red-50 p-5">
    {/* Header row */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 flex items-center justify-center rounded bg-red-600 text-white shrink-0">
        <i className="fa-solid fa-truck-medical text-sm" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.15em]">
          Emergency
        </p>
        <p className="text-sm font-bold text-red-900 leading-snug">
          Campus Emergency Lines
        </p>
      </div>
    </div>

    {/* Numbers grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {emergencyNumbers.map(({ label, icon, tel }) => (
        <a
          key={label}
          href={`tel:${tel}`}
          id={`emergency-${label.toLowerCase().replace(/\s+/g, "-")}`}
          className="flex items-center gap-2 border border-red-200 rounded bg-white px-3 py-2.5 text-xs font-bold text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
        >
          <i className={`${icon} text-sm shrink-0`} aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </div>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const unionVentures: ServiceItem[] = [
  {
    icon: "fa-solid fa-fire-flame-simple",
    title: "SU Kerosene Depot",
    description:
      "Affordable kerosene at union-regulated prices, available on campus for all students.",
    href: "https://wa.me/message/D75QRKLIXRFFA1",
    buttonText: "Order on WhatsApp",
    isExternal: true,
  },
  {
    icon: "fa-solid fa-print",
    title: "SU Cafe",
    description:
      "Professional printing, photocopying, and digital services at student-friendly rates.",
    href: "https://wa.me/message/T2EV3QZOQPAVC1",
    buttonText: "Chat with Cafe",
    isExternal: true,
  },
  {
    icon: "fa-solid fa-tv",
    title: "SU Viewing Center",
    description:
      "Live football, premium entertainment, and gaming tournaments. Royal Garden, opposite Ajeem Hostel.",
    href: "https://wa.me/2349027379115?text=Hello%20KWASU%20SU,%20I%20would%20like%20to%20inquire%20about%20the%20SU%20Viewing%20Center.",
    buttonText: "Inquire on WhatsApp",
    isExternal: true,
  },
];

const studentSupport: ServiceItem[] = [
  {
    icon: "fa-solid fa-comment-dots",
    title: "Submit a Complaint",
    description:
      "Report welfare issues directly to the union. Every submission is reviewed.",
    href: "/services/complaints",
    buttonText: "File a report",
  },
  {
    icon: "fa-solid fa-file-arrow-down",
    title: "Downloads",
    description:
      "Access handbooks, official forms, and important student documents.",
    href: "/services/downloads",
    buttonText: "Browse vault",
  },
  {
    icon: "fa-solid fa-briefcase",
    title: "Opportunities",
    description:
      "Scholarships, internships, and jobs curated for KWASU students.",
    href: "/services/opportunities",
    buttonText: "Explore now",
  },
  {
    icon: "fa-solid fa-lightbulb",
    title: "Suggestion Box",
    description: "Share ideas that make KWASU better for everyone.",
    href: "/services/suggestion-box",
    buttonText: "Submit an idea",
  },
];

const ServicesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Student Services | KWASU Students' Union</title>
        <meta
          name="description"
          content="Access student services provided by KWASU Students' Union — kerosene depot, SU cafe, printing, complaint filing, and emergency contacts."
        />
        <link rel="canonical" href="https://thekwasusu.com/services" />
      </Helmet>

      {/* ── PAGE BANNER ─────────────────────────────────────────────────── */}
      <section className="relative w-full bg-brand-900 border-b border-brand-800 overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold"
          aria-hidden="true"
        />

        <div className="container relative py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              KWASU Students' Union
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Student{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Services
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              Union ventures, administrative support, and emergency contacts —
              everything the union provides for the KWASU student body.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div className="container py-10 max-w-5xl">
        {/* Union Ventures */}
        <ServiceSection
          label="Union Ventures"
          title="Commercial Services"
          items={unionVentures}
          featured
        />

        {/* Divider */}
        <div className="border-t border-gray-100 mb-14" />

        {/* Student Support */}
        <ServiceSection
          label="Administrative"
          title="Student Support"
          items={studentSupport}
        />

        {/* Divider */}
        <div className="border-t border-gray-100 mb-10" />

        {/* Emergency */}
        <EmergencyBanner />
      </div>
    </>
  );
};

export default ServicesPage;