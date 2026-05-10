import { useState } from "react";
import { ArrowUp, ArrowDown, Search, Filter, Download } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAmount } from "@/utils/product";

// Sample transaction data
interface Transaction {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
  };
  productId: string;
  productTitle: string;
  amount: number;
  status: "completed" | "pending" | "refunded";
  paymentMethod: string;
}

const transactionsData: Transaction[] = [];

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter transactions based on search query and active tab
  const filteredTransactions = transactionsData.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customer.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.customer.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.productTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "completed" && transaction.status === "completed") ||
      (activeTab === "pending" && transaction.status === "pending") ||
      (activeTab === "refunded" && transaction.status === "refunded");

    return matchesSearch && matchesStatus;
  });

  // Calculate total revenue, pending, and refunded amounts
  // const totalRevenue = transactionsData
  //   .filter((t) => t.status === "completed")
  //   .reduce((sum, transaction) => sum + transaction.amount, 0);

  // const pendingAmount = transactionsData
  //   .filter((t) => t.status === "pending")
  //   .reduce((sum, transaction) => sum + transaction.amount, 0);

  // const refundedAmount = transactionsData
  //   .filter((t) => t.status === "refunded")
  //   .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalRevenue = 0;
  const pendingAmount = 0;
  const refundedAmount = 0;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Get status badge class
  const getStatusBadgeClass = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "refunded":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transaksi</h1>
          <p className="text-muted-foreground">
            Pantau riwayat penjualan dan pembayaran Anda
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  Rp. {getAmount(totalRevenue)}
                </div>
                <div className="text-green-600 flex items-center text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  0.0%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  Rp{getAmount(pendingAmount)}
                </div>
                <div className="text-yellow-600 flex items-center text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  0.0%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Refunded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  Rp{getAmount(refundedAmount)}
                </div>
                <div className="text-red-600 flex items-center text-sm">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  0.0%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Transaksi ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Tanggal
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Pembeli
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Produk
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Jumlah
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Pembayaran
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium">{transaction.id}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {transaction.customer.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.customer.email}
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate">
                        {transaction.productTitle}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            transaction.status
                          )}`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {transaction.paymentMethod}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Transactions;
