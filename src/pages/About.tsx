"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { api } from "@/lib/api";
import { Document } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, History, Target, Eye, Heart, Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AboutHero from "@/components/AboutHero";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const aboutContent = `
## Our Mission
To represent, advocate for, and empower the students of Kwara State University, fostering a vibrant and inclusive campus community where every student can thrive academically, socially, and personally.

## Our Vision
To be a leading Students' Union, recognized for its transparency, accountability, and unwavering commitment to student welfare, academic excellence, and innovative solutions that enhance the overall university experience.

## Our Core Values
*   **Student-Centricity:** Placing the needs and interests of students at the forefront.
*   **Integrity & Transparency:** Upholding honesty and openness in all operations.
*   **Advocacy & Empowerment:** Championing student rights and leadership potential.
*   **Inclusivity & Diversity:** Valuing every student and promoting equal opportunities.
*   **Innovation & Progress:** Embracing new ideas to improve student services.

---

## Brief History of KWASU SU

The Kwara State University Students' Union (KWASU SU) emerged as the official representative body of students of Kwara State University (KWASU), Malete, with a clear mandate to serve as the collective voice of the student community. 

Its establishment marked a defining moment in the democratic and participatory development of the university, creating a structured platform through which students could engage university management, advocate for their welfare, and contribute meaningfully to institutional growth.

### The Foundation (2017/2018)
The formal installation of the Students’ Union took place during the **2017/2018 academic session** under the leadership of **Comrade Aliyu Uthman Abdulkadir (Phodeo)**, who was then serving as the National Association of Nigerian Students (NANS)- Kwara Chairman. This foundational phase provided the constitutional and administrative framework upon which the Union continues to operate.

### Presidential Legacy & Leadership
The Union has evolved through the dedicated leadership of its elected Presidents:

*   **1st Pioneer President: Comrade Adio Usman Olawale (Adio)**
    *   Laid the groundwork for effective student leadership and institutional engagement, setting important precedents in governance.
*   **2nd President: Comrade Abdulganiyu Dayo Dikko (Dikko)**
    *   Strengthened advocacy efforts and deepened the Union’s institutional presence within the university.
*   **3rd President: Comrade Kozeem Olaitan Hanafy (Hanafy)**
    *   Expanded the Union’s visibility through impactful initiatives and broadened student participation.
*   **4th President: Lawal Azeez Okikiola (Okiki)**
    *   Consolidated administrative stability and promoted structured engagement between students and management.
*   **5th President: Comrade Yusuf Umar Danshitta (Danshitta)**
    *   Prioritized welfare-centered programs, reinforcing the Union’s commitment to student well-being.
*   **6th President: Comrade Adewoye Isreal Jesutofunmi (Isreal.ait)**
    *   Further strengthened student representation and encouraged broader inclusion in Union affairs.
*   **7th President: Comrade Abdulkadir Soliu Kolapo (Sen. Kolapapaz)**
    *   Emphasized accountability and continuity in student governance.
*   **8th President: Comrade Abdulafeez Babatunde Kewulere (Baba)**
    *   Reinforced the Union’s position as a formidable and organized body within the university.
*   **9th President (Current): Comrade Abdulsamad Olamilekan Raji (PEOPLE)**
    *   Continues to uphold the Union’s enduring mission of progressive leadership and constructive engagement.
`;

const galleryImages = [
  "/about-gallery/photo1.jpg",
  "/about-gallery/photo2.jpg",
  "/about-gallery/photo3.jpg",
  "/about-gallery/photo4.jpg",
  "/about-gallery/photo5.jpg",
  "/about-gallery/photo6.jpg",
];

const About = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const allDocs = await api.documents.getAll();
        const filteredDocs = allDocs.filter(doc =>
          doc.tags.includes("constitution") || doc.tags.includes("handbook")
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
      <Helmet>
        <title>About Us | KWASU Students' Union</title>
        <meta name="description" content="Official history and mission of the KWASU Students' Union. Meet our presidential legacy and access key documents." />
      </Helmet>
      
      <AboutHero />

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main History Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-10 shadow-xl rounded-[2.5rem] border-brand-50 bg-white/50 backdrop-blur-sm">
              <CardContent className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {aboutContent}
                </ReactMarkdown>
              </CardContent>
            </Card>

            {/* Photo Carousel Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-4">
                <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                  <Camera className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-brand-800">Moments in Union History</h3>
              </div>
              
              <div className="px-10 relative">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {galleryImages.map((src, index) => (
                      <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                        <div className="overflow-hidden rounded-2xl aspect-[4/3] shadow-md border border-brand-50 bg-white">
                          <img 
                            src={src} 
                            alt={`Union activity ${index + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4 bg-white hover:bg-brand-50 text-brand-700 border-brand-100" />
                  <CarouselNext className="-right-4 bg-white hover:bg-brand-50 text-brand-700 border-brand-100" />
                </Carousel>
              </div>
            </div>
          </div>

          {/* Sidebar: Documents & Fast Facts */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-6 shadow-lg rounded-2xl border-brand-100 bg-brand-900 text-white">
              <CardHeader className="pb-4 p-0">
                <CardTitle className="text-xl font-bold uppercase text-brand-gold flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Important Vault
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4 pt-4">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full bg-white/10" />
                    <Skeleton className="h-12 w-full bg-white/10" />
                  </div>
                ) : error ? (
                  <div className="text-red-300 text-sm">{error}</div>
                ) : documents.length > 0 ? (
                  documents.map((doc) => (
                    <Button
                      key={doc.id}
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-3 px-4 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl transition-all"
                    >
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <FileText className="mr-3 h-5 w-5 text-brand-gold" />
                        <div className="flex-grow min-w-0">
                          <span className="block font-bold truncate text-sm uppercase tracking-tight">{doc.title}</span>
                          <span className="block text-[10px] text-white/60 uppercase font-bold">{doc.fileType} • {doc.fileSize}</span>
                        </div>
                        <Download className="ml-auto h-4 w-4 text-white/40" />
                      </a>
                    </Button>
                  ))
                ) : (
                  <p className="text-white/60 text-xs italic">Constitution and Handbook coming soon.</p>
                )}
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg rounded-2xl border-brand-100 bg-white">
              <CardHeader className="pb-4 p-0">
                <CardTitle className="text-xl font-extrabold uppercase text-brand-700 flex items-center gap-2">
                  <History className="h-5 w-5 text-brand-500" /> Fast Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-4 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-900 uppercase tracking-widest">Founded</h4>
                    <p className="text-sm text-gray-600">2017/2018 Academic Session</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-900 uppercase tracking-widest">Leadership</h4>
                    <p className="text-sm text-gray-600">9th President currently in office</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-900 uppercase tracking-widest">Location</h4>
                    <p className="text-sm text-gray-600">KWASU SU Building, Malete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;