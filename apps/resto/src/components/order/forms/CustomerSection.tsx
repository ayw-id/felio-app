import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UpdateOrder } from "../OrderDialog";

interface CustomerSectionProps {
  customers: Customer[];
  order: CustomerOrder;
  update: (params: UpdateOrder) => void;
}

const CustomerSection: React.FC<CustomerSectionProps> = ({
  customers,
  order,
  update,
}) => {
  return (
    <section>
      <Label>Customer</Label>

      <div className="space-y-4 mt-2">
        {/* selector buttons */}
        <div className="flex gap-4">
          {["existing", "new"].map((t) => (
            <Button
              key={t}
              variant={order.customerType === t ? "default" : "outline"}
              onClick={() =>
                update({
                  customerType: t,
                  customer: {
                    ...(order.customer || {}),
                    customerName: "",
                    customerPhone: "",
                    customerEmail: "",
                  },
                })
              }
            >
              {t === "existing" ? "Existing Customer" : "New Customer"}
            </Button>
          ))}
        </div>

        {order.customerType === "existing" ? (
          <select
            className="w-full p-2 border rounded-md"
            value={order?.customer?.id}
            onChange={(e) => {
              update({
                customer: {
                  ...order.customer,
                  id: e.target.value,
                },
              });
            }}
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.customerName} - {c.customerPhone}
              </option>
            ))}
          </select>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <Label htmlFor="custName">Customer Name *</Label>
              <Input
                id="custName"
                value={order.customer?.customerName}
                onChange={(e) =>
                  update({
                    customer: {
                      ...(order.customer || {}),
                      customerName: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
            {/* Phone */}
            <div>
              <Label htmlFor="custPhone">Phone *</Label>
              <Input
                id="custPhone"
                value={order.customer?.customerPhone}
                onChange={(e) =>
                  update({
                    customer: {
                      ...(order.customer || {}),
                      customerPhone: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
            {/* Email */}
            <div className="md:col-span-2">
              <Label htmlFor="custEmail">Email (Optional)</Label>
              <Input
                type="email"
                id="custEmail"
                value={order.customer?.customerEmail}
                onChange={(e) =>
                  update({
                    customer: {
                      ...(order.customer || {}),
                      customerEmail: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerSection;
