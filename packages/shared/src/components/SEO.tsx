import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'event';
  publishedAt?: string;
  tags?: string[];
  jsonLd?: Record<string, any>;
}

function truncateText(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  const sub = str.slice(0, maxLength - 1);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > 0 ? sub.slice(0, lastSpace) : sub) + "…";
}

export const SEO: React.FC<SEOProps> = ({
  title = "KWASU Students' Union | Official Website",
  description = "Official digital hub of the Kwara State University Students' Union (KWASU SU). Access official campus news, events, student services, and leadership.",
  image = "https://kwasusu.com.ng/logo.png",
  url = "https://kwasusu.com.ng",
  type = "website",
  publishedAt,
  tags = [],
  jsonLd,
}) => {
  // Ensure title stays under 60 chars for Google SERP display
  const pageTitle = title.length > 60 ? truncateText(title, 58) : title;
  
  // Clean markdown if present
  const cleanDesc = description.replace(/[#*`_>]/g, "").trim();

  // Search Engine meta description: max 155 chars
  const searchDesc = truncateText(cleanDesc, 155);

  // Social card og:description: max 122 chars for clean mobile cards
  const ogDesc = truncateText(cleanDesc, 122);

  // Ensure absolute HTTPS URL
  const absoluteImage = image.startsWith("http")
    ? image
    : `https://kwasusu.com.ng${image.startsWith("/") ? "" : "/"}${image}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={searchDesc} />
      <link rel="canonical" href={url} />

      {/* Open Graph / WhatsApp / Facebook / Telegram */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={ogDesc} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:secure_url" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="KWASU Students' Union" />
      <meta property="og:locale" content="en_NG" />

      {/* Article-specific Open Graph */}
      {type === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === 'article' && tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@thekwasusu" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={ogDesc} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Optional Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
