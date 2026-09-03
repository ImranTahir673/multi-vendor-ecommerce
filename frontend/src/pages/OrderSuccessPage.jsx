import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import { Link } from "react-router-dom";
import { BsBagCheckFill } from "react-icons/bs";
import styles from "../styles/styles";

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
      <div className="bg-green-100 p-4 rounded-full mb-4">
        <BsBagCheckFill size={60} className="text-green-600" />
      </div>
      <h5 className="text-center mb-4 text-[25px] font-bold text-gray-800">
        Your order is successful!
      </h5>
      <p className="text-gray-600 text-center max-w-md mb-6">
        Thank you for shopping with E-Shop. Your order has been placed and split amongst our independent sellers. You can track your shipment status anytime in your profile dashboard.
      </p>
      <div className="flex gap-4">
        <Link to="/profile">
          <div className={`${styles.button} text-white`}>
            View Orders
          </div>
        </Link>
        <Link to="/products">
          <div className={`${styles.button} bg-[#3853db] hover:bg-[#2c43b8] text-white`}>
            Continue Shopping
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
