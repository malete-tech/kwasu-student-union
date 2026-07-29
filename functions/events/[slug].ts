/**
 * Cloudflare Pages Function: /events/:slug
 *
 * Same pattern as functions/news/[id].ts — intercepts event detail pages
 * and injects event-specific OG / Twitter Card tags for social sharing.
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

function buildOgTags(event: {
  title: string;
  description: string;
  startsAt: string;
  venue: string;
  category: string;
  url: string;
}): string {
  const title = escapeHtml(`${event.title} | KWASU Students' Union Events`);
  // Strip basic markdown for description
  const description = escapeHtml(
    event.description.replace(/[#*`_>]/g, "").split("\n")[0] ?? event.title
  );
  const url = escapeHtml(event.url);

  // Format date for description suffix
  let dateSuffix = "";
  try {
    const d = new Date(event.startsAt);
    dateSuffix = ` — ${d.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} @ ${escapeHtml(event.venue)}`;
  } catch {
    // ignore date formatting errors
  }

  return `
  <!-- Injected by Cloudflare Pages Function for social sharing -->
  <title>${title}</title>
  <meta name="description" content="${description}${dateSuffix}" />

  <meta property="og:type" content="event" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}${dateSuffix}" />
  <meta property="og:image" content="${FALLBACK_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="KWASU Students' Union" />
  <meta property="og:locale" content="en_NG" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}${dateSuffix}" />
  <meta name="twitter:image" content="${FALLBACK_IMAGE}" />
  <meta name="twitter:site" content="@thekwasusu" />
  <!-- /Injected by Cloudflare Pages Function -->`;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    // ── 1. Fetch event from Supabase REST API ─────────────────────────────
    const apiUrl = `${SUPABASE_URL}/rest/v1/events?slug=eq.${encodeURIComponent(slug)}&select=id,slug,title,description_md,starts_at,venue,category&limit=1`;

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

    // ── 3. Replace static tags and inject OG block before </head> ─────────
    html = html.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${escapeHtml(row.title ?? "")} | KWASU Students' Union Events</title>`
    );
    html = html.replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${escapeHtml(
        (row.description_md ?? "").replace(/[#*`_>]/g, "").split("\n")[0] ?? ""
      )}" />`
    );

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
