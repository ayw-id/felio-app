import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiEmployee } from "@/types/api";

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  title?: string;
  admin?: {
    idEmployee: string;
    name?: string;
    role: "admin_brand" | "admin_branch" | "employee";
  } | null;
  employees?: ApiEmployee[];
  existingRole?: "admin_brand" | "admin_branch" | "employee";
  admins?: ApiEmployee[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSubmit: (data: {
    idEmployee: string;
    role: "admin_brand" | "admin_branch";
  }) => void;
}

const AdminDialog: React.FC<AdminDialogProps> = ({
  open,
  onOpenChange,
  mode,
  title = "Admin",
  admin,
  employees = [],
  existingRole,
  admins = [],
  loading,
  setLoading,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    idEmployee: admin?.idEmployee || "",
    role: admin?.role || "admin_branch",
  });

  const isEdit = mode === "edit";

  const handleSubmit = () => {
    let idEmployee = form.idEmployee;
    if (!idEmployee && isEdit) {
      idEmployee = admin?.idEmployee;
    }
    if (!idEmployee || !form.role) return;
    onSubmit({ ...form, idEmployee });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Ubah Role Admin" : "Tambah Admin Baru"}
          </DialogTitle>
        </DialogHeader>

        {!isEdit && (
          <div>
            <Label htmlFor="employeeSelect">Pilih Karyawan</Label>
            <Select
              value={form.idEmployee}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, idEmployee: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih karyawan untuk admin" />
              </SelectTrigger>
              <SelectContent>
                {employees
                  .filter(
                    (emp) => !admins.some((admin) => admin.email === emp.email)
                  )
                  .map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {isEdit && (
          <div>
            <Label>{admin?.name}</Label>
          </div>
        )}

        <div>
          <Label>Role Admin {form.role}</Label>
          <Select
            value={form.role}
            onValueChange={(value: "admin_brand" | "admin_branch") =>
              setForm((f) => ({ ...f, role: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin_brand">Admin Brand</SelectItem>
              <SelectItem value="admin_branch">Admin Cabang</SelectItem>
              {isEdit && <SelectItem value="employee">User</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batalkan
          </Button>
          <Button disabled={loading} onClick={handleSubmit}>
            {isEdit ? "Simpan Perubahan" : "Tambah Admin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;
