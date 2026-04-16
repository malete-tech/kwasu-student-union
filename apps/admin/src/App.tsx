import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import NotFound from "./pages/NotFound";

// Admin Imports
import AdminLayout from "./app/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
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
import ComplaintDetailPage from "./pages/admin/ComplaintDetailPage";
import DocumentsManagement from "./pages/admin/DocumentsManagement";
import AddDocument from "./pages/admin/AddDocument";
import EditDocument from "./pages/admin/EditDocument";
import OpportunitiesManagement from "./pages/admin/OpportunitiesManagement";
import AddOpportunity from "./pages/admin/AddOpportunity";
import EditOpportunity from "./pages/admin/EditOpportunity";
import SpotlightManagement from "./pages/admin/SpotlightManagement";
import AddSpotlight from "./pages/admin/AddSpotlight";
import EditSpotlight from "./pages/admin/EditSpotlight";
import GlobalAnnouncementManagement from "./pages/admin/GlobalAnnouncementManagement";
import PartnersManagement from "./pages/admin/PartnersManagement";
import AddPartner from "./pages/admin/AddPartner";
import EditPartner from "./pages/admin/EditPartner";
import ProfilePage from "./pages/admin/ProfilePage";

import ProtectedRoute from "@/components/admin/ProtectedRoute";

const queryClient = new QueryClient();
const helmetContext = {};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider context={helmetContext}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<AdminLoginPage />} />

            {/* Protected Management Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              
              {/* News */}
              <Route path="news">
                <Route index element={<NewsManagement />} />
                <Route path="add" element={<AddNewsArticle />} />
                <Route path="edit/:id" element={<EditNewsArticle />} />
              </Route>

              {/* Events */}
              <Route path="events">
                <Route index element={<EventsManagement />} />
                <Route path="add" element={<AddEvent />} />
                <Route path="edit/:slug" element={<EditEvent />} />
              </Route>

              {/* Executives */}
              <Route path="executives">
                <Route index element={<ExecutivesManagement />} />
                <Route path="add" element={<AddExecutive />} />
                <Route path="edit/:slug" element={<EditExecutive />} />
              </Route>

              {/* Complaints */}
              <Route path="complaints">
                <Route index element={<ComplaintsManagement />} />
                <Route path=":id" element={<ComplaintDetailPage />} />
              </Route>

              {/* Documents */}
              <Route path="documents">
                <Route index element={<DocumentsManagement />} />
                <Route path="add" element={<AddDocument />} />
                <Route path="edit/:id" element={<EditDocument />} />
              </Route>

              {/* Opportunities */}
              <Route path="opportunities">
                <Route index element={<OpportunitiesManagement />} />
                <Route path="add" element={<AddOpportunity />} />
                <Route path="edit/:id" element={<EditOpportunity />} />
              </Route>

              {/* Spotlight */}
              <Route path="spotlight">
                <Route index element={<SpotlightManagement />} />
                <Route path="add" element={<AddSpotlight />} />
                <Route path="edit/:id" element={<EditSpotlight />} />
              </Route>

              <Route path="announcements" element={<GlobalAnnouncementManagement />} />
              <Route path="profile" element={<ProfilePage />} />
              
              {/* Partners/Ads */}
              <Route path="partners">
                <Route index element={<PartnersManagement />} />
                <Route path="add" element={<AddPartner />} />
                <Route path="edit/:id" element={<EditPartner />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
