import React, { useState, useEffect } from "react";
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
  Plus,
  Search,
  AlertTriangle,
  Edit,
  History,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RawMaterial } from "src/pages/Stock";
import { useStockHistory } from "@/hooks/useStockHistory";
import { useResto } from "@/contexts/RestoContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface HistoryProps {
  rawMaterials: RawMaterial[];
  historySearchTerm: string;
  setHistorySearchTerm: (text: string) => void;
}

const getSubTypeText = (subType) => {
  if (subType === "purchase") return "Pembelian";
  if (subType === "usage") return "Penjualan";
  if (subType === "adjustment_in" || subType === "adjustment_out")
    return "Penyesuaian";
};

const History: React.FC<HistoryProps> = ({
  rawMaterials,
  historySearchTerm,
  setHistorySearchTerm,
}) => {
  const { toast } = useToast();
  const { selectedBranch } = useResto();
  const { stockHistoryQuery, adjustStock } = useStockHistory();
  const [isAddStockOpen, setIsAddStockOpen] = useState<boolean>(false);
  const [dialogHasOpened, setDialogHasOpened] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [newStockTransaction, setNewStockTransaction] = useState({
    idMaterial: "",
    type: "in" as "in" | "out",
    qty: 0,
    pricePerUnit: 0,
    notes: "",
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    const action = searchParams.get("action");
    const data = searchParams.get("data");
    if (tab === "history") {
      if (action === "create") {
        setIsAddStockOpen(true);
        setDialogHasOpened(true);
        if (data) {
          const codeQtySeparated = data.split("-");
          if (codeQtySeparated.length === 2) {
            setNewStockTransaction({
              ...newStockTransaction,
              idMaterial: codeQtySeparated[0],
              qty: parseFloat(codeQtySeparated[1]),
              type: "out",
              notes: "Expired",
            });
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!isAddStockOpen && tab === "history" && dialogHasOpened) {
      navigate(`${import.meta.env.BASE_URL}stock`);
    }
  }, [isAddStockOpen]);

  const filteredTransactions = (stockHistoryQuery.data || []).filter(
    (transaction) =>
      transaction.materialName
        ?.toLowerCase()
        .includes(historySearchTerm.toLowerCase()) ||
      transaction.notes
        ?.toLowerCase()
        .includes(historySearchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(historySearchTerm.toLowerCase())
  );

  const handleAddStockTransaction = () => {
    if (!newStockTransaction.idMaterial || newStockTransaction.qty <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    adjustStock(newStockTransaction, {
      onSuccess: () => {
        stockHistoryQuery.refetch();
        setIsAddStockOpen(false);
        setNewStockTransaction({
          idMaterial: "",
          type: "in",
          qty: 0,
          pricePerUnit: 0,
          notes: "",
        });
        setIsAddStockOpen(false);

        toast({
          title: "Success",
          description: "Stock transaction recorded successfully",
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

  const getStockHistoryForMaterial = (idMaterial: string) => {
    return stockTransactions.filter((t) => t.idMaterial === idMaterial);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari transaksi..."
            value={historySearchTerm}
            onChange={(e) => setHistorySearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Penyesuaian Stok
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Penyesuaian Stok</DialogTitle>
              <DialogDescription>
                Tambah penyesuaian stok masuk atau keluar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="material">Bahan</Label>
                <select
                  id="material"
                  className="w-full p-2 border rounded-md"
                  value={newStockTransaction.idMaterial}
                  onChange={(e) =>
                    setNewStockTransaction({
                      ...newStockTransaction,
                      idMaterial: e.target.value,
                    })
                  }
                >
                  <option value="">Pilih bahan</option>
                  {rawMaterials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Jenis Transaksi</Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={
                      newStockTransaction.type === "in" ? "default" : "outline"
                    }
                    onClick={() =>
                      setNewStockTransaction({
                        ...newStockTransaction,
                        type: "in",
                      })
                    }
                  >
                    Masuk
                  </Button>
                  <Button
                    type="button"
                    variant={
                      newStockTransaction.type === "out" ? "default" : "outline"
                    }
                    onClick={() =>
                      setNewStockTransaction({
                        ...newStockTransaction,
                        type: "out",
                      })
                    }
                  >
                    Keluar
                  </Button>
                </div>
              </div>

              <div
                className={`grid grid-cols-${
                  newStockTransaction.type === "in" ? 2 : 1
                } gap-4`}
              >
                <div>
                  <Label htmlFor="quantity">Jumlah</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newStockTransaction.qty + ""}
                    onChange={(e) =>
                      setNewStockTransaction({
                        ...newStockTransaction,
                        qty: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                {newStockTransaction.type === "in" && (
                  <div>
                    <Label htmlFor="pricePerUnit">Harga per Unit</Label>
                    <Input
                      id="pricePerUnit"
                      type="number"
                      step="0.01"
                      value={newStockTransaction.pricePerUnit + ""}
                      onChange={(e) =>
                        setNewStockTransaction({
                          ...newStockTransaction,
                          pricePerUnit: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Input
                  id="notes"
                  value={newStockTransaction.notes}
                  onChange={(e) =>
                    setNewStockTransaction({
                      ...newStockTransaction,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Catatan tambahan"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddStockOpen(false)}
                >
                  Batal
                </Button>
                <Button onClick={handleAddStockTransaction}>
                  Catat Transaksi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Bahan</TableHead>
              <TableHead>Stok Masuk / Keluar</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Harga per Unit</TableHead>
              <TableHead>Total Nilai</TableHead>
              <TableHead>Tanggal Kadaluarsa</TableHead>
              <TableHead>Referensi</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.materialName}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === "in" ? "default" : "secondary"
                    }
                  >
                    {transaction.type === "in" ? "Masuk" : "Keluar"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {transaction.type === "in" ? "+" : "-"}
                  {transaction.qty}
                </TableCell>
                <TableCell>
                  Rp {transaction.pricePerUnit.toLocaleString()}
                </TableCell>
                <TableCell>
                  Rp{" "}
                  {(
                    transaction.qty * transaction.pricePerUnit
                  ).toLocaleString()}
                </TableCell>
                <TableCell>{transaction.expiredDate}</TableCell>
                <TableCell>{transaction.reference}</TableCell>
                <TableCell>
                  {transaction.notes ||
                    getSubTypeText(transaction.subType) ||
                    "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default History;
