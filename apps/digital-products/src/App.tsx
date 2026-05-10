import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Website from "./pages/Website";
import ProductDetails from "./pages/ProductDetails";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { getAuthData } from "./services/auth";
import { storageNames } from "@/utils/constants";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const dataAuth = getAuthData();
    if (!dataAuth) {
      localStorage.setItem(storageNames.authRedirect, "DSTORE");
      window.location.href = `${import.meta.env.VITE_ROOT}app/auth/login`;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path={import.meta.env.BASE_URL} element={<Index />} />
              <Route
                path={import.meta.env.BASE_URL + "website"}
                element={<Website />}
              />
              <Route
                path={import.meta.env.BASE_URL + "products"}
                element={<Products />}
              />
              <Route
                path={import.meta.env.BASE_URL + "products/:id"}
                element={<ProductDetails />}
              />
              <Route
                path={import.meta.env.BASE_URL + "transactions"}
                element={<Transactions />}
              />
              <Route
                path={import.meta.env.BASE_URL + "analytics"}
                element={<Analytics />}
              />
              <Route
                path={import.meta.env.BASE_URL + "services"}
                element={<Services />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
