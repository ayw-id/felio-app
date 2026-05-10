import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Overview,
  HistoryComponent,
  Purchase,
  Supplier,
} from "@/components/stock";
import Container from "@/components/ui/Container";
import { useStock } from "@/hooks/useStock";
import { useResto } from "@/contexts/RestoContext";
import { useSearchParams } from "react-router-dom";

export interface RawMaterial {
  id?: string;
  name: string;
  category?: string;
  unit: string;
  supplier?: string;
  minStock: number;
  currentStock: number;
  costPerUnit: number;
  lastPurchaseDate?: string;
  bookingStock?: number;
}

export interface StockTransaction {
  id: string;
  idMaterial: string;
  materialName: string;
  type: "in" | "out";
  quantity: number;
  pricePerUnit: number;
  date: string;
  notes?: string;
  materialName: string;
  subType:
    | "purchase"
    | "usage"
    | "adjustment_in"
    | "adjustment_out"
    | "initialization";
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: "draft" | "done" | "cancelled";
  orderDate: string;
  items: PurchaseItem[];
  totalAmount: number;
  notes?: string;
}

interface PurchaseItem {
  idMaterial: string;
  materialName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface ContactPerson {
  name: string;
  phone: string;
  email?: string;
}

const Stock = () => {
  const { toast } = useToast();
  const [searchPurchaseTerm, setSearchPurchaseTerm] = useState("");
  const [historySearchTerm, setHistorySearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const { selectedBranch } = useResto();
  const { stockQuery, isLoading, isError } = useStock(selectedBranch?.id);
  const [searchParams] = useSearchParams();

  const handleViewHistory = (material: RawMaterial) => {
    setHistorySearchTerm(material.name);
    setActiveTab("history");
  };

  const handlePurchaseHistory = (text: string) => {
    setSearchPurchaseTerm(text);
    setActiveTab("purchases");
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (["overview", "history", "purchases"].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  return (
    <Container
      title={"Manajemen Stok Bahan Baku"}
      subTitle={"Pantau dan kelola inventori bahan baku Anda"}
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-10">Loading stock...</div>
        ) : isError ? (
          <div className="text-red-500 text-center py-10">
            Failed to fetch stock
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Ringkasan Stok</TabsTrigger>
              <TabsTrigger value="history">Riwayat Stok</TabsTrigger>
              <TabsTrigger value="purchases">Pembelian</TabsTrigger>
              <TabsTrigger value="supplier">Supplier</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Overview
                handleViewHistory={handleViewHistory}
                rawMaterials={stockQuery?.data?.stocks || []}
                refetchRawMaterial={stockQuery.refetch}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <HistoryComponent
                rawMaterials={stockQuery?.data?.stocks || []}
                refetchRawMaterial={stockQuery.refetch}
                historySearchTerm={historySearchTerm}
                setHistorySearchTerm={setHistorySearchTerm}
              />
            </TabsContent>

            <TabsContent value="purchases" className="space-y-6">
              <Purchase
                rawMaterials={stockQuery?.data?.stocks || []}
                searchPurchaseTerm={searchPurchaseTerm}
                setSearchPurchaseTerm={setSearchPurchaseTerm}
              />
            </TabsContent>

            <TabsContent value="supplier" className="space-y-6">
              <Supplier handlePurchaseHistory={handlePurchaseHistory} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Container>
  );
};

export default Stock;
