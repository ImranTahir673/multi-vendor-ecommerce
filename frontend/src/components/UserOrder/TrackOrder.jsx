import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const data = orders && orders.find((item) => item._id === id);

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-lg text-center">
        <h2 className="text-xl font-bold mb-4">Order Shipment Tracking</h2>
        {data && data?.status === "Processing" ? (
          <h1 className="text-[20px] text-amber-600 font-medium">Your Order is processing in shop.</h1>
        ) : data?.status === "Transferred to delivery partner" ? (
          <h1 className="text-[20px] text-blue-600 font-medium">Your Order is on the way to delivery partner.</h1>
        ) : data?.status === "Shipping" ? (
          <h1 className="text-[20px] text-indigo-600 font-medium">
            Your Order is on the way with our delivery partner.
          </h1>
        ) : data?.status === "Received" ? (
          <h1 className="text-[20px] text-purple-600 font-medium">
            Your Order is in your city. Our Delivery man will deliver soon.
          </h1>
        ) : data?.status === "On the way" ? (
          <h1 className="text-[20px] text-teal-600 font-medium">
            Our Delivery man is on the way to deliver your package!
          </h1>
        ) : data?.status === "Delivered" ? (
          <h1 className="text-[20px] text-green-600 font-bold">Your order has been delivered!</h1>
        ) : data?.status === "Processing refund" ? (
          <h1 className="text-[20px] text-red-500 font-medium">Your refund is processing!</h1>
        ) : data?.status === "Refund Success" ? (
          <h1 className="text-[20px] text-green-600 font-medium">Your refund was successful!</h1>
        ) : (
          <h1 className="text-gray-500">Tracking information updating...</h1>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
