import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Admin } from "src/pages/Staff";
import { useEmployees } from "@/hooks/useEmployees";
import AdminDialog from "@/components/staff/admin/AdminDialog";

const Admin: React.FC<AdminProps> = () => {
  const { toast } = useToast();
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const useAdmin = () => useEmployees("admin");
  const useEmployee = () => useEmployees("employee");
  const { data: admins, isAdminLoading, refetchEmployee } = useAdmin();
  const {
    data: employees,
    isEmployeeLoading,
    employeeMutation,
  } = useEmployee();

  const [newAdmin, setNewAdmin] = useState({
    idEmployee: "",
    role: "admin_branch" as "admin_brand" | "admin_branch" | "employee",
  });

  const [editAdminData, setEditAdminData] = useState<Admin | null>(null);

  const handleSubmitAdmin = (
    data: { idEmployee: string; role: "admin_brand" | "admin_branch" },
    mode: "add" | "edit"
  ) => {
    setLoading(false);

    employeeMutation(
      {
        path: "changeRole",
        payload: data,
      },
      {
        onSuccess: async (data: any) => {
          setLoading(false);
          if (mode === "add") {
            setIsAddAdminOpen(false);
          } else {
            setIsEditAdminOpen(false);
          }

          toast({
            title: "Success",
            description:
              mode === "add"
                ? "Admin berhasil ditambahkan"
                : "Role admin diperbarui",
          });

          refetchEmployee();
        },
        onError: (error: any) => {
          setLoading(false);
          toast({
            title: "Error",
            description: "Gagal menyimpan perubahan role admin",
            variant: "destructive",
          });
        },
      }
    );
  };

  const openEditAdmin = (admin: Admin) => {
    setEditAdminData({ ...admin });
    setIsEditAdminOpen(true);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setIsAddAdminOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Admin
        </Button>
        {/*<Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Admin Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="employeeSelect">Pilih Karyawan</Label>
                <Select
                  value={newAdmin.idEmployee}
                  onValueChange={(value) => setNewAdmin({...newAdmin, idEmployee: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee to assign admin role" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees
                      .filter(emp => !admins.some(admin => admin.email === emp.email))
                      .map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="adminRole">Admin Role</Label>
                <Select
                  value={newAdmin.role}
                  onValueChange={(value: "admin_brand" | "admin_branch") => 
                    setNewAdmin({...newAdmin, role: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin_brand">Admin Brand</SelectItem>
                    <SelectItem value="admin_branch">Admin Cabang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>
                  Batalkan
                </Button>
                <Button onClick={handleAddAdmin}>
                  Tambah Admin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>*/}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {admin.role === "admin"
                      ? "Admin"
                      : admin.role === "admin_brand"
                      ? "Admin Brand"
                      : "Admin Cabang"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {admin.role !== "admin" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditAdmin(admin)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Admin Dialog */}
      {/*<Dialog open={isEditAdminOpen} onOpenChange={setIsEditAdminOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Role Admin</DialogTitle>
          </DialogHeader>
          {editAdminData && (
            <>
              <div>
                <Label htmlFor="employeeSelect">{editAdminData.name}</Label>
                
              </div>
              <div>
                <Label htmlFor="adminRole">Admin Role</Label>
                <Select
                  value={editAdminData.role}
                  onValueChange={(value: "admin_brand" | "admin_branch") => 
                    setEditAdminData({...editAdminData, role: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin_brand">Admin Brand</SelectItem>
                    <SelectItem value="admin_branch">Admin Cabang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>
                  Batalkan
                </Button>
                <Button onClick={handleEditAdmin}>
                  Lanjutkan
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>*/}

      <AdminDialog
        open={isAddAdminOpen}
        onOpenChange={setIsAddAdminOpen}
        mode="add"
        employees={employees}
        admins={admins}
        loading={loading}
        setLoading={setLoading}
        onSubmit={(data) => handleSubmitAdmin(data, "add")}
      />

      <AdminDialog
        open={isEditAdminOpen}
        onOpenChange={setIsEditAdminOpen}
        mode="edit"
        admin={{
          idEmployee: editAdminData?.id || "",
          name: editAdminData?.name || "",
          role:
            (editAdminData?.role as "admin_brand" | "admin_branch") ||
            "admin_branch",
        }}
        existingRole={editAdminData?.role}
        loading={loading}
        setLoading={setLoading}
        onSubmit={(data) => handleSubmitAdmin(data, "edit")}
      />
    </>
  );
};

export default Admin;
