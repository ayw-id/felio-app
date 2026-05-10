import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItemType, getBase64FromFile, ImageType } from "@/pages/Menu";
import { RawMaterial } from "@/pages/Stock";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (item: MenuItemType) => void;
  item: MenuItemType;
  setItem: (item: MenuItemType) => void;
  stockItems: RawMaterial[];
  maxImage?: number;
  removeImage: (index: number) => void;
  removeIngredient: (index: number) => void;
};

const MenuDialog: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  item,
  setItem,
  stockItems,
  maxImage = 8,
  removeImage,
  removeIngredient,
}) => {
  const handleImageUpload = async (files: ImageType[]) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const total = (item.images?.length || 0) + fileArray.length;
    if (total > maxImage) return;

    const newImages: ImageType[] = [];
    for (const f of fileArray) {
      newImages.push({
        file: f,
        preview: URL.createObjectURL(f),
        src: "",
        base64: await getBase64FromFile(f),
        size: f.size,
        type: f.type?.replace("image/", ""),
      });
    }

    setItem({
      ...item,
      images: [...item.images, ...newImages],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{item.id ? "Edit" : "Add"} Menu Item</DialogTitle>
          <DialogDescription>
            Fill in the details of your menu item.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] px-1">
          <div className="space-y-6 p-1">
            <div>
              <Label>Name *</Label>
              <Input
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) =>
                  setItem({ ...item, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Price *</Label>
              <Input
                type="number"
                step="0.01"
                value={item.price + ""}
                onChange={(e) =>
                  setItem({ ...item, price: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label>Bahan Makanan</Label>
              <div className="space-y-2">
                {item.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2 p-2 border rounded"
                  >
                    <Select
                      value={ingredient.idMaterial}
                      disabled={item.id && ingredient.id}
                      onValueChange={(value) => {
                        const stockItem = stockItems.find(
                          (i) => i.id === value
                        );
                        if (!stockItem) return;
                        const updated = [...item.ingredients];
                        updated[index] = {
                          idMaterial: stockItem.id,
                          code: stockItem.code,
                          name: stockItem.name,
                          qty: ingredient.qty,
                          unit: stockItem.unit,
                        };
                        setItem({ ...item, ingredients: updated });
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
                        const updated = [...item.ingredients];
                        updated[index].qty = parseFloat(e.target.value);
                        setItem({ ...item, ingredients: updated });
                      }}
                    />
                    <Input
                      value={ingredient.unit}
                      disabled
                      placeholder="Unit"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
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
                    setItem({
                      ...item,
                      ingredients: [
                        ...item.ingredients,
                        { id: "", name: "", qty: 0, unit: "" },
                      ],
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Bahan Baku
                </Button>
              </div>
            </div>

            <div>
              <Label>Gambar (Max {maxImage})</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              {item.images?.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {item.images.map((file, index) => (
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

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => onSave(item)}>
                {item.id ? "Update" : "Add"} Menu
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MenuDialog;
