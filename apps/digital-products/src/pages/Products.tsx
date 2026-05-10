import { useEffect, useState } from "react";
import { PlusCircle, Search, Filter, Grid3X3, List } from "lucide-react";
import ProductCard, { Product } from "../components/dashboard/ProductCard";
import PageTransition from "../components/layout/PageTransition";
import CreateEditProductForm from "../components/dashboard/CreateEditProductForm";
import { AuthData, getAuthData } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "@/services/product";
import { toast } from "@/components/ui/use-toast";
import { dStoreStorageNames } from "@/utils/constants";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined
  );
  const [dataAuth, setDataAuth] = useState<AuthData>(null);
  const [selectedIdProduct, setSelectedIdProduct] = useState<string>("");

  useEffect(() => {
    const auth = getAuthData();
    if (auth) {
      setDataAuth(auth);
    }

    const onBoardingAction = localStorage.getItem(
      dStoreStorageNames.dStoreOnboarding
    );
    if (onBoardingAction === "createProduct") {
      localStorage.removeItem(dStoreStorageNames.dStoreOnboarding);
      handleCreateProduct();
    }
  }, []);

  const _getProducts = () => {
    if (!selectedIdProduct) {
      return getProducts({
        token: dataAuth.token,
        baseUrl: import.meta.env.VITE_DSTORE_API,
      }).then((data) => {
        if (data.success) {
          setProducts(data.data.products);
          return true;
        } else {
          toast({
            title: data.msg,
            description: data.msg,
          });

          throw new Error(data.msg);
        }
      });
    } else {
      return getProductById({
        token: dataAuth.token,
        baseUrl: import.meta.env.VITE_DSTORE_API,
        idProduct: selectedIdProduct,
      }).then((data) => {
        if (data.success) {
          if (data.data.product) {
            setEditingProduct({
              ...data.data.product,
              fileUrl:
                data.data.product.fileProduct?.source !== "direct_upload"
                  ? data.data.product.fileProduct.url
                  : "",
            });
          }
          setIsFormOpen(true);
          setSelectedIdProduct("");
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
  };

  const productQuery = useQuery({
    queryKey: ["products"],
    queryFn: _getProducts,
  });

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEditProduct = (id: string) => {
    setSelectedIdProduct(id);

    setTimeout(() => {
      productQuery.refetch();
    }, 500);
  };

  const handleCreateProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleSubmitProduct = (data: Omit<Product, "sales">) => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.code === editingProduct.code ? { ...p, ...data } : p
        )
      );
    } else {
      // Create new product with a generated ID
      const newProduct: Product = {
        sales: 0,
        ...data,
      };
      setProducts([newProduct, ...products]);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Produk</h1>
          <p className="text-muted-foreground">Kelola produk digital Anda</p>
        </header>

        <div className="flex flex-col mb-8">
          <div className="md:flex gap-2">
            {/*<button className="subtle-card flex items-center gap-2 px-4 py-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>*/}

            {/*<div className="subtle-card flex rounded-lg overflow-hidden">
              <button 
                className={`flex items-center justify-center p-2 ${viewMode === 'grid' ? 'bg-secondary' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button 
                className={`flex items-center justify-center p-2 ${viewMode === 'list' ? 'bg-secondary' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>*/}

            <button
              className="bg-primary text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-primary/90"
              onClick={handleCreateProduct}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm w-[120px] font-medium">Buat Produk</span>
            </button>

            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 md:ml-2 mt-4 md:mt-0 pr-4 py-2 w-full border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {productQuery.isLoading && <p className="text-center">Loading..</p>}

        {productQuery.isError && (
          <p className="text-center">Error Loading Data</p>
        )}

        {!productQuery.isLoading &&
          !productQuery.isError &&
          filteredProducts.length === 0 && (
            <div className="subtle-card p-8 text-center">
              <p className="text-lg font-medium">Anda belum memiliki produk</p>
            </div>
          )}

        {!productQuery.isLoading &&
          !productQuery.isError &&
          filteredProducts.length > 0 && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onDelete={handleDeleteProduct}
                  onEdit={handleEditProduct}
                  dataAuth={dataAuth}
                />
              ))}
            </div>
          )}

        {isFormOpen && (
          <CreateEditProductForm
            isOpen={isFormOpen}
            dataAuth={dataAuth}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleSubmitProduct}
            initialData={editingProduct}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default Products;
