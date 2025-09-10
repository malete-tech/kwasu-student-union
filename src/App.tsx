import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Layout from "./app/layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Executives from "./pages/Executives";
import ExecutiveDetail from "./pages/ExecutiveDetail";
import NewsPage from "./pages/NewsPage"; // New import
import NewsDetail from "./pages/NewsDetail"; // New import
import EventsPage from "./pages/EventsPage"; // New import
import EventDetail from "./pages/EventDetail"; // New import
import ServicesPage from "./pages/ServicesPage"; // New import
import DownloadsPage from "./pages/DownloadsPage"; // New import
import OpportunitiesPage from "./pages/OpportunitiesPage"; // New import
import ContactPage from "./pages/ContactPage"; // New import

const queryClient = new QueryClient();
const helmetContext = {}; // Required for react-helmet-async

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider context={helmetContext}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/executives" element={<Executives />} />
              <Route path="/executives/:slug" element={<ExecutiveDetail />} />
              <Route path="/news" element={<NewsPage />} /> {/* New route */}
              <Route path="/news/:slug" element={<NewsDetail />} /> {/* New route */}
              <Route path="/events" element={<EventsPage />} /> {/* New route */}
              <Route path="/events/:slug" element={<EventDetail />} /> {/* New route */}
              <Route path="/services" element={<ServicesPage />} /> {/* New route */}
              <Route path="/services/downloads" element={<DownloadsPage />} /> {/* New route */}
              <Route path="/services/opportunities" element={<OpportunitiesPage />} /> {/* New route */}
              <Route path="/contact" element={<ContactPage />} /> {/* New route */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;