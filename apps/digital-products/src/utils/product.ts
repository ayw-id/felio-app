import { type Product } from "@/components/dashboard/ProductCard";

export const getProductTypeLabel = (type: Product["type"]) => {
  switch (type) {
    case "ECOURSE":
      return "Online Course";
    case "EBOOK":
      return "E-Book";
    case "EVENT":
      return "Event";
    case "CONSULTATION":
      return "Consultation";
    case "DONATION":
      return "Donation";
    case "GRAPHIC_DESIGN":
      return "Graphic Design";
    case "FREELANCE":
      return "Freelancing";
    case "OTHER":
      return "Lainnya";
  }
};

export const getAmount = (amount: number, useCurrency?: boolean): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  return formatter.format(amount).replace("IDR", useCurrency ? "Rp." : "");
};
