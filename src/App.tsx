import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Existing pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LiveClassPage from "./pages/LiveClass";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";

// Newly added sidebar-linked pages
import Teachers from "./pages/Teachers";
import Materials from "./pages/Materials";
import Recordings from "./pages/Recordings";
import Tests from "./pages/Tests";
import Assignments from "./pages/Assignments";
import GradeReport from "./pages/GradeReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarInset>
            <Routes>
              {/* Existing routes */}
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/live-class/:roomId" element={<LiveClassPage />} />

              {/* Newly added sidebar-linked routes */}
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/recordings" element={<Recordings />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/grade-report" element={<GradeReport />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarInset>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
