import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const ShopOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");

  const { id } = useParams();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Order status updated!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to update order status");
      });
  };

  const refundOrderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Refund processed successfully!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to process refund");
      });
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Fulfillment Details</h1>
        </div>
        <Link to="/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
          >
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id?.slice(0, 10)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start mb-5 bg-white p-4 rounded shadow-sm" key={index}>
            <img
              src={`${item.images && item.images[0]?.url}`}
              alt=""
              className="w-[80px] h-[80px] object-cover rounded"
            />
            <div className="w-full pl-4">
              <h5 className="text-[20px] font-medium">{item.name}</h5>
              <h5 className="text-[20px] text-[#00000091] font-Roboto">
                US${item.discountPrice} x {item.qty}
              </h5>
            </div>
          </div>
        ))}

      <div className="border-t w-full text-right py-2">
        <h5 className="pt-3 text-[18px] font-bold text-gray-800">
          Total Price: <strong>US${data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-start bg-white p-6 rounded shadow-sm">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-2 text-[16px] text-[#00000084]">
            {data?.shippingAddress.address1 + " " + data?.shippingAddress.address2}
          </h4>
          <h4 className="text-[16px] text-[#00000084]">
            {data?.shippingAddress.country}
          </h4>
          <h4 className="text-[16px] text-[#00000084]">
            {data?.shippingAddress.city}
          </h4>
          <h4 className="text-[16px] text-[#00000084]">
            {data?.user?.phoneNumber}
          </h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px] font-[600]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
        </div>
      </div>
      <br />
      <br />
      <div className="bg-white p-6 rounded shadow-sm">
        <h4 className="text-[20px] font-[600]">Order Status Update:</h4>
        <p className="text-gray-500 text-sm mt-1 mb-4">
          Current status: <strong className="text-blue-600">{data?.status}</strong>
        </p>
        {data?.status !== "Processing refund" &&
          data?.status !== "Refund Success" && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-[250px] mt-2 border h-[38px] rounded-[5px] px-2 font-medium"
            >
              {[
                "Processing",
                "Transferred to delivery partner",
                "Shipping",
                "Received",
                "On the way",
                "Delivered",
              ]
                .slice(
                  [
                    "Processing",
                    "Transferred to delivery partner",
                    "Shipping",
                    "Received",
                    "On the way",
                    "Delivered",
                  ].indexOf(data?.status)
                )
                .map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))}
            </select>
          )}
        {data?.status === "Processing refund" ||
        data?.status === "Refund Success" ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-[250px] mt-2 border h-[38px] rounded-[5px] px-2 font-medium"
          >
            {["Processing refund", "Refund Success"]
              .slice(
                ["Processing refund", "Refund Success"].indexOf(data?.status)
              )
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
        ) : null}

        <div
          className={`${styles.button} mt-5 !bg-[#3853db] hover:bg-[#2b42b8] !rounded-[4px] text-white font-[600] !h-[45px] text-[18px]`}
          onClick={
            data?.status === "Processing refund"
              ? refundOrderUpdateHandler
              : orderUpdateHandler
          }
        >
          Update Status
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default ShopOrderDetails;
