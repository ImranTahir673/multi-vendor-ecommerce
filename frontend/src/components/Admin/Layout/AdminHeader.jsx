import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-6">
      <div>
        <Link to="/admin/dashboard">
          <span className="text-2xl font-bold tracking-wider text-gray-900">
            E<span className="text-[#3853db]">-Shop Admin</span>
          </span>
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/admin-orders" className="800px:block hidden">
            <FiPackage
              color="#555"
              size={28}
              className="mx-4 cursor-pointer hover:text-blue-600"
              title="All Platform Orders"
            />
          </Link>
          <Link to="/admin-sellers" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={28}
              className="mx-4 cursor-pointer hover:text-blue-600"
              title="All Verified Sellers"
            />
          </Link>
          <img
            src={`${user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}`}
            alt=""
            className="w-[50px] h-[50px] rounded-full object-cover border-[2px] border-[#3853db]"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
