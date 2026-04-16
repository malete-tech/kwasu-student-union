import { News, Event, Opportunity } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const search = {
  searchAll: async (term: string): Promise<{ news: News[], events: Event[], opportunities: Opportunity[] }> => {
    const searchPattern = `%${term.toLowerCase()}%`;

    // 1. Search News (title, excerpt)
    const newsPromise = supabase.from('news')
      .select('*')
      .or(`title.ilike.${searchPattern},excerpt.ilike.${searchPattern}`)
      .order('published_at', { ascending: false });

    // 2. Search Events (title, description_md, venue, category)
    const eventsPromise = supabase.from('events')
      .select('*')
      .or(`title.ilike.${searchPattern},description_md.ilike.${searchPattern},venue.ilike.${searchPattern},category.ilike.${searchPattern}`)
      .order('starts_at', { ascending: true });

    // 3. Search Opportunities (title, description_md, sponsor)
    const opportunitiesPromise = supabase.from('opportunities')
      .select('*')
      .or(`title.ilike.${searchPattern},description_md.ilike.${searchPattern},sponsor.ilike.${searchPattern}`)
      .order('deadline', { ascending: true });

    const [newsResult, eventsResult, opportunitiesResult] = await Promise.all([
      newsPromise,
      eventsPromise,
      opportunitiesPromise,
    ]);

    if (newsResult.error) {
      console.error("Supabase error searching news:", newsResult.error);
      throw new Error(newsResult.error.message);
    }
    if (eventsResult.error) {
      console.error("Supabase error searching events:", eventsResult.error);
      throw new Error(eventsResult.error.message);
    }
    if (opportunitiesResult.error) {
      console.error("Supabase error searching opportunities:", opportunitiesResult.error);
      throw new Error(opportunitiesResult.error.message);
    }

    const news = newsResult.data.map(item => ({
      ...item,
      bodyMd: item.body_md,
      publishedAt: item.published_at,
    })) as News[];

    const events = eventsResult.data.map(item => ({
      ...item,
      startsAt: item.starts_at,
      endsAt: item.ends_at,
      descriptionMd: item.description_md,
      rsvpOpen: item.rsvp_open,
      rsvpLink: item.rsvp_link,
      agendaMd: item.agenda_md,
    })) as Event[];

    const opportunities = opportunitiesResult.data.map(item => ({
      ...item,
      descriptionMd: item.description_md,
    })) as Opportunity[];

    return { news, events, opportunities };
  },
};