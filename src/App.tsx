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
import Executives from "./pages/Executives"; // New import
import ExecutiveDetail from "./pages/ExecutiveDetail"; // New import

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
              <Route path="/executives" element={<Executives />} /> {/* New route */}
              <Route path="/executives/:slug" element={<ExecutiveDetail />} /> {/* New route */}
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