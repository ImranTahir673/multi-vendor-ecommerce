import React from "react";
import styles from "../../styles/styles";

const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap">
        <div className={`${styles.noramlFlex}`}>
          <div className={`${styles.cart_button} !h-[35px]`}>
            <span className={`${styles.cart_button_text} !text-[14px]`}>
              1. Shipping
            </span>
          </div>
          <div
            className={`${
              active > 1
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#fdb1c1]"
            }`}
          />
        </div>

        <div className={`${styles.noramlFlex}`}>
          <div
            className={`${
              active > 1
                ? `${styles.cart_button} !h-[35px]`
                : `${styles.cart_button} !h-[35px] !bg-[#fdb1c1]`
            }`}
          >
            <span className={`${styles.cart_button_text} !text-[14px]`}>
              2. Payment
            </span>
          </div>
        </div>

        <div className={`${styles.noramlFlex}`}>
          <div
            className={`${
              active > 2
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#fdb1c1]"
            }`}
          />
          <div
            className={`${
              active > 2
                ? `${styles.cart_button} !h-[35px]`
                : `${styles.cart_button} !h-[35px] !bg-[#fdb1c1]`
            }`}
          >
            <span className={`${styles.cart_button_text} !text-[14px]`}>
              3. Success
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
