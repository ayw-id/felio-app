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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useToken } from "@/contexts/TokenContext";
import { useResto } from "@/contexts/RestoContext";
import { useQueryClient } from "@tanstack/react-query";
import { useBranch } from "@/hooks/useBranch";

interface Branch {
  id: string;
  idBrand: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

const Branches = () => {
  const { toast } = useToast();
  const { employeeRole } = useToken();
  const { branches, selectedBrand } = useResto();
  const { saveBranch, changeStatusBranch } = useBranch();
  const isAdmin = ["admin", "admin_brand"].includes(employeeRole);
  const queryClient = useQueryClient();
  const token = useToken(); // Instead of destructuring only employeeRole

  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [branchForm, setBranchForm] = useState<{
    name: string;
    address: string;
    phone: string;
    status: "active" | "inactive";
  }>({
    name: "",
    address: "",
    phone: "",
    status: "active",
  });

  const handleSaveBranch = async () => {
    if (!branchForm.name || !branchForm.address || !branchForm.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const phone = branchForm.phone
      ? branchForm.phone.startsWith("0")
        ? branchForm.phone.slice(1)
        : branchForm.phone
      : "";
    const body = {
      idBrand: selectedBrand?.id,
      name: branchForm.name,
      address: branchForm.address,
      phone,
      ...(editingBranch?.id && { idBranch: editingBranch.id }),
    };

    saveBranch(body, {
      onSuccess: async () => {
        toast({
          title: "Success",
          description: editingBranch
            ? "Branch updated successfully"
            : "Branch created successfully",
        });

        setBranchForm({ name: "", address: "", phone: "", status: "active" });
        setEditingBranch(null);
        setIsBranchDialogOpen(false);
      },
      onError: (error: any) => {
        toast({
          title: "Failed",
          description: error.message || "Failed to save branch",
          variant: "destructive",
        });
      },
    });
  };

  const handleToggleBranchStatus = async (branch: Branch) => {
    changeStatusBranch(
      { idBranch: branch.id },
      {
        onSuccess: async () => {
          toast({
            title: "Success",
            description: "Branch status updated",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Failed",
            description: error.message || "Failed to change branch status",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setBranchForm({
      name: branch.name,
      address: branch.address,
      phone: (branch.phone ? "0" : "") + branch.phone,
      status: branch.isActive ? "active" : "inactive",
    });
    setIsBranchDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Cabang Brand</h3>
        <Dialog open={isBranchDialogOpen} onOpenChange={setIsBranchDialogOpen}>
          <DialogTrigger asChild>
            {isAdmin && (
              <Button
                onClick={() => {
                  setEditingBranch(null);
                  setBranchForm({
                    name: "",
                    address: "",
                    phone: "",
                    status: "active",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Cabang
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? "Edit Branch" : "Add New Branch"}
              </DialogTitle>
              <DialogDescription>
                {editingBranch
                  ? "Update branch information"
                  : "Add a new branch location"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="branchName">Branch Name *</Label>
                <Input
                  id="branchName"
                  value={branchForm.name}
                  onChange={(e) =>
                    setBranchForm({ ...branchForm, name: e.target.value })
                  }
                  placeholder="Enter branch name"
                />
              </div>
              <div>
                <Label htmlFor="branchAddress">Address *</Label>
                <Input
                  id="branchAddress"
                  value={branchForm.address}
                  onChange={(e) =>
                    setBranchForm({ ...branchForm, address: e.target.value })
                  }
                  placeholder="Enter branch address"
                />
              </div>
              <div>
                <Label htmlFor="branchPhone">Phone *</Label>
                <Input
                  id="branchPhone"
                  value={branchForm.phone}
                  onChange={(e) =>
                    setBranchForm({ ...branchForm, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              {/*<div>
                <Label htmlFor="branchStatus">Status</Label>
                <select
                  id="branchStatus"
                  className="w-full p-2 border rounded-md"
                  value={branchForm.status}
                  onChange={(e) =>
                    setBranchForm({
                      ...branchForm,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>*/}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsBranchDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveBranch}>
                  {editingBranch ? "Update" : "Create"} Branch
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Cabang</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead>Tindakan</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>{branch.address}</TableCell>
                <TableCell>
                  {(branch.phone ? "0" : "") + branch.phone}
                </TableCell>
                <TableCell>
                  <Badge variant={branch.isActive ? "default" : "secondary"}>
                    {branch.isActive ? "active" : "inactive"}
                  </Badge>
                  {/*<Button
                    variant={branch.isActive ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleBranchStatus(branch)}
                  >
                    {branch.isActive ? "Deactivate" : "Activate"}
                  </Button>*/}
                </TableCell>
                {isAdmin && branch.isActive && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBranch(branch)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Non aktifkan cabang
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Anda yakin ingin menonaktifkan cabang ini ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Tidak</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleToggleBranchStatus(branch)}
                            >
                              Ya
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Branches;
