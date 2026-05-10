import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { getAmount } from "@/lib/utils";

interface InstallmentDetailsProps {
  count: number;
  paidAmount: number;
  onAmountChange: (index: number, amount?: number) => void;
  onDateChange: (index: number, date: Date) => void;
}

const InstallmentDetails: React.FC<InstallmentDetailsProps> = ({
  count,
  paidAmount,
  installments,
  onAmountChange,
  onDateChange,
}) => {
  if (count <= 1) return null;

  return (
    <div>
      <Label>Installment Details</Label>
      <div className="space-y-3 mt-2">
        <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
          Pembayaran pertama: Rp.{getAmount(paidAmount)}
        </div>

        {installments.map((installment, index) => {
          return (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="font-medium">
                Installment {index + 2}
                {installment.status === "paid" ? "(Telah dibayar)" : ""}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nominal (Rp)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    disabled={installment.status === "paid"}
                    value={
                      installment.amount !== undefined ? installment.amount : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      const value = Number(val);
                      if (val === "") {
                        onAmountChange(index);
                      } else if (!isNaN(value)) {
                        onAmountChange(index, value);
                      }
                    }}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label>Jatuh Tempo</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !installment.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {installment.dueDate
                          ? format(installment.dueDate, "PPP")
                          : "Pick due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={installment.dueDate}
                        onSelect={(date) => {
                          onDateChange(
                            index,
                            `${date.getFullYear()}-${
                              date.getMonth() + 1
                            }-${date.getDate()}`
                          );
                        }}
                        disabled={(date) =>
                          date < new Date() || installment.status === "paid"
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InstallmentDetails;
