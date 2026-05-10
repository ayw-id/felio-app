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
import WebsiteCard, { Website } from "./WebsiteCard";
import Editor, {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  Toolbar,
} from "react-simple-wysiwyg";
import { getProductTypeLabel } from "@/utils/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthData, getAuthData } from "@/services/auth";
import { addWebsite, updateWebsite } from "@/services/website";

const formSchema = z.object({
  websiteName: z.string(),
  idTemplate: z.string().optional(),
  idDomain: z.string(),
  idWebsite: z.string().optional(),
});

export interface FelioDomain {
  id: string;
  domain: string;
}

type WebsiteFormData = z.infer<typeof formSchema>;

interface WebsiteTemplateProps {
  dataAuth: AuthData;
  templates: Website[];
  selectedWebsite: Website | null;
  availableDomains: FelioDomain[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const getInitialDomain = (
  availableDomains: FelioDomain[],
  selectedWebsite: Website | null
) => {
  if (availableDomains.length) {
    let selectedDomain = availableDomains[0];
    if (selectedWebsite) {
      const selectedAvailableDomain = availableDomains.find(
        (domain) => domain.domain === selectedWebsite.felioDomain
      );
      if (selectedAvailableDomain) {
        selectedDomain = selectedAvailableDomain;
      }
    }

    return selectedDomain;
  }

  return null;
};

const WebsiteTemplate = ({
  dataAuth,
  templates,
  isOpen,
  selectedWebsite,
  onClose,
  onSubmit,
  availableDomains,
}: WebsiteTemplateProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Website | null>(
    null
  );
  const [startFromBlank, setStartFromBlank] = useState<boolean>(false);
  const [selectedFelioDomain, setSelectedFelioDomain] =
    useState<FelioDomain | null>(
      getInitialDomain(availableDomains, selectedWebsite)
    );

  const form = useForm<WebsiteFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteName: selectedWebsite?.name || "",
      idTemplate: "",
      idDomain: "",
      idWebsite: selectedWebsite?.id || "",
    },
  });

  const addWebsiteMutation = useMutation({ mutationFn: addWebsite });
  const updateWebsiteMutation = useMutation({ mutationFn: updateWebsite });

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const stateValues = {
      ...form.getValues(),
      idTemplate: selectedTemplate?.id || "",
      idDomain: availableDomains?.length ? availableDomains[0].id : "",
    };

    if (selectedWebsite) {
      updateWebsiteMutation
        .mutateAsync({
          baseUrl: import.meta.env.VITE_DSTORE_API,
          stateValues,
          token: dataAuth.token,
        })
        .then((data) => {
          if (data.success) {
            onSubmit();
            onClose();
          } else {
            toast({
              title: "Website Gagal Diubah",
              description: data.msg,
            });
          }
        })
        .catch((error) => {
          toast({
            title: "Ada masalah",
            description: "Coba lagi nanti",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      addWebsiteMutation
        .mutateAsync({
          baseUrl: import.meta.env.VITE_DSTORE_API,
          stateValues,
          token: dataAuth.token,
        })
        .then((data) => {
          if (data.success) {
            const anchor = document.createElement("a");
            anchor.href = `${import.meta.env.VITE_BUILDER_BUILD}?id=${
              data.data.id
            }`;
            anchor.target = "_blank";
            anchor.click();
            anchor.remove();
            onSubmit();
            onClose();
          } else {
            toast({
              title: "Website Gagal Dibuat",
              description: data.msg,
            });
          }
        })
        .catch((error) => {
          toast({
            title: "Ada masalah",
            description: "Coba lagi nanti",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const onUseTemplate = (template: Website) => {
    setSelectedTemplate(template);
  };

  const onCancel = () => {
    if (selectedTemplate || startFromBlank) {
      setSelectedTemplate(null);
      setStartFromBlank(false);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[1600px] md:max-w-[1600px] p-0`}
        style={{
          borderRadius: 12,
          ...(!selectedTemplate && !startFromBlank && !selectedWebsite
            ? null
            : {
                maxWidth: "600px",
              }),
        }}
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Buat Website</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6 pt-2">
          {selectedTemplate && (
            <WebsiteCard
              isSelectedTemplate={true}
              website={selectedTemplate}
              index={0}
            />
          )}
          {(selectedTemplate || startFromBlank || selectedWebsite) && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6 mx-1 mb-4 mt-8"
              >
                <FormField
                  control={form.control}
                  name="websiteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama Website{" "}
                        <b>
                          {selectedFelioDomain.domain || ""}/{field.value}
                        </b>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama website Anda"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}

          {!selectedTemplate && !startFromBlank && !selectedWebsite && (
            <>
              <div className="text-center">
                <Button type="button" onClick={() => setStartFromBlank(true)}>
                  Mulai dari halaman kosong
                </Button>

                <p className="my-6">atau gunakan template</p>
              </div>
              <div
                className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
              >
                {templates.map((template, index) => {
                  return (
                    <WebsiteCard
                      key={index}
                      isPreview={true}
                      website={template}
                      index={index}
                      onUseTemaple={onUseTemplate}
                    />
                  );
                })}
              </div>
            </>
          )}
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t">
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={onCancel}
          >
            {selectedTemplate ? "Kembali" : "Batal"}
          </Button>

          {(selectedTemplate || startFromBlank || selectedWebsite) && (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting
                ? "Menyimpan..."
                : selectedWebsite
                ? "Update Website"
                : "Buat Website"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebsiteTemplate;
