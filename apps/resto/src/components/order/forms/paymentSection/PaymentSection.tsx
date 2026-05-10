import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstallmentDetails from "./InstallmentDetails";
import PaymentSummary from "./PaymentSummary";
import { CustomerOrder } from "src/pages/Orders";
import { getAmount } from "@/lib/utils";

interface PaymentSectionProps {
  order: CustomerOrder;
  updatePaidAmount: (amount?: number) => void;
  updateInstallmentCount: (count: number) => void;
  onInstallmentAmountChanged: (index: number, amount?: number) => void;
  onInstallmentDateChange: (index: number, date: Date) => void;
}

export const calculateTotal = (order: CustomerOrder) => {
  let total = 0;

  if (order?.selectedItems?.length) {
    order.selectedItems.forEach((item) => {
      if (item) {
        total += item.price * item.qty;
      }
    });
  }
  return total;
};

const PaymentSection: React.FC<PaymentSectionProps> = ({
  order,
  updatePaidAmount,
  updateInstallmentCount,
  onInstallmentAmountChanged,
  onInstallmentDateChange,
}) => {
  const total = calculateTotal(order);
  return (
    <section className="space-y-4">
      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Total Amount</Label>
          <div className="text-2xl font-bold text-green-600">
            Rp.{isNaN(total) ? 0 : getAmount(total)}
          </div>
        </div>
        <div>
          <Label htmlFor="paidAmount">First Payment (Rp.)</Label>
          <Input
            id="paidAmount"
            type="number"
            step="0.01"
            value={order.paidAmount !== undefined ? order.paidAmount + "" : ""}
            onChange={(e) => {
              const val = e.target.value;
              const value = Number(val);
              if (val === "") {
                updatePaidAmount();
              } else if (!isNaN(value)) {
                updatePaidAmount(value);
              }
            }}
          />
        </div>
      </div>

      {/* Installment count selector */}
      <div>
        <Label htmlFor="installmentCount">Number of Installments</Label>
        <select
          id="installmentCount"
          className="w-full p-2 border rounded-md"
          value={order.installmentCount}
          onChange={(e) => updateInstallmentCount(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 6].map((n) => (
            <option key={n} value={n}>
              {n === 1 ? "1 (Full Payment)" : `${n} Installments`}
            </option>
          ))}
        </select>
      </div>

      {/* Conditional details */}
      {order.installmentCount > 1 && (
        <>
          <InstallmentDetails
            order={order}
            count={order.installmentCount}
            paidAmount={order.paidAmount}
            installments={order.installments}
            onAmountChange={onInstallmentAmountChanged}
            onDateChange={onInstallmentDateChange}
            // update={update}
          />
          {/*<PaymentSummary order={order} total={total} />*/}
        </>
      )}
    </section>
  );
};

export default PaymentSection;
