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
import CentralExecutive from "./pages/CentralExecutive";
import SenateCouncil from "./pages/SenateCouncil";
import JudiciaryCouncil from "./pages/JudiciaryCouncil";
import ExecutiveDetail from "./pages/ExecutiveDetail";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import ServicesPage from "./pages/ServicesPage";
import DownloadsPage from "./pages/DownloadsPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import ContactPage from "./pages/ContactPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import SubmitComplaintPage from "./pages/SubmitComplaintPage";
import SpotlightPage from "./pages/SpotlightPage";
import SuggestionBoxPage from "./pages/SuggestionBoxPage";
import PartnersPage from "./pages/PartnersPage"; // Added


const queryClient = new QueryClient();
const helmetContext = {};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider context={helmetContext}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/executives/central" element={<CentralExecutive />} />
              <Route path="/executives/senate" element={<SenateCouncil />} />
              <Route path="/executives/judiciary" element={<JudiciaryCouncil />} />
              <Route path="/executives/:slug" element={<ExecutiveDetail />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetail />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/downloads" element={<DownloadsPage />} />
              <Route path="/services/opportunities" element={<OpportunitiesPage />} />
              <Route path="/services/complaints" element={<SubmitComplaintPage />} />
              <Route path="/services/suggestion-box" element={<SuggestionBoxPage />} />
              <Route path="/spotlight" element={<SpotlightPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;