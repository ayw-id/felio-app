import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Package,
  ChefHat,
  Calculator,
  Users,
  TrendingUp,
  Building,
  Menu,
  ShoppingCart,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TabNav = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigationItems = [
    { value: "overview", label: "Overview", icon: TrendingUp, path: "" },
    { value: "orders", label: "Pesanan", icon: ShoppingCart, path: "orders" },
    {
      value: "customers",
      label: "Pelanggan",
      icon: UserCheck,
      path: "customers",
    },
    { value: "stock", label: "Bahan Baku", icon: Package, path: "stock" },
    { value: "menu", label: "Menu & Paket", icon: ChefHat, path: "menu" },
    // { value: "accounting", label: "Keuangan", icon: Calculator, path: "accounting" },
    { value: "employees", label: "Team", icon: Users, path: "staff" },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsDrawerOpen(false);
    // navigate('/business')
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-6 mb-8"
    >
      {/* Mobile Navigation Drawer */}
      <div className="md:hidden">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              <Menu className="w-4 h-4 mr-2" />
              Navigation
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Navigation</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  to={import.meta.env.BASE_URL + item.path}
                  key={item.value}
                >
                  <Button
                    key={item.value}
                    variant={activeTab === item.value ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange(item.value)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Tabs */}
      <TabsList className="hidden md:grid w-full grid-cols-8 lg:w-fit">
        {navigationItems.map((item) => (
          <TabsTrigger
            onClick={() => handleTabChange(item.value)}
            key={item.value}
            value={item.value}
            className="flex items-center gap-2"
          >
            <Link to={import.meta.env.BASE_URL + item.path}>{item.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TabNav;
