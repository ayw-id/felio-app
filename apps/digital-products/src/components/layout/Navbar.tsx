import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  BarChart3,
  Link,
  ShoppingBag,
  Settings,
  Menu,
  X,
  FileText,
  UserRound,
  LogOut,
  Crown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  storageNames,
  dStoreStorageNames,
  builderStorageNames,
  restoStorageNames,
} from "@/utils/constants";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "", icon: LayoutGrid, label: "Dashboard" },
    { path: "website", icon: Link, label: "Bio Page" },
    { path: "products", icon: ShoppingBag, label: "Produk" },
    { path: "transactions", icon: FileText, label: "Transaksi" },
    // { path: "analytics", icon: BarChart3, label: "Analitik" },
    // { path: "settings", icon: Settings, label: "Settings" },
    { path: "services", icon: Crown, label: "Layanan Lain", color: "orange" },
  ];

  const handleLogout = () => {
    Object.values(storageNames).forEach((key) => {
      localStorage.removeItem(key);
    });

    Object.values(dStoreStorageNames).forEach((key) => {
      localStorage.removeItem(key);
    });

    Object.values(builderStorageNames).forEach((key) => {
      localStorage.removeItem(key);
    });

    Object.values(restoStorageNames).forEach((key) => {
      localStorage.removeItem(key);
    });

    window.location.href = `${import.meta.env.VITE_APP}auth/login`;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-subtle"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <NavLink
              to={import.meta.env.BASE_URL}
              className="text-xl font-semibold tracking-tight"
            >
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md mr-1">
                Felio
              </span>
              <span>DStore</span>
              {/* <span>{JSON.stringify(import.meta.env.BASE_URL)}</span> */}
            </NavLink>

            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex space-x-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={import.meta.env.BASE_URL + link.path}
                    className={({ isActive }) => `
                      px-4 py-2 rounded-md flex items-center space-x-2 transition-colors
                      ${
                        isActive
                          ? "bg-secondary text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }
                    `}
                  >
                    <link.icon
                      className="w-4 h-4"
                      style={{ color: link.color || "black" }}
                    />
                    <span style={{ color: link.color || "black" }}>
                      {link.label}
                    </span>
                  </NavLink>
                ))}
              </nav>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-9 w-9 hover:ring-2 hover:ring-primary/20 transition-all">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* <DropdownMenuItem className="cursor-pointer">
                    <UserRound className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator /> */}
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <button
              className="md:hidden p-2 rounded-md hover:bg-secondary/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="container mx-auto px-4 pt-20 pb-6">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={import.meta.env.BASE_URL + link.path}
                  className={({ isActive }) => `
                    px-4 py-3 rounded-md flex items-center space-x-3 transition-colors
                    ${
                      isActive
                        ? "bg-secondary text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }
                  `}
                >
                  <link.icon
                    className="w-5 h-5"
                    style={{ color: link.color || "black" }}
                  />
                  <span
                    className="text-lg"
                    style={{ color: link.color || "black" }}
                  >
                    {link.label}
                  </span>
                </NavLink>
              ))}
              <hr className="border-border my-2" />
              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-md flex items-center space-x-3 text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-lg">Log out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
