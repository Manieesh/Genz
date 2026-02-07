import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Home from "./pages/Home";
import Results from "./pages/Results";
import CodeMap from "./pages/CodeMap";
import History from "./pages/History";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PageLayout>
                <Home />
              </PageLayout>
            }
          />
          <Route
            path="/results/:reviewId"
            element={
              <PageLayout>
                <Results />
              </PageLayout>
            }
          />
          <Route
            path="/map/:reviewId"
            element={
              <PageLayout fullWidth>
                <CodeMap />
              </PageLayout>
            }
          />
          <Route
            path="/history"
            element={
              <PageLayout>
                <History />
              </PageLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <PageLayout>
                <SettingsPage />
              </PageLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
