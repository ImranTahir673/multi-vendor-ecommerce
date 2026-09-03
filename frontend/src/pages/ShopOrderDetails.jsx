import React from "react";
import DashboardHeader from "../components/Shop/Layout/DashboardHeader";
import Footer from "../components/Layout/Footer";
import ShopOrderDetails from "../components/Shop/ShopOrderDetails";

const ShopOrderDetailsPage = () => {
  return (
    <div>
      <DashboardHeader />
      <ShopOrderDetails />
      <Footer />
    </div>
  );
};

export default ShopOrderDetailsPage;
