import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { server } from "../../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(1);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Review submission failed");
      });
  };

  const refundHandler = async () => {
    await axios
      .put(`${server}/order/order-refund/${id}`, {
        status: "Processing refund",
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Refund request failed");
      });
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
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
        data?.cart.map((item, index) => {
          return (
            <div className="w-full flex items-start mb-5 bg-white p-4 rounded shadow-sm" key={index}>
              <img
                src={`${item.images && item.images[0]?.url}`}
                alt=""
                className="w-[80x] h-[80px] object-cover rounded"
              />
              <div className="w-full pl-4">
                <h5 className="text-[20px] font-medium">{item.name}</h5>
                <h5 className="text-[20px] text-[#00000091] font-Roboto">
                  US${item.discountPrice} x {item.qty}
                </h5>
              </div>
              {!item.isReviewed && data?.status === "Delivered" ? (
                <div
                  className={`${styles.button} text-[#fff] !bg-[#3853db] hover:bg-[#2c42b8] !h-[40px] text-sm`}
                  onClick={() => setOpen(true) || setSelectedItem(item)}
                >
                  Write a review
                </div>
              ) : null}
            </div>
          );
        })}

      {/* review popup */}
      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[50%] h-min bg-[#fff] shadow rounded-md p-6 relative">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[25px] font-[500] font-Poppins text-center">
              Give a Review
            </h2>
            <br />
            <div className="w-full flex items-center">
              <img
                src={`${selectedItem?.images && selectedItem?.images[0]?.url}`}
                alt=""
                className="w-[70px] h-[70px] object-cover rounded"
              />
              <div className="pl-3">
                <div className="text-[18px] font-medium">{selectedItem?.name}</div>
                <h4 className="text-[18px] font-Roboto text-red-600">
                  US${selectedItem?.discountPrice} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            {/* ratings */}
            <h5 className="pl-1 text-[18px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-1 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-1">
              <label className="block text-[18px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? What did you like or dislike about it?"
                className="mt-2 w-[98%] border p-2 rounded-md outline-none"
              ></textarea>
            </div>
            <div
              className={`${styles.button} text-white text-[18px] ml-1 bg-[#3853db] hover:bg-[#2c42b8]`}
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right py-3">
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
          <br />
          {data?.status === "Delivered" && (
            <div
              className={`${styles.button} text-white bg-red-600 hover:bg-red-700 !w-[180px] !h-[42px]`}
              onClick={refundHandler}
            >
              Request a Refund
            </div>
          )}
        </div>
      </div>
      <br />
      <Link to="/profile">
        <div className={`${styles.button} text-white`}>Back to Orders</div>
      </Link>
      <br />
      <br />
    </div>
  );
};

export default UserOrderDetails;
