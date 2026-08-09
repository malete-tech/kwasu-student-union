"use client";

import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { api } from "@/lib/api";
import { Document } from "@/types";

import { FileText, Download } from "@/components/ui/font-awesome-icon";
import { Skeleton } from "@/components/ui/skeleton";
import AboutHero from "@/components/AboutHero";
import FadeIn from "@/components/FadeIn";

// ─── Data ────────────────────────────────────────────────────────────────────

const pillars = [
  {
    index: "01",
    title: "Our Mission",
    body: "To represent, advocate for, and empower the students of Kwara State University — fostering a vibrant and inclusive campus community where every student can thrive academically, socially, and personally.",
  },
  {
    index: "02",
    title: "Our Vision",
    body: "To be a leading Students' Union recognized for transparency, accountability, and an unwavering commitment to student welfare, academic excellence, and innovative solutions.",
  },
  {
    index: "03",
    title: "Core Values",
    body: "Student-centricity · Integrity & Transparency · Advocacy & Empowerment · Inclusivity & Diversity · Innovation & Progress.",
  },
];

const presidents = [
  {
    order: "1st",
    name: "Comrade Adio Usman Olawale",
    alias: "Adio",
    note: "Laid the groundwork for effective student leadership and institutional engagement, setting important precedents in governance.",
  },
  {
    order: "2nd",
    name: "Comrade Abdulganiyu Dayo Dikko",
    alias: "Dikko",
    note: "Strengthened advocacy efforts and deepened the Union's institutional presence within the university.",
  },
  {
    order: "3rd",
    name: "Comrade Kozeem Olaitan Hanafy",
    alias: "Hanafy",
    note: "Expanded the Union's visibility through impactful initiatives and broadened student participation.",
  },
  {
    order: "4th",
    name: "Lawal Azeez Okikiola",
    alias: "Okiki",
    note: "Consolidated administrative stability and promoted structured engagement between students and management.",
  },
  {
    order: "5th",
    name: "Comrade Yusuf Umar Danshitta",
    alias: "Danshitta",
    note: "Prioritized welfare-centered programs, reinforcing the Union's commitment to student well-being.",
  },
  {
    order: "6th",
    name: "Comrade Adewoye Isreal Jesutofunmi",
    alias: "Isreal.ait",
    note: "Further strengthened student representation and encouraged broader inclusion in Union affairs.",
  },
  {
    order: "7th",
    name: "Comrade Abdulkadir Soliu Kolapo",
    alias: "Sen. Kolapapaz",
    note: "Emphasized accountability and continuity in student governance.",
  },
  {
    order: "8th",
    name: "Comrade Abdulafeez Babatunde Kewulere",
    alias: "Baba",
    note: "Reinforced the Union's position as a formidable and organized body within the university.",
  },
  {
    order: "9th",
    name: "Comrade Abdulsamad Olamilekan Raji",
    alias: "PEOPLE",
    note: "Upheld the Union's enduring mission of progressive leadership and constructive engagement during the People's Era Administration.",
  },
  {
    order: "10th",
    name: "Comrade Habibullah Muhammad",
    alias: "PROGRESS",
    note: "Currently driving student welfare, campus development, and progressive leadership as President of the KWASU Students' Union.",
    isCurrent: true,
  },
];

const quickFacts = [
  { label: "Founded", value: "2017 / 2018" },
  { label: "Presidents", value: "10 administrations" },
  { label: "Location", value: "KWASU SU Building, Malete" },
];

// ─── Component ───────────────────────────────────────────────────────────────

const About = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const allDocs = await api.documents.getAll();
        const filteredDocs = allDocs.filter(
          (doc) => doc.tags.includes("constitution") || doc.tags.includes("handbook")
        );
        setDocuments(filteredDocs);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError("Failed to load documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  return (
    <>
      <SEO
        title="About Us | KWASU Students' Union"
        description="Learn about the Kwara State University Students' Union mission, vision, leadership history, and access official governing documents."
        url="https://kwasusu.com.ng/about"
      />

      {/* ── 1. PAGE BANNER ───────────────────────────────────────────────── */}
      <AboutHero />

      {/* ── 2. MISSION · VISION · VALUES ─────────────────────────────────── */}
      <FadeIn>
        <section className="border-b border-gray-100">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {pillars.map((pillar, i) => (
                <div
                  key={pillar.index}
                  className={`py-10 px-6 md:py-12 md:px-8 ${
                    i < pillars.length - 1
                      ? "border-b md:border-b-0 md:border-r border-gray-100"
                      : ""
                  }`}
                >
                  <span className="block text-[11px] font-bold text-brand-gold uppercase tracking-[0.18em] mb-4">
                    {pillar.index}
                  </span>
                  <h2 className="text-base font-bold text-brand-900 mb-3">{pillar.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── 3. HISTORY & TIMELINE ────────────────────────────────────────── */}
      <section className="container py-16 md:py-20">
        <FadeIn>
          <div className="mb-10 pb-6 border-b border-gray-100">
            <p className="text-xs font-bold text-brand-400 uppercase tracking-[0.15em] mb-2">
              Our Story
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-900">
              A Brief History of KWASU SU
            </h2>
          </div>
        </FadeIn>

        {/* Foundation prose */}
        <FadeIn delay={0.05}>
          <div className="max-w-2xl mb-14 space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              The Kwara State University Students' Union (KWASU SU) emerged as the official
              representative body of students of Kwara State University, Malete, with a clear
              mandate to serve as the collective voice of the student community.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Its establishment marked a defining moment in the democratic and participatory
              development of the university — creating a structured platform through which
              students could engage university management, advocate for their welfare, and
              contribute meaningfully to institutional growth.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The formal installation took place during the{" "}
              <strong className="text-brand-800 font-semibold">2017/2018 academic session</strong>{" "}
              under the leadership of{" "}
              <strong className="text-brand-800 font-semibold">
                Comrade Aliyu Uthman Abdulkadir (Phodeo)
              </strong>
              , then-serving as the NANS Kwara Chairman. This foundational phase provided the
              constitutional and administrative framework upon which the Union continues to operate.
            </p>
          </div>
        </FadeIn>

        {/* Presidential Timeline */}
        <FadeIn delay={0.1}>
          <p className="text-xs font-bold text-brand-400 uppercase tracking-[0.15em] mb-8">
            Presidential Legacy
          </p>
        </FadeIn>

        <div className="relative">
          {/* Vertical spine — mobile: left-aligned to node, desktop: centered */}
          <div
            className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gray-200"
            aria-hidden="true"
          />

          <div className="space-y-0">
            {presidents.map((president, i) => {
              const isRight = i % 2 !== 0;

              // Shared card markup
              const card = (
                <div
                  className={`border border-gray-100 bg-white rounded p-4 ${
                    president.isCurrent ? "border-brand-gold/40 bg-brand-50/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">
                      {president.order} President
                    </span>
                    {president.isCurrent && (
                      <span className="text-[9px] font-bold bg-brand-gold/15 text-brand-700 px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-brand-900 leading-snug">
                    {president.name}{" "}
                    <span className="text-brand-400 font-normal">({president.alias})</span>
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2">{president.note}</p>
                </div>
              );

              // Shared node markup
              const node = (
                <div className="relative z-10 flex justify-center pt-1">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-extrabold bg-white ${
                      president.isCurrent
                        ? "border-brand-gold text-brand-gold"
                        : "border-brand-300 text-brand-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>
              );

              return (
                <FadeIn key={president.order} delay={i * 0.06} direction="up">
                  <div className="pb-8">
                    {/* ── Desktop: strict 3-col grid [left | node | right] ── */}
                    <div className="hidden md:grid md:items-start pb-2" style={{ gridTemplateColumns: "1fr 56px 1fr" }}>
                      {/* Left column — only populated on even items */}
                      <div className="pr-6 flex justify-end">
                        {!isRight && card}
                      </div>
                      {/* Center node */}
                      {node}
                      {/* Right column — only populated on odd items */}
                      <div className="pl-6">
                        {isRight && card}
                      </div>
                    </div>

                    {/* ── Mobile: simple left-to-right with node on far left ── */}
                    <div className="flex md:hidden items-start gap-4 pl-1">
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-extrabold bg-white ${
                            president.isCurrent
                              ? "border-brand-gold text-brand-gold"
                              : "border-brand-300 text-brand-500"
                          }`}
                        >
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-1">{card}</div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. KEY DOCUMENTS ─────────────────────────────────────────────── */}
      <FadeIn>
        <section className="border-t border-gray-100">
          <div className="container py-12 md:py-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-brand-400 uppercase tracking-[0.15em] mb-1">
                  Resources
                </p>
                <h2 className="text-lg font-extrabold text-brand-900">Key Documents</h2>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded" />
                <Skeleton className="h-16 w-full rounded" />
              </div>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : documents.length > 0 ? (
              <div className="divide-y divide-gray-100 border border-gray-100 rounded">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-brand-50/50 transition-colors group"
                  >
                    <div className="text-brand-500 flex-shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-brand-900 truncate">{doc.title}</p>
                      <p className="text-[11px] text-gray-400 uppercase font-medium mt-0.5">
                        {doc.fileType} · {doc.fileSize}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-gray-300 group-hover:text-brand-500 transition-colors">
                      <Download className="h-4 w-4" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded px-5 py-6 text-sm text-gray-400">
                Constitution and Student Handbook coming soon.
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      {/* ── 5. QUICK FACTS BAR ────────────────────────────────────────────── */}
      <FadeIn>
        <section className="bg-brand-900 border-t border-brand-800">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {quickFacts.map((fact, i) => (
                <div
                  key={fact.label}
                  className={`py-8 px-6 md:px-8 ${
                    i < quickFacts.length - 1
                      ? "border-b sm:border-b-0 sm:border-r border-brand-800"
                      : ""
                  }`}
                >
                  <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.15em] mb-1">
                    {fact.label}
                  </p>
                  <p className="text-base font-bold text-white">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
};

export default About;