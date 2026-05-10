import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { EmployeeManager, Shift, AdminComponent } from "@/components/staff";
import Container from "@/components/ui/Container";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  startDate: string;
  status: "active" | "inactive";
  address: string;
}

// interface Shift {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   position: string;
//   notes?: string;
//   status: "scheduled" | "completed" | "missed";
// }

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "supervisor";
  permissions: string[];
  lastLogin: string;
}

const Staff = () => {
  const { toast } = useToast();

  return (
    <Container
      title={"Staff Management"}
      subTitle={"Kelola karyawan dan administratis"}
    >
      <div className="space-y-6">
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employees">Karyawan</TabsTrigger>
            {/*<TabsTrigger value="shifts">Shifts</TabsTrigger>*/}
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6">
            <EmployeeManager />
          </TabsContent>

          <TabsContent value="shifts" className="space-y-6">
            <Shift />
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <AdminComponent />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default Staff;
