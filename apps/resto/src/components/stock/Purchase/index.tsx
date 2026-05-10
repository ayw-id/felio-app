import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  AlertTriangle,
  Edit,
  History,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RawMaterial } from "src/pages/Stock";
import { usePurchases } from "@/hooks/usePurchases";
import { PurchaseOrder } from "@/pages/Stock";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSupplier } from "@/hooks/useSupplier";
import { PurchaseOrderDialog } from "./Dialog";

interface PurchaseOrderProps {
  rawMaterials: RawMaterial[];
  searchPurchaseTerm: string;
  setSearchPurchaseTerm: (text: string) => void;
}

const Purchase: React.FC<PurchaseProps> = ({
  rawMaterials,
  searchPurchaseTerm,
  setSearchPurchaseTerm,
}) => {
  const { toast } = useToast();
  const [isPurchaseOrderOpen, setIsPurchaseOrderOpen] = useState(false);
  const [isConfirmPurchaseOpen, setIsConfirmPurchaseOpen] = useState(false);
  const [isCancelPurchaseOpen, setIsCancelPurchaseOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<PurchaseOrder | null>(null);
  const [dialogHasOpened, setDialogHasOpened] = useState<boolean>(false);
  const { getPurchases, createPurchase, confirmPurchase, cancelPurchase } =
    usePurchases();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getSuppliers } = useSupplier(isPurchaseOrderOpen);
  const navigate = useNavigate();

  const [newPurchaseOrder, setNewPurchaseOrder] = useState({
    idSupplier: "",
    pic: "",
    date: "",
    // materials: [{ idMaterial: "", unit: "", qty: 0, price: 0, hasExpiredDate: false, expiredDate: null }],
    materials: [],
    notes: "",
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    const action = searchParams.get("action");
    const data = searchParams.get("data");
    if (tab === "purchases") {
      if (action === "create") {
        setIsPurchaseOrderOpen(true);
        setDialogHasOpened(true);
        if (data) {
          const splittedCodes = data.split("|");
          const newMaterials = [];
          splittedCodes.forEach((splittedCode) => {
            const codeQtySeparated = splittedCode.split("-");
            if (codeQtySeparated.length === 2) {
              newMaterials.push({
                idMaterial: codeQtySeparated[0],
                qty: parseFloat(codeQtySeparated[1].replace(",", ".")),
              });
            }
          });
          setNewPurchaseOrder({
            ...newPurchaseOrder,
            materials: newMaterials,
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (rawMaterials.length) {
      setNewPurchaseOrder({
        ...newPurchaseOrder,
        materials: (newPurchaseOrder.materials || []).map((item) => {
          let idMaterial = item.idMaterial;
          let qty = item.qty || 1;
          let hasExpiredDate = false;
          let expiredDate = null;
          const price = item.price || 0;
          let unit = item.unit || "";
          if (idMaterial) {
            const rawMaterial = rawMaterials.find(
              (material) => material.id === item.idMaterial
            );
            idMaterial = rawMaterial?.id;
            unit = rawMaterial?.unit;
            if (rawMaterial?.expiredInDays) {
              const today = new Date();
              const expired = new Date();
              expired.setDate(today.getDate() + rawMaterial.expiredInDays);
              let month = expired.getMonth() + 1;
              if (month < 10) {
                month = "0" + month;
              }
              expiredDate = `${expired.getFullYear()}-${month}-${expired.getDate()}`;
              hasExpiredDate = true;
            }
          }
          return {
            ...item,
            idMaterial,
            qty,
            price,
            hasExpiredDate,
            expiredDate,
          };
        }),
      });
    }
  }, [rawMaterials]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!isPurchaseOrderOpen && tab === "purchases" && dialogHasOpened) {
      navigate(`${import.meta.env.BASE_URL}stock`);
    }
  }, [isPurchaseOrderOpen]);

  const filteredPurchaseOrders = (getPurchases.data || []).filter(
    (po) =>
      po.orderNumber.toLowerCase().includes(searchPurchaseTerm.toLowerCase()) ||
      po.supplier?.toLowerCase().includes(searchPurchaseTerm.toLowerCase()) ||
      po.status.toLowerCase().includes(searchPurchaseTerm.toLowerCase())
  );

  const handleCreatePurchaseOrder = (isDraft: boolean = true) => {
    if (
      newPurchaseOrder.materials.some(
        (item) => !item.idMaterial || item.qty <= 0 || item.price <= 0
      ) ||
      !newPurchaseOrder.pic ||
      !newPurchaseOrder.date
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createPurchase(
      {
        ...newPurchaseOrder,
        isDraft,
      },
      {
        onSuccess: () => {
          getPurchases.refetch();
          setIsPurchaseOrderOpen(false);

          toast({
            title: "Success",
            description: `Purchase order ${
              isDraft ? "saved as draft" : "created"
            } successfully`,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Failed",
            description: error?.message || "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  const addPurchaseOrderItem = () => {
    setNewPurchaseOrder({
      ...newPurchaseOrder,
      materials: [
        ...newPurchaseOrder.materials,
        { idMaterial: "", qty: 0, price: 0 },
      ],
    });
  };

  const removePurchaseOrderItem = (index: number) => {
    const updatedItems = newPurchaseOrder.materials.filter(
      (_, i) => i !== index
    );
    setNewPurchaseOrder({
      ...newPurchaseOrder,
      materials:
        updatedItems.length > 0
          ? updatedItems
          : [{ idMaterial: "", qty: 0, price: 0 }],
    });
  };

  const updatePurchaseOrderItem = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedItems = newPurchaseOrder.materials.map((item, i) => {
      let unit = item.unit;
      let idMaterial = item.idMaterial;
      if (field === "idMaterial") {
        const material = rawMaterials.find((m) => m.id === value);
        if (material) {
          unit = material.unit;
          idMaterial = material.id;
        }
      }
      return i === index
        ? {
            ...item,
            [field]: value,
            unit,
            idMaterial,
          }
        : item;
    });

    setNewPurchaseOrder({
      ...newPurchaseOrder,
      materials: updatedItems,
    });
  };

  const handleConfirmPurchaseOrder = () => {
    confirmPurchase(
      {
        idPurchase: selectedPurchase.id,
      },
      {
        onSuccess: () => {
          getPurchases.refetch();
          setIsConfirmPurchaseOpen(false);
          setSelectedPurchase(null);

          toast({
            title: "Success",
            description: `Pembelian berhasil dikonfirmasi`,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Failed",
            description: error?.message || "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCancelPurchaseOrder = () => {
    cancelPurchase(
      {
        idPurchase: selectedPurchase.id,
      },
      {
        onSuccess: () => {
          getPurchases.refetch();
          setIsCancelPurchaseOpen(false);
          setSelectedPurchase(null);

          toast({
            title: "Success",
            description: `Pembelian berhasil dibatalkan`,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Failed",
            description: error?.message || "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "done":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari pesanan pembelian..."
            value={searchPurchaseTerm}
            onChange={(e) => setSearchPurchaseTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <PurchaseOrderDialog
          isOpen={isPurchaseOrderOpen}
          setIsOpen={setIsPurchaseOrderOpen}
          newPurchaseOrder={newPurchaseOrder}
          setNewPurchaseOrder={setNewPurchaseOrder}
          rawMaterials={rawMaterials}
          handleCreatePurchaseOrder={handleCreatePurchaseOrder}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Pesanan</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Pesanan</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchaseOrders.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium">{po.orderNumber}</TableCell>
                <TableCell className="font-medium">{po.supplier}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(po.status)}>
                    {po.status === "draft" && "Draft"}
                    {po.status === "done" && "Selesai"}
                    {po.status === "cancelled" && "Dibatalkan"}
                  </Badge>
                </TableCell>
                <TableCell>{po.orderDate}</TableCell>
                <TableCell>Rp{po.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {po.items.map((item, index) => (
                      <div key={index}>
                        {item.materialName} ({item.qty} {item.unit})
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{po.notes || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {po.status === "draft" && (
                      <>
                        <Dialog
                          open={
                            isConfirmPurchaseOpen &&
                            selectedPurchase?.id === po.id
                          }
                          onOpenChange={(open) => {
                            setIsConfirmPurchaseOpen(open);
                            if (!open) setSelectedPurchase(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPurchase(po);
                                setIsConfirmPurchaseOpen(true);
                              }}
                            >
                              Konfirmasi Pembelian
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Konfirmasi Pembelian</DialogTitle>
                              <DialogDescription>
                                Anda yakin ingin mengonfirmasi pembelian{" "}
                                <b>{po.orderNumber}</b> ?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setIsConfirmPurchaseOpen(false)
                                  }
                                >
                                  Batal
                                </Button>
                                <Button onClick={handleConfirmPurchaseOrder}>
                                  Konfirmasi
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={
                            isCancelPurchaseOpen &&
                            selectedPurchase?.id === po.id
                          }
                          onOpenChange={(open) => {
                            setIsCancelPurchaseOpen(open);
                            if (!open) setSelectedPurchase(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPurchase(po);
                                setIsCancelPurchaseOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Batalkan Pembelian</DialogTitle>
                              <DialogDescription>
                                Anda yakin ingin membatalkan pembelian{" "}
                                <b>{po.orderNumber}</b> ?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsCancelPurchaseOpen(false)}
                                >
                                  Kembali
                                </Button>
                                <Button onClick={handleCancelPurchaseOrder}>
                                  Ya, Batalkan Pembelian
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Purchase;
