import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Search, Edit, Trash2, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MenuComponent from "@/components/menu/Menu";
import Package from "@/components/menu/Package";
import Container from "@/components/ui/Container";
import DialogContainer from "@/components/ui/DialogContainer";
import { useMenuPackage } from "@/hooks/useMenuPackage";
import { useStock } from "@/hooks/useStock";
import { getAmount } from "@/lib/utils";

export interface ImageType {
  id?: string;
  base64?: string;
  src?: string;
  size?: number;
  type?: string;
}

export interface IngredientItem {
  id?: string;
  idMaterial: string;
  name: string;
  qty: number;
  unit: string;
  isCustom: boolean;
}

export interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable?: boolean;
  ingredients: IngredientItem[];
  ingredientsToDelete: string[];
  images: ImageType[];
  imagesToDelete: string[];
}

interface PackageItem {
  id?: string;
  code?: string;
  idMenu: string;
  name: string;
  qty: number;
  ingredients: IngredientItem[];
}

export interface PackageType {
  id: string;
  name: string;
  description: string;
  servings: number;
  isAvailable?: boolean;
  foodMenus: PackageItem[];
  foodMenusToDelete: string[];
  ingredients: IngredientItem[];
  ingredientsToDelete: string[];
  equipments: string[];
  services: string[];
  images: ImageType[];
  imagesToDelete: string[];
  price: number;
}

export const getBase64FromFile = async (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

const Menu = () => {
  const { toast } = useToast();
  const { stockQuery } = useStock();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    MenuItemType | PackageType | null
  >(null);
  const [itemType, setItemType] = useState<"menu" | "package">("menu");
  const { getMenuPackage, saveMenuPackage } = useMenuPackage("menu", true);

  const handleEdit = (
    item: MenuItemType | PackageType,
    type: "menu" | "package"
  ) => {
    setSelectedItem(item);
    setItemType(type);
    setIsEditDialogOpen(true);
  };

  const handleView = (
    item: MenuItemType | PackageType,
    type: "menu" | "package"
  ) => {
    setSelectedItem(item);
    setItemType(type);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (id: string, type: "menu" | "package") => {
    if (type === "menu") {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } else {
      setPackages(packages.filter((item) => item.id !== id));
    }
    toast({
      title: "Success",
      description: `${
        type === "menu" ? "Menu item" : "Package"
      } deleted successfully`,
    });
  };

  const removeImage = (
    index: number,
    currentFiles: File[],
    setter: (files: File[]) => void
  ) => {
    const updated = currentFiles.filter((_, i) => i !== index);
    setter(updated);
  };

  return (
    <Container
      title={"Menu & Package Management"}
      subTitle={"Kelola menu dan paket makanan"}
    >
      <div className="space-y-6">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <MenuComponent
              handleDelete={handleDelete}
              handleView={handleView}
              menuItems={getMenuPackage.data || []}
              stockItems={stockQuery.data?.stocks || []}
            />
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <Package
              removeImage={removeImage}
              handleDelete={handleDelete}
              handleView={handleView}
              handleEdit={handleEdit}
              menuItems={getMenuPackage.data || []}
              stockItems={stockQuery.data?.stocks || []}
            />
          </TabsContent>
        </Tabs>

        {/* View Dialog */}
        <DialogContainer
          isDialogOpen={isViewDialogOpen}
          setIsDialogOpen={setIsViewDialogOpen}
          title={`Detail ${itemType === "menu" ? "Menu" : "Paket"}`}
        >
          <ScrollArea className="max-h-[70vh] px-1">
            {selectedItem && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedItem.name}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {selectedItem.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-2xl font-bold text-green-600">
                        Rp {getAmount(selectedItem.price)}
                      </span>
                    </div>
                  </div>
                  {selectedItem.images && selectedItem.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedItem.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image.src}
                          alt={`${selectedItem.name} ${index + 1}`}
                          className="w-full h-48 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {"ingredients" in selectedItem && (
                  <div>
                    <h4 className="font-medium mb-2">Ingredients</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="outline">
                          {ingredient.name} ({ingredient.qty} {ingredient.unit})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {itemType === "package" && "foodMenus" in selectedItem && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        Menu Makanan & Minuman
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.foodMenus.map((item, index) => (
                          <Badge key={index} variant="outline">
                            {item.name} (X{item.qty})
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Perlengkapan</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.equipments.map((item, index) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Layanan</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.services.map((service, index) => (
                          <Badge key={index} variant="default">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContainer>
      </div>
    </Container>
  );
};

export default Menu;
