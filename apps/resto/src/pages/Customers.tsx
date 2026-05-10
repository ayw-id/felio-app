import CustomersComponent from "@/components/customer";
import Container from "@/components/ui/Container";

const Customers = () => {
  return (
    <Container
      title={"Customer Management"}
      subTitle={"Manage your customers and their orders"}
    >
      <CustomersComponent />
    </Container>
  );
};

export default Customers;
