import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "src/pages/Staff";

interface Props {
  mode: "add" | "edit" | "view";
  open: boolean;
  onClose: () => void;
  employee?: Employee;
  onSave?: (employee: Employee) => void;
}

const defaultData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  status: "active",
};

const EmployeeDialog: React.FC<Props> = ({
  mode,
  open,
  onClose,
  employee,
  onSave,
}) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [data, setData] = useState<Employee>(
    employee ?? {
      startDate: new Date().toISOString().split("T")[0],
      ...defaultData,
    }
  );

  useEffect(() => {
    if (employee && (isEdit || isView)) {
      setData(employee);
    }
    if (isAdd) {
      setData({
        startDate: new Date().toISOString().split("T")[0],
        ...defaultData,
      });
    }
  }, [employee, mode]);

  const renderField = (
    label: string,
    value: any,
    key: keyof Employee,
    isNumeric = false
  ) => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      {isView ? (
        <p className="text-sm text-gray-600">{value}</p>
      ) : (
        <Input
          id={key}
          type={isNumeric ? "number" : "text"}
          value={value}
          onChange={(e) =>
            setData({
              ...data,
              [key]: isNumeric ? Number(e.target.value) : e.target.value,
            })
          }
        />
      )}
    </div>
  );

  const handleSave = () => {
    if (onSave) onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isView
              ? "Employee Details"
              : isEdit
              ? "Edit Employee"
              : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
              {renderField("Name", data.name, "name")}
              {renderField("Email", data.email, "email")}
              {isView && renderField("Phone", data.phone, "phone")}
              {isView && renderField("Position", data.role, "role")}
            </div>
          )}

          {isEdit && renderField("Name", data.name, "name")}

          {!isView && renderField("Phone", data.phone, "phone")}

          {renderField("Address", data.address, "address")}

          {!isView && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {isEdit ? "Ubah Pegawai" : "Tambah Pegawai"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
