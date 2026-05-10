import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { MenuItem } from "src/pages/Orders";
import { getAmount } from "@/lib/utils";

// A single “menu” item that can be ordered separately or appear inside a package
export interface Menu {
  id: string;
  name: string;
  qty: number; // default qty inside a package
}

// Extra information if the menu item is a package
export interface PackageDetails {
  menus: Menu[];
}

/** Item selected by the user when creating an order */
export interface SelectedItem {
  /** ID of the MenuItem chosen */
  itemId: string;
  /** Number of copies requested */
  qty: number;
  /**
   * Custom price override (package only).  Undefined ⇒ use default price.
   */
  customPrice?: number;
  /**
   * Customised quantities for each menu inside the package.
   * Only exists when type === "package".
   */
  customMenuQuantities?: Record<string, number>;
}

/* ------------------------------------------------------------------ */
/* 🔌 Props for the component                                        */
/* ------------------------------------------------------------------ */

export interface SelectedItemsCardProps {
  order: CustomerOrder;
  /** Master menu catalogue (packages & singles) */
  menuItems: MenuItem[];

  /** Handler: add a blank item */
  onAdd: () => void;
  /** Handler: remove item at index */
  onRemove: (index: number) => void;
  /**
   * Handler: update a primitive field on a selected item
   *   @param index   which SelectedItem
   *   @param key     property key (itemId | quantity | customPrice)
   *   @param value   new value
   */
  onUpdateItem: (
    index: number,
    code: string,
    qty?: number,
    price?: number
  ) => void;
  /**
   * Handler: update quantity of a menu inside a package
   *   @param index        which SelectedItem
   *   @param menuId       which inner menu
   *   @param newQuantity  new quantity
   */
  onUpdateMenuQuantity: (index: number, idMenu: string, qty?: number) => void;

  onUpdateIngredientQuantity: {
    index: number;
    idIngredient: string;
    qty?: number;
  };
}

const SelectedItemsCard: React.FC<SelectedItemsCardProps> = ({
  order,
  menuItems,
  onAdd,
  onRemove,
  onUpdateItem,
  onUpdateMenuQuantity,
  onUpdateIngredientQuantity,
}) => {
  return (
    <div>
      {/* Header controls */}
      <div className="flex justify-between items-center mb-4">
        <Label>Items *</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>

      {/* All selected items */}
      <div className="space-y-3">
        {order.selectedItems?.map((item, index) => {
          const selectedMenuItem = menuItems.find((m) => m.code === item?.code);
          const isPackage = selectedMenuItem?.type === "package";

          return (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              {/* Row 1: item selector & quantity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label>Item</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    disabled={item?.id}
                    value={item?.code || ""}
                    onChange={(e) =>
                      onUpdateItem(index, e.target.value as string, 1)
                    }
                  >
                    <option value="">Select item</option>
                    {menuItems.map((m, indexItem) => (
                      <option key={indexItem} value={m.code}>
                        {m.name} – ({m.type === "package" ? "Paket" : "Menu"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity & remove */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item?.qty !== undefined ? item.qty + "" : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const value = parseInt(val);
                        if (val === "") {
                          onUpdateItem(index, item?.code);
                        } else if (!isNaN(value)) {
                          onUpdateItem(index, item?.code, value);
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-6"
                    onClick={() => onRemove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Package‑specific customisation */}
              {(selectedMenuItem?.packageDetails ||
                selectedMenuItem?.menuDetails) && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  {/* Optional custom price */}
                  <div>
                    <Label>Harga Satuan</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={`Default: $${selectedMenuItem.price}`}
                      value={item?.price + ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const value = parseInt(val);
                        if (val === "") {
                          onUpdateItem(index, item?.code, item?.qty);
                        } else if (!isNaN(value)) {
                          onUpdateItem(index, item?.code, item?.qty, value);
                        }
                      }}
                    />
                  </div>

                  {/* Custom menu quantities */}
                  {isPackage && (
                    <div>
                      <Label className="block mb-2">Menu Quantities</Label>
                      <div className="space-y-2">
                        {item.packageDetails?.menus.map((menu) => (
                          <div
                            key={menu.id}
                            className="flex items-center gap-4"
                          >
                            <span className="flex-1 text-sm">{menu.name}</span>
                            <Input
                              type="number"
                              className="w-20"
                              placeholder={menu.qty ? menu.qty + "" : ""}
                              value={
                                menu.qty !== undefined ? menu.qty + "" : ""
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                const value = parseInt(val);
                                if (val === "") {
                                  onUpdateMenuQuantity(index, menu.id);
                                } else if (!isNaN(value)) {
                                  onUpdateMenuQuantity(index, menu.id, value);
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom ingredient quantities */}
                  <div>
                    <Label className="block mb-2">Ingredient Quantities</Label>
                    <div className="space-y-2">
                      {(
                        item.packageDetails || item.menuDetails
                      )?.ingredients.map((ingredient) => (
                        <div
                          key={ingredient.id}
                          className="flex items-center gap-4"
                        >
                          <span className="flex-1 text-sm">
                            {ingredient.name} ({ingredient.unit})
                          </span>
                          <Input
                            type="number"
                            className="w-20"
                            placeholder={
                              ingredient.qty ? ingredient.qty + "" : ""
                            }
                            value={ingredient.qty + ""}
                            onChange={(e) =>
                              onUpdateIngredientQuantity(
                                index,
                                ingredient.id,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedItemsCard;
