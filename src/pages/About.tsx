"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { Document } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const aboutContent = `
## Our Mission
To represent, advocate for, and empower the students of Kwara State University, fostering a vibrant and inclusive campus community where every student can thrive academically, socially, and personally.

## Our Vision
To be a leading Students' Union, recognized for its transparency, accountability, and unwavering commitment to student welfare, academic excellence, and innovative solutions that enhance the overall university experience.

## Our Core Values
*   **Student-Centricity:** Placing the needs and interests of students at the forefront of all our initiatives and decisions.
*   **Integrity & Transparency:** Upholding the highest standards of honesty, ethics, and openness in all union operations.
*   **Advocacy & Empowerment:** Actively championing student rights and providing platforms for students to develop their leadership potential.
*   **Inclusivity & Diversity:** Promoting an environment where all students feel valued, respected, and have equal opportunities.
*   **Innovation & Progress:** Embracing new ideas and technologies to continuously improve student services and engagement.

## Brief History of KWASU SU
The Kwara State University Students' Union (KWASU SU) was established shortly after the university's inception to serve as the official representative body for all students. Over the years, the Union has played a pivotal role in bridging the gap between students and the university management, advocating for improved welfare, academic support, and a conducive learning environment. From its humble beginnings, KWASU SU has grown into a formidable force, organizing numerous events, initiatives, and campaigns that have positively impacted student life. We continue to build on this legacy, striving to create a lasting positive impact on every student's journey at KWASU.
`;

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
        <meta name="description" content="Learn about the mission, vision, values, and history of KWASU Students' Union. Access our constitution and student handbook." />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-brand-700">About KWASU Students' Union</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg rounded-2xl">
              <CardContent className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aboutContent}
                </ReactMarkdown>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-brand-700">Important Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : error ? (
                  <div className="text-destructive text-sm">{error}</div>
                ) : documents.length > 0 ? (
                  documents.map((doc) => (
                    <Button
                      key={doc.id}
                      asChild
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 border-brand-300 hover:bg-brand-50 focus-visible:ring-brand-gold"
                    >
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <FileText className="mr-3 h-5 w-5 text-brand-500" />
                        <div className="flex-grow">
                          <span className="block font-medium">{doc.title}</span>
                          <span className="block text-xs text-muted-foreground">{doc.fileType} &bull; {doc.fileSize}</span>
                        </div>
                        <Download className="ml-auto h-5 w-5 text-muted-foreground" />
                      </a>
                    </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No important documents available yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;