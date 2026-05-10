import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomerSection from "./forms/CustomerSection";
import EventDetailsSection from "./forms/EventDetailsSection";
import ItemsSection from "./forms/ItemsSection/ItemsSection";
import PaymentSection from "./forms/PaymentSection/PaymentSection";
import OrderSummary from "./OrderSummary";
import OrderPaymentForm from "./OrderPaymentForm";
import { CustomerOrder, Customer, MenuItem } from "src/pages/Orders";
import SelectedItemsCard from "./forms/itemsSection/SelectedItemsCard";
import { calculateTotal } from "@/components/order/forms/paymentSection/PaymentSection";
import { EventType } from "@/hooks/useEvent";

interface UpdateOrder {
  customerType?: "existing" | "new";
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  eventDate?: string;
  eventType?: string;
}

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (param: boolean) => void;
  mode: "create" | "edit" | "detail";
  order: CustomerOrder;
  setOrder: (data: CustomerOrder) => void;
  customers: Customer[];
  menuItems: MenuItem[];
  onSave: () => void;
  onEdit: () => void;
  onPayment: () => void;
  showPackageDetails: () => void;
  handleChangeOrderStatus: (
    idOrder: string,
    status: "confirmed" | "delivered" | "cancelled"
  ) => void;
  eventTypes: EventType[];
  eventLocations: EventType[];
}

const generateDefaultDueDates = (index: number) => {
  const dueDates: { [installmentNumber: number]: Date } = {};
  const baseDate = new Date();

  const dueDate = new Date(baseDate);
  dueDate.setDate(baseDate.getDate() + 7 * (index + 1)); // Weekly intervals

  return dueDate;
};

const OrderDialog: React.FC<OrderDialogProps> = ({
  open,
  onOpenChange,
  mode = "create", // "create" | "detail"
  order,
  setOrder,
  customers,
  menuItems,
  onSave,
  onEdit,
  onPayment,
  showPackageDetails,
  handleChangeOrderStatus,
  eventTypes,
  eventLocations,
}) => {
  const isViewMode = mode === "detail";
  const isEditMode = mode === "edit";

  const onOrderChanged = (data: UpdateOrder) => {
    setOrder({
      ...order,
      ...data,
    });
  };

  const onAddSelectedItems = () => {
    setOrder({
      ...order,
      selectedItems: [null, ...order.selectedItems],
    });
  };

  const onUpdateItem = (
    index: number,
    code: string,
    qty?: number,
    price?: number
  ) => {
    const selectedItems = JSON.parse(JSON.stringify(order.selectedItems));
    const selectedMenuItem = menuItems.find((item) => item.code === code);
    if (selectedItems[index]) {
      const isItemChanged = selectedItems[index].code !== code;
      const isQtyChanged = selectedItems[index].qty !== qty;

      if (isItemChanged) {
        // item changed
        selectedItems[index].price = selectedMenuItem?.price;
      } else if (!isQtyChanged) {
        // price changed
        selectedItems[index].price = price;
      } else {
        // qty changed
      }
      if (isItemChanged) {
        selectedItems[index].id = undefined;
      }
      selectedItems[index].type = selectedMenuItem?.type;
      selectedItems[index].idItem = selectedMenuItem?.idItem;
      selectedItems[index].code = code;
      selectedItems[index].qty = qty;
    } else {
      selectedItems[index] = {
        idItem: selectedMenuItem?.idItem,
        code,
        type: selectedMenuItem?.type,
        qty,
        price: price !== undefined ? price : selectedMenuItem?.price,
      };
    }

    const isPackage = selectedMenuItem?.type === "package";
    if (isPackage && selectedMenuItem?.packageDetails) {
      const packageDetails = JSON.parse(
        JSON.stringify(selectedMenuItem.packageDetails)
      );
      const menus = packageDetails?.menus?.map((menu) => {
        return {
          ...menu,
          qty: (qty || 0) * menu.qty,
        };
      });
      packageDetails.menus = menus;
      const ingredients = packageDetails?.ingredients?.map((ingredient) => {
        return {
          ...ingredient,
          qty: (qty || 0) * ingredient.qty,
        };
      });
      packageDetails.ingredients = ingredients;
      selectedItems[index].packageDetails = packageDetails;
    } else if (selectedMenuItem?.menuDetails) {
      const menuDetails = JSON.parse(
        JSON.stringify(selectedMenuItem.menuDetails)
      );
      const ingredients = menuDetails?.ingredients?.map((ingredient) => {
        return {
          ...ingredient,
          qty: (qty || 0) * ingredient.qty,
        };
      });
      menuDetails.ingredients = ingredients;
      selectedItems[index].menuDetails = menuDetails;
    }

    if (order.installmentCount > 1) {
      updateInstallmentCount(order.installmentCount, {
        ...order,
        selectedItems,
      });
    } else {
      setOrder({
        ...order,
        selectedItems,
      });
    }
  };

  const onUpdateMenuQuantity = (
    index: number,
    idMenu: string,
    qty?: number
  ) => {
    const selectedItems = JSON.parse(JSON.stringify(order.selectedItems));
    const indexMenu = selectedItems[index].packageDetails?.menus.findIndex(
      (menu) => menu.id === idMenu
    );

    if (indexMenu >= 0) {
      selectedItems[index].packageDetails.menus[indexMenu].qty = qty;
    }

    setOrder({
      ...order,
      selectedItems,
    });
  };

  const onUpdateIngredientQuantity = (
    index: number,
    idIngredient: string,
    qty?: number
  ) => {
    const selectedItems = JSON.parse(JSON.stringify(order.selectedItems));
    let itemDetails =
      selectedItems[index].type === "package"
        ? selectedItems[index].packageDetails
        : selectedItems[index].menuDetails;
    const indexIngredient = itemDetails?.ingredients.findIndex(
      (ingredient) => ingredient.id === idIngredient
    );

    if (indexIngredient >= 0) {
      itemDetails.ingredients[indexIngredient].qty = parseFloat(qty);
    }

    if (selectedItems[index].type === "package") {
      selectedItems[index].packageDetails = itemDetails;
    } else {
      selectedItems[index].menuDetails = itemDetails;
    }

    setOrder({
      ...order,
      selectedItems,
    });
  };

  const onRemoveItem = (index: number) => {
    const selectedItems = JSON.parse(JSON.stringify(order.selectedItems));
    const selectedItemsToDelete = order.selectedItemsToDelete || [];
    if (order.selectedItems[index]?.id) {
      selectedItemsToDelete.push(order.selectedItems[index].id);
    }
    selectedItems.splice(index, 1);
    setOrder({
      ...order,
      selectedItems,
      selectedItemsToDelete,
    });
  };

  const updatePaidAmount = (paidAmount?: number) => {
    const total = calculateTotal(order);
    if (paidAmount !== undefined && paidAmount > total) {
      paidAmount = total;
    }
    if (order.installmentCount > 1) {
      updateInstallmentCount(order.installmentCount, {
        ...order,
        paidAmount,
      });
    } else {
      setOrder({
        ...order,
        paidAmount,
      });
    }
  };

  const updateInstallmentCount = (
    installmentCount: number,
    newOrder?: CustomerOrder
  ) => {
    const installments = [];
    const total =
      calculateTotal(newOrder || order) - ((newOrder || order).paidAmount || 0);
    const base = Math.floor(total / (installmentCount - 1));
    const remaining = total - (installmentCount - 1) * base;

    for (let a = 0; a < installmentCount - 1; a++) {
      installments.push({
        amount: base,
        dueDate: generateDefaultDueDates(a),
      });
    }

    if (installments.length) {
      installments[0].amount += remaining;
    }
    setOrder({
      ...(newOrder || order),
      installmentCount,
      installments,
    });
  };

  const onInstallmentAmountChanged = (index: number, amount?: number) => {
    const installments = JSON.parse(JSON.stringify(order.installments));
    installments[index].amount = amount;
    setOrder({
      ...order,
      installments,
    });
  };

  const onInstallmentDateChange = (index: number, date: Date) => {
    const installments = JSON.parse(JSON.stringify(order.installments));
    installments[index].dueDate = date;
    setOrder({
      ...order,
      installments,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isViewMode
              ? `Order Details - #${order?.orderNumber}`
              : isEditMode
              ? `Edit Order - #${order?.orderNumber}`
              : "Create New Customer Order"}
          </DialogTitle>
          <DialogDescription>
            {isViewMode
              ? "Complete order information and payment schedule"
              : isEditMode
              ? "Edit this catering order and update installment options"
              : "Create a new catering order with installment payment options"}
          </DialogDescription>
        </DialogHeader>

        {order && (
          <ScrollArea className="max-h-[70vh] px-1">
            <div className="space-y-6 p-1">
              {isViewMode ? (
                <OrderSummary
                  order={order}
                  onPayment={onPayment}
                  onEdit={onEdit}
                  showPackageDetails={showPackageDetails}
                  handleChangeOrderStatus={handleChangeOrderStatus}
                />
              ) : (
                <>
                  <CustomerSection
                    customers={customers}
                    order={order}
                    update={onOrderChanged}
                  />
                  <EventDetailsSection
                    order={order}
                    update={onOrderChanged}
                    eventTypes={eventTypes}
                    eventLocations={eventLocations}
                  />
                  <SelectedItemsCard
                    menuItems={menuItems}
                    order={order}
                    update={onOrderChanged}
                    onAdd={onAddSelectedItems}
                    onUpdateItem={onUpdateItem}
                    onRemove={onRemoveItem}
                    onUpdateMenuQuantity={onUpdateMenuQuantity}
                    onUpdateIngredientQuantity={onUpdateIngredientQuantity}
                  />
                  <PaymentSection
                    order={order}
                    updatePaidAmount={updatePaidAmount}
                    updateInstallmentCount={updateInstallmentCount}
                    onInstallmentAmountChanged={onInstallmentAmountChanged}
                    onInstallmentDateChange={onInstallmentDateChange}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={onSave}>
                      {isEditMode ? "Update Order" : "Create Order"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
