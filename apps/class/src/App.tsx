import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./lib/LanguageContext";
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import { baseUrl } from "./lib/utils";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path={baseUrl} element={<Index />} />
            <Route path={baseUrl + "register"} element={<Registration />} />
            <Route path={baseUrl + "payment"} element={<Payment />} />
            <Route path={baseUrl + "privacy"} element={<Privacy />} />
            <Route path={baseUrl + "refund-policy"} element={<RefundPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;