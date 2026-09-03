import React, { useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";

const FAQPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <Faq />
      <Footer />
    </div>
  );
};

const Faq = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  const faqData = [
    {
      q: "What is your return policy?",
      a: "We offer a 30-day money-back return policy on all eligible marketplace purchases. If you are unsatisfied with your order, you can initiate a refund request directly through your buyer dashboard under the order details page.",
    },
    {
      q: "How do I track my order?",
      a: "Once an order is confirmed and marked as transferred to a delivery partner, you can click on 'Track Order' in your account profile to monitor real-time delivery status updates from 'Processing' to 'Delivered'.",
    },
    {
      q: "How do I become a seller on E-Shop?",
      a: "Click on the 'Become Seller' button in the top navigation bar, register your shop with your business email, store address, and phone number, and verify your account via the activation link sent to your inbox.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support secure global card payments powered by Stripe Elements (Visa, MasterCard, American Express) as well as Cash on Delivery (COD) for selected regions.",
    },
    {
      q: "How does seller payout and withdrawal work?",
      a: "Sellers can set up their withdrawal bank method in their dashboard settings and request balance payouts anytime their available balance exceeds $50. Requests are reviewed and processed by platform admins within 3-7 business days.",
    },
  ];

  return (
    <div className={`${styles.section} my-8`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
      <div className="mx-auto space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-4 cursor-pointer"
            onClick={() => toggleTab(index + 1)}
          >
            <button className="flex justify-between items-center w-full text-left focus:outline-none">
              <span className="text-lg font-medium text-gray-900">
                {item.q}
              </span>
              {activeTab === index + 1 ? (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {activeTab === index + 1 && (
              <div className="mt-4">
                <p className="text-base text-gray-500 leading-relaxed">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
