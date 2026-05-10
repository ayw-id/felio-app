import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  delay?: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      className="subtle-card p-6 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="bg-secondary/50 p-2 rounded-full">
          <Icon className="w-4 h-4 text-foreground" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-2xl font-semibold">{value}</div>

        {trend && (
          <div className="flex items-center">
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
            {description && (
              <span className="text-xs ml-2 text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
