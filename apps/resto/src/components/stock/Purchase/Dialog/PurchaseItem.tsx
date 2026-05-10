import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RawMaterial } from "src/pages/Stock";
import { Switch } from "@/components/ui/Switch";

interface PurchaseOrderItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  rawMaterials: RawMaterial[];
}

export const PurchaseOrderItemDialog: React.FC<
  PurchaseOrderItemDialogProps
> = ({ isOpen, onClose, onSave, rawMaterials, initialItem, mode = "add" }) => {
  const [form, setForm] = useState({
    idMaterial: "",
    qty: 0,
    price: 0,
    unit: "",
  });

  // Load initial item on edit
  useEffect(() => {
    if (initialItem) {
      setForm(initialItem);
    } else {
      setForm({ idMaterial: "", qty: 0, price: 0, unit: "" });
    }
  }, [initialItem, isOpen]);

  const handleChange = (field: string, value: any) => {
    if (field === "idMaterial") {
      const material = rawMaterials.find((m) => m.id === value);
      let expiredDate = null;
      let hasExpiredDate = false;
      if (material.expiredInDays) {
        const today = new Date();
        const expired = new Date();
        expired.setDate(today.getDate() + material.expiredInDays);
        let month = expired.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        expiredDate = `${expired.getFullYear()}-${month}-${expired.getDate()}`;
        hasExpiredDate = true;
      }
      setForm((prev) => ({
        ...prev,
        idMaterial: material?.id || "",
        unit: material?.unit || "",
        hasExpiredDate,
        expiredDate,
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    if (!form.idMaterial || form.qty <= 0) return;
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Item Pesanan" : "Tambah Item Pesanan"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Bahan</Label>
            <select
              className="w-full p-2 border rounded-md text-sm"
              value={form.idMaterial}
              onChange={(e) => handleChange("idMaterial", e.target.value)}
              disabled={mode === "edit"} // disable on edit
            >
              <option value="">Pilih bahan</option>
              {rawMaterials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Jumlah {form.unit && `(${form.unit})`}</Label>
            <Input
              type="number"
              value={form.qty || ""}
              onChange={(e) => handleChange("qty", parseFloat(e.target.value))}
            />
          </div>

          <div>
            <Label>Harga/Unit</Label>
            <Input
              type="number"
              step="0.01"
              value={form.price || ""}
              onChange={(e) =>
                handleChange("price", parseFloat(e.target.value))
              }
            />
          </div>

          <div>
            <Label>Tanggal Kadaluarsa</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                checked={form.hasExpiredDate}
                onCheckedChange={(checked) =>
                  handleChange("hasExpiredDate", checked)
                }
              />
              <Label>Tambahkan tanggal kadaluarsa</Label>
            </div>
            {!!form.hasExpiredDate && (
              <Input
                type="date"
                className="mt-2"
                value={form.expiredDate}
                onChange={(e) => handleChange("expiredDate", e.target.value)}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            {mode === "edit" ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
