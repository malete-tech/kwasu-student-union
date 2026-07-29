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
}

export const SEO: React.FC<SEOProps> = ({
  title = "KWASU Students' Union | Official Website",
  description = "The official digital home of the Kwara State University Students' Union. Access news, campus events, student services, and leadership updates.",
  image = "https://kwasusu.com.ng/logo.png",
  url = "https://kwasusu.com.ng",
  type = "website",
  publishedAt,
  tags = [],
}) => {
  return (
    <Helmet>
      {/* Standard */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / WhatsApp / Facebook / Telegram */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="KWASU Students' Union" />
      <meta property="og:locale" content="en_NG" />

      {/* Article-specific Open Graph (used by Facebook/LinkedIn for articles) */}
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
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
