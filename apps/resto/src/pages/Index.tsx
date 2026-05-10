import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ChefHat,
  Calculator,
  Users,
  AlertTriangle,
  Star,
  Building2,
} from "lucide-react";
import StatusCard from "@/components/dashboard/StatusCard";
import AlertCard from "@/components/dashboard/AlertCard";
import { useHomeStats } from "@/hooks/useHomeStats";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface StockShortage {
  idMaterial: string;
  name: string;
  unit: string;
  qtyShort: number;
}

interface StockExpired {
  idMaterial: string;
  name: string;
  unit: string;
  expiredQty: number;
}

interface HomeAlert {
  type: "warning" | "default";
  message: string;
  title?: string;
  data?: StockShortage[] | StockExpired[];
}

export interface HomeStatsResponse {
  stats: {
    title: string;
    value: number;
  };
  alert: HomeAlert;
}

const getUrlParams = (
  title: "lowStock" | "expiredMaterials",
  data: StockShortage[] | StockExpired[]
) => {
  let ids = "";
  data.forEach((item) => {
    const id =
      item.idMaterial +
      "-" +
      (title === "lowStock" ? item.qtyShort : item.expiredQty);
    ids += (ids ? "|" : "") + id;
  });

  return ids;
};

const alertTitle = (title: string) => {
  return title === "lowStock"
    ? "Kekurangan Bahan Baku"
    : title === "expiredMaterials"
    ? "Bahan Baku Kadaluarsa"
    : "";
};

const Index = () => {
  const [showAlertDetail, setShowAlertDetail] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<HomeAlert | null>(null);
  // const [shortageStocks, setShortageStocks] = useState<StockShortage[] | null>(null);

  const { data, isLoading, error } = useHomeStats();
  const navigate = useNavigate();

  const stats = data?.data?.stats?.map((stat) => {
    const icon =
      stat.icon === "package"
        ? Package
        : stat.icon === "chefHat"
        ? ChefHat
        : stat.icon === "calculator"
        ? Calculator
        : stat.icon === "star"
        ? Star
        : stat.icon === "building"
        ? Building2
        : Users;
    return {
      ...stat,
      icon,
    };
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading home stats</p>;

  const handleAlertClick = (alert) => {
    if (alert.data?.length > 0) {
      setSelectedAlert(alert);
      setShowAlertDetail(true);
    }
  };

  const purchaseMaterial = () => {
    const params = getUrlParams(selectedAlert.title, selectedAlert.data);
    navigate(
      `${
        import.meta.env.BASE_URL
      }stock/?tab=purchases&action=create&data=${params}`
    );
  };

  const removeStock = (item: StockExpired) => {
    const params = getUrlParams(selectedAlert.title, [item]);
    navigate(
      `${
        import.meta.env.BASE_URL
      }stock/?tab=history&action=create&data=${params}`
    );
  };

  return (
    <>
      <div
        className={`grid grid-cols-1 lg:grid-cols-${
          data?.data?.alerts?.length ? 3 : 1
        } gap-6 mt-8`}
      >
        {!!data?.data?.alerts?.length && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Pengingat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.data?.alerts?.map((alert, index) => (
                <AlertCard
                  key={index}
                  {...alert}
                  onClick={() => handleAlertClick(alert)}
                />
              ))}
            </CardContent>
          </Card>
        )}
        <div className="lg:col-span-2">
          <div
            className={`grid grid-cols-${
              data?.data?.alerts?.length ? 2 : 3
            } gap-6`}
          >
            {(stats || []).map((stat: HomeStatsResponse, index) => (
              <StatusCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Shortage Stock Dialog */}
        {selectedAlert && (
          <Dialog open={showAlertDetail} onOpenChange={setShowAlertDetail}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{alertTitle(selectedAlert.title)}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-[60vh] overflow-auto">
                {selectedAlert.data?.map((item, index) => (
                  <div key={index} className="border p-2 rounded">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Stok:{" "}
                      {selectedAlert.title === "lowStock"
                        ? item.qtyShort
                        : selectedAlert.title === "expiredMaterials"
                        ? item.expiredQty
                        : 0}{" "}
                      {item.unit}
                    </div>

                    {selectedAlert.title === "expiredMaterials" && (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-48 mt-2"
                        onClick={() => removeStock(item)}
                      >
                        Kurangi Stok Kadaluarsa
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {selectedAlert.title === "lowStock" && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-48 mt-2"
                  onClick={purchaseMaterial}
                >
                  Buat Pembelian
                </Button>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/*<Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button 
              onClick={() => setActiveTab("stock")}
              className="w-full p-3 text-left rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Pembelian Bahan Baku</div>
            </button>
            <button 
              onClick={() => setActiveTab("menu")}
              className="w-full p-3 text-left rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Buat Menu Baru</div>
            </button>
            <button 
              onClick={() => setActiveTab("employees")}
              className="w-full p-3 text-left rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Schedule Staff</div>
              <div className="text-sm text-gray-500">Manage shifts</div>
            </button>
          </CardContent>
        </Card>*/}
      </div>
    </>
  );
};

export default Index;
