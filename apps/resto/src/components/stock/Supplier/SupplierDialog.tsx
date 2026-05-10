// components/supplier/SupplierDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SupplierType } from "@/hooks/useSupplier";
import { Trash2 } from "lucide-react";

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SupplierType | null;
  onSave: (data: Omit<SupplierType, "id"> & { id?: string }) => void;
  isSaving?: boolean;
}

const SupplierDialog: React.FC<SupplierDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  onSave,
  isSaving = false,
}) => {
  const [form, setForm] = useState({
    name: "",
    contactPersons: [] as { name: string; phone: string }[],
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        contactPersons: initialData.contactPersons || [],
      });
    } else {
      setForm({
        name: "",
        contactPersons: [],
      });
    }
  }, [initialData]);

  const handleAddContact = () => {
    setForm((prev) => ({
      ...prev,
      contactPersons: [...prev.contactPersons, { name: "", phone: "" }],
    }));
  };

  const handleContactChange = (
    index: number,
    key: "name" | "phone",
    value: string
  ) => {
    const updated = [...form.contactPersons];
    updated[index] = { ...updated[index], [key]: value };
    setForm((prev) => ({ ...prev, contactPersons: updated }));
  };

  const handleRemoveContact = (index: number) => {
    const updated = [...form.contactPersons];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, contactPersons: updated }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Nama supplier wajib diisi");
    if (form.contactPersons.some((contact) => !contact.name || !contact.phone))
      return alert("Silahkan lengkapi data kontak supplier");

    onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: form.name.trim(),
      contactPersons: form.contactPersons.filter((contact) => !!contact.name),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Supplier" : "Tambah Supplier"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Perbarui informasi supplier yang dipilih."
              : "Masukkan data supplier baru."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="supplierName">Nama Supplier</Label>
            <Input
              id="supplierName"
              className="mt-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Masukkan nama supplier"
            />
          </div>

          <div>
            <Label>Kontak Supplier</Label>
            <ScrollArea className="max-h-48 border rounded-md p-2 mt-2">
              {form.contactPersons.map((contact, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2"
                >
                  <div className="md:col-span-2 mt-2 ml-2">
                    <Input
                      placeholder="Nama Kontak"
                      value={contact.name}
                      onChange={(e) =>
                        handleContactChange(idx, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="No. Telepon"
                      value={contact.phone}
                      onChange={(e) =>
                        handleContactChange(idx, "phone", e.target.value)
                      }
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={form.contactPersons.length === 1}
                      onClick={() => handleRemoveContact(idx)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 ml-2"
                onClick={handleAddContact}
              >
                + Tambah Kontak
              </Button>
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierDialog;
