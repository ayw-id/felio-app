import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AlertProps {
  type: string;
  message: string;
  data?: any;
  onClick: (alert) => void;
}

const AlertCard: React.FC<AlertProps> = ({
  title,
  message,
  data,
  type = "default",
  onClick,
}) => {
  return (
    <div
      className={`p-3 rounded-lg border-l-4 ${
        type === "warning"
          ? "bg-orange-50 border-l-orange-500"
          : "bg-blue-50 border-l-blue-500"
      }`}
    >
      <p className="text-sm text-gray-700">{message}</p>
      {!!data && (
        <Button
          variant="outline"
          size="sm"
          className="w-24 mt-2"
          onClick={() => onClick(data)}
        >
          Lihat
        </Button>
      )}
    </div>
  );
};

export default AlertCard;
