import React, { useEffect } from "react";
import styles from "../../styles/styles";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import { getAllSellers } from "../../redux/actions/sellers";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);

  const adminBalance = adminEarning?.toFixed(2);

  return (
    <>
      <div className="w-full p-8">
        <h3 className="text-[22px] font-Poppins pb-2">Admin Overview</h3>
        <div className="w-full block 800px:flex items-center justify-between">
          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <AiOutlineMoneyCollect
                size={30}
                className="mr-2"
                fill="#00000085"
              />
              <h3
                className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
              >
                Platform Commission Earnings
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500] font-Roboto">
              ${adminBalance || 0}
            </h5>
          </div>

          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <MdBorderClear size={30} className="mr-2" fill="#00000085" />
              <h3
                className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
              >
                All Sellers
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {sellers && sellers.length}
            </h5>
            <Link to="/admin-sellers">
              <h5 className="pt-4 pl-[36px] text-[#077eff]">View Sellers</h5>
            </Link>
          </div>

          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <AiOutlineMoneyCollect
                size={30}
                className="mr-2"
                fill="#00000085"
              />
              <h3
                className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
              >
                All Orders
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {adminOrders && adminOrders.length}
            </h5>
            <Link to="/admin-orders">
              <h5 className="pt-4 pl-[36px] text-[#077eff]">View Orders</h5>
            </Link>
          </div>
        </div>

        <br />
        <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
        <div className="w-full min-h-[45vh] bg-white rounded shadow-sm overflow-x-auto p-4">
          <table className="min-w-full bg-white border border-gray-100 rounded-lg">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-left text-sm uppercase">
                <th className="py-3 px-4 border-b">Order ID</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Items</th>
                <th className="py-3 px-4 border-b">Total</th>
                <th className="py-3 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {adminOrders &&
                adminOrders.slice(0, 6).map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="py-3 px-4 font-mono">{item._id.slice(0, 10)}...</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.cart.length}</td>
                    <td className="py-3 px-4 font-semibold font-Roboto">${item.totalPrice}</td>
                    <td className="py-3 px-4 text-gray-500">{item.createdAt?.slice(0, 10)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {(!adminOrders || adminOrders.length === 0) && (
            <p className="text-center py-8 text-gray-400">No platform orders yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardMain;
