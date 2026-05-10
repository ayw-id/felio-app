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
import { Plus, Search, Edit, History, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Container from "@/components/ui/Container";
import { RawMaterial } from "src/pages/Stock";
import { useStock } from "@/hooks/useStock";
import { useResto } from "@/contexts/RestoContext";
import { useSupplier, SupplierType } from "@/hooks/useSupplier";
import { SupplierDialog } from "@/components/Stock";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialData: SupplierType = {
  name: "",
  contactPersons: [
    {
      name: "",
      phone: "",
      email: "",
    },
  ],
  status: "active",
};

const Supplier: React.FC<{
  handlePurchaseHistory: (supplierName: string) => void;
}> = ({ handlePurchaseHistory }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { getSuppliers, isSaving, supplierMutation } = useSupplier();

  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierType>(initialData);

  const filteredSuppliers = (getSuppliers.data || []).filter(
    (supplier) => supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    // JSON.stringify(supplier.contactPersons).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={() => {
            setSelectedSupplier(initialData);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Supplier
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Supplier</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>
                  {supplier.contactPersons.map((contact) => {
                    return (
                      <Badge
                        key={contact.phone}
                        variant="outlined"
                        className="ml-2"
                      >
                        {contact.name} - {contact.phone}
                      </Badge>
                    );
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      supplier.isActive === "active" ? "default" : "outlined"
                    }
                    className="ml-2"
                  >
                    {supplier.isActive}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handlePurchaseHistory(supplier.name);
                      }}
                    >
                      <History className="w-4 h-4" />
                    </Button>

                    {supplier.isActive === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}

                    {supplier.isActive === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <SupplierDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          initialData={selectedSupplier}
          onSave={(data) => {
            supplierMutation(
              {
                path: "save",
                payload: data,
              },
              {
                onSuccess: () => {
                  toast({
                    title: "Berhasil",
                    description: "Supplier disimpan",
                  });
                  setIsDialogOpen(false);
                },
                onError: (err) => {
                  toast({
                    title: "Gagal",
                    description: err.message,
                    variant: "destructive",
                  });
                },
              }
            );
          }}
          isSaving={isSaving}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={() => setIsDeleteDialogOpen(false)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Non Aktifkan Supplier</AlertDialogTitle>
              <AlertDialogDescription>
                Anda yakin ingin menon-aktifkan supplier{" "}
                <strong>{selectedSupplier.name}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Batalkan</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  supplierMutation(
                    {
                      path: "changeStatus",
                      payload: { id: selectedSupplier.id },
                    },
                    {
                      onSuccess: () => {
                        toast({
                          title: "Berhasil",
                          description: "Supplier dinon-aktifkan",
                        });
                        setIsDeleteDialogOpen(false);
                      },
                      onError: (err) => {
                        toast({
                          title: "Gagal",
                          description: err.message,
                          variant: "destructive",
                        });
                      },
                    }
                  );
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Non-Aktifkan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default Supplier;
