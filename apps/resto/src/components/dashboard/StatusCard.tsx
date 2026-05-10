import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAmount } from "@/lib/utils";

interface StatusProps {
  title: string;
  value: string;
  trend: string;
  description: string;
}

const StatusCard: React.FC<StatusProps> = (stat) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {stat.title}
        </CardTitle>
        <stat.icon className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">
          {getAmount(stat.value)}
        </div>
        {/*<p className="text-xs text-gray-500 mt-1">
          <span className="text-green-600 font-medium">{stat.trend}</span> {stat.description}
        </p>*/}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
