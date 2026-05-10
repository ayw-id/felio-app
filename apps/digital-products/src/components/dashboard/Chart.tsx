import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";

export type ChartType = "area" | "bar" | "line";

interface ChartProps {
  data: any[];
  type?: ChartType;
  dataKey: string;
  xAxisDataKey: string;
  name?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

const Chart = ({
  data,
  type = "area",
  dataKey,
  xAxisDataKey,
  name,
  color = "#111111",
  height = 300,
  showGrid = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
}: ChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  // Animation for data loading
  useEffect(() => {
    setChartData([]);

    const timer = setTimeout(() => {
      setChartData(data);
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart data={chartData}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            {showXAxis && (
              <XAxis
                dataKey={xAxisDataKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
            )}
            {showYAxis && (
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
            )}
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  fontSize: "12px",
                }}
              />
            )}
            <defs>
              <linearGradient
                id={`gradient-${dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey={dataKey}
              name={name || dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${dataKey})`}
              animationDuration={1500}
            />
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart data={chartData}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            {showXAxis && (
              <XAxis
                dataKey={xAxisDataKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
            )}
            {showYAxis && (
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
            )}
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  fontSize: "12px",
                }}
              />
            )}
            <Bar
              dataKey={dataKey}
              name={name || dataKey}
              fill={color}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={chartData}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            {showXAxis && (
              <XAxis
                dataKey={xAxisDataKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
            )}
            {showYAxis && (
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
            )}
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  fontSize: "12px",
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey={dataKey}
              name={name || dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ stroke: color, strokeWidth: 2, fill: "#fff", r: 4 }}
              activeDot={{ stroke: color, strokeWidth: 2, fill: color, r: 6 }}
              animationDuration={1500}
            />
          </LineChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  );
};

export default Chart;
