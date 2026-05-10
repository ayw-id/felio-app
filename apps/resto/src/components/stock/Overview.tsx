import React, { useState, useEffect } from "react";
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
  Plus,
  Search,
  AlertTriangle,
  Edit,
  History,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Container from "@/components/ui/Container";
import { RawMaterial } from "src/pages/Stock";
import { useStock } from "@/hooks/useStock";
import { useResto } from "@/contexts/RestoContext";

interface OverviewProps {
  handleViewHistory: (material: RawMaterial) => void;
  rawMaterials: RawMaterial[];
  refetchRawMaterial: () => void;
}

const OverView: React.FC<OverviewProps> = ({
  handleViewHistory,
  rawMaterials,
  refetchRawMaterial,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMinStockOpen, setIsEditMinStockOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(
    null
  );
  const { selectedBranch } = useResto();
  const { saveStock, isSaving } = useStock();

  const [minStockUpdate, setMinStockUpdate] = useState({
    minStock: 0,
  });

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    unit: "",
    minStock: 0,
    costPerUnit: 0,
    currentStock: 0,
    expiredInDays: 0,
  });

  const filteredMaterials = rawMaterials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateMinStock = () => {
    if (!selectedMaterial || minStockUpdate.minStock < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid minimum stock value",
        variant: "destructive",
      });
      return;
    }

    saveStock(
      {
        idRawMaterial: selectedMaterial.id,
        minStock: minStockUpdate.minStock,
      },
      {
        onSuccess: () => {
          refetchRawMaterial();
          setIsEditMinStockOpen(false);
          setSelectedMaterial(null);

          toast({
            title: "Success",
            description: "Minimum stock updated successfully",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Failed",
            description: error?.message || "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const data = {
      name: newMaterial.name,
      unit: newMaterial.unit,
      pricePerUnit: newMaterial.costPerUnit,
      currentStock: newMaterial.currentStock,
      expiredInDays: newMaterial.expiredInDays,
      minStock: newMaterial.minStock,
    };

    saveStock(data, {
      onSuccess: () => {
        setNewMaterial({
          name: "",
          unit: "",
          minStock: 0,
          costPerUnit: 0,
          currentStock: 0,
          expiredInDays: 0,
        });
        setIsAddMaterialOpen(false);
        toast({
          title: "Success",
          description: "New material added successfully",
        });
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
            placeholder="Cari bahan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Bahan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Bahan Baku Baru</DialogTitle>
              <DialogDescription>
                Tambahkan bahan baku baru ke inventori
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="materialName">Nama Bahan Baku</Label>
                <Input
                  id="materialName"
                  value={newMaterial.name}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, name: e.target.value })
                  }
                  placeholder="Nama bahan baku"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Satuan</Label>
                  <Input
                    id="unit"
                    value={newMaterial.unit}
                    onChange={(e) =>
                      setNewMaterial({ ...newMaterial, unit: e.target.value })
                    }
                    placeholder="kg, liter, dll."
                  />
                </div>
                <div>
                  <Label htmlFor="costPerUnit">Harga/Unit</Label>
                  <Input
                    id="costPerUnit"
                    type="number"
                    step="0.01"
                    value={parseInt(newMaterial.costPerUnit) + ""}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        costPerUnit: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentStock">Stok Awal</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={parseFloat(newMaterial.currentStock) + ""}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        currentStock: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="minStock">Stok Min</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={parseFloat(newMaterial.minStock) + ""}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        minStock: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="expiredInDays">Waktu Kadaluarsa (Hari)</Label>
                  <Input
                    id="expiredInDays"
                    type="number"
                    value={parseFloat(newMaterial.expiredInDays) + ""}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        expiredInDays: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddMaterialOpen(false)}
                >
                  Batal
                </Button>
                <Button onClick={handleAddMaterial}>Tambah Bahan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bahan</TableHead>
              <TableHead>Stok Saat Ini</TableHead>
              <TableHead>Stok Pemesanan</TableHead>
              <TableHead>Stok Min</TableHead>
              <TableHead>Waktu Kadaluarsa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Harga/Unit</TableHead>
              <TableHead>Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>
                  {material.stock} {material.unit}
                </TableCell>
                <TableCell className="font-medium">
                  {material.bookingStock} {material.unit}
                </TableCell>
                <TableCell>
                  {material.minStock} {material.unit}
                </TableCell>
                <TableCell>
                  {material.expiredInDays
                    ? material.expiredInDays + " hari"
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {material.bookingStock > material.stock ? (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1 w-fit"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Stok Kurang
                    </Badge>
                  ) : material.stock - material.bookingStock <=
                    material.minStock ? (
                    <Badge
                      variant="default"
                      className="flex items-center gap-1 w-fit bg-orange-500"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Stok Rendah
                    </Badge>
                  ) : (
                    <Badge variant="default">Tersedia</Badge>
                  )}

                  {!!material.expiredQty && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1 w-fit mt-2"
                    >
                      <History className="w-3 h-3" />
                      {material.expiredQty} {material.unit} akan kadaluwarsa
                    </Badge>
                  )}
                </TableCell>
                <TableCell>Rp{material.costPerUnit.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewHistory(material)}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                    <Dialog
                      open={
                        isEditMinStockOpen &&
                        selectedMaterial?.id === material.id
                      }
                      onOpenChange={(open) => {
                        setIsEditMinStockOpen(open);
                        if (!open) setSelectedMaterial(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMaterial(material);
                            setMinStockUpdate({ minStock: material.minStock });
                            setIsEditMinStockOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Perbarui Stok Minimum</DialogTitle>
                          <DialogDescription>
                            Atur level stok minimum untuk {material.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="minStock">
                              Stok Minimum ({material.unit})
                            </Label>
                            <Input
                              id="minStock"
                              type="number"
                              value={minStockUpdate.minStock + ""}
                              onChange={(e) =>
                                setMinStockUpdate({
                                  minStock: parseFloat(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsEditMinStockOpen(false)}
                            >
                              Batal
                            </Button>
                            <Button onClick={handleUpdateMinStock}>
                              Perbarui
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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

export default OverView;
