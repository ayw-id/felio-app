import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Container from "@/components/ui/Container";
import Overview from "@/components/accounting/Overview";

interface TransactionsProps {
  filteredTransactions: Transaction[];
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  searchTerm: string;
  setSearchTerm: (search: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({
  filteredTransactions,
  transactions,
  setTransactions,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter,
  searchTerm,
  setSearchTerm,
}) => {
  const { toast } = useToast();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    type: "income" as "income" | "expense",
    category: "",
    description: "",
    amount: 0,
    invoice: "",
  });

  const categories = {
    income: [
      "Food Sales",
      "Catering Services",
      "Event Packages",
      "Other Income",
    ],
    expense: [
      "Raw Materials",
      "Equipment",
      "Utilities",
      "Staff Wages",
      "Other Expenses",
    ],
  };

  const handleAddTransaction = () => {
    if (
      !newTransaction.category ||
      !newTransaction.description ||
      !newTransaction.amount
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      ...newTransaction,
      status: "completed",
    };

    setTransactions([...transactions, transaction]);
    setNewTransaction({
      type: "income",
      category: "",
      description: "",
      amount: 0,
      invoice: "",
    });
    setIsAddTransactionOpen(false);

    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
  };

  const exportTransactions = () => {
    const csvContent = [
      [
        "Date",
        "Type",
        "Category",
        "Description",
        "Amount",
        "Invoice",
        "Status",
      ],
      ...filteredTransactions.map((t) => [
        t.date,
        t.type,
        t.category,
        t.description,
        t.amount.toString(),
        t.invoice || "",
        t.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Transactions exported successfully",
    });
  };

  return (
    <>
      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[250px]"
            />
          </div>
          <select
            className="p-2 border rounded-md"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="p-2 border rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...categories.income, ...categories.expense].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog
            open={isAddTransactionOpen}
            onOpenChange={setIsAddTransactionOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Record a new financial transaction.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transactionType">Type</Label>
                    <select
                      id="transactionType"
                      className="w-full p-2 border rounded-md"
                      value={newTransaction.type}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          type: e.target.value as "income" | "expense",
                        })
                      }
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="transactionCategory">Category</Label>
                    <select
                      id="transactionCategory"
                      className="w-full p-2 border rounded-md"
                      value={newTransaction.category}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">Select category</option>
                      {categories[newTransaction.type].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="transactionDescription">Description</Label>
                    <Input
                      id="transactionDescription"
                      value={newTransaction.description}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="transactionAmount">Amount ($)</Label>
                    <Input
                      id="transactionAmount"
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          amount: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="transactionInvoice">
                      Invoice Number (Optional)
                    </Label>
                    <Input
                      id="transactionInvoice"
                      value={newTransaction.invoice}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          invoice: e.target.value,
                        })
                      }
                      placeholder="INV-001"
                    />
                  </div>
                  <Button onClick={handleAddTransaction} className="w-full">
                    Add Transaction
                  </Button>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "income"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.invoice || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Transactions;
