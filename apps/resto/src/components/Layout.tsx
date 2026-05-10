import { useLocation, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import UserAvatar from "@/components/UserAvatar";
import BranchSelector from "@/components/BranchSelector";
import BrandSelector from "@/components/BrandSelector";
import TabNav from "@/components/TabNav";
import Index from "../pages/Index";
import Orders from "../pages/Orders";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Customers from "../pages/Customers";
import Stock from "../pages/Stock";
import MenuPage from "../pages/Menu";
import Accounting from "../pages/Accounting";
import Staff from "../pages/Staff";
import Brand from "../pages/Brand";
import Suppliers from "../pages/Suppliers";
import NotFound from "../pages/NotFound";
import AuthGuard from "/src/AuthGuard";
import { RestoProvider } from "@/contexts/RestoContext";
import { useToken } from "@/contexts/TokenContext";
import { useRestoRedirectGuard } from "@/hooks/useRestoRedirectGuard";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const location = useLocation();
  const authRoutes = ["login", "register"];
  const settingRoutes = ["brand", "branch"];
  const { token, employeeRole } = useToken();
  const isAdmin = employeeRole === "admin";
  const isAdminBrand = token?.employeeRole === "admin_brand";
  const isAuthPage = authRoutes.some((route) =>
    location.pathname.startsWith(import.meta.env.BASE_URL + route)
  );
  const isSettingPage = settingRoutes.some((route) =>
    location.pathname.startsWith(import.meta.env.BASE_URL + route)
  );

  return (
    <AuthGuard>
      <RestoProvider>
        {/** 🔒 Redirect user to /brand if no brand or branch */}
        {!isAuthPage && <RestoRedirectEnforcer />}

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
          <div className="container mx-auto p-6">
            {isSettingPage && (
              <Link
                to={import.meta.env.BASE_URL}
                className="flex items-center cursor-pointer"
              >
                <Button variant="default" className="w-full mb-4 w-120">
                  Kembali Ke Beranda
                </Button>
              </Link>
            )}
            {!isAuthPage && (
              <div className="flex justify-between items-start">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Resto & Catering Management Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Kelola brand resto & kulinermu secara efisien
                  </p>
                </div>
                <UserAvatar />
              </div>
            )}

            {!isAuthPage && (
              <div className="mb-6 space-y-4">
                {isAdmin && <BrandSelector />}
                {(isAdmin || isAdminBrand) && <BranchSelector />}
              </div>
            )}

            {!isAuthPage && !isSettingPage && <TabNav />}

            <Routes>
              <Route path={import.meta.env.BASE_URL} element={<Index />} />
              <Route
                path={import.meta.env.BASE_URL + "login"}
                element={<Login />}
              />
              <Route
                path={import.meta.env.BASE_URL + "orders"}
                element={<Orders />}
              />
              <Route
                path={import.meta.env.BASE_URL + "customers"}
                element={<Customers />}
              />
              <Route
                path={import.meta.env.BASE_URL + "stock"}
                element={<Stock />}
              />
              <Route
                path={import.meta.env.BASE_URL + "menu"}
                element={<MenuPage />}
              />
              <Route
                path={import.meta.env.BASE_URL + "accounting"}
                element={<Accounting />}
              />
              <Route
                path={import.meta.env.BASE_URL + "staff"}
                element={<Staff />}
              />
              <Route
                path={import.meta.env.BASE_URL + "brand"}
                element={<Brand />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </RestoProvider>
    </AuthGuard>
  );
};

const RestoRedirectEnforcer = () => {
  useRestoRedirectGuard();
  return null;
};

export default Layout;
