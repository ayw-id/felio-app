import { useState } from "react";
import {
  BarChart3,
  LineChart,
  PieChart,
  ArrowDown,
  ArrowRight,
  Calendar,
  Globe,
} from "lucide-react";
import Chart from "../components/dashboard/Chart";
import StatCard from "../components/dashboard/StatCard";
import PageTransition from "../components/layout/PageTransition";

// Sample data
const weeklyRevenueData = [
  { day: "Mon", revenue: 1200 },
  { day: "Tue", revenue: 1900 },
  { day: "Wed", revenue: 1500 },
  { day: "Thu", revenue: 2800 },
  { day: "Fri", revenue: 2200 },
  { day: "Sat", revenue: 1800 },
  { day: "Sun", revenue: 1100 },
];

const monthlySalesData = [
  { month: "Jan", sales: 42 },
  { month: "Feb", sales: 68 },
  { month: "Mar", sales: 55 },
  { month: "Apr", sales: 71 },
  { month: "May", sales: 89 },
  { month: "Jun", sales: 125 },
  { month: "Jul", sales: 132 },
  { month: "Aug", sales: 146 },
  { month: "Sep", sales: 169 },
  { month: "Oct", sales: 184 },
  { month: "Nov", sales: 211 },
  { month: "Dec", sales: 246 },
];

const productSalesData = [
  { name: "Courses", sales: 540 },
  { name: "E-Books", sales: 372 },
  { name: "Events", sales: 148 },
  { name: "Consultation", sales: 89 },
];

const visitorSourceData = [
  { name: "Direct", value: 35 },
  { name: "Organic Search", value: 40 },
  { name: "Social Media", value: 15 },
  { name: "Referrals", value: 10 },
];

const countriesData = [
  { name: "United States", value: 45 },
  { name: "United Kingdom", value: 15 },
  { name: "Canada", value: 12 },
  { name: "Australia", value: 8 },
  { name: "Germany", value: 6 },
  { name: "Others", value: 14 },
];

type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Track your digital store performance
          </p>
        </header>

        {/* Time Range Selector */}
        <div className="flex items-center gap-3 mb-8 subtle-card inline-flex p-1.5 rounded-lg">
          {[
            { label: "7 days", value: "7d" },
            { label: "30 days", value: "30d" },
            { label: "90 days", value: "90d" },
            { label: "1 year", value: "1y" },
            { label: "All time", value: "all" },
          ].map((range) => (
            <button
              key={range.value}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary/80"
              }`}
              onClick={() => setTimeRange(range.value as TimeRange)}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Revenue"
            value="$32,621.42"
            icon={LineChart}
            trend={{ value: 18.2, isPositive: true }}
            description={`last ${timeRange}`}
            delay={0}
          />
          <StatCard
            title="Sales"
            value="1,149"
            icon={BarChart3}
            trend={{ value: 12.5, isPositive: true }}
            description={`last ${timeRange}`}
            delay={1}
          />
          <StatCard
            title="Avg. Order Value"
            value="$82.54"
            icon={PieChart}
            trend={{ value: 3.1, isPositive: true }}
            description={`last ${timeRange}`}
            delay={2}
          />
          <StatCard
            title="Visitors"
            value="24,589"
            icon={Globe}
            trend={{ value: 5.8, isPositive: false }}
            description={`last ${timeRange}`}
            delay={3}
          />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="subtle-card p-6">
            <h2 className="text-xl font-semibold mb-6">Revenue Overview</h2>
            <Chart
              data={weeklyRevenueData}
              type="area"
              dataKey="revenue"
              xAxisDataKey="day"
              name="Revenue ($)"
              color="#111111"
              height={360}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="subtle-card p-6">
            <h2 className="text-xl font-semibold mb-6">Monthly Sales</h2>
            <Chart
              data={monthlySalesData}
              type="bar"
              dataKey="sales"
              xAxisDataKey="month"
              name="Sales"
              color="#111111"
              height={300}
            />
          </div>

          <div className="subtle-card p-6">
            <h2 className="text-xl font-semibold mb-6">
              Sales by Product Type
            </h2>
            <Chart
              data={productSalesData}
              type="bar"
              dataKey="sales"
              xAxisDataKey="name"
              name="Sales"
              color="#111111"
              height={300}
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="subtle-card p-6">
            <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
            <div className="space-y-4">
              {visitorSourceData.map((source) => (
                <div
                  key={source.name}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span>{source.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">{source.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="subtle-card p-6">
            <h2 className="text-xl font-semibold mb-4">Top Countries</h2>
            <div className="space-y-4">
              {countriesData.map((country) => (
                <div
                  key={country.name}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>{country.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">{country.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Analytics;
