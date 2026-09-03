import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
      })
      .catch((error) => {
      });
  }, [dispatch, id]);

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
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

  const averageRating = (totalRatings / (totalReviewsLength || 1)).toFixed(2);

  return (
    <div>
      <div className="w-full bg-white shadow-sm rounded-[4px] p-4">
        <div className="w-full flex item-center justify-center">
          <img
            src={`${data.avatar?.url || "https://cdn-icons-png.flaticon.com/512/869/869636.png"}`}
            alt=""
            className="w-[150px] h-[150px] object-cover rounded-full border-[3px] border-[#3853db]"
          />
        </div>
        <h3 className="text-center py-2 text-[20px] font-semibold">{data.name}</h3>
        <p className="text-[14px] text-gray-500 p-[10px] flex items-center leading-relaxed">
          {data.description || "Verified independent seller on E-Shop."}
        </p>
        <div className="p-3">
          <h5 className="font-[600]">Address</h5>
          <h4 className="text-[#000000a6] text-sm">{data.address}</h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600]">Phone Number</h5>
          <h4 className="text-[#000000a6] text-sm">{data.phoneNumber}</h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600]">Total Products</h5>
          <h4 className="text-[#000000a6] text-sm">{products && products.length}</h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600]">Shop Ratings</h5>
          <h4 className="text-[#000000a6] text-sm">{averageRating}/5</h4>
        </div>
        <div className="p-3">
          <h5 className="font-[600]">Joined On</h5>
          <h4 className="text-[#000000a6] text-sm">{data?.createdAt?.slice(0, 10)}</h4>
        </div>
        {isOwner && (
          <div className="py-3 px-4">
            <Link to="/settings">
              <div
                className={`${styles.button} !w-full !h-[42px] !rounded-[5px] !bg-[#3853db] hover:bg-[#2c42b8]`}
              >
                <span className="text-white font-medium">Edit Shop Profile</span>
              </div>
            </Link>
            <div
              className={`${styles.button} !w-full !h-[42px] !rounded-[5px] !bg-[#e44343] hover:bg-[#c93333] mt-3`}
              onClick={logoutHandler}
            >
              <span className="text-white font-medium">Log Out</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopInfo;
