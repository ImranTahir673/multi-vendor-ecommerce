import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  React.useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      // Check if simulated or real
      if (client_secret.startsWith("pi_test_") && !client_secret.includes("_secret_")) {
        // Fallback simulation for offline testing
        order.paymentInfo = {
          id: client_secret,
          status: "succeeded",
          type: "Credit Card (Simulated)",
        };

        await axios
          .post(`${server}/order/create-order`, order, config)
          .then((res) => {
            setOpen(false);
            navigate("/order/success");
            toast.success("Order successful!");
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.setItem("latestOrder", JSON.stringify([]));
            window.location.reload();
          });
      } else {
        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
          },
        });

        if (result.error) {
          toast.error(result.error.message);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            order.paymentInfo = {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              type: "Credit Card",
            };

            await axios
              .post(`${server}/order/create-order`, order, config)
              .then((res) => {
                setOpen(false);
                navigate("/order/success");
                toast.success("Order successful!");
                localStorage.setItem("cartItems", JSON.stringify([]));
                localStorage.setItem("latestOrder", JSON.stringify([]));
                window.location.reload();
              });
          }
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order placed successfully via Cash on Delivery!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8 shadow-sm">
      {/* select 1: Credit / Debit card */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full border-[3px] border-[#1d1a1ab4] flex items-center justify-center cursor-pointer"
            onClick={() => setSelect(1)}
          >
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Pay with Debit/credit card
          </h4>
        </div>

        {/* pay with card */}
        {select === 1 ? (
          <div className="w-full flex border-b">
            <form className="w-full" onSubmit={paymentHandler}>
              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-medium">Card Holder Name</label>
                  <input
                    required
                    placeholder={user && user.name}
                    className={`${styles.input} !w-[95%] text-[#444]`}
                    value={user && user.name}
                    readOnly
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-medium">Exp Date</label>
                  <div className={`${styles.input} bg-white flex items-center py-2.5`}>
                    <CardExpiryElement
                      className="w-full"
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#444",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-medium">Card Number</label>
                  <div className={`${styles.input} !w-[95%] bg-white flex items-center py-2.5`}>
                    <CardNumberElement
                      className="w-full"
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#444",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-medium">CVV</label>
                  <div className={`${styles.input} bg-white flex items-center py-2.5`}>
                    <CardCvcElement
                      className="w-full"
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#444",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <input
                type="submit"
                value="Submit Payment"
                className={`${styles.button} !bg-[#f63b60] hover:bg-[#e02e52] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        ) : null}
      </div>

      <br />
      {/* select 2: Cash on Delivery */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full border-[3px] border-[#1d1a1ab4] flex items-center justify-center cursor-pointer"
            onClick={() => setSelect(2)}
          >
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Cash on Delivery
          </h4>
        </div>

        {/* cash on delivery */}
        {select === 2 ? (
          <div className="w-full flex">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <p className="text-gray-600 text-sm mb-4">
                Pay in cash when your package is delivered to your doorstep.
              </p>
              <input
                type="submit"
                value="Confirm Order (Cash on Delivery)"
                className={`${styles.button} !bg-[#f63b60] hover:bg-[#e02e52] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] !w-[280px]`}
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8 shadow-sm">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${orderData?.subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData?.discountPrice ? "$" + orderData.discountPrice : "-"}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3 text-red-600">
        ${orderData?.totalPrice}
      </h5>
    </div>
  );
};

export default Payment;
