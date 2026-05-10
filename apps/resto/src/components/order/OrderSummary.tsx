import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, List, ChefHat } from "lucide-react";
import OrderPaymentForm from "./OrderPaymentForm";
import { CustomerOrder, Installment } from "src/pages/Orders";
import { getAmount } from "@/lib/utils";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderSummaryProps {
  order: CustomerOrder;
  onEdit: () => void;
  onPayment: () => void;
  showPackageDetails: () => void;
  handleChangeOrderStatus: (
    idOrder: string,
    status: "confirmed" | "delivered" | "cancelled"
  ) => void;
}

const getFirstInstallment = (totalAmount, installments) => {
  let totalInstallment = 0;
  installments?.forEach((i) => {
    totalInstallment += parseInt(i.amount);
  });

  return totalAmount - totalInstallment;
};

const showPayButton = (orderStatus, installments) => {
  if (!["delivered", "confirmed"].includes(orderStatus)) return false;

  return installments.some((i) => i.status !== "paid");
};

const getStatus = (status) => {
  return status === "paid" ? "Telah Dibayar" : "Belum Dibayar";
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  onEdit,
  onPayment,
  showPackageDetails,
  handleChangeOrderStatus,
}) => {
  const firstPayment = getFirstInstallment(
    order.totalAmount,
    order.installments || []
  );
  const [selectedInstallment, setSelectedInstallment] =
    useState<Installment | null>(null);
  const isShowPayButton =
    showPayButton(order.orderStatus, order.installments || []) &&
    !!selectedInstallment;

  const handleCheckboxChange = (installment: Installment, checked: boolean) => {
    setSelectedInstallment(checked ? installment : null);
  };

  const getAmount = (amount: number) => amount.toLocaleString("id-ID");

  return (
    <>
      {/* Customer & Event Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">Info Customer</h4>
          <p>{order.customer?.customerName}</p>
          <p>{order.customer?.customerPhone}</p>
          {order.customer?.customerEmail && (
            <p>{order.customer?.customerEmail}</p>
          )}
        </div>
        <div>
          <h4 className="font-medium">Info Pemesanan</h4>
          <p>Tanggal Pengiriman: {order.eventDate}</p>
          <p>Tipe: {order.eventType}</p>
          <p>Lokasi: {order.eventLocation}</p>
          <p>Total: Rp {getAmount(order.totalAmount)}</p>
        </div>
      </div>

      {/* Items */}
      <div>
        <h4 className="font-medium mb-2">Item Pesanan</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Harga Unit</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(order.selectedItems || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {item.type === "package" ? "Paket" : "Menu"}
                </TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>Rp {getAmount(item.price)}</TableCell>
                <TableCell>Rp {getAmount(item.totalPrice)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {item.type === "package" && item.packageDetails && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          showPackageDetails(item.packageDetails, "menus")
                        }
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        showPackageDetails(
                          item.type === "package"
                            ? item.packageDetails
                            : item.menuDetails,
                          "ingredients"
                        )
                      }
                    >
                      <ChefHat className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Payment Schedule */}
      <div>
        <h4 className="font-medium mb-2">Jadwal Pembayaran</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-4"></TableHead>
              <TableHead>Jatuh Tempo</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Pembayaran</TableHead>
              <TableHead>tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {firstPayment > 0 && (
              <TableRow>
                <TableCell></TableCell>
                <TableCell>-</TableCell>
                <TableCell>Rp {getAmount(firstPayment)}</TableCell>
                <TableCell>
                  <Badge variant="default">Telah Dibayar</Badge>
                </TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            )}
            {(order.installments || []).map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  {i.status !== "paid" && (
                    <Checkbox
                      checked={selectedInstallment?.id === i.id}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(i, Boolean(checked))
                      }
                    />
                  )}
                </TableCell>
                <TableCell>{i.dueDate}</TableCell>
                <TableCell>Rp {getAmount(i.amount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      i.status === "paid"
                        ? "default"
                        : i.status === "overdue"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {getStatus(i.status)}
                  </Badge>
                </TableCell>
                <TableCell>{i.paidDate || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {i.status === "paid" && i.receipt?.src && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Lihat Bukti Pembayaran
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <ScrollArea className="max-h-[70vh] px-1">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bukti Pembayaran
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <img
                              src={i.receipt.src}
                              alt="Receipt Preview"
                              className="max-w-full max-h-full rounded border mb-4"
                            />
                            <AlertDialogFooter>
                              <AlertDialogCancel>Kembali</AlertDialogCancel>
                            </AlertDialogFooter>
                          </ScrollArea>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {isShowPayButton && (
          <OrderPaymentForm
            onPayment={onPayment}
            selectedInstallment={selectedInstallment}
          />
        )}
        {order.orderStatus === "draft" && (
          <Button onClick={onEdit}>Ubah Pesanan</Button>
        )}
        {order.orderStatus === "draft" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-teal-500">Konfirmasi Pesanan</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Pesanan</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda yakin ingin konfirmasi pesanan ini?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Tidak</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleChangeOrderStatus(order.id, "confirmed")}
                >
                  Konfirmasi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {order.orderStatus === "confirmed" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-indigo-800">Selesaikan Pesanan</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Selesaikan Pesanan</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda yakin ingin pesanan ini telah selesai?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Tidak</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleChangeOrderStatus(order.id, "delivered")}
                >
                  Konfirmasi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </>
  );
};

export default OrderSummary;
