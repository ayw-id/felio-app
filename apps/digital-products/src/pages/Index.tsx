import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  Plus,
  Globe,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ProductCard, { Product } from "../components/dashboard/ProductCard";
import Chart from "../components/dashboard/Chart";
import PageTransition from "../components/layout/PageTransition";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { dStoreStorageNames } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { onBoarding } from "@/services/home";
import { AuthData, getAuthData } from "@/services/auth";
import { toast } from "@/components/ui/use-toast";

// Sample data for charts
const salesData = [
  // { month: "Jan", sales: 4000 },
  // { month: "Feb", sales: 3000 },
  // { month: "Mar", sales: 5000 },
  // { month: "Apr", sales: 4500 },
  // { month: "May", sales: 6000 },
  // { month: "Jun", sales: 5500 },
  // { month: "Jul", sales: 7000 },
];

const visitorData = [
  // { day: "Mon", visitors: 500 },
  // { day: "Tue", visitors: 600 },
  // { day: "Wed", visitors: 800 },
  // { day: "Thu", visitors: 1200 },
  // { day: "Fri", visitors: 900 },
  // { day: "Sat", visitors: 700 },
  // { day: "Sun", visitors: 500 },
];

// Sample product data
const featuredProducts: Product[] = [];

const Index = () => {
  const navigate = useNavigate();
  const [dataAuth, setDataAuth] = useState<AuthData>(null);
  const [hasProduct, setHasProduct] = useState<boolean>(false);
  const [hasWebsite, setHasWebsite] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuthData();
    if (auth) {
      setDataAuth(auth);
    }
  }, []);

  const handleCreateProduct = () => {
    localStorage.setItem(dStoreStorageNames.dStoreOnboarding, "createProduct");
    navigate(import.meta.env.BASE_URL + "products");
  };

  const handleCreateWebPage = () => {
    localStorage.setItem(dStoreStorageNames.dStoreOnboarding, "createWebsite");
    navigate(import.meta.env.BASE_URL + "website");
  };

  const _onBoarding = () => {
    return onBoarding({
      token: dataAuth.token,
      baseUrl: import.meta.env.VITE_DSTORE_API,
    }).then((data) => {
      if (data.success) {
        setHasProduct(data.data.hasProduct);
        setHasWebsite(data.data.hasWebsite);
        return true;
      } else {
        toast({
          title: data.msg,
          description: data.msg,
        });

        return true;
      }
    });
  };

  const onboardingQuery = useQuery({
    queryKey: ["onboarding"],
    queryFn: _onBoarding,
  });

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your digital product store
          </p>
        </header>

        {onboardingQuery.isLoading && <p className="text-center">Loading..</p>}

        {onboardingQuery.isError && (
          <p className="text-center">Error Loading Data</p>
        )}

        {!onboardingQuery.isLoading &&
          !onboardingQuery.isError &&
          (!hasProduct || !hasWebsite) && (
            <div className="space-y-8 mb-12 bg-yellow-50 py-8">
              <header className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                  Selamat Datang Di Felio DStore! 🎉
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Mari mulai dengan membuat produk pertama Anda atau menyiapkan
                  halaman web Anda.
                </p>
              </header>

              <div className="max-w-4xl mx-auto">
                <div
                  className={`grid grid-cols-1 md:grid-cols-${
                    hasProduct || hasWebsite ? 1 : 2
                  } gap-8`}
                >
                  {!hasProduct && (
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                      onClick={handleCreateProduct}
                    >
                      <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Package className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">
                          Buat Produk Pertama Anda
                        </CardTitle>
                        <CardDescription className="text-base">
                          Tambahkan produk digital seperti kursus online,
                          e-book, atau template untuk mulai menjual
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleCreateProduct}
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Buat Produk
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {!hasWebsite && (
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                      onClick={handleCreateWebPage}
                    >
                      <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Globe className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">
                          Siapkan Halaman Web Anda
                        </CardTitle>
                        <CardDescription className="text-base">
                          Sesuaikan tampilan toko Anda dan buat landing pages
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          className="w-full"
                          size="lg"
                          onClick={handleCreateWebPage}
                        >
                          <Globe className="w-5 h-5 mr-2" />
                          Buat Halaman Website
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Revenue"
            value="0"
            icon={DollarSign}
            trend={{ value: 0.0, isPositive: true }}
            description="vs bulan lalu"
            delay={0}
          />
          <StatCard
            title="Penjualan Produk"
            value="0"
            icon={ShoppingCart}
            trend={{ value: 0.0, isPositive: true }}
            description="vs bulan lalu"
            delay={1}
          />
          <StatCard
            title="Conversion Rate"
            value="0.0%"
            icon={TrendingUp}
            trend={{ value: 0.0, isPositive: true }}
            description="vs bulan lalu"
            delay={2}
          />
          <StatCard
            title="Pelanggan Aktif"
            value="0"
            icon={Users}
            trend={{ value: 0.0, isPositive: true }}
            description="vs bulan lalu"
            delay={3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="subtle-card p-6">
            <h2 className="text-xl font-semibold mb-6">Penjualan Bulanan</h2>
            {salesData.length ? (
              <Chart
                data={salesData}
                type="area"
                dataKey="sales"
                xAxisDataKey="month"
                name="Sales ($)"
                color="#111111"
                height={300}
              />
            ) : (
              <p>Tidak ada data penjualan</p>
            )}
          </div>

          <div className="subtle-card p-6">
            <h2 className="text-xl font-semibold mb-6">Pengunjung Mingguan</h2>
            {visitorData.length ? (
              <Chart
                data={visitorData}
                type="bar"
                dataKey="visitors"
                xAxisDataKey="day"
                name="Visitors"
                color="#111111"
                height={300}
              />
            ) : (
              <p>Tidak ada data pengunjung</p>
            )}
          </div>
        </div>
        {/* Featured Products */}
        {featuredProducts.length ? (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Produk Paling Laris</h2>
              <a
                href="/products"
                className="text-sm font-medium text-primary hover:underline"
              >
                Lihat semua produk
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </PageTransition>
  );
};

export default Index;
