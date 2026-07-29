/**
 * Cloudflare Pages Function: /events/:slug
 *
 * Intercepts GET requests to event detail URLs before they reach the static SPA.
 * Fetches event data from Supabase and injects event-specific Open Graph / Twitter
 * Card meta tags + Event JSON-LD structured data so social media crawlers
 * (WhatsApp, Telegram, Facebook, X, LinkedIn) receive a rich link preview and Google
 * receives structured Event metadata.
 */

const SUPABASE_URL = "https://hblljnhofvcflilawtkn.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibGxqbmhvZnZjZmxpbGF3dGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MDAyNDgsImV4cCI6MjA3NjM3NjI0OH0.vYAo27VhPxxjuOBdJKpWujnYnFDXZ7MdsuHkD4VHE2Q";
const SITE_ORIGIN = "https://kwasusu.com.ng";
const FALLBACK_IMAGE = `${SITE_ORIGIN}/logo.png`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function truncateText(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  const sub = str.slice(0, maxLength - 1);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > 0 ? sub.slice(0, lastSpace) : sub) + "…";
}

function buildOgTags(event: {
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string | null;
  venue: string;
  category: string;
  url: string;
}): string {
  const rawTitle = event.title.trim();
  const pageTitle = escapeHtml(
    rawTitle.length > 44
      ? truncateText(rawTitle, 58)
      : `${rawTitle} | KWASU Events`
  );

  // Clean markdown syntax from description
  const cleanDesc = event.description.replace(/[#*`_>]/g, "").split("\n")[0] ?? rawTitle;

  const metaDesc = escapeHtml(truncateText(cleanDesc, 155));
  const ogDesc = escapeHtml(truncateText(cleanDesc, 122));
  const url = escapeHtml(event.url);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": rawTitle,
    "description": cleanDesc,
    "startDate": event.startsAt,
    "endDate": event.endsAt || event.startsAt,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Malete",
        "addressRegion": "Kwara State",
        "addressCountry": "NG"
      }
    },
    "image": [FALLBACK_IMAGE],
    "organizer": {
      "@type": "Organization",
      "name": "KWASU Students' Union",
      "url": SITE_ORIGIN
    }
  });

  return `
  <!-- Injected by Cloudflare Pages Function for social sharing & SEO -->
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="event" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image" content="${FALLBACK_IMAGE}" />
  <meta property="og:image:secure_url" content="${FALLBACK_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="KWASU Students' Union" />
  <meta property="og:locale" content="en_NG" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@thekwasusu" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <meta name="twitter:image" content="${FALLBACK_IMAGE}" />

  <script type="application/ld+json">
  ${jsonLd}
  </script>
  <!-- /Injected by Cloudflare Pages Function -->`;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    // ── 1. Fetch event from Supabase REST API ─────────────────────────────
    const apiUrl = `${SUPABASE_URL}/rest/v1/events?slug=eq.${encodeURIComponent(slug)}&select=id,slug,title,description_md,starts_at,ends_at,venue,category&limit=1`;

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
    const eventUrl = `${SITE_ORIGIN}/events/${slug}`;

    const ogTags = buildOgTags({
      title: row.title ?? "",
      description: row.description_md ?? "",
      startsAt: row.starts_at ?? "",
      endsAt: row.ends_at ?? null,
      venue: row.venue ?? "",
      category: row.category ?? "",
      url: eventUrl,
    });

    // ── 2. Fetch the SPA index.html from Cloudflare Assets ────────────────
    const indexRequest = new Request(`${SITE_ORIGIN}/`, context.request);
    const indexRes = await context.env.ASSETS.fetch(indexRequest);

    if (!indexRes.ok) {
      return context.env.ASSETS.fetch(context.request);
    }

    let html = await indexRes.text();

    // ── 3. Replace static tags and inject OG block ────────────────────────
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
    console.error("[events/[slug]] OG injection error:", err);
    return context.env.ASSETS.fetch(context.request);
  }
};
