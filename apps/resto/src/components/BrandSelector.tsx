import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Plus, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResto } from "@/contexts/RestoContext";

const BrandSelector = () => {
  const { toast } = useToast();
  const { brands, selectedBrand, updateSelectedBrand } = useResto();

  const [newBrand, setNewBrand] = useState({
    name: "",
    description: "",
  });

  const selectedBrandData = brands.find(
    (brand) => brand.id === selectedBrand?.id
  );

  const onBrandChange = (idBrand: string) => {
    const brand = brands.find((b) => b.id === idBrand);
    if (brand) {
      updateSelectedBrand(brand);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex items-center gap-2 shrink-0">
        <Building2 className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium">Brand:</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
        <select
          value={selectedBrand?.id || ""}
          onChange={(e) => onBrandChange(e.target.value)}
          className="px-3 py-1 border rounded-md bg-white w-full sm:min-w-[200px] sm:max-w-[250px]"
        >
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BrandSelector;
