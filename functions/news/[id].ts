/**
 * Cloudflare Pages Function: /news/:id
 *
 * Intercepts GET requests to news article URLs before they reach the static SPA.
 * Fetches article data from Supabase and injects article-specific Open Graph / Twitter
 * Card meta tags + NewsArticle JSON-LD structured data so social media crawlers
 * (WhatsApp, Telegram, Facebook, X, LinkedIn) receive a rich link preview and Google
 * receives structured article metadata.
 */

const SUPABASE_URL = "https://hblljnhofvcflilawtkn.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibGxqbmhvZnZjZmxpbGF3dGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MDAyNDgsImV4cCI6MjA3NjM3NjI0OH0.vYAo27VhPxxjuOBdJKpWujnYnFDXZ7MdsuHkD4VHE2Q";
const SITE_ORIGIN = "https://kwasusu.com.ng";
const FALLBACK_IMAGE = `${SITE_ORIGIN}/logo.png`;

/**
 * Escape special HTML characters to prevent XSS through article titles/excerpts.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Smart truncate string at nearest word boundary to avoid cutting words in half.
 */
function truncateText(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  const sub = str.slice(0, maxLength - 1);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > 0 ? sub.slice(0, lastSpace) : sub) + "…";
}

/**
 * Build the block of <meta> tags + JSON-LD script to inject.
 */
function buildOgTags(article: {
  title: string;
  excerpt: string;
  coverUrl?: string | null;
  publishedAt: string;
  tags: string[];
  url: string;
}): string {
  const rawTitle = article.title.trim();
  // Ensure title stays under 60 chars for Google SERP display
  const pageTitle = escapeHtml(
    rawTitle.length > 48
      ? truncateText(rawTitle, 58)
      : `${rawTitle} | KWASU SU`
  );

  const metaDesc = escapeHtml(truncateText(article.excerpt, 155)); // For search engines
  const ogDesc = escapeHtml(truncateText(article.excerpt, 122));   // For social media cards (<125 chars)

  // Ensure absolute HTTPS image URL
  let image = FALLBACK_IMAGE;
  if (article.coverUrl && article.coverUrl.trim().length > 0) {
    const trimmed = article.coverUrl.trim();
    image = trimmed.startsWith("http") ? trimmed : `${SITE_ORIGIN}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  }

  const url = escapeHtml(article.url);

  const articleTags = article.tags
    .map((tag) => `  <meta property="article:tag" content="${escapeHtml(tag)}" />`)
    .join("\n");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": rawTitle,
    "description": article.excerpt,
    "image": [image],
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "author": {
      "@type": "Organization",
      "name": "KWASU Students' Union",
      "url": SITE_ORIGIN
    },
    "publisher": {
      "@type": "Organization",
      "name": "KWASU Students' Union",
      "logo": {
        "@type": "ImageObject",
        "url": FALLBACK_IMAGE
      }
    }
  });

  return `
  <!-- Injected by Cloudflare Pages Function for social sharing & SEO -->
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="KWASU Students' Union" />
  <meta property="og:locale" content="en_NG" />
  <meta property="article:published_time" content="${article.publishedAt}" />
${articleTags}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@thekwasusu" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <meta name="twitter:image" content="${image}" />

  <script type="application/ld+json">
  ${jsonLd}
  </script>
  <!-- /Injected by Cloudflare Pages Function -->`;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { id } = context.params as { id: string };

  try {
    // ── 1. Fetch article from Supabase REST API ────────────────────────────
    const apiUrl = `${SUPABASE_URL}/rest/v1/news?id=eq.${encodeURIComponent(id)}&select=id,title,excerpt,cover_url,published_at,tags&limit=1`;

    const supabaseRes = await fetch(apiUrl, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
    });

    if (!supabaseRes.ok) {
      return context.env.ASSETS.fetch(context.request);
    }

    const rows: any[] = await supabaseRes.json();

    if (!rows || rows.length === 0) {
      return context.env.ASSETS.fetch(context.request);
    }

    const row = rows[0];
    const articleUrl = `${SITE_ORIGIN}/news/${id}`;

    const ogTags = buildOgTags({
      title: row.title ?? "",
      excerpt: row.excerpt ?? "",
      coverUrl: row.cover_url ?? null,
      publishedAt: row.published_at ?? new Date().toISOString(),
      tags: Array.isArray(row.tags) ? row.tags : [],
      url: articleUrl,
    });

    // ── 2. Fetch the SPA index.html from Cloudflare Assets ────────────────
    const indexRequest = new Request(`${SITE_ORIGIN}/`, context.request);
    const indexRes = await context.env.ASSETS.fetch(indexRequest);

    if (!indexRes.ok) {
      return context.env.ASSETS.fetch(context.request);
    }

    let html = await indexRes.text();

    // ── 3. Clean fallback meta tags and inject article OG block ───────────
    html = html.replace(/<title>[^<]*<\/title>/i, "");
    html = html.replace(/<meta\s+name="description"[^>]*>/gi, "");
    html = html.replace(/<meta\s+property="og:[^>]*>/gi, "");
    html = html.replace(/<meta\s+name="twitter:[^>]*>/gi, "");
    html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, "");

    html = html.replace("</head>", `${ogTags}\n</head>`);

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (err) {
    console.error("[news/[id]] OG injection error:", err);
    return context.env.ASSETS.fetch(context.request);
  }
};
