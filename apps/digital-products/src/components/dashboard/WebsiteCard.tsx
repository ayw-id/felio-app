import { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Eye,
  ShoppingCart,
  ExternalLink,
  HandHeart,
  PaintRoller,
  Briefcase,
  Trash2,
  Edit,
  MonitorCog,
  Crown,
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
import { deleteWebsite } from "@/services/website";
import { activateBuilderAccount } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { storageNames } from "@/utils/constants";

export interface Website {
  id: string;
  idWebsite: string;
  thumbnail: string;
  name?: string;
  colorDisplay?: string;
  isPublished?: boolean;
  type?: "prop" | "basic";
}

interface WebsiteCardProps {
  dataAuth?: AuthData;
  builderAuth?: AuthData;
  website: Website;
  index: number;
  isPreview?: boolean;
  isSelectedTemplate?: boolean;
  onUseTemaple?: (template: Website) => void;
  onDelete?: (id: string) => void;
  onEditInfo?: (website: string) => void;
}

const WebsiteCard = ({
  dataAuth,
  builderAuth,
  website,
  index,
  onDelete,
  onEditInfo,
  onUseTemaple,
  isPreview = false,
  isSelectedTemplate = false,
}: WebsiteCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPro = website.type === "pro";

  const deleteWebsiteMutation = useMutation({ mutationFn: deleteWebsite });
  const activateBuilderAccountMutation = useMutation({
    mutationFn: activateBuilderAccount,
  });

  const handleShare = () => {
    window.navigator.clipboard.writeText(
      `${website.domainData.felioDomain}/${website.domainData.hostName}`
    );

    toast({
      title: "Link url berhasi dicopy",
    });
  };

  const handleDelete = () => {
    deleteWebsiteMutation
      .mutateAsync({
        baseUrl: import.meta.env.VITE_DSTORE_API,
        token: dataAuth.token,
        webId: website.id,
      })
      .then((data) => {
        if (data.success) {
          if (onDelete) {
            onDelete(website.id);
            toast({
              title: "Website deleted",
              description: `${website.name} has been deleted successfully.`,
            });
          }
        } else {
          toast({
            title: "Website gagal dihapus",
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

  const handleEditInfo = () => {
    if (onEditInfo) {
      onEditInfo(website);
    }
  };

  const handleEditWebsite = () => {
    if (builderAuth) {
      goToBuilder();
    } else {
      console.warn("ppp", dataAuth);
      activateBuilderAccountMutation
        .mutateAsync({
          baseUrl: import.meta.env.VITE_DSTORE_API,
          token: dataAuth.token,
        })
        .then((data) => {
          if (data.success) {
            if (data.data.builderToken) {
              const token = {
                token: data.data.builderToken,
              };
              localStorage.setItem(
                storageNames.builderToken as string,
                JSON.stringify(token)
              );

              goToBuilder();
            } else {
              toast({
                title: "Token tidak ditemukan",
                description: data.msg,
              });
            }
          } else {
            toast({
              title: "Builder tidak dapat diaktifkan",
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
    }
  };

  const goToBuilder = () => {
    const anchor = document.createElement("a");
    anchor.href = `${import.meta.env.VITE_BUILDER_BUILD}?id=${
      website.idWebsite
    }`;
    anchor.target = "_blank";
    anchor.click();
    anchor.remove();
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
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={{
          backgroundColor:
            !website.thumbnail && website.colorDisplay
              ? website.colorDisplay
              : "",
        }}
      >
        {website.thumbnail && (
          <div className="relative inline-block">
            <img
              src={website.thumbnail}
              alt={website.name || website.thumbnail}
              className="w-full h-full object-cover transition-transform duration-500"
            />
            <div className="absolute top-0 right-0 text-white text-sm px-2 py-1 rounded-bl">
              {isPreview && isPro && (
                <div
                  className="bg-yellow-500 w-12 grid justify-center py-2"
                  style={{ borderRadius: 12 }}
                >
                  <Crown className="w-5 h-5" color="white" />
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        />
      </div>

      <div className="p-5">
        <h3 className="font-medium text-lg mb-2">{website.name}</h3>
        {!isPreview && !isSelectedTemplate && (
          <>
            <div className="mt-4 flex gap-2">
              {website.isPublished && (
                <Button
                  variant="secondary"
                  className="flex items-center justify-center gap-1.5 w-10 h-10"
                  style={{ alignItems: "center", justifyContent: "center" }}
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="secondary"
                className="flex bg-blue-500 items-center text-primary-foreground justify-center gap-1.5 w-10 h-10"
                onClick={handleEditInfo}
              >
                <Edit className="w-4 h-4" />
                {/*<span>Edit Info</span>*/}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-10 h-10">
                    <Trash2 className="" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Anda yakin ingin menghapus website ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Website <strong> {website.name}</strong> akan dihapus
                      secara permanen.
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

            <Button
              variant="secondary"
              className="mt-4 w-[100%] flex items-center justify-center gap-1.5"
              style={{ backgroundColor: "#0096FF" }}
              onClick={handleEditWebsite}
            >
              <MonitorCog className="w-4 h-4 text-white" />
              <span style={{ color: "white" }}>Edit Website</span>
            </Button>

            {website.isPublished && (
              <div className="mt-2">
                <Link
                  to={`${website.domainData.felioDomain}/${website.domainData.hostName}`}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-2 px-3 rounded-md text-sm font-medium transition-colors hover:bg-primary/90"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat Website</span>
                </Link>
              </div>
            )}
          </>
        )}

        {isPreview && (
          <div className="mt-4 grid">
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-1.5"
              onClick={() => onUseTemaple(website)}
            >
              <Edit className="w-4 h-4" />
              <span>Gunakan Template</span>
            </Button>
          </div>
        )}

        {isPreview && (
          <div className="mt-2">
            <Link
              to={`${
                isPreview ? import.meta.env.VITE_BUILDER_PREVIEW : ""
              }?id=${website.id}&type=template`}
              target="_blank"
              className="flex items-center justify-center gap-1.5 bg-blue-500 text-primary-foreground py-2 px-3 rounded-md text-sm font-medium transition-colors hover:bg-primary/90"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WebsiteCard;
