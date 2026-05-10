import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Calendar,
  Clock,
  Video,
  FileText,
  Users,
  Tag,
  HandHeart,
  PaintRoller,
  Briefcase,
  BarChart,
  Layers,
  Clock3,
} from "lucide-react";
import { Product } from "../components/dashboard/ProductCard";
import PageTransition from "../components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services/product";
import { AuthData, getAuthData } from "@/services/auth";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [dataAuth, setDataAuth] = useState<AuthData>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allProductImages, setAllProductImages] = useState<string[]>([]);

  const _getProduct = () => {
    if (id) {
      return getProductById({
        token: dataAuth.token,
        baseUrl: import.meta.env.VITE_DSTORE_API,
        idProduct: id,
      }).then((data) => {
        if (data.success) {
          setProduct(data.data.product);
          setAllProductImages(
            data.data.product.images.map((image) => image.url)
          );
          return true;
        } else {
          toast({
            title: data.msg,
            description: data.msg,
          });

          throw new Error(data.msg);
        }
      });
    }

    return false;
  };

  const productQuery = useQuery({
    queryKey: ["products"],
    queryFn: _getProduct,
  });

  useEffect(() => {
    const auth = getAuthData();
    if (auth) {
      setDataAuth(auth);
    }
  }, []);

  const handlePurchase = () => {
    toast({
      title: "Product purchased!",
      description: `You have successfully purchased ${product?.title}`,
    });
  };

  // Select a specific image in the carousel
  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (productQuery.isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading</h2>
          <Button onClick={() => navigate("/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </PageTransition>
    );
  }

  // Get the button text based on product type
  const getButtonText = () => {
    switch (product.type) {
      case "DONATION":
        return "Donate Now";
      case "GRAPHIC_DESIGN":
        return "Request Design";
      case "FREELANCE":
        return "Hire Now";
      default:
        return "Purchase Now";
    }
  };

  // Render different content based on product type
  const renderProductContent = () => {
    switch (product.type) {
      case "ECOURSE":
        return (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5" />
                  Course Content
                </CardTitle>
                <CardDescription>
                  Total Duration: {product.content?.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.content?.videos.map((video, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{video}</h4>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "EBOOK":
        return (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Book Content
                </CardTitle>
                <CardDescription>
                  {product.content?.pages} pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.content?.chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Chapter: {chapter}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "EVENT":
        return (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Event Details
                </CardTitle>
                <CardDescription>{product.content?.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-md bg-secondary/50">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">
                      {new Date(product.content?.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-md bg-secondary/50">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Featured Speakers:
                    </h4>
                    <ul className="list-disc pl-10 space-y-1">
                      {product.content?.speakers.map((speaker, index) => (
                        <li key={index}>{speaker}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "CONSULTATION":
        return (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Consultation Details
                </CardTitle>
                <CardDescription>
                  Duration: {product.content?.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-secondary/50">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Expert Consultants:
                    </h4>
                    <ul className="list-disc pl-10 space-y-1">
                      {product.content?.experts.map((expert, index) => (
                        <li key={index}>{expert}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-md bg-secondary/50">
                    <h4 className="font-medium mb-2">What's Included:</h4>
                    <ul className="list-disc pl-10 space-y-1">
                      {product.content?.includes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "DONATION":
        return (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HandHeart className="mr-2 h-5 w-5" />
                  Donation Impact
                </CardTitle>
                <CardDescription>{product.content?.impact}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-secondary/50">
                    <h4 className="font-medium mb-2 flex items-center">
                      <BarChart className="h-5 w-5 mr-2" />
                      Campaign Goals:
                    </h4>
                    <ul className="list-disc pl-10 space-y-1">
                      {product.content?.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>

                  {product.content?.testimonials && (
                    <div className="p-3 rounded-md bg-secondary/50">
                      <h4 className="font-medium mb-2">Testimonials:</h4>
                      <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
                        {product.content?.testimonials}
                      </blockquote>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "GRAPHIC_DESIGN":
        return (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PaintRoller className="mr-2 h-5 w-5" />
                  Design Package Details
                </CardTitle>
                <CardDescription>
                  Timeline: {product.content?.timeline}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-secondary/50">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Layers className="h-5 w-5 mr-2" />
                      Deliverables:
                    </h4>
                    <ul className="list-disc pl-10 space-y-1">
                      {product.content?.deliverables.map(
                        (deliverable, index) => (
                          <li key={index}>{deliverable}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center p-3 rounded-md bg-secondary/50">
                    <span className="font-medium mr-2">
                      Revisions Included:
                    </span>
                    <span>{product.content?.revisions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "FREELANCE":
        return (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Freelance Services
                </CardTitle>
                <CardDescription>{product.content?.experience}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-secondary/50">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Clock3 className="h-5 w-5 mr-2" />
                      Services Offered:
                    </h4>
                    <ul className="list-disc pl-10 space-y-1">
                      {product.content?.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-md bg-secondary/50">
                    <h4 className="font-medium mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.content?.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <p>No additional information available for this product type.</p>
        );
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4">
              {allProductImages.length > 0 && (
                <>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md mb-4">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {allProductImages.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-[3/4] relative">
                              <img
                                src={image}
                                alt={`${product.title} - image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {allProductImages.length > 1 && (
                        <>
                          <CarouselPrevious className="absolute left-2 bg-background/80 backdrop-blur-sm" />
                          <CarouselNext className="absolute right-2 bg-background/80 backdrop-blur-sm" />
                        </>
                      )}
                    </Carousel>
                  </div>

                  {/* Thumbnail Navigation */}
                  {allProductImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {allProductImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => selectImage(index)}
                          className={cn(
                            "aspect-square overflow-hidden rounded-md border-2",
                            currentImageIndex === index
                              ? "border-primary"
                              : "border-transparent"
                          )}
                        >
                          <img
                            src={image}
                            alt={`${product.title} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {product.status === "draft" && (
              <span className="inline-block bg-secondary/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-muted-foreground mb-4">
                Draft
              </span>
            )}

            <div className="subtle-card p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground uppercase">
                  Price
                </span>
                <span className="text-xl font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <Button className="w-full" onClick={handlePurchase}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {getButtonText()}
              </Button>
            </div>

            <div className="subtle-card p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase">
                Product Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium flex items-center">
                    <Tag className="mr-1 h-3 w-3" />
                    {product.type.charAt(0).toUpperCase() +
                      product.type.slice(1).replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales</span>
                  <span className="font-medium">{product.sales} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`font-medium ${
                      product.status === "published"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {product.status.charAt(0).toUpperCase() +
                      product.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <Tabs defaultValue="content" className="mb-6">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="pt-4">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      Deskripsi Produk
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {product.content?.videos.map((video, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white mr-3">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{video}</h4>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {renderProductContent()}
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>
                      See what our customers say about this product
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to leave a review!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="support" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Support</CardTitle>
                    <CardDescription>
                      Need help with this product?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      For any questions or issues, please contact our support
                      team:
                    </p>
                    <p className="text-muted-foreground">
                      support@digistore.com
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetails;
