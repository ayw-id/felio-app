import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  ExternalLink,
  HandHeart,
  PaintRoller,
  Briefcase,
  Trash2,
  Edit,
  MonitorCog,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getAmount, getProductTypeLabel } from "@/utils/product";
import { deleteProduct } from "@/services/product";
import { useMutation } from "@tanstack/react-query";
import { AuthData } from "@/services/auth";

export enum ServiceType {
  websiteBuilder = "websiteBuilder",
  store = "store",
  agent = "agent",
  digitalProduct = "digitalProduct",
  resto = "resto",
}

export interface Service {
  id: string;
  title: string;
  items: string[];
  serviceType?: ServiceType;
  isComingSoon: boolean;
}

interface ServiceCardProps {
  service: Service;
  index: number;
  dataAuth?: AuthData;
  verifyService: (service: Service) => void;
}

const ServiceCard = ({
  service,
  index,
  dataAuth,
  verifyService,
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const onSignIn = async (): Promise<void> => {
    verifyService(service.serviceType);
  };

  return (
    <motion.div
      className="subtle-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5" style={{ height: "100%" }}>
        <h3 className="font-bold text-lg mb-2">{service.title}</h3>

        {service.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="font-light text-sm mb-4">{item}</span>
          </div>
        ))}
        <div className="mt-2">
          <Button
            variant="secondary"
            disabled={service.isComingSoon}
            className="mt-4 w-[100%] flex items-center justify-center gap-1.5"
            style={{ backgroundColor: "#0096FF" }}
            onClick={onSignIn}
          >
            <MonitorCog className="w-4 h-4 text-white" />
            <span style={{ color: "white" }}>Masuk Sekarang</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
