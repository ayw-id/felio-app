import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Employee } from "src/pages/Staff";

interface Props {
  employees: Employee[];
  onView: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}
const EmployeeTable: React.FC<Props> = ({
  employees,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Posisi</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tindakan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((emp) => (
          <TableRow key={emp.id}>
            <TableCell className="font-medium">{emp.name}</TableCell>
            <TableCell>
              {emp.role === "admin"
                ? "Admin"
                : emp.role === "admin_brand"
                ? "Admin Brand"
                : emp.role === "admin_branch"
                ? "Admin Cabang"
                : "User"}
            </TableCell>
            <TableCell>{emp.email}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(emp)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(emp)}>
                  <Edit className="w-4 h-4" />
                </Button>
                {emp.role !== "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(emp)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
export default EmployeeTable;
