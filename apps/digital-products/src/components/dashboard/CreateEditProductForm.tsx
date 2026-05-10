import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Upload, ImageIcon, Images } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import fs from "fs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Product, ProductImage } from "./ProductCard";
import Editor, {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  Toolbar,
} from "react-simple-wysiwyg";
import { getProductTypeLabel } from "@/utils/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthData, getAuthData } from "@/services/auth";
import { saveProduct } from "@/services/product";

const productTypes = [
  "EBOOK",
  "ECOURSE",
  // "CONSULTATION",
  // "DONATION",
  // "FREELANCE",
  // "EVENT",
  // "GRAPHIC_DESIGN",
  "OTHER",
] as const;

const formSchema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  title: z
    .string()
    .min(3, { message: "Product title must be at least 3 characters" }),
  type: z.enum(productTypes),
  price: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number" }),
  description: z.string().optional(),
  fileUrl: z.string().optional(),
  images: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      base64: z.string(),
      url: z.string(),
      urlThumb: z.string(),
      width: z.number(),
      height: z.number(),
      type: z.string(),
      isThumbnail: z.boolean(),
    })
  ),
  fileProduct: z
    .object({
      name: z.string(),
      base64: z.string(),
      url: z.string(),
      type: z.string(),
      source: z
        .enum(["dropbox", "google_drive", "other_url", "direct_upload"])
        .default("direct_upload"),
    })
    .optional(),
  deletedImages: z.array(z.string()),
});

type ProductFormData = z.infer<typeof formSchema>;

interface CreateEditProductFormProps {
  dataAuth: AuthData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: Product;
}

const CreateEditProductForm = ({
  dataAuth,
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreateEditProductFormProps) => {
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [switchTrigger, setSwitchTrigger] = useState<boolean>(false);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<
    Array<{ file: File; preview: string; data: ProductImage }>
  >(
    initialData?.images
      ? initialData.images.map((image) => ({
          file: new File([], "existing-image"),
          preview: image.url,
          data: image,
        }))
      : []
  );

  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      type: "OTHER",
      price: 0,
      description: "",
      fileUrl: "",
      images: [],
      fileProduct: {
        name: "",
        base64: "",
        url: "",
        type: "",
        source: "direct_upload",
      },
      deletedImages: [],
    },
  });

  const watchFileType = form.watch("fileProduct.source");

  const getBase64FromFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  // Handler for additional images selection
  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 8 - images.length;

    if (remainingSlots <= 0) {
      toast({
        title: "Maximum images reached",
        description: "You can only upload up to 8 additional images",
        variant: "destructive",
      });
      return;
    }

    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    // Create preview URLs for the new files
    const newImages = [];
    for (let a = 0; a < filesToAdd.length; a++) {
      const base64 = await getBase64FromFile(filesToAdd[a]);
      newImages.push({
        file: filesToAdd[a],
        preview: URL.createObjectURL(filesToAdd[a]),
        data: {
          id: "",
          name: "",
          base64,
          url: "",
          urlThumb: "",
          width: 0,
          height: 0,
          type: "",
          isThumbnail: false,
        },
      });
    }

    setImages([...images, ...newImages]);

    // Reset the input so the same file can be selected again if needed
    if (imagesInputRef.current) {
      imagesInputRef.current.value = "";
    }

    toast({
      title: "Images selected",
      description: `${filesToAdd.length} image${
        filesToAdd.length > 1 ? "s" : ""
      } added`,
    });
  };

  // Remove additional image
  const removeAdditionalImage = (index: number) => {
    const updatedImages = [...images];

    if (updatedImages[index].data.id) {
      setDeletedImages([...deletedImages, updatedImages[index].data.id]);
    }

    // Release the object URL to prevent memory leaks
    URL.revokeObjectURL(updatedImages[index].preview);

    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        form.setValue("fileProduct", {
          ...form.getValues().fileProduct,
          base64,
        });
      };
      reader.readAsDataURL(file); // Reads file as base64

      toast({
        title: "File selected",
        description: `${file.name} (${Math.round(
          file.size / 1024
        )}KB) selected for upload.`,
      });
    }
  };

  const mutation = useMutation({ mutationFn: saveProduct });

  const handleSubmit = async () => {
    const stateValues = {
      ...form.getValues(),
      images: images.map((image) => image.data),
      deletedImages,
    };

    if (watchFileType !== "direct_upload") {
      stateValues.fileProduct = {
        url: stateValues.fileUrl,
        base64: "",
        name: "",
        type: "",
        source: watchFileType,
      };
    }

    // Validation
    let error = "";

    if (!stateValues.title) {
      error = "Silahkan isi nama produk terlebih dahulu";
    } else {
      stateValues.price = parseInt(stateValues.price) || 0;
      if (!stateValues.price) {
        error = "Silahkan isi harga produk terlebih dahulu";
      } else if (!stateValues.images.length) {
        error = "Silahkan upload minimal 1 gambar produk";
      } else if (
        !stateValues.fileProduct?.base64 &&
        !stateValues.fileProduct?.url
      ) {
        error = "Silahkan upload file atau url produk terlebih dahulu";
      }
    }

    if (error) {
      toast({
        title: "Upload Produk Gagal",
        description: error,
      });
      return;
    }

    // Submit
    setIsSubmitting(true);

    mutation
      .mutateAsync({
        baseUrl: import.meta.env.VITE_DSTORE_API,
        stateValues,
        token: dataAuth.token,
      })
      .then((data) => {
        if (data.success) {
          onSubmit(data.data.product);
          toast({
            title: isEditing ? "Produk Sudah Diupdate" : "Produk Sudah Dibuat",
            description: isEditing
              ? "Produk Anda barhasil diubah"
              : "Produk Anda berhasil dibuat",
          });
          onClose();
        } else {
          toast({
            title: isEditing ? "Produk Gagal Diupdate" : "Produk Gagal Dibuat",
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
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[700px] p-0"
        style={{ borderRadius: 12 }}
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isEditing ? "Edit Produk" : "Buat Produk Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ubah produk Anda di sini. Klik simpan saat Anda yakin ingin mengubah produk."
              : "Tambah produk ke katalog Anda. Masukkan semua kolom yang dibutuhkan."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] sm:px-6 pt-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
              style={{ margin: 12 }}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Produk</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Produk</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productTypes.map((type, i) => (
                            <SelectItem value={type} key={i}>
                              {getProductTypeLabel(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Silahkan pilih tipe produk yang ingin Anda masukkan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1000"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 rounded-md border p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">
                    Additional Images{" "}
                    <span className="text-xs text-muted-foreground">
                      ({images.length}/8)
                    </span>
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imagesInputRef.current?.click()}
                    disabled={images.length >= 8}
                  >
                    <Images className="mr-2 h-4 w-4" /> Add Images
                  </Button>
                </div>
                <Input
                  ref={imagesInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagesChange}
                  multiple
                />

                {images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.preview}
                          alt={`Additional image ${index + 1}`}
                          className="h-24 w-full rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 size-6 rounded-full"
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <X className="size-3" />
                        </Button>
                        <span className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-1 rounded-tl">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No additional images yet. Click "Add Images" to upload up
                      to 8 images.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-md border p-4">
                <h3 className="text-sm font-medium">File Produk</h3>
                <FormField
                  control={form.control}
                  name="fileProduct.source"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="google_drive"
                              id="google_drive"
                            />
                            <Label htmlFor="google_drive">
                              URL Google Drive
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dropbox" id="dropbox" />
                            <Label htmlFor="dropbox">URL Dropbox</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other_url" id="other_url" />
                            <Label htmlFor="other_url">URL Lain</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="direct_upload"
                              id="direct_upload"
                            />
                            <Label htmlFor="direct_upload">Upload File</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchFileType === "direct_upload" ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      {form.getValues().fileProduct.url && (
                        <div className="relative">
                          <p style={{ marginRight: 48 }}>
                            {form.getValues().fileProduct.name}
                          </p>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-0 right-0 size-6 rounded-full"
                            onClick={() => {
                              form.setValue("fileProduct.url", "");
                              form.setValue("fileProduct.base64", "");
                              setSwitchTrigger(!switchTrigger);
                            }}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => productFileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" /> Pilih File
                      </Button>
                      <Input
                        ref={productFileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleProductFileChange}
                      />
                      <span className="text-sm text-muted-foreground">
                        {productFile ? productFile.name : "No file selected"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Max ukuran file: 100MB
                    </p>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={
                              watchFileType === "dropbox"
                                ? "https://www.dropbox.com/s/..."
                                : watchFileType === "google_drive"
                                ? "https://drive.google.com/file/d/..."
                                : "https://example.com/file.pdf"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {watchFileType === "dropbox"
                            ? "Masukkan link Dropbox yang dapat dishare"
                            : watchFileType === "google_drive"
                            ? "Masukkan link Google Drive yang dapat dishare"
                            : "Masukkan link file produk yang valid"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <Editor value={field.value} onChange={field.onChange}>
                      <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                      </Toolbar>
                    </Editor>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t">
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="mt-2"
          >
            {isSubmitting
              ? "Menyimpan..."
              : isEditing
              ? "Ubah Produk"
              : "Buat Produk"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditProductForm;
