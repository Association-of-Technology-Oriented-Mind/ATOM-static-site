import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FullPhotoGallery from "./pages/FullPhotoGallery";
import Event from "./pages/Event";
import EventDetailPage from "./pages/EventDetailPage";
import InternalRegistrationForm from "./pages/InternalRegistrationForm";
import ExternalRegistrationForm from "./pages/ExternalRegistrationForm";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Event />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/full-gallery" element={<FullPhotoGallery />} />
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
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
