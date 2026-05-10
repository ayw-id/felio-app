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

export interface ProductImage {
  id?: string;
  name: string;
  base64: string;
  url: string;
  urlThumb: string;
  width: number;
  height: number;
  type: string;
}

export interface Product {
  id: string;
  code: string;
  title: string;
  type:
    | "EBOOK"
    | "ECOURSE"
    | "CONSULTATION"
    | "DONATION"
    | "FREELANCE"
    | "EVENT"
    | "GRAPHIC_DESIGN"
    | "OTHER";
  price: number;
  images: ProductImage[];
  fileProduct?: {
    name: string;
    base64: string;
    url: string;
    type: string;
  };
  sales: number;
  status?: "published" | "draft";
  description?: string;
  content?: any;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  dataAuth?: AuthData;
}

const ProductCard = ({
  product,
  index,
  onDelete,
  onEdit,
  dataAuth,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getProductTypeIcon = (type: Product["type"]) => {
    switch (type) {
      case "DONATION":
        return <HandHeart className="w-3 h-3 mr-1" />;
      case "GRAPHIC_DESIGN":
        return <PaintRoller className="w-3 h-3 mr-1" />;
      case "FREELANCE":
        return <Briefcase className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const deleteProductMutation = useMutation({ mutationFn: deleteProduct });

  const handleDelete = () => {
    deleteProductMutation
      .mutateAsync({
        baseUrl: import.meta.env.VITE_DSTORE_API,
        token: dataAuth.token,
        idProduct: product.id,
      })
      .then((data) => {
        if (data.success) {
          if (onDelete) {
            onDelete(product.id);
            toast({
              title: "Product deleted",
              description: `${product.title} has been deleted successfully.`,
            });
          }
        } else {
          toast({
            title: "Produk gagal dihapus",
            description: data.msg,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Ada masalah",
          description: "Coba lagi nanti",
          variant: "destructive",
        });
      })
      .finally(() => {
        // setIsSubmitting(false);
      });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product.id);
    }
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
      <div className="relative aspect-[16/9] overflow-hidden">
        <span className="absolute top-2 left-2 z-10 bg-secondary/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full font-medium flex items-center">
          {getProductTypeIcon(product.type)}
          {getProductTypeLabel(product.type)}
        </span>

        {product.status === "draft" && (
          <span className="absolute top-2 right-2 z-10 bg-secondary/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-muted-foreground">
            Draft
          </span>
        )}

        <img
          src={product.images.length ? product.images[0].urlThumb : ""}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        />
      </div>

      <div className="p-5">
        <h3 className="font-medium text-lg mb-2">{product.title}</h3>

        <div className="flex justify-between items-center">
          <span className="font-semibold">Rp.{getAmount(product.price)}</span>
          <span className="text-sm text-muted-foreground">
            {product.sales || 0} sold
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-1.5"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Anda yakin ingin menghapus produk ini?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Produk <strong> {product.title}</strong> akan dihapus secara
                  permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
