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
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import ServicesPage from "./pages/ServicesPage";
import DownloadsPage from "./pages/DownloadsPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import ContactPage from "./pages/ContactPage";

// Admin Imports
import AdminLayout from "./app/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminUpdatePasswordPage from "./pages/admin/AdminUpdatePasswordPage";
import DashboardOverview from "./pages/admin/DashboardOverview";
import NewsManagement from "./pages/admin/NewsManagement";
import AddNewsArticle from "./pages/admin/AddNewsArticle";
import EditNewsArticle from "./pages/admin/EditNewsArticle"; // New import
import EventsManagement from "./pages/admin/EventsManagement";
import ExecutivesManagement from "./pages/admin/ExecutivesManagement";
import ComplaintsManagement from "./pages/admin/ComplaintsManagement";
import DocumentsManagement from "./pages/admin/DocumentsManagement";
import OpportunitiesManagement from "./pages/admin/OpportunitiesManagement";
import StudentSpotlightManagement from "./pages/admin/StudentSpotlightManagement";


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
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/executives" element={<Executives />} />
              <Route path="/executives/:slug" element={<ExecutiveDetail />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetail />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/downloads" element={<DownloadsPage />} />
              <Route path="/services/opportunities" element={<OpportunitiesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* ADD ALL CUSTOM PUBLIC ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            </Route>

            {/* Admin Login Route (Publicly accessible) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/update-password" element={<AdminUpdatePasswordPage />} />

            {/* Admin Protected Routes (Will be protected by auth later) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="news" element={<NewsManagement />} />
              <Route path="news/add" element={<AddNewsArticle />} />
              <Route path="news/edit/:slug" element={<EditNewsArticle />} /> {/* New route */}
              <Route path="events" element={<EventsManagement />} />
              <Route path="executives" element={<ExecutivesManagement />} />
              <Route path="complaints" element={<ComplaintsManagement />} />
              <Route path="documents" element={<DocumentsManagement />} />
              <Route path="opportunities" element={<OpportunitiesManagement />} />
              <Route path="spotlight" element={<StudentSpotlightManagement />} />
            </Route>

            {/* Catch-all for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;