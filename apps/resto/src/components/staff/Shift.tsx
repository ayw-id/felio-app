import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  startDate: string;
  salary: number;
  status: "active" | "inactive";
  address: string;
  emergencyContact: string;
}

interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  position: string;
  notes?: string;
  status: "scheduled" | "completed" | "missed";
}

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "supervisor";
  permissions: string[];
  lastLogin: string;
  status: "active" | "inactive";
}

const Shift = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isViewEmployeeOpen, setIsViewEmployeeOpen] = useState(false);
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [isEditShiftOpen, setIsEditShiftOpen] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      position: "Head Chef",
      department: "Kitchen",
      startDate: "2023-01-15",
      salary: 5000,
      status: "active",
      address: "123 Main St, City",
      emergencyContact: "+1987654321",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      position: "Server",
      department: "Service",
      startDate: "2023-03-20",
      salary: 2500,
      status: "active",
      address: "456 Oak Ave, City",
      emergencyContact: "+1987654322",
    },
  ]);

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      date: "2024-01-20",
      startTime: "08:00",
      endTime: "16:00",
      position: "Head Chef",
      status: "scheduled",
    },
    {
      id: "2",
      employeeId: "2",
      employeeName: "Jane Smith",
      date: "2024-01-20",
      startTime: "12:00",
      endTime: "20:00",
      position: "Server",
      status: "completed",
    },
  ]);

  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "owner",
      permissions: ["all"],
      lastLogin: "2024-01-19",
      status: "active",
    },
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    salary: 0,
    address: "",
    emergencyContact: "",
  });

  const [editEmployeeData, setEditEmployeeData] = useState<Employee | null>(
    null
  );

  const [newShift, setNewShift] = useState({
    employeeId: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  const [editShiftData, setEditShiftData] = useState<Shift | null>(null);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "manager" as "owner" | "manager" | "supervisor",
    permissions: [] as string[],
  });

  const [editAdminData, setEditAdminData] = useState<Admin | null>(null);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.position) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      ...newEmployee,
      startDate: new Date().toISOString().split("T")[0],
      status: "active",
    };

    setEmployees([...employees, employee]);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      salary: 0,
      address: "",
      emergencyContact: "",
    });
    setIsAddEmployeeOpen(false);

    toast({
      title: "Success",
      description: "Employee added successfully",
    });
  };

  const handleEditEmployee = () => {
    if (!editEmployeeData) return;

    const updatedEmployees = employees.map((emp) =>
      emp.id === editEmployeeData.id ? editEmployeeData : emp
    );

    setEmployees(updatedEmployees);
    setIsEditEmployeeOpen(false);
    setEditEmployeeData(null);

    toast({
      title: "Success",
      description: "Employee updated successfully",
    });
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewEmployeeOpen(true);
  };

  const openEditEmployee = (employee: Employee) => {
    setEditEmployeeData({ ...employee });
    setIsEditEmployeeOpen(true);
  };

  const handleAddShift = () => {
    if (
      !newShift.employeeId ||
      !newShift.date ||
      !newShift.startTime ||
      !newShift.endTime
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const employee = employees.find((emp) => emp.id === newShift.employeeId);
    if (!employee) return;

    const shift: Shift = {
      id: Date.now().toString(),
      ...newShift,
      employeeName: employee.name,
      position: employee.position,
      status: "scheduled",
    };

    setShifts([...shifts, shift]);
    setNewShift({
      employeeId: "",
      date: "",
      startTime: "",
      endTime: "",
      notes: "",
    });
    setIsAddShiftOpen(false);

    toast({
      title: "Success",
      description: "Shift scheduled successfully",
    });
  };

  const handleEditShift = () => {
    if (!editShiftData) return;

    const updatedShifts = shifts.map((shift) =>
      shift.id === editShiftData.id ? editShiftData : shift
    );

    setShifts(updatedShifts);
    setIsEditShiftOpen(false);
    setEditShiftData(null);

    toast({
      title: "Success",
      description: "Shift updated successfully",
    });
  };

  const openEditShift = (shift: Shift) => {
    setEditShiftData({ ...shift });
    setIsEditShiftOpen(true);
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const admin: Admin = {
      id: Date.now().toString(),
      ...newAdmin,
      lastLogin: "Never",
      status: "active",
    };

    setAdmins([...admins, admin]);
    setNewAdmin({
      name: "",
      email: "",
      role: "manager",
      permissions: [],
    });
    setIsAddAdminOpen(false);

    toast({
      title: "Success",
      description: "Admin added successfully",
    });
  };

  const handleEditAdmin = () => {
    if (!editAdminData) return;

    const updatedAdmins = admins.map((admin) =>
      admin.id === editAdminData.id ? editAdminData : admin
    );

    setAdmins(updatedAdmins);
    setIsEditAdminOpen(false);
    setEditAdminData(null);

    toast({
      title: "Success",
      description: "Admin updated successfully",
    });
  };

  const openEditAdmin = (admin: Admin) => {
    setEditAdminData({ ...admin });
    setIsEditAdminOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Staff Management
          </h1>
          <p className="text-gray-600">
            Manage employees, shifts, and administrators
          </p>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>
                Manage your restaurant staff and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="employees" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="employees">Employees</TabsTrigger>
                  <TabsTrigger value="shifts">Shifts</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="employees" className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Dialog
                      open={isAddEmployeeOpen}
                      onOpenChange={setIsAddEmployeeOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Employee
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Employee</DialogTitle>
                          <DialogDescription>
                            Enter employee details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={newEmployee.name}
                              onChange={(e) =>
                                setNewEmployee({
                                  ...newEmployee,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newEmployee.email}
                              onChange={(e) =>
                                setNewEmployee({
                                  ...newEmployee,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={newEmployee.phone}
                              onChange={(e) =>
                                setNewEmployee({
                                  ...newEmployee,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="position">Position</Label>
                            <Input
                              id="position"
                              value={newEmployee.position}
                              onChange={(e) =>
                                setNewEmployee({
                                  ...newEmployee,
                                  position: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="department">Department</Label>
                            <Input
                              id="department"
                              value={newEmployee.department}
                              onChange={(e) =>
                                setNewEmployee({
                                  ...newEmployee,
                                  department: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="salary">Salary</Label>
                            <Input
                              id="salary"
                              type="number"
                              value={newEmployee.salary}
                              onChange={(e) =>
                                setNewEmployee({
                                  ...newEmployee,
                                  salary: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsAddEmployeeOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleAddEmployee}>
                              Add Employee
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">
                              {employee.name}
                            </TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  employee.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {employee.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewEmployee(employee)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditEmployee(employee)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* View Employee Dialog */}
                  <Dialog
                    open={isViewEmployeeOpen}
                    onOpenChange={setIsViewEmployeeOpen}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Employee Details</DialogTitle>
                      </DialogHeader>
                      {selectedEmployee && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Name</Label>
                              <p className="text-sm text-gray-600">
                                {selectedEmployee.name}
                              </p>
                            </div>
                            <div>
                              <Label>Position</Label>
                              <p className="text-sm text-gray-600">
                                {selectedEmployee.position}
                              </p>
                            </div>
                            <div>
                              <Label>Department</Label>
                              <p className="text-sm text-gray-600">
                                {selectedEmployee.department}
                              </p>
                            </div>
                            <div>
                              <Label>Email</Label>
                              <p className="text-sm text-gray-600">
                                {selectedEmployee.email}
                              </p>
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <p className="text-sm text-gray-600">
                                {selectedEmployee.phone}
                              </p>
                            </div>
                            <div>
                              <Label>Salary</Label>
                              <p className="text-sm text-gray-600">
                                ${selectedEmployee.salary}
                              </p>
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <p className="text-sm text-gray-600">
                                {selectedEmployee.startDate}
                              </p>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Badge
                                variant={
                                  selectedEmployee.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {selectedEmployee.status}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label>Address</Label>
                            <p className="text-sm text-gray-600">
                              {selectedEmployee.address}
                            </p>
                          </div>
                          <div>
                            <Label>Emergency Contact</Label>
                            <p className="text-sm text-gray-600">
                              {selectedEmployee.emergencyContact}
                            </p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Edit Employee Dialog */}
                  <Dialog
                    open={isEditEmployeeOpen}
                    onOpenChange={setIsEditEmployeeOpen}
                  >
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                      </DialogHeader>
                      {editEmployeeData && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="editName">Name</Label>
                            <Input
                              id="editName"
                              value={editEmployeeData.name}
                              onChange={(e) =>
                                setEditEmployeeData({
                                  ...editEmployeeData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="editEmail">Email</Label>
                            <Input
                              id="editEmail"
                              type="email"
                              value={editEmployeeData.email}
                              onChange={(e) =>
                                setEditEmployeeData({
                                  ...editEmployeeData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="editPhone">Phone</Label>
                            <Input
                              id="editPhone"
                              value={editEmployeeData.phone}
                              onChange={(e) =>
                                setEditEmployeeData({
                                  ...editEmployeeData,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="editPosition">Position</Label>
                            <Input
                              id="editPosition"
                              value={editEmployeeData.position}
                              onChange={(e) =>
                                setEditEmployeeData({
                                  ...editEmployeeData,
                                  position: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="editSalary">Salary</Label>
                            <Input
                              id="editSalary"
                              type="number"
                              value={editEmployeeData.salary}
                              onChange={(e) =>
                                setEditEmployeeData({
                                  ...editEmployeeData,
                                  salary: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="editStatus">Status</Label>
                            <Select
                              value={editEmployeeData.status}
                              onValueChange={(value: "active" | "inactive") =>
                                setEditEmployeeData({
                                  ...editEmployeeData,
                                  status: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsEditEmployeeOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleEditEmployee}>
                              Update Employee
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                <TabsContent value="shifts" className="space-y-6">
                  <div className="flex justify-end">
                    <Dialog
                      open={isAddShiftOpen}
                      onOpenChange={setIsAddShiftOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Schedule Shift
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule New Shift</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="employee">Employee</Label>
                            <Select
                              value={newShift.employeeId}
                              onValueChange={(value) =>
                                setNewShift({ ...newShift, employeeId: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select employee" />
                              </SelectTrigger>
                              <SelectContent>
                                {employees.map((emp) => (
                                  <SelectItem key={emp.id} value={emp.id}>
                                    {emp.name} - {emp.position}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="shiftDate">Date</Label>
                            <Input
                              id="shiftDate"
                              type="date"
                              value={newShift.date}
                              onChange={(e) =>
                                setNewShift({
                                  ...newShift,
                                  date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="startTime">Start Time</Label>
                              <Input
                                id="startTime"
                                type="time"
                                value={newShift.startTime}
                                onChange={(e) =>
                                  setNewShift({
                                    ...newShift,
                                    startTime: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="endTime">End Time</Label>
                              <Input
                                id="endTime"
                                type="time"
                                value={newShift.endTime}
                                onChange={(e) =>
                                  setNewShift({
                                    ...newShift,
                                    endTime: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="shiftNotes">Notes</Label>
                            <Textarea
                              id="shiftNotes"
                              value={newShift.notes}
                              onChange={(e) =>
                                setNewShift({
                                  ...newShift,
                                  notes: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsAddShiftOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleAddShift}>
                              Schedule Shift
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shifts.map((shift) => (
                          <TableRow key={shift.id}>
                            <TableCell className="font-medium">
                              {shift.employeeName}
                            </TableCell>
                            <TableCell>{shift.date}</TableCell>
                            <TableCell>
                              {shift.startTime} - {shift.endTime}
                            </TableCell>
                            <TableCell>{shift.position}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  shift.status === "completed"
                                    ? "default"
                                    : shift.status === "scheduled"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {shift.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditShift(shift)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Edit Shift Dialog */}
                  <Dialog
                    open={isEditShiftOpen}
                    onOpenChange={setIsEditShiftOpen}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Shift</DialogTitle>
                      </DialogHeader>
                      {editShiftData && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="editShiftDate">Date</Label>
                            <Input
                              id="editShiftDate"
                              type="date"
                              value={editShiftData.date}
                              onChange={(e) =>
                                setEditShiftData({
                                  ...editShiftData,
                                  date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="editStartTime">Start Time</Label>
                              <Input
                                id="editStartTime"
                                type="time"
                                value={editShiftData.startTime}
                                onChange={(e) =>
                                  setEditShiftData({
                                    ...editShiftData,
                                    startTime: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="editEndTime">End Time</Label>
                              <Input
                                id="editEndTime"
                                type="time"
                                value={editShiftData.endTime}
                                onChange={(e) =>
                                  setEditShiftData({
                                    ...editShiftData,
                                    endTime: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="editShiftStatus">Status</Label>
                            <Select
                              value={editShiftData.status}
                              onValueChange={(
                                value: "scheduled" | "completed" | "missed"
                              ) =>
                                setEditShiftData({
                                  ...editShiftData,
                                  status: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">
                                  Scheduled
                                </SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                                <SelectItem value="missed">Missed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="editShiftNotes">Notes</Label>
                            <Textarea
                              id="editShiftNotes"
                              value={editShiftData.notes || ""}
                              onChange={(e) =>
                                setEditShiftData({
                                  ...editShiftData,
                                  notes: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsEditShiftOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleEditShift}>
                              Update Shift
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                <TabsContent value="admin" className="space-y-6">
                  <div className="flex justify-end">
                    <Dialog
                      open={isAddAdminOpen}
                      onOpenChange={setIsAddAdminOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Admin
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Admin</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="adminName">Name</Label>
                            <Input
                              id="adminName"
                              value={newAdmin.name}
                              onChange={(e) =>
                                setNewAdmin({
                                  ...newAdmin,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="adminEmail">Email</Label>
                            <Input
                              id="adminEmail"
                              type="email"
                              value={newAdmin.email}
                              onChange={(e) =>
                                setNewAdmin({
                                  ...newAdmin,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="adminRole">Role</Label>
                            <Select
                              value={newAdmin.role}
                              onValueChange={(
                                value: "owner" | "manager" | "supervisor"
                              ) => setNewAdmin({ ...newAdmin, role: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="supervisor">
                                  Supervisor
                                </SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsAddAdminOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleAddAdmin}>Add Admin</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {admins.map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell className="font-medium">
                              {admin.name}
                            </TableCell>
                            <TableCell>{admin.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{admin.role}</Badge>
                            </TableCell>
                            <TableCell>{admin.lastLogin}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  admin.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {admin.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditAdmin(admin)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Edit Admin Dialog */}
                  <Dialog
                    open={isEditAdminOpen}
                    onOpenChange={setIsEditAdminOpen}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Admin</DialogTitle>
                      </DialogHeader>
                      {editAdminData && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="editAdminName">Name</Label>
                            <Input
                              id="editAdminName"
                              value={editAdminData.name}
                              onChange={(e) =>
                                setEditAdminData({
                                  ...editAdminData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="editAdminEmail">Email</Label>
                            <Input
                              id="editAdminEmail"
                              type="email"
                              value={editAdminData.email}
                              onChange={(e) =>
                                setEditAdminData({
                                  ...editAdminData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="editAdminRole">Role</Label>
                            <Select
                              value={editAdminData.role}
                              onValueChange={(
                                value: "owner" | "manager" | "supervisor"
                              ) =>
                                setEditAdminData({
                                  ...editAdminData,
                                  role: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="supervisor">
                                  Supervisor
                                </SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="editAdminStatus">Status</Label>
                            <Select
                              value={editAdminData.status}
                              onValueChange={(value: "active" | "inactive") =>
                                setEditAdminData({
                                  ...editAdminData,
                                  status: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsEditAdminOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleEditAdmin}>
                              Update Admin
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shift;
