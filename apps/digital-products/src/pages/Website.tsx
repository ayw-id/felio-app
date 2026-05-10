import { useEffect, useState } from "react";
import { PlusCircle, Search, Filter, Grid3X3, List } from "lucide-react";
import WebsiteCard, {
  Website,
  AvailableDomain,
} from "../components/dashboard/WebsiteCard";
import PageTransition from "../components/layout/PageTransition";
import WebsiteTemplate from "../components/dashboard/WebsiteTemplate";
import { AuthData, getAuthData } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import {
  getWebsites,
  getTemplates,
  getAvailableDomains,
} from "@/services/website";
import { getBuilderToken } from "@/services/auth";
import { toast } from "@/components/ui/use-toast";
import { dStoreStorageNames } from "@/utils/constants";

const Website = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dataAuth, setDataAuth] = useState<AuthData>(null);
  const [builderDataAuth, setBuilderDataAuth] = useState<AuthData>(null);
  const [templates, setTemplates] = useState<Website[]>([]);
  const [availableDomains, setAvailableDomains] = useState<AvailableDomain[]>(
    []
  );
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);

  useEffect(() => {
    const auth = getAuthData();
    if (auth) {
      setDataAuth(auth);
    }

    const builderAuth = getBuilderToken();
    if (builderAuth) {
      setBuilderDataAuth(builderAuth);
    }

    const onBoardingAction = localStorage.getItem(
      dStoreStorageNames.dStoreOnboarding
    );
    if (onBoardingAction === "createWebsite") {
      localStorage.removeItem(dStoreStorageNames.dStoreOnboarding);
      handleCreateWebsite();
    }
  }, []);

  const _getWebsites = () => {
    return getWebsites({
      token: dataAuth.token,
      baseUrl: import.meta.env.VITE_DSTORE_API,
    }).then((data) => {
      if (data.success) {
        setWebsites(data.data.websites);
        return true;
      } else {
        toast({
          title: data.msg,
          description: data.msg,
        });

        throw new Error(data.msg);
      }
    });
  };

  const websiteQuery = useQuery({
    queryKey: ["websites"],
    queryFn: _getWebsites,
  });

  const _getTemplates = () => {
    return getTemplates({
      baseUrl: import.meta.env.VITE_BUILDER_API,
    }).then((data) => {
      if (data.success) {
        setTemplates(data.data.templates);
        return true;
      } else {
        toast({
          title: data.msg,
          description: data.msg,
        });

        throw new Error(data.msg);
      }
    });
  };

  const _getAvailableDomains = () => {
    return getAvailableDomains({
      baseUrl: import.meta.env.VITE_DSTORE_API,
    }).then((data) => {
      if (data.success) {
        setAvailableDomains(data.data.domains);
        return true;
      } else {
        toast({
          title: data.msg,
          description: data.msg,
        });

        throw new Error(data.msg);
      }
    });
  };

  const availableDomainsQuery = useQuery({
    queryKey: ["availableDomains"],
    queryFn: _getAvailableDomains,
  });

  const templateQuery = useQuery({
    queryKey: ["templates"],
    queryFn: _getTemplates,
  });

  const filteredWebsites = websites.filter((website) =>
    website.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteWebsite = (id: string) => {
    setWebsites(websites.filter((website) => website.id !== id));
  };

  const handleCreateWebsite = () => {
    setIsFormOpen(true);
  };

  const handleSubmitWebsite = () => {
    websiteQuery.refetch();
  };

  const handleEditInfo = (website: Website) => {
    setSelectedWebsite(website);
    setIsFormOpen(true);
  };

  const onFormClosed = () => {
    setIsFormOpen(false);
    setSelectedWebsite(null);
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Website</h1>
          <p className="text-muted-foreground">Kelola website Anda</p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
          {/*<div className="relative grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search websites..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>*/}

          <div className="flex gap-2">
            {/*<button className="subtle-card flex items-center gap-2 px-4 py-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            
            <div className="subtle-card flex rounded-lg overflow-hidden">
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
              onClick={handleCreateWebsite}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm w-[120px] font-medium">
                Buat Website
              </span>
            </button>
          </div>
        </div>

        {websiteQuery.isLoading && <p className="text-center">Loading..</p>}

        {websiteQuery.isError && (
          <p className="text-center">Error Loading Data</p>
        )}

        {!websiteQuery.isLoading &&
          !websiteQuery.isError &&
          filteredWebsites.length === 0 && (
            <div className="subtle-card p-8 text-center">
              <p className="text-lg font-medium">Anda belum memiliki website</p>
            </div>
          )}

        {!websiteQuery.isLoading &&
          !websiteQuery.isError &&
          filteredWebsites.length > 0 && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredWebsites.map((website, index) => (
                <WebsiteCard
                  key={website.id}
                  website={website}
                  index={index}
                  onDelete={handleDeleteWebsite}
                  dataAuth={dataAuth}
                  onEditInfo={handleEditInfo}
                  builderAuth={builderDataAuth}
                />
              ))}
            </div>
          )}
        {isFormOpen && (
          <WebsiteTemplate
            isOpen={isFormOpen}
            dataAuth={dataAuth}
            templates={templates}
            selectedWebsite={selectedWebsite}
            onClose={onFormClosed}
            onSubmit={handleSubmitWebsite}
            availableDomains={availableDomains}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default Website;
