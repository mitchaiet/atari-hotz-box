
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KeyOverlayProvider } from "./contexts/KeyOverlayContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MIDIDebugConsole from "./components/MIDIDebugConsole";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <KeyOverlayProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MIDIDebugConsole />
            <footer className="text-center text-sm text-gray-500 py-4 mt-auto">
              © 2025 Mitch Chaiet. All rights reserved.
            </footer>
          </div>
        </BrowserRouter>
      </KeyOverlayProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
