import { useState, useCallback } from "react";

const initial = {
  customerType: "existing",
  customerId: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  eventDate: "",
  eventType: "",
  selectedItems: [],
  firstPayment: 0,
  installmentCount: 1,
  installmentDueDates: {},
  installmentAmounts: {},
};

export default function useNewOrderState() {
  const [newOrder, set] = useState(initial);

  // All your updateXXX helper functions
  const update = useCallback((patch) => {
    set((o) => ({ ...o, ...patch }));
  }, []);

  /* … calculateTotal, addSelectedItem, updateSelectedItem, etc … */

  return {
    newOrder,
    update,
    /* expose the helpers you need in children */
  };
}
