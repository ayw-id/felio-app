import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee } from "@/types/employee";
import { useToast } from "@/hooks/use-toast";
import EmployeeDialog from "./EmployeeDialog";
import DeleteEmployeeAlert from "./DeleteEmployeeAlert";
import EmployeeTable from "./EmployeeTable";
import { useEmployees } from "/src/hooks/useEmployees";
import { useApi } from "/src/hooks/useApi";

const EmployeeManager: React.FC = () => {
  const { toast } = useToast();

  const {
    data: employees,
    isLoading,
    isError,
    employeeMutation,
    refetchEmployee,
  } = useEmployees();

  const { idBrand } = useApi();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("add");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (employee: any) => {
    setDialogMode("edit");
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleView = (employee: any) => {
    setDialogMode("view");
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    if (data?.id) {
      data.idEmployee = data.id;
    }
    setLoading(false);

    employeeMutation(
      {
        path: "save",
        payload: data,
      },
      {
        onSuccess: async (data: any) => {
          setLoading(false);
          toast({
            title: "Success",
            description: "Data pegawai berhasil sisimpan",
          });
          setIsDialogOpen(false);
          refetchEmployee();
        },
        onError: (error: any) => {
          setLoading(false);
          toast({
            title: "Error",
            description: "Gagal menambah pegawai",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDelete = async (
    idEmployee: string,
    scope: "all" | "brand" | "branch"
  ) => {
    setLoading(false);

    employeeMutation(
      {
        path: "delete",
        payload: {
          idEmployee,
          scope,
          ...(scope === "brand" ? { idBrand } : null),
        },
      },
      {
        onSuccess: async (data: any) => {
          setLoading(false);
          toast({
            title: "Success",
            description: "Data pegawai berhasil dihapus",
          });
          setIsDeleteDialogOpen(false);
          refetchEmployee();
        },
        onError: (error: any) => {
          setLoading(false);
          toast({
            title: "Error",
            description: "Gagal menghapus pegawai",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            setSelectedEmployee(null);
            setDialogMode("add");
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pegawai
        </Button>
      </div>

      {/* Table */}
      <EmployeeTable
        employees={filteredEmployees}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDeleteConfirm}
      />

      {/* EmployeeDialog (shared for add/edit/view) */}
      <EmployeeDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        mode={dialogMode}
        employee={selectedEmployee}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
      {selectedEmployee && (
        <DeleteEmployeeAlert
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          employee={selectedEmployee}
          onConfirmDelete={(employeeId, scope) =>
            handleDelete(employeeId, scope)
          }
        />
      )}
    </>
  );
};

export default EmployeeManager;
