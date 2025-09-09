import {
  Executive,
  News,
  Event,
  Document,
  Opportunity,
  StudentSpotlight,
  Complaint,
} from "@/types";

// Import mock data
import newsData from "@/data/news.json";
import eventsData from "@/data/events.json";
import executivesData from "@/data/executives.json";
import documentsData from "@/data/documents.json";
import opportunitiesData from "@/data/opportunities.json";
import studentSpotlightData from "@/data/student-spotlight.json";

const SIMULATED_DELAY = 500; // milliseconds

const simulateAsync = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, SIMULATED_DELAY);
  });
};

export const api = {
  news: {
    getAll: (): Promise<News[]> => simulateAsync(newsData as News[]),
    getLatest: (count: number): Promise<News[]> =>
      simulateAsync(
        (newsData as News[])
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime(),
          )
          .slice(0, count),
      ),
    getBySlug: (slug: string): Promise<News | undefined> =>
      simulateAsync(
        (newsData as News[]).find((item) => item.slug === slug),
      ),
  },
  events: {
    getAll: (): Promise<Event[]> => simulateAsync(eventsData as Event[]),
    getUpcoming: (count: number): Promise<Event[]> =>
      simulateAsync(
        (eventsData as Event[])
          .filter((event) => new Date(event.startsAt) > new Date())
          .sort(
            (a, b) =>
              new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
          )
          .slice(0, count),
      ),
    getBySlug: (slug: string): Promise<Event | undefined> =>
      simulateAsync(
        (eventsData as Event[]).find((item) => item.slug === slug),
      ),
  },
  executives: {
    getAll: (): Promise<Executive[]> =>
      simulateAsync(executivesData as Executive[]),
    getBySlug: (slug: string): Promise<Executive | undefined> =>
      simulateAsync(
        (executivesData as Executive[]).find((item) => item.slug === slug),
      ),
  },
  documents: {
    getAll: (): Promise<Document[]> =>
      simulateAsync(documentsData as Document[]),
  },
  opportunities: {
    getAll: (): Promise<Opportunity[]> =>
      simulateAsync(opportunitiesData as Opportunity[]),
  },
  studentSpotlight: {
    getAll: (): Promise<StudentSpotlight[]> =>
      simulateAsync(studentSpotlightData as StudentSpotlight[]),
  },
  complaints: {
    // This will be handled by localStorage, not static JSON
    submit: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'timeline'>): Promise<Complaint> => {
      return simulateAsync({
        id: `C-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        status: 'Queued',
        timeline: [{ status: 'Queued', timestamp: new Date().toISOString(), note: 'Complaint received.' }],
        ...complaint,
      } as Complaint);
    },
    getById: (id: string): Promise<Complaint | undefined> => {
      // This will fetch from localStorage later
      return simulateAsync(undefined); // Placeholder
    }
  }
};