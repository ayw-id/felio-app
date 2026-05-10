import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useMenuPackage } from "@/hooks/useMenuPackage";
import Container from "@/components/ui/Container";
import {
  MenuItemType,
  getBase64FromFile,
  ImageType,
  IngredientItem,
} from "@/pages/Menu";
import { RawMaterial } from "@/pages/Stock";
import { getAmount } from "@/lib/utils";
import MenuDialog from "@/components/menu/MenuDialog";

interface MenuProps {
  handleDelete: (id: string, type: "menu" | "package") => void;
  handleView: (
    item: MenuItemType | PackageType,
    type: "menu" | "package"
  ) => void;
  menuItems: MenuItemType[];
  setMenuItems: (menuItemTypes: MenuItemType[]) => void;
  stockItems: RawMaterial[];
}

const MAX_IMAGE = 8;

const Menu: React.FC<MenuProps> = ({
  handleDelete,
  handleView,
  menuItems,
  setMenuItems,
  stockItems,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const { getMenuPackage, saveMenuPackage } = useMenuPackage("menu");

  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>({
    name: "",
    description: "",
    price: 0,
    ingredients: [] as IngredientItem[],
    ingredientsToDelete: [] as string[],
    isAvailable: true,
    images: [] as ImageType[],
    imagesToDelete: [] as string[],
  });

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeImage = (index: number) => {
    const imagesToDelete = selectedMenuItem.imagesToDelete || [];
    if (selectedMenuItem.images[index].id) {
      imagesToDelete.push(selectedMenuItem.images[index]);
    }

    const images = selectedMenuItem.images.filter((img, i) => i !== index);

    setSelectedMenuItem({
      ...selectedMenuItem,
      images,
      imagesToDelete,
    });
  };

  const removeIngredient = (index: number) => {
    const ingredientsToDelete = selectedMenuItem.ingredientsToDelete || [];
    if (
      selectedMenuItem.ingredients[index].id &&
      selectedMenuItem.ingredients[index].idMaterial
    ) {
      ingredientsToDelete.push(selectedMenuItem.ingredients[index].id);
    }

    const ingredients = selectedMenuItem.ingredients.filter(
      (ing, i) => i !== index
    );

    setSelectedMenuItem({
      ...selectedMenuItem,
      ingredients,
      ingredientsToDelete,
    });
  };

  const handleSaveMenuItem = () => {
    if (!selectedMenuItem.name || selectedMenuItem.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let ingredients = selectedMenuItem.ingredients.map((i) => {
      if (!i.idMaterial) {
        if (i.id) {
          i.idMaterial = i.id;
          delete i.id;
        }
      }
      return i;
    });

    ingredients = ingredients.filter((i) => !!i.idMaterial);

    let images = selectedMenuItem.images.map((i) => {
      if (i.preview) {
        delete i.preview;
      }
      if (i.file) {
        delete i.file;
      }

      return i;
    });

    images = images.filter((i) => !!i);

    saveMenuPackage(
      {
        ...selectedMenuItem,
        ingredients,
        ingredientsToDelete: selectedMenuItem.ingredientsToDelete || [],
        ...(selectedMenuItem.id
          ? {
              idMenu: selectedMenuItem.id,
            }
          : null),
        images,
        imagesToDelete: selectedMenuItem.imagesToDelete || [],
      },
      {
        onSuccess: () => {
          getMenuPackage.refetch();
          setIsAddMenuOpen(false);

          toast({
            title: "Success",
            description: "Tambah menu berhasil",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Failed",
            description: error?.message || "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={() => {
            setSelectedMenuItem({
              name: "",
              description: "",
              price: 0,
              ingredients: [] as IngredientItem[],
              ingredientsToDelete: [] as string[],
              isAvailable: true,
              images: [] as ImageType[],
              imagesToDelete: [] as string[],
            });
            setIsAddMenuOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Menu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden bg-gray-100">
              {!!item.images?.length && item.images[0]?.src && (
                <img
                  src={item.images[0].src}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{item.name}</h3>
                <Badge variant={item.isAvailable ? "default" : "secondary"}>
                  {item.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  Rp {getAmount(item.price)}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleView(item, "menu")}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedMenuItem(item);
                      setIsAddMenuOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {/*<AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this menu item? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id, "menu")}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>*/}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MenuDialog
        open={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        item={selectedMenuItem}
        setItem={setSelectedMenuItem}
        onSave={handleSaveMenuItem}
        stockItems={stockItems}
        removeImage={removeImage}
        removeIngredient={removeIngredient}
      />
    </>
  );
};

export default Menu;
