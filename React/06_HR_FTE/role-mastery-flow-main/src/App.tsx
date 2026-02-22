import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Applications from "./pages/Applications";
import CVVersions from "./pages/CVVersions";
import JobIntelligence from "./pages/JobIntelligence";
import Outreach from "./pages/Outreach";
import InterviewPrep from "./pages/InterviewPrep";
import Analytics from "./pages/Analytics";
import ControlTowerPage from "./pages/ControlTowerPage";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/cv-versions" element={<CVVersions />} />
            <Route path="/job-intelligence" element={<JobIntelligence />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/control-tower" element={<ControlTowerPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
