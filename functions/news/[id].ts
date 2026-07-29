/**
 * Cloudflare Pages Function: /news/:id
 *
 * Intercepts GET requests to news article URLs before they reach the static SPA.
 * Fetches article data from Supabase and injects article-specific Open Graph / Twitter
 * Card meta tags so social media crawlers (WhatsApp, Telegram, Facebook, X, etc.)
 * receive a rich link preview instead of the generic site fallback.
 *
 * For regular browsers, this function is transparent — it returns the same index.html
 * the static SPA would serve, just with correct <meta> tags already in the <head>.
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
 * Build the block of <meta> tags to inject, as a string.
 */
function buildOgTags(article: {
  title: string;
  excerpt: string;
  coverUrl?: string | null;
  publishedAt: string;
  tags: string[];
  url: string;
}): string {
  const title = escapeHtml(`${article.title} | KWASU Students' Union`);
  const description = escapeHtml(article.excerpt);
  const image = article.coverUrl || FALLBACK_IMAGE;
  const url = escapeHtml(article.url);

  const articleTags = article.tags
    .map((tag) => `  <meta property="article:tag" content="${escapeHtml(tag)}" />`)
    .join("\n");

  return `
  <!-- Injected by Cloudflare Pages Function for social sharing -->
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="KWASU Students' Union" />
  <meta property="og:locale" content="en_NG" />
  <meta property="article:published_time" content="${article.publishedAt}" />
${articleTags}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:site" content="@thekwasusu" />
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
      // Fall through to static asset on any Supabase error
      return context.env.ASSETS.fetch(context.request);
    }

    const rows: any[] = await supabaseRes.json();

    if (!rows || rows.length === 0) {
      // Article not found — fall through to SPA (will show its own 404)
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

    // ── 3. Replace the static <title> and inject OG tags ──────────────────
    // Remove the existing static title, meta description, and any static OG tags
    html = html.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${escapeHtml(row.title ?? "")} | KWASU Students' Union</title>`
    );
    html = html.replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${escapeHtml(row.excerpt ?? "")}" />`
    );

    // Inject our full OG tag block right before </head>
    html = html.replace("</head>", `${ogTags}\n</head>`);

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        // Cache for 5 minutes at the edge — articles don't change frequently
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (err) {
    // On any unexpected error, fall through to the static asset — never show a 500
    console.error("[news/[id]] OG injection error:", err);
    return context.env.ASSETS.fetch(context.request);
  }
};
