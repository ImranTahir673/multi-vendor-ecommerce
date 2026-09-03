import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div
      className={`w-full block bg-white rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-4 shadow-sm`}
    >
      <div className="w-full lg:-w[50%] m-auto flex justify-center">
        <img
          src={`${data?.images && data?.images[0]?.url}`}
          alt=""
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80";
          }}
          className="max-h-[300px] object-contain rounded"
        />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center pl-4">
        <h2 className={`${styles.productTitle}`}>{data?.name}</h2>
        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
          {data?.description}
        </p>
        <div className="flex py-2 justify-between items-center">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              ${data?.originalPrice}
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              ${data?.discountPrice}
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data?.sold_out || 0} sold
          </span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data?._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
          <div
            className={`${styles.button} text-[#fff] ml-5 bg-[#3853db] hover:bg-[#2c42b8]`}
            onClick={() => addToCartHandler(data)}
          >
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
