import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ShoppingCart } from "lucide-react";
import { RawMaterial } from "src/pages/Stock";
import { useSupplier } from "@/hooks/useSupplier";
import { PurchaseOrderItemDialog } from "./PurchaseItem";

interface PurchaseOrderDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newPurchaseOrder: any;
  setNewPurchaseOrder: (order: any) => void;
  rawMaterials: RawMaterial[];
  handleCreatePurchaseOrder: (isDraft: boolean) => void;
}

export const PurchaseOrderDialog: React.FC<PurchaseOrderDialogProps> = ({
  isOpen,
  setIsOpen,
  newPurchaseOrder,
  setNewPurchaseOrder,
  rawMaterials,
  handleCreatePurchaseOrder,
}) => {
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const { getSuppliers } = useSupplier(isOpen);

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
      (_: any, i: number) => i !== index
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
    const updatedItems = newPurchaseOrder.materials.map(
      (item: any, i: number) => {
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
          ? { ...item, [field]: value, unit, idMaterial }
          : item;
      }
    );

    setNewPurchaseOrder({
      ...newPurchaseOrder,
      materials: updatedItems,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Buat Pesanan Pembelian
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Pesanan Pembelian</DialogTitle>
          <DialogDescription>
            Buat pesanan pembelian bahan baku baru
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Supplier */}
          <div>
            <Label>Supplier</Label>
            <select
              className="w-full p-2 border rounded-md text-sm"
              value={newPurchaseOrder.idSupplier}
              onChange={(e) =>
                setNewPurchaseOrder({
                  ...newPurchaseOrder,
                  idSupplier: e.target.value,
                })
              }
            >
              <option value="">Pilih Supplier</option>
              {(getSuppliers.data || [])
                .filter((supplier) => supplier.isActive === "active")
                .map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
            </select>
          </div>

          {/* PIC */}
          <div>
            <Label htmlFor="pic">Penanggung Jawab</Label>
            <Input
              id="pic"
              value={newPurchaseOrder.pic}
              onChange={(e) =>
                setNewPurchaseOrder({
                  ...newPurchaseOrder,
                  pic: e.target.value,
                })
              }
              placeholder="Nama penanggung jawab"
            />
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Tanggal Pengiriman</Label>
            <Input
              id="date"
              type="date"
              value={newPurchaseOrder.date}
              onChange={(e) =>
                setNewPurchaseOrder({
                  ...newPurchaseOrder,
                  date: e.target.value,
                })
              }
            />
          </div>

          {/* Materials */}
          <div>
            <Label>Item Pesanan</Label>
            <div className="space-y-2 mt-2">
              {newPurchaseOrder.materials.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">
                      {rawMaterials.find((m) => m.id === item.idMaterial)
                        ?.name || "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.qty} {item.unit} × Rp{item.price}
                    </p>
                    {item.hasExpiredDate && (
                      <p className="text-sm text-muted-foreground">
                        Tanggal Kadaluarsa: {item.expiredDate}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItemIndex(index);
                        setIsItemDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNewPurchaseOrder({
                          ...newPurchaseOrder,
                          materials: newPurchaseOrder.materials.filter(
                            (_: any, i: number) => i !== index
                          ),
                        })
                      }
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsItemDialogOpen(true)}
              >
                Tambah Item
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Input
              id="notes"
              value={newPurchaseOrder.notes}
              onChange={(e) =>
                setNewPurchaseOrder({
                  ...newPurchaseOrder,
                  notes: e.target.value,
                })
              }
              placeholder="Catatan pesanan"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCreatePurchaseOrder(true)}
            >
              Simpan Draft
            </Button>
            <Button onClick={() => handleCreatePurchaseOrder(false)}>
              Buat Pesanan
            </Button>
          </div>
        </div>
      </DialogContent>

      <PurchaseOrderItemDialog
        isOpen={isItemDialogOpen}
        onClose={() => {
          setIsItemDialogOpen(false);
          setEditingItemIndex(null);
        }}
        rawMaterials={rawMaterials}
        initialItem={
          editingItemIndex !== null
            ? newPurchaseOrder.materials[editingItemIndex]
            : undefined
        }
        mode={editingItemIndex !== null ? "edit" : "add"}
        onSave={(item) => {
          if (editingItemIndex !== null) {
            // edit
            const updated = [...newPurchaseOrder.materials];
            updated[editingItemIndex] = item;
            setNewPurchaseOrder({ ...newPurchaseOrder, materials: updated });
          } else {
            // add
            setNewPurchaseOrder({
              ...newPurchaseOrder,
              materials: [...newPurchaseOrder.materials, item],
            });
          }
        }}
      />
    </Dialog>
  );
};
