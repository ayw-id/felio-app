import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brands, Branches, PaymentSettings } from "@/components/business";
import Container from "@/components/ui/Container";
import { useToken } from "@/contexts/TokenContext";

const Brand = () => {
  const [activeTab, setActiveTab] = useState("branches");
  const { token, employeeRole } = useToken();
  const isAdmin = employeeRole === "admin";

  return (
    <Container
      title={"Business Management"}
      subTitle={"Kelola cabang dan pengaturan bisnis"}
    >
      <div className="space-y-6">
        {isAdmin ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`grid w-full grid-cols-2`}>
              {isAdmin && <TabsTrigger value="brands">Brands</TabsTrigger>}
              <TabsTrigger value="branches">Branches</TabsTrigger>
              {/*<TabsTrigger value="payments">Payment Settings</TabsTrigger>*/}
            </TabsList>

            {isAdmin && (
              <TabsContent value="brands" className="space-y-4">
                <Brands />
              </TabsContent>
            )}

            <TabsContent value="branches" className="space-y-4">
              <Branches />
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <PaymentSettings />
            </TabsContent>
          </Tabs>
        ) : (
          <Branches />
        )}
      </div>
    </Container>
  );
};

export default Brand;
