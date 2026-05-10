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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Search,
  Eye,
  X,
  List,
  ChefHat,
  CreditCard,
  Wallet,
  QrCode,
  MapPin,
  CalendarIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import OrderDialog from "@/components/order/OrderDialog";
import { useOrders } from "@/hooks/useOrders";
import { useMenuPackage } from "@/hooks/useMenuPackage";
import { useCustomers } from "@/hooks/useCustomers";
import { getAmount } from "@/lib/utils";
import { useEvent } from "@/hooks/useEvent";

export type OrderItem = {
  id?: string;
  idItem: string;
  code: string;
  name: string;
  qty: number;
  price: number;
  total: number;
  type: "menu" | "package";
  // only if type === "package"
  packageDetails: {
    menus?: {
      id: string;
      idMenu: string;
      name: string;
      qty: number;
    }[];
    ingredients?: {
      id: string;
      idMaterial: string;
      name: string;
      qty: number;
      unit: string;
    }[];
  };
};

export type Installment = {
  id?: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  isPaid: boolean;
  status: "pending" | "paid" | "overdue";
};

export type Customer = {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
};

export type CustomerOrder = {
  id?: string;
  orderNumber?: string;
  customer?: Customer;
  status?: "draft" | "confirmed" | "delivered" | "cancelled";
  paymentMethod?: "cash" | "transfer" | "installment";
  totalAmount: number;
  paidAmount?: number;
  dueAmount?: number;
  orderDate?: string;
  deliveryDate?: string;
  notes?: string;
  eventType: EventType | null;
  eventLocation: EventType | null;

  items?: OrderItem[];
  installmentCount?: number;
  installments?: Installment[];

  // Internal metadata
  createdAt?: string;
  updatedAt?: string;
};

export const getOrderStatus = (
  status: "draft" | "confirmed" | "delivered" | "cancelled"
) => {
  return status === "draft"
    ? "Draft"
    : status === "confirmed"
    ? "Pesanan Baru"
    : status === "delivered"
    ? "Selesai"
    : "Dibatalkan";
};

const getPaymentStatus = (status: "unpaid" | "partial" | "paid") => {
  return status === "unpaid"
    ? "Belum Dibayar"
    : status === "partial"
    ? "Dibayar Sebagian"
    : "Selesai";
};

const Orders = () => {
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderDialogMode, setOrderDialogMode] = useState<
    "create" | "edit" | "detail"
  >("create");
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPackageDetailOpen, setIsPackageDetailOpen] = useState(false);
  const [packageDetailType, setPackageDetailType] = useState<
    "ingredients" | "menus"
  >("ingredients");
  const [selectedPackageDetails, setSelectedPackageDetails] =
    useState<PackageDetails | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    receiptImage: null as File | null,
    paymentMethod: "cash",
  });

  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(
    null
  );
  const { getOrders, saveOrder, getOrderDetail, changeOrderStatus, payOrder } =
    useOrders({ idOrder: selectedOrder?.id });
  const { getCustomers } = useCustomers(
    true,
    isOrderDialogOpen && orderDialogMode !== "detail"
  );
  const { getMenuPackage: getMenu } = useMenuPackage(
    "menu",
    isOrderDialogOpen && orderDialogMode !== "detail"
  );
  const { getMenuPackage: getPackage } = useMenuPackage(
    "package",
    isOrderDialogOpen && orderDialogMode !== "detail"
  );
  const { getEvents } = useEvent(isOrderDialogOpen);

  // Sample payment methods (in real app, this would come from business settings)
  const [availablePaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "cash",
      name: "Cash",
      enabled: true,
    },
    {
      id: "2",
      type: "bank_transfer",
      name: "Bank Transfer - BCA",
      enabled: true,
      details: {
        accountNumber: "1234567890",
        accountName: "Your Business Name",
        bankName: "Bank Central Asia",
      },
    },
    {
      id: "3",
      type: "payment_gateway",
      name: "GoPay",
      enabled: true,
      details: {
        gatewayType: "e_wallet",
        provider: "GoPay",
      },
    },
  ]);

  useEffect(() => {
    if (getOrderDetail.data && selectedOrder && orderDialogMode !== "edit") {
      setSelectedOrder({
        ...selectedOrder,
        ...getOrderDetail.data,
      });
    }
  }, [getOrderDetail.data]);

  const menuItems = [
    ...(getPackage.data || []).map((pkg) => {
      const dataPkg = JSON.parse(JSON.stringify(pkg));
      dataPkg.idItem = pkg.id;
      dataPkg.code = "package-" + dataPkg.code;
      dataPkg.qty = 0;
      dataPkg.total = 0;
      dataPkg.type = "package";
      dataPkg.packageDetails = {
        menus: dataPkg.foodMenus,
        ingredients: dataPkg.ingredients.map((ingredient) => {
          return {
            ...ingredient,
            qty: ingredient.qty,
          };
        }),
      };
      delete dataPkg.ingredients;
      delete dataPkg.foodMenus;
      delete dataPkg.id;

      return dataPkg;
    }),
    ...(getMenu.data || []).map((menu) => {
      const dataMenu = JSON.parse(JSON.stringify(menu));
      dataMenu.idItem = menu.id;
      dataMenu.code = "menu-" + dataMenu.code;
      dataMenu.qty = 0;
      dataMenu.total = 0;
      dataMenu.type = "menu";
      dataMenu.menuDetails = {
        ingredients: dataMenu.ingredients.map((ingredient) => {
          return {
            ...ingredient,
            qty: ingredient.qty,
          };
        }),
      };

      delete dataMenu.id;

      return dataMenu;
    }),
  ];

  const filteredOrders = (getOrders.data || []).filter(
    (order) =>
      order.customer?.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentIcon = (type: string, gatewayType?: string) => {
    if (type === "cash") return <CreditCard className="w-4 h-4" />;
    if (type === "bank_transfer") return <MapPin className="w-4 h-4" />;
    if (type === "payment_gateway") {
      if (gatewayType === "e_wallet") return <Wallet className="w-4 h-4" />;
      if (gatewayType === "qris") return <QrCode className="w-4 h-4" />;
      return <CreditCard className="w-4 h-4" />;
    }
    return <CreditCard className="w-4 h-4" />;
  };

  const calculateTotal = () => {
    return selectedOrder.selectedItems.reduce((total, item) => {
      const price = item.price;
      return total + price * item.qty;
    }, 0);
  };

  const generateDefaultDueDates = (installmentCount: number) => {
    if (installmentCount <= 1) return {};

    const dueDates: { [installmentNumber: number]: Date } = {};
    const baseDate = new Date();

    // Skip first installment (index 1), start from second installment (index 2)
    for (let i = 2; i <= installmentCount; i++) {
      const dueDate = new Date(baseDate);
      dueDate.setDate(baseDate.getDate() + 7 * (i - 1)); // Weekly intervals
      dueDates[i] = dueDate;
    }

    return dueDates;
  };

  const generateDefaultInstallmentAmounts = (
    installmentCount: number,
    totalAmount: number,
    paidAmount: number
  ) => {
    if (installmentCount <= 1) return {};

    const amounts: { [installmentNumber: number]: number } = {};
    const remainingAmount = totalAmount - paidAmount;
    const defaultInstallmentAmount = remainingAmount / (installmentCount - 1);

    // Generate default amounts for installments 2 through installmentCount
    for (let i = 2; i <= installmentCount; i++) {
      amounts[i] = defaultInstallmentAmount;
    }

    return amounts;
  };

  const getTotalInstallmentAmount = () => {
    let total = 0;
    selectedOrder.installments.forEach((i) => {
      total += i.amount;
    });
    return total;
  };

  const handleSaveOrder = () => {
    if (selectedOrder.selectedItems.length === 0) {
      toast({
        title: "Error",
        description:
          "Please fill in all required fields and select at least one item",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = calculateTotal();
    const totalPayments =
      selectedOrder.paidAmount + getTotalInstallmentAmount();

    // Check if total payments match the order total
    if (Math.abs(totalPayments - totalAmount) > 0) {
      toast({
        title: "Error",
        description: "Total installment amounts must equal the order total",
        variant: "destructive",
      });
      return;
    }

    // Create installments
    let installments: Installment[] = [];

    // First payment (already paid)
    if (selectedOrder.paidAmount > 0) {
      installments.push({
        id: "1",
        amount: selectedOrder.paidAmount,
        dueDate: new Date().toISOString().split("T")[0],
        paidDate: new Date().toISOString().split("T")[0],
        status: "paid",
      });
    }

    // Remaining installments with custom amounts and due dates
    installments = [...installments, ...(selectedOrder.installments || [])];

    // Get customer info
    const customer = {};
    const customerName = selectedOrder.customer?.customerName;
    const customerPhone = selectedOrder.customer?.customerPhone;
    const customerEmail = selectedOrder.customer?.customerEmail;

    if (selectedOrder.customerType === "existing") {
      if (!selectedOrder.customer?.id) {
        toast({
          title: "Error",
          description: "Silahkan pilih customer",
          variant: "destructive",
        });
        return;
      } else {
        customer.id = selectedOrder.customer.id;
      }
    } else {
      customer.customerName = customerName;
      customer.customerPhone = customerPhone;
      customer.customerEmail = customerEmail;
    }

    const items: OrderItem[] = selectedOrder.selectedItems.map((item) => {
      const menuItem = menuItems.find((m) => m.code === item.code)!;
      const price = item.price;

      let transformedMenus = [];
      if (item.type === "package") {
        transformedMenus = item.packageDetails?.menus?.map((menu) => {
          const transformedMenu = {
            ...menu,
            qty: menu.qty,
          };

          return transformedMenu;
        });
      }

      let transformedIngredients = [];
      transformedIngredients = (
        item.type === "package" ? item.packageDetails : item.menuDetails
      )?.ingredients?.map((ingredient) => {
        const transformedIngredient = {
          ...ingredient,
          qty: ingredient.qty,
        };

        return transformedIngredient;
      });

      return {
        id: item.id,
        idItem: item.idItem,
        name: menuItem.name,
        type: item.type?.toLowerCase() as "menu" | "package",
        qty: item.qty,
        price,
        totalPrice: price * item.qty,
        menus: transformedMenus,
        ingredients: transformedIngredients,
      };
    });

    console.warn("selectedOrder", selectedOrder);

    let eventType = null;
    const selectedEventType = selectedOrder.eventType;
    if (selectedEventType?.name) {
      eventType = {
        name: selectedEventType.name,
      };
      if (selectedEventType.id !== "-1" && selectedEventType.id !== "") {
        eventType.id = selectedOrder.eventType.id;
      }
    }

    let eventLocation = null;
    const selectedEventLocation = selectedOrder.eventLocation;
    if (selectedEventLocation?.name) {
      eventLocation = {
        name: selectedEventLocation.name,
      };
      if (
        selectedEventLocation.id !== "-1" &&
        selectedEventLocation.id !== ""
      ) {
        eventLocation.id = selectedOrder.eventLocation.id;
      }
    }

    const order: CustomerOrder = {
      ...(selectedOrder.id
        ? {
            idOrder: selectedOrder.id,
          }
        : {}),
      customer,
      orderDate: new Date().toISOString().split("T")[0],
      eventDate: selectedOrder.eventDate,
      eventType,
      eventLocation,
      items,
      itemsToDelete: selectedOrder.selectedItemsToDelete || [],
      totalAmount,
      firstPayment: selectedOrder.firstPayment,
      installments,
      paidAmount: selectedOrder.paidAmount,
      status: "draft",
    };

    console.warn("order", order);

    saveOrder(order, {
      onSuccess: () => {
        setSelectedOrder({
          customer: null,
          eventDate: "",
          eventType: {
            id: "",
            name: "",
            type: "type",
          },
          eventLocation: {
            id: "",
            name: "",
            type: "location",
          },
          selectedItems: [],
          installmentCount: 1,
          firstPayment: 0,
          installmentDueDates: {},
          installmentAmounts: {},
        });

        toast({
          title: "Success",
          description: "Buat pesanan berhasil",
        });
        setIsOrderDialogOpen(false);
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

  const handleEdit = () => {
    setOrderDialogMode("edit");
  };

  const handleChangeOrderStatus = (
    idOrder: string,
    status: "confirmed" | "delivered" | "cancelled"
  ) => {
    changeOrderStatus(
      {
        status,
        idOrder,
      },
      {
        onSuccess: () => {
          const statusStr =
            status === "confirmed"
              ? "dikonfirmasi"
              : status === "delivered"
              ? "diselesaikan"
              : "dibatalkan";
          toast({
            title: "Success",
            description: "Buat pesanan berhasil " + statusStr,
          });

          setSelectedOrder(null);
          setIsOrderDialogOpen(false);
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

  const handlePayment = (paymentData) => {
    payOrder(paymentData, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Bukti pembayaran berhasil disimpan",
        });

        setSelectedOrder(null);
        setIsOrderDialogOpen(false);
      },
      onError: (error: any) => {
        toast({
          title: "Failed",
          description: error?.message || "Something went wrong",
          variant: "destructive",
        });
      },
    });

    const selectedPaymentMethod = availablePaymentMethods.find(
      (pm) => pm.id === paymentForm.paymentMethod
    );

    // Update the order with new payment
    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        const newPaidAmount = order.firstPayment + paymentForm.amount;
        const updatedInstallments = order.installments.map((installment) => {
          if (installment.status === "pending" && paymentForm.amount > 0) {
            const paymentToApply = Math.min(
              paymentForm.amount,
              installment.amount
            );
            if (paymentToApply === installment.amount) {
              return {
                ...installment,
                status: "paid" as const,
                paidDate: new Date().toISOString().split("T")[0],
              };
            }
          }
          return installment;
        });

        return {
          ...order,
          firstPayment: newPaidAmount,
          installments: updatedInstallments,
          status:
            newPaidAmount >= order.totalAmount
              ? ("completed" as const)
              : order.status,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setPaymentForm({ amount: 0, receiptImage: null, paymentMethod: "cash" });
    setIsPaymentDialogOpen(false);

    toast({
      title: "Payment Recorded",
      description: `Payment of $${paymentForm.amount.toFixed(2)} via ${
        selectedPaymentMethod?.name
      } has been recorded successfully`,
    });
  };

  const showPackageDetails = (
    packageDetails: PackageDetails,
    type: "ingredients" | "menus"
  ) => {
    setSelectedPackageDetails(packageDetails);
    setPackageDetailType(type);
    setIsPackageDetailOpen(true);
  };

  const getEmptyOrder: CustomerOrder = () => {
    return {
      id: "", // Or let backend generate it
      customerType: "existing",
      idCustomer: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      eventDate: "",
      eventType: "",
      selectedItems: [],
      installmentCount: 1,
      firstPayment: 0,
      installments: [],
      totalAmount: 0,
      status: "confirmed",
    };
  };

  return (
    <Container
      title={"Orders Management"}
      subTitle={"Kelola pesanan dan pembayaran pelanggan"}
    >
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <div style={{ textAlign: "right" }}>
          <Button
            onClick={() => {
              setSelectedOrder(getEmptyOrder());
              setOrderDialogMode("create");
              setIsOrderDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Pesanan
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pesanan</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Tanggal Event</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Total Harga</TableHead>
              <TableHead>Sudah Terbayar</TableHead>
              <TableHead>Status Pesanan</TableHead>
              <TableHead>Status Pembayaran</TableHead>
              <TableHead>Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.orderNumber}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {order.customer?.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerPhone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{order.eventDate}</TableCell>
                <TableCell>{order.eventType}</TableCell>
                <TableCell>Rp {getAmount(order.totalAmount)}</TableCell>
                <TableCell>Rp {getAmount(order.paidAmount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ["confirmed", "delivered"].includes(order.orderStatus)
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
                  <Badge
                    variant={
                      order.paymentStatus === "unpaid"
                        ? "destructive"
                        : order.paymentStatus === "partial"
                        ? "outline"
                        : "default"
                    }
                    className={
                      order.paymentStatus === "paid" ? "bg-teal-600" : ""
                    }
                  >
                    {getPaymentStatus(order.paymentStatus)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder({
                          ...order,
                          customerType: "existing",
                        });
                        setOrderDialogMode("detail");
                        setIsOrderDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {!["cancelled", "delivered"].includes(
                      order.orderStatus
                    ) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Batalkan Pesanan
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Anda yakin ingin batalkan pesanan ini?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Tidak</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleChangeOrderStatus(order.id, "cancelled")
                              }
                            >
                              Ya, batalkan pesanan
                            </AlertDialogAction>
                          </AlertDialogFooter>
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

      {selectedOrder && (
        <OrderDialog
          mode={orderDialogMode}
          open={isOrderDialogOpen}
          onOpenChange={(open) => {
            setIsOrderDialogOpen(open);
            if (!open) {
              setSelectedOrder(null);
              setOrderDialogMode("create");
            }
          }}
          order={selectedOrder}
          setOrder={setSelectedOrder}
          customers={getCustomers.data || []}
          menuItems={menuItems}
          onSave={handleSaveOrder}
          eventTypes={(getEvents.data || []).filter(
            (event) => event.type === "type"
          )}
          eventLocations={(getEvents.data || []).filter(
            (event) => event.type === "location"
          )}
          onEdit={handleEdit}
          onPayment={handlePayment}
          showPackageDetails={showPackageDetails}
          handleChangeOrderStatus={handleChangeOrderStatus}
        />
      )}

      {/* Package Details Dialog */}
      <Dialog open={isPackageDetailOpen} onOpenChange={setIsPackageDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Package{" "}
              {packageDetailType === "ingredients"
                ? "Ingredients"
                : "Menu Items"}
            </DialogTitle>
            <DialogDescription>
              {packageDetailType === "ingredients"
                ? "List of ingredients required for this package"
                : "List of menu items included in this package"}
            </DialogDescription>
          </DialogHeader>
          {selectedPackageDetails && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    {packageDetailType === "ingredients" && (
                      <TableHead>Unit</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packageDetailType === "ingredients"
                    ? selectedPackageDetails.ingredients.map((ingredient) => (
                        <TableRow key={ingredient.id}>
                          <TableCell>{ingredient.name}</TableCell>
                          <TableCell>{ingredient.qty}</TableCell>
                          <TableCell>{ingredient.unit}</TableCell>
                        </TableRow>
                      ))
                    : selectedPackageDetails.menus.map((menu) => (
                        <TableRow key={menu.id}>
                          <TableCell>{menu.name}</TableCell>
                          <TableCell>{menu.qty}</TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Orders;
