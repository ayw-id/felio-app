import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { getAmount } from "@/lib/utils";
import { useOrders } from "@/hooks/useOrders";
import { getOrderStatus } from "@/pages/Orders";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

interface CustomerOrder {
  id: string;
  orderDate: string;
  eventDate: string;
  eventType: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(
    null
  );
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const { getCustomers } = useCustomers(false);
  const { getOrders, getOrderDetail } = useOrders({
    idCustomer: selectedCustomer?.id,
    disabled: !selectedCustomer?.id,
    idOrder: selectedOrder?.id,
  });

  const filteredCustomers = (getCustomers.data || []).filter(
    (customer) =>
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerPhone.includes(searchTerm) ||
      (customer.customlerEmail &&
        customer.customlerEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (getOrderDetail.data && selectedOrder) {
      setSelectedOrder({
        ...selectedOrder,
        ...getOrderDetail.data,
      });
    }
  }, [getOrderDetail.data]);

  useEffect(() => {
    if (selectedCustomer?.id) {
      getOrders.refetch();
    }
  }, [selectedCustomer]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Jumlah Pesanan</TableHead>
              <TableHead>Total Pesanan</TableHead>
              <TableHead>Pesanan Terakhir</TableHead>
              <TableHead>Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.customerName}
                </TableCell>
                <TableCell>{customer.customerPhone}</TableCell>
                <TableCell>{customer.customerEmail || "N/A"}</TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell>Rp {getAmount(customer.totalSpent)}</TableCell>
                <TableCell>{customer.lastOrderDate}</TableCell>
                <TableCell>
                  {!!customer.totalOrders && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Lihat Pesanan
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>
                            Order History - {customer.customerName}
                          </DialogTitle>
                          <DialogDescription>
                            Riwayat Peanan Customer
                          </DialogDescription>
                        </DialogHeader>
                        <div className="overflow-auto max-h-[60vh]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID Pemesanan</TableHead>
                                <TableHead>Tanggal Pemesanan</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Total Harga</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tindakan</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(getOrders.data || []).map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell>#{order.orderNumber}</TableCell>
                                  <TableCell>{order.orderDate}</TableCell>
                                  <TableCell>{order.eventType}</TableCell>
                                  <TableCell>
                                    Rp {getAmount(order.totalAmount)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        ["confirmed", "delivered"].includes(
                                          order.orderStatus
                                        )
                                          ? "default"
                                          : order.orderStatus === "cancelled"
                                          ? "destructive"
                                          : "outline"
                                      }
                                      className={
                                        order.orderStatus === "delivered"
                                          ? "bg-teal-600"
                                          : order.orderStatus === "confirmed"
                                          ? "bg-blue-700"
                                          : ""
                                      }
                                    >
                                      {getOrderStatus(order.orderStatus)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Dialog
                                      open={
                                        isOrderDetailOpen &&
                                        selectedOrder?.id === order.id
                                      }
                                      onOpenChange={(open) => {
                                        setIsOrderDetailOpen(open);
                                        if (!open) setSelectedOrder(null);
                                      }}
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedOrder(order);
                                            setIsOrderDetailOpen(true);
                                          }}
                                        >
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Detail Pesanan - #
                                            {order.orderNumber}
                                          </DialogTitle>
                                          {/*<DialogDescription>
                                            Complete order information
                                          </DialogDescription>*/}
                                        </DialogHeader>
                                        {selectedOrder && (
                                          <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <h4 className="font-medium">
                                                  Customer Information
                                                </h4>
                                                <p>{customer.customerName}</p>
                                                <p>{customer.customerPhone}</p>
                                                {customer.customerEmail && (
                                                  <p>
                                                    {customer.customerEmail}
                                                  </p>
                                                )}
                                              </div>
                                              <div>
                                                <h4 className="font-medium">
                                                  Event Information
                                                </h4>
                                                <p>
                                                  Date:{" "}
                                                  {selectedOrder.eventDate}
                                                </p>
                                                <p>
                                                  Type:{" "}
                                                  {selectedOrder.eventType}
                                                </p>
                                                <p>
                                                  Total: Rp
                                                  {getAmount(
                                                    selectedOrder.totalAmount
                                                  )}
                                                </p>
                                                <p>
                                                  Status:{" "}
                                                  {selectedOrder.orderStatus}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </DialogContent>
                                    </Dialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;
