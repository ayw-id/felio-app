import { useEffect, useState } from "react";
import { PlusCircle, Search, Filter, Grid3X3, List } from "lucide-react";
import ServiceCard, {
  Service,
  ServiceType,
} from "../components/dashboard/ServiceCard";
import PageTransition from "../components/layout/PageTransition";
import { AuthData, getAuthData } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "@/services/product";
import { toast } from "@/components/ui/use-toast";
import { verifyServiceAccount } from "../services/auth";
import { storageNames } from "../utils/constants";

const services: Service[] = [
  {
    title: "#FelioStore",
    items: [
      "🚀 Jualan produk fisik dengan toko online, atur produk, stok, dan varian dengan mudah",
      "🚀 Tersedia layanan pengiriman seperti JNE, JNT, LION, dst",
      "🚀 Tersedia layanan pembayaran seperti E-wallet (OVO, Dana, ShopeePay), VA, dst",
      "🚀 Sudah termasuk #FelioBuilder (Web Builder)",
      "🎯 Cocok buat business owner yang ingin kembangkan brand dan tingkatkan penjualan",
    ],
    isComingSoon: false,
    serviceType: ServiceType.store,
  },
  {
    title: "#FelioAgent",
    items: [
      "🚀 Atur level agen dan halaman registrasi reseller",
      "🚀 Kelola komisi per produk atau per kategori",
      "🚀 Kelola dan pantau performa reseller</p>",
      "🚀 Sudah termasuk #FelioStore & #FelioBuilder",
      "🎯 Cocok buat brand yang ingin kelola tim reseller dengan mudah",
    ],
    isComingSoon: false,
    serviceType: ServiceType.agent,
  },
  {
    title: "#FelioResto",
    items: [
      "🚀 Kelola cabang resto dengan mudah",
      "🚀 Kelola menu, karyawan, hingga pesanan",
      "🚀 Tersedia fitur tagihan untuk dibayar nanti</p>",
      "🚀 Sudah termasuk #FelioPos",
      "🎯 Cocok buat bisnis restoran dan catering",
    ],
    isComingSoon: false,
    serviceType: ServiceType.resto,
  },
  {
    title: "#FelioPos",
    items: [
      "🚀 Aplikasi kasir yang simple dan minimalis",
      "🚀 Kelola pesanan dan terima pembayaran dengan aman dan mudah",
      "🚀 Kelola tagihan untuk dibayar nanti</p>",
      "🚀 Sudah termasuk #FelioStore untuk kelola produk",
      "🎯 Cocok buat toko offline seperti restoran, minimarket, dan lainnya",
    ],
    isComingSoon: true,
  },
  {
    title: "#FelioAffiliate",
    items: [
      "🚀 Gabung jadi member affiliate untuk pasarkan layanan felio dan produk merchant",
      "🚀 Kelola dan pantau performa link yang dishare, serta data client yang berhasil diajak",
      "🚀 Terima komisi untuk setiap transaksi dari client yang berhasil diajak",
      "🎯 Cocok buat Anda yang ingin punya penghasilan tambahan sebagai affiliator",
    ],
    isComingSoon: true,
  },
];
const Services = () => {
  const [dataAuth, setDataAuth] = useState<AuthData>(null);

  const verifyService = (service: Service) => {
    return verifyServiceAccount({
      token: dataAuth.token,
      baseUrl: import.meta.env.VITE_STORE_API,
      service,
    }).then((data) => {
      if (data.success) {
        if (service === ServiceType.store) {
          window.location.href = import.meta.env.VITE_APP;
        } else if (service === ServiceType.agent) {
          window.location.href = `${import.meta.env.VITE_APP}agent/`;
        } else if (service === ServiceType.resto) {
          localStorage.setItem(
            storageNames.restoToken as string,
            JSON.stringify(data.data?.serviceToken)
          );
          window.location.href = `${import.meta.env.VITE_ROOT}resto/`;
        }
        return true;
      } else {
        toast({
          title: data.msg,
          description: data.msg,
        });

        throw new Error(data.msg);
      }
    });
  };

  useEffect(() => {
    const auth = getAuthData();
    if (auth) {
      setDataAuth(auth);
    }
  }, []);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Layanan Felio</h1>
          <p className="text-muted-foreground">
            Jelajahi layanan lain Felio.ID yang cocok untuk bisnis Anda
          </p>
        </header>

        <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
              dataAuth={dataAuth}
              verifyService={verifyService}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Services;
