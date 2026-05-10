import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Transaction } from "src/pages/Accounting";

interface OverviewProps {
  filteredTransactions: Transaction[];
}

const Overview: React.FC<OverviewProps> = ({ filteredTransactions }) => {
  const [dateFilter, setDateFilter] = useState("");

  const setDateRange = (range: string) => {
    const today = new Date();
    let startDate = "";

    switch (range) {
      case "today":
        startDate = today.toISOString().split("T")[0];
        break;
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString().split("T")[0];
        break;
      case "month":
        const monthAgo = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );
        startDate = monthAgo.toISOString().split("T")[0];
        break;
      case "year":
        const yearAgo = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        startDate = yearAgo.toISOString().split("T")[0];
        break;
    }

    setDateFilter(startDate);
  };

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  return (
    <>
      {/* Date Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Date Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="dateInput">Start Date</Label>
              <Input
                id="dateInput"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange("today")}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange("week")}
              >
                This Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange("month")}
              >
                This Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange("year")}
              >
                This Year
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateFilter("")}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Income
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Profit
            </CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                netProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${netProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Overview;
