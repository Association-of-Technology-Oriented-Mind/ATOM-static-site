import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";

// Only the landing page is eager. Everything else — especially the admin
// bundle and its Firebase dependencies — loads on demand.
const NotFound = lazy(() => import("./pages/NotFound"));
const FullPhotoGallery = lazy(() => import("./pages/FullPhotoGallery"));
const Event = lazy(() => import("./pages/Event"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const InternalRegistrationForm = lazy(() => import("./pages/InternalRegistrationForm"));
const ExternalRegistrationForm = lazy(() => import("./pages/ExternalRegistrationForm"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const ClubPage = lazy(() => import("./pages/ClubPage"));
const CorePage = lazy(() => import("./pages/CorePage"));

import { FloatingNav } from "@/components/ui/floating-navbar";

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingNav />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Event />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />
              <Route path="/full-gallery" element={<FullPhotoGallery />} />
              <Route path="/core" element={<CorePage />} />
              <Route path="/clubs/:slug" element={<ClubPage />} />
              <Route path="/registration/internal" element={<InternalRegistrationForm />} />
              <Route path="/registration/external" element={<ExternalRegistrationForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
