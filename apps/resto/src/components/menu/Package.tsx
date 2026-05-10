import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Plus, Search, Edit, Trash2, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Container from "@/components/ui/Container";
import { useMenuPackage } from "@/hooks/useMenuPackage";
import {
  PackageItem,
  IngredientItem,
  MenuItemType,
  getBase64FromFile,
  ImageType,
} from "@/pages/Menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RawMaterial } from "@/pages/Stock";
import { getAmount } from "@/lib/utils";
import PackageDialog from "@/components/menu/PackageDialog";

interface PackageProps {
  handleDelete: (id: string, type: "menu" | "package") => void;
  handleView: (
    item: MenuItemType | PackageType,
    type: "menu" | "package"
  ) => void;
  handleEdit: (
    item: MenuItemType | PackageType,
    type: "menu" | "package"
  ) => void;
  packages: PackageType[];
  setPackages: (packageTypes: PackageType[]) => void;
  menuItems: MenuItemType[];
  stockItems: RawMaterial[];
}

const Package: React.FC<PackageProps> = ({
  handleDelete,
  handleView,
  handleEdit,
  packages,
  setPackages,
  menuItems,
  stockItems,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const { getMenuPackage, saveMenuPackage } = useMenuPackage("package", true);

  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null
  );

  const filteredPackages = (getMenuPackage.data || []).filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePackage = (data: PackageType) => {
    saveMenuPackage(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: selectedPackage
            ? "Ubah paket berhasil"
            : "Tambah paket berhasil",
        });

        getMenuPackage.refetch();
        setIsPackageOpen(false);
        setSelectedPackage(null);
      },
      onError: (error: any) => {
        toast({
          title: "Failed",
          description: error?.message || "Something went wrong",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari paket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={() => {
            setSelectedPackage(null);
            setIsPackageOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Paket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden bg-gray-100">
              {pkg.images?.length > 0 && pkg.images[0]?.src && (
                <img
                  src={pkg.images[0].src}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{pkg.name}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {pkg.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  Rp {getAmount(pkg.price)}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleView(pkg, "package")}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setIsPackageOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {/*<AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Package</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this package? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(pkg.id, "package")}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>*/}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PackageDialog
        open={isPackageOpen}
        onClose={() => setIsPackageOpen(false)}
        mode={selectedPackage ? "edit" : "add"}
        onSubmit={handleSavePackage}
        menuItems={menuItems}
        stockItems={stockItems}
        initialData={selectedPackage}
      />
    </>
  );
};

export default Package;
