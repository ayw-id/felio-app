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
import Container from "@/components/ui/Container";
import Overview from "@/components/accounting/Overview";
import Transactions from "@/components/accounting/Transactions";

export interface Transaction {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  invoice?: string;
  status: "completed" | "pending";
}

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2024-01-15",
      type: "income",
      category: "Food Sales",
      description: "Wedding catering service",
      amount: 2500.0,
      invoice: "INV-001",
      status: "completed",
    },
    {
      id: "2",
      date: "2024-01-14",
      type: "expense",
      category: "Raw Materials",
      description: "Chicken and vegetables purchase",
      amount: 450.0,
      invoice: "EXP-001",
      status: "completed",
    },
  ]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || transaction.type === typeFilter;
    const matchesCategory =
      !categoryFilter || transaction.category === categoryFilter;
    const matchesDate = !dateFilter || transaction.date >= dateFilter;
    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  return (
    <Container
      title={"Accounting & Reports"}
      subTitle={"View financial reports and analytics"}
    >
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Daftar Transaksi</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Overview filteredTransactions={filteredTransactions} />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Transactions
              filteredTransactions={filteredTransactions}
              transactions={transactions}
              setTransactions={setTransactions}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default Accounting;
