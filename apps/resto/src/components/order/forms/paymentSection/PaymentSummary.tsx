export default function PaymentSummary({
  total,
  firstPayment,
  installmentsTotal,
}) {
  const remaining = total - firstPayment - installmentsTotal;
  const isBalanced = Math.abs(remaining) < 0.01;

  return (
    <div className="p-3 bg-blue-50 rounded-lg mt-4">
      <div className="text-sm font-medium mb-2">Payment Summary:</div>
      <div className="text-sm space-y-1">
        <div>Total Order: ${total.toFixed(2)}</div>
        <div>First Payment: ${firstPayment.toFixed(2)}</div>
        <div>Total Installments: ${installmentsTotal.toFixed(2)}</div>
        <div
          className={cn(
            "font-medium",
            isBalanced ? "text-green-600" : "text-red-600"
          )}
        >
          Remaining: ${remaining.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
