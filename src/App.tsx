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
import SearchResultsPage from "./pages/SearchResultsPage"; // New import

// Admin Imports
import AdminLayout from "./app/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminUpdatePasswordPage from "./pages/admin/AdminUpdatePasswordPage";
import DashboardOverview from "./pages/admin/DashboardOverview";
import NewsManagement from "./pages/admin/NewsManagement";
import AddNewsArticle from "./pages/admin/AddNewsArticle";
import EditNewsArticle from "./pages/admin/EditNewsArticle";
import EventsManagement from "./pages/admin/EventsManagement";
import AddEvent from "./pages/admin/AddEvent";
import EditEvent from "./pages/admin/EditEvent";
import ExecutivesManagement from "./pages/admin/ExecutivesManagement";
import AddExecutive from "./pages/admin/AddExecutive";
import EditExecutive from "./pages/admin/EditExecutive";
import ComplaintsManagement from "./pages/admin/ComplaintsManagement";
import DocumentsManagement from "./pages/admin/DocumentsManagement";
import AddDocument from "./pages/admin/AddDocument";
import EditDocument from "./pages/admin/EditDocument";
import OpportunitiesManagement from "./pages/admin/OpportunitiesManagement";
import StudentSpotlightManagement from "./pages/admin/StudentSpotlightManagement";
import AddStudentSpotlight from "./pages/admin/AddStudentSpotlight";
import EditStudentSpotlight from "./pages/admin/EditStudentSpotlight";


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
              <Route path="/search" element={<SearchResultsPage />} /> {/* New Search Route */}
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
              <Route path="news/edit/:slug" element={<EditNewsArticle />} />
              <Route path="events" element={<EventsManagement />} />
              <Route path="events/add" element={<AddEvent />} />
              <Route path="events/edit/:slug" element={<EditEvent />} />
              <Route path="executives" element={<ExecutivesManagement />} />
              <Route path="executives/add" element={<AddExecutive />} />
              <Route path="executives/edit/:slug" element={<EditExecutive />} />
              <Route path="complaints" element={<ComplaintsManagement />} />
              <Route path="documents" element={<DocumentsManagement />} />
              <Route path="documents/add" element={<AddDocument />} />
              <Route path="documents/edit/:id" element={<EditDocument />} />
              <Route path="opportunities" element={<OpportunitiesManagement />} />
              <Route path="spotlight" element={<StudentSpotlightManagement />} />
              <Route path="spotlight/add" element={<AddStudentSpotlight />} />
              <Route path="spotlight/edit/:id" element={<EditStudentSpotlight />} />
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