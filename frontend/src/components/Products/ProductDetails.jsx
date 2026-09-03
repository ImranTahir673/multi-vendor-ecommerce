import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../Ratings/Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && (data.shop?._id || data.shopId)) {
      dispatch(getAllProductsShop(data.shop?._id || data.shopId));
    }
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, dispatch, wishlist]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + (product.reviews?.length || 0), 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc +
        (product.reviews?.reduce((sum, rev) => sum + rev.rating, 0) || 0),
      0
    );

  const avg = totalRatings / (totalReviewsLength || 1);
  const averageRating = avg.toFixed(2);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop?._id || data.shopId;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Failed to start conversation");
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${data && data.images && data.images[select]?.url}`}
                  alt=""
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80";
                  }}
                  className="w-[80%] max-h-[400px] object-contain mx-auto rounded"
                />
                <div className="w-full flex mt-4 justify-center gap-2">
                  {data &&
                    data.images &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        className={`${
                          select === index ? "border-[2px] border-[#3853db]" : "border"
                        } cursor-pointer rounded p-1`}
                        onClick={() => setSelect(index)}
                      >
                        <img
                          src={`${i?.url}`}
                          alt=""
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80";
                          }}
                          className="h-[60px] w-[60px] object-cover rounded"
                        />
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  {data.description}
                </p>
                <div className="flex pt-3 items-center">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    ${data.discountPrice}
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? "$" + data.originalPrice : null}
                  </h3>
                </div>

                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center bg-[#3853db] hover:bg-[#2841b8]`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center text-sm font-medium">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${data?.shop?._id || data?.shopId}`}>
                    <img
                      src={`${data?.shop?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/869/869636.png"}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2 object-cover border"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop?._id || data?.shopId}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1 font-semibold`}>
                        {data.shop?.name || "Verified Store"}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating}/5) Ratings
                    </h5>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] hover:bg-[#5233be] !rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center text-sm font-medium">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-4 rounded my-8">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-4 text-[16px] leading-8 pb-10 whitespace-pre-line text-gray-700">
            {data.description}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[30vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-3 p-3 bg-white rounded shadow-sm" key={index}>
                <img
                  src={`${item.user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}`}
                  alt=""
                  className="w-[45px] h-[45px] rounded-full object-cover mr-3"
                />
                <div className="pl-2">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user?.name || "Verified Customer"}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{item.comment}</p>
                </div>
              </div>
            ))}

          {data && data.reviews && data.reviews.length === 0 && (
            <h5 className="text-gray-500 my-8">No Reviews have been posted for this product yet!</h5>
          )}
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop?._id || data.shopId}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.shop?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/869/869636.png"}`}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name} font-semibold`}>{data.shop?.name}</h3>
                  <h5 className="pb-2 text-[15px]">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2 text-gray-600 text-sm leading-relaxed">
              {data.shop?.description || "Independent certified seller on E-Shop Marketplace."}
            </p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500] text-gray-600">
                  {data.shop?.createdAt?.slice(0, 10) || "2026-01-01"}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500] text-gray-600">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500] text-gray-600">
                  {totalReviewsLength}
                </span>
              </h5>
              <Link to={`/shop/preview/${data.shop?._id || data.shopId}`}>
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-4`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
