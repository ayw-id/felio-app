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
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResto } from "@/contexts/RestoContext";
import { useToken } from "@/contexts/TokenContext";
import { useQueryClient } from "@tanstack/react-query";
import { useBrand } from "@/hooks/useBrand";

interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  status?: "active" | "inactive";
}

const Brands = () => {
  const { token } = useToken();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { brands } = useResto();
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const { saveBrand } = useBrand();

  const [brandForm, setBrandForm] = useState<{
    idBrand?: string;
    name: string;
    description: string;
    email: string;
    phone: string;
    callingCode: string;
    status: "active" | "inactive";
  }>({
    name: "",
    description: "",
    email: "",
    phone: "",
    callingCode: "+62",
    status: "active",
  });

  const handleSaveBrand = async () => {
    if (!brandForm.name || !brandForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const phone = brandForm.phone
      ? brandForm.phone.startsWith("0")
        ? brandForm.phone.slice(1)
        : brandForm.phone
      : "";

    const body = {
      name: brandForm.name,
      description: brandForm.description,
      status: brandForm.status,
      email: brandForm.email,
      phone,
      callingCode: "+62",
      ...(editingBrand ? { idBrand: editingBrand.id } : {}),
    };

    saveBrand(body, {
      onSuccess: async () => {
        toast({
          title: "Success",
          description: editingBrand
            ? "Brand updated successfully"
            : "Brand created successfully",
        });

        setBrandForm({ name: "", description: "", status: "active" });
        setEditingBrand(null);
        setIsBrandDialogOpen(false);
      },
      onError: (error: any) => {
        toast({
          title: "Failed",
          description: error.message || "Failed to save brand",
          variant: "destructive",
        });
      },
    });
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandForm({
      name: brand.name,
      email: brand.email,
      phone: (brand.phone ? "0" : "") + brand.phone,
      description: brand.description ?? "",
      status: brand.status ?? "active",
    });
    setIsBrandDialogOpen(true);
  };

  const handleDeleteBrand = (brandId: string) => {
    toast({
      title: "Success",
      description: "Brand deleted successfully",
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Brand Management</h3>
        <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingBrand(null);
                setBrandForm({ name: "", description: "", status: "active" });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? "Edit Brand" : "Add New Brand"}
              </DialogTitle>
              <DialogDescription>
                {editingBrand
                  ? "Update brand information"
                  : "Add a new brand to your business"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="brandName">Brand Name *</Label>
                <Input
                  id="brandName"
                  value={brandForm.name}
                  onChange={(e) =>
                    setBrandForm({ ...brandForm, name: e.target.value })
                  }
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <Label htmlFor="brandEmail">Email *</Label>
                <Input
                  id="brandEmail"
                  value={brandForm.email}
                  onChange={(e) =>
                    setBrandForm({ ...brandForm, email: e.target.value })
                  }
                  placeholder="Enter brand email"
                />
              </div>
              <div>
                <Label htmlFor="brandPhone">Phone *</Label>
                <Input
                  id="brandPhone"
                  value={brandForm.phone}
                  onChange={(e) =>
                    setBrandForm({ ...brandForm, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="brandDescription">Description *</Label>
                <Input
                  id="brandDescription"
                  value={brandForm.description}
                  onChange={(e) =>
                    setBrandForm({ ...brandForm, description: e.target.value })
                  }
                  placeholder="Enter brand description"
                />
              </div>
              {/*<div>
                <Label htmlFor="brandStatus">Status</Label>
                <select
                  id="brandStatus"
                  className="w-full p-2 border rounded-md"
                  value={brandForm.status}
                  onChange={(e) =>
                    setBrandForm({ ...brandForm, status: e.target.value as "active" | "inactive" })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>*/}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsBrandDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveBrand}>
                  {editingBrand ? "Update" : "Create"} Brand
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
              <TableHead>Brand Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{brand.name}</span>
                </TableCell>
                <TableCell>{brand.description ?? "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      brand.status === "active" ? "default" : "secondary"
                    }
                  >
                    {brand.status ?? "active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBrand(brand)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {/*<AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this brand? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteBrand(brand.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>*/}
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

export default Brands;
