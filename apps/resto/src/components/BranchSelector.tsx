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
import { MapPin, Plus, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResto } from "@/contexts/RestoContext";

const BranchSelector = () => {
  const { toast } = useToast();
  const { branches, selectedBranch, updateSelectedBranch } = useResto();

  const onBranchChange = (idBranch: string) => {
    const branch = branches.find((b) => b.id === idBranch);
    if (branch) {
      updateSelectedBranch(branch);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex items-center gap-2 shrink-0">
        <Building className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium">Branch:</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
        <select
          value={selectedBranch?.id || ""}
          onChange={(e) => onBranchChange(e.target.value)}
          className="px-3 py-1 border rounded-md bg-white w-full sm:min-w-[200px] sm:max-w-[250px]"
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BranchSelector;
