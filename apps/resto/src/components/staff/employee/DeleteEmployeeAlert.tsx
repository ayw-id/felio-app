import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { Employee } from "src/pages/Staff";

type Scope = "all" | "brand" | "branch";

interface DeleteEmployeeAlertProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onConfirmDelete: (employeeId: string, scope: Scope) => void;
}

const DeleteEmployeeAlert: React.FC<DeleteEmployeeAlertProps> = ({
  open,
  onClose,
  employee,
  onConfirmDelete,
}) => {
  const [scope, setScope] = useState<Scope>("branch");

  if (!employee) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Employee</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{employee.name}</strong>?
            <br />
            This action cannot be undone. Their shifts and admin privileges will
            be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Scope selector */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Delete Scope</label>
          <Select value={scope} onValueChange={(val) => setScope(val as Scope)}>
            <SelectTrigger>
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All (Global)</SelectItem>
              <SelectItem value="brand">Current Brand</SelectItem>
              <SelectItem value="branch">Current Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirmDelete(employee.id, scope);
              onClose();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEmployeeAlert;
