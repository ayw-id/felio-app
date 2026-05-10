import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MenuItemType,
  PackageItem,
  IngredientItem,
  ImageType,
  getBase64FromFile,
} from "@/pages/Menu";
import { RawMaterial } from "@/pages/Stock";

interface PackageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  mode: "add" | "edit";
  initialData?: any;
  menuItems: MenuItemType[];
  stockItems: RawMaterial[];
}

const emptyPackage = {
  name: "",
  description: "",
  price: 0,
  servings: 0,
  foodMenus: [] as PackageItem[],
  ingredients: [] as IngredientItem[],
  equipment: [] as string[],
  services: [] as string[],
  images: [] as ImageType[],
  imagesToDelete: [] as string[],
};

const getUpdatedIngredients = (
  updatedMenus: PackageItem[],
  selectedIngredients: IngredientItem[]
) => {
  const ingredients = [];

  updatedMenus.forEach((menu) => {
    menu.ingredients?.forEach((menuIngredient) => {
      const indexIngredient = ingredients.findIndex(
        (ingredient) => ingredient.idMaterial === menuIngredient.idMaterial
      );
      if (indexIngredient === -1) {
        const selectedIngredient = selectedIngredients.find(
          (ing) => ing.idMaterial === menuIngredient.idMaterial
        );
        ingredients.push({
          ...(selectedIngredient ? { id: selectedIngredient.id } : null),
          ...(menuIngredient.id ? { idMenu: menuIngredient.id } : null),
          idMaterial: menuIngredient.idMaterial,
          name: menuIngredient.name,
          qty: menuIngredient.qty * menu.qty,
          unit: menuIngredient.unit,
        });
      } else {
        ingredients[indexIngredient].qty += menuIngredient.qty * menu.qty;
      }
    });
  });

  return ingredients;
};

const PackageDialog: React.FC<PackageDialogProps> = ({
  open,
  onClose,
  onSubmit,
  mode,
  initialData,
  menuItems,
  stockItems,
}) => {
  const [data, setData] = useState(emptyPackage);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setData(initialData);
    } else {
      setData(emptyPackage);
    }
  }, [mode, initialData, open]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;
    const total = (data.images?.length || 0) + files.length;
    if (total > 8) return;

    const newImages: ImageType[] = await Promise.all(
      Array.from(files).map(async (file) => ({
        file,
        preview: URL.createObjectURL(file),
        src: "",
        base64: await getBase64FromFile(file),
        size: file.size,
        type: file.type?.replace("image/", ""),
      }))
    );

    setData({ ...data, images: [...data.images, ...newImages] });
  };

  const removeImage = (index: number) => {
    const imagesToDelete = [...(data.imagesToDelete || [])];
    if (data.images[index].id) imagesToDelete.push(data.images[index]);
    const images = data.images.filter((_, i) => i !== index);
    setData({ ...data, images, imagesToDelete });
  };

  const handleSubmit = () => {
    if (!data.name || data.price <= 0) return;

    let menus = data.foodMenus.map((i) => {
      if (!i.idMenu) {
        if (i.id) {
          i.idMenu = i.id;
          delete i.id;
        }
      }
      return i;
    });

    menus = menus.filter((i) => !!i.idMenu);

    let ingredients = data.ingredients.map((i) => {
      if (!i.idMaterial) {
        if (i.id) {
          i.idMaterial = i.id;
          delete i.id;
        }
      }
      return i;
    });

    ingredients = ingredients.filter((i) => !!i.idMaterial);

    let images = data.images.map((i) => {
      if (i.preview) {
        delete i.preview;
      }
      if (i.file) {
        delete i.file;
      }

      return i;
    });

    images = images.filter((i) => !!i);

    const equipments = (data.equipments || []).filter((i) => !!i);

    const services = (data.services || []).filter((i) => !!i);

    const cleaned = {
      ...data,
      ingredients,
      ingredientsToDelete: data.ingredientsToDelete || [],
      ...(data.id
        ? {
            idPackage: data.id,
          }
        : null),
      images,
      imagesToDelete: data.imagesToDelete || [],
      equipments,
      services,
      foodMenus: menus,
      foodMenusToDelete: data.foodMenusToDelete || [],
    };

    onSubmit(cleaned);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Package" : "Edit Package"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new catering package"
              : "Update package details"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] px-1 space-y-6">
          <div>
            <Label>Nama Paket *</Label>
            <Input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <Label>Deskripsi</Label>
            <Textarea
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <Label>Harga *</Label>
              <Input
                type="number"
                value={data.price + ""}
                onChange={(e) =>
                  setData({ ...data, price: parseFloat(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Porsi</Label>
              <Input
                type="number"
                value={data.servings + ""}
                onChange={(e) =>
                  setData({ ...data, servings: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="mt-4">
            <Label>Menu Paket</Label>
            <div className="space-y-2">
              {data.foodMenus.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-2 p-2 border rounded"
                >
                  <Select
                    value={item.idMenu}
                    disabled={item.id && item.idMenu}
                    onValueChange={(value) => {
                      const menuItem = menuItems.find(
                        (item) => item.id === value
                      );
                      if (menuItem) {
                        const updatedMenus = [...data.foodMenus];
                        updatedMenus[index] = {
                          ...updatedMenus[index],
                          idMenu: menuItem.id,
                          name: menuItem.name,
                          ingredients: menuItem.ingredients,
                        };

                        let updatedIngredients = [...data.ingredients];
                        if (menuItem.ingredients?.length) {
                          updatedIngredients = getUpdatedIngredients(
                            updatedMenus,
                            data.ingredients
                          );
                        }

                        setData({
                          ...data,
                          foodMenus: updatedMenus,
                          ingredients: updatedIngredients,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Menu" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Porsi"
                    value={item.qty + ""}
                    onChange={(e) => {
                      const updatedItems = [...data.foodMenus];
                      updatedItems[index].qty = parseFloat(e.target.value);
                      const ingredients = getUpdatedIngredients(
                        updatedItems,
                        data.ingredients
                      );
                      setData({
                        ...data,
                        foodMenus: updatedItems,
                        ingredients,
                      });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const foodMenusToDelete = data.foodMenusToDelete || [];
                      if (
                        data.foodMenus[index].id &&
                        data.foodMenus[index].idMenu
                      ) {
                        foodMenusToDelete.push(data.foodMenus[index].id);
                      }
                      const updatedItems = data.foodMenus.filter(
                        (_, i) => i !== index
                      );
                      const ingredients = getUpdatedIngredients(
                        updatedItems,
                        data.ingredients
                      );

                      setData({
                        ...data,
                        foodMenus: updatedItems,
                        foodMenusToDelete,
                        ingredients,
                      });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setData({
                    ...data,
                    foodMenus: [
                      ...data.foodMenus,
                      { id: "", name: "", qty: 0 },
                    ],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Menu
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label>Bahan Makanan (Optional)</Label>
            <div className="space-y-2">
              {data.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-2 p-2 border rounded"
                >
                  <Select
                    value={ingredient.idMaterial}
                    disabled={ingredient.id && ingredient.idMaterial}
                    onValueChange={(value) => {
                      const stockItem = stockItems.find(
                        (item) => item.idMaterial === value
                      );
                      if (stockItem) {
                        const updatedIngredients = [...data.ingredients];
                        updatedIngredients[index] = {
                          ...updatedIngredients[index],
                          idMaterial: stockItem.id,
                          name: stockItem.name,
                          unit: stockItem.unit,
                        };
                        setData({ ...data, ingredients: updatedIngredients });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={ingredient.qty + ""}
                    onChange={(e) => {
                      const updatedIngredients = [...data.ingredients];
                      updatedIngredients[index].qty = parseFloat(
                        e.target.value
                      );
                      setData({ ...data, ingredients: updatedIngredients });
                    }}
                  />
                  <Input value={ingredient.unit} disabled placeholder="Unit" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const ingredientsToDelete =
                        data.ingredientsToDelete || [];
                      if (
                        data.ingredients[index].id &&
                        data.ingredients[index].idMaterial
                      ) {
                        ingredientsToDelete.push(data.ingredients[index].id);
                      }
                      const updatedIngredients = data.ingredients.filter(
                        (_, i) => i !== index
                      );
                      setData({
                        ...data,
                        ingredients: updatedIngredients,
                        ingredientsToDelete,
                      });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setData({
                    ...data,
                    ingredients: [
                      ...data.ingredients,
                      { id: "", name: "", qty: 0, unit: "" },
                    ],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Bahan Makanan
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label>Perlengkapan</Label>
            <div className="space-y-2">
              {data.equipments?.map((equipment, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Perlengkapan"
                    value={equipment}
                    onChange={(e) => {
                      const updatedEquipment = [...data.equipments];
                      updatedEquipment[index] = e.target.value;
                      setData({ ...data, equipments: updatedEquipment });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updatedEquipment = data.equipments.filter(
                        (_, i) => i !== index
                      );
                      setData({ ...data, equipments: updatedEquipment });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setData({
                    ...data,
                    equipments: [...(data.equipments || []), ""],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Perlengkapan
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label>Layanan</Label>
            <div className="space-y-2">
              {data.services.map((service, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Service name"
                    value={service}
                    onChange={(e) => {
                      const updatedServices = [...data.services];
                      updatedServices[index] = e.target.value;
                      setData({ ...data, services: updatedServices });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updatedServices = data.services.filter(
                        (_, i) => i !== index
                      );
                      setData({ ...data, services: updatedServices });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setData({
                    ...data,
                    services: [...data.services, ""],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Layanan
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Label>Gambar (Max 8)</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            {data.images?.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {data.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={file.src || file.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 mb-12 flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {mode === "add" ? "Add" : "Update"}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDialog;
