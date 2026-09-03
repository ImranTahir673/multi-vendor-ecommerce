import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";

const AllOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shop Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-100 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-left text-sm uppercase">
              <th className="py-3 px-4 border-b">Order ID</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Items Qty</th>
              <th className="py-3 px-4 border-b">Total</th>
              <th className="py-3 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((item) => (
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
                  <td className="py-3 px-4">
                    <Link to={`/order/${item._id}`}>
                      <button className="text-blue-600 hover:text-blue-800">
                        <AiOutlineArrowRight size={20} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <p className="text-center py-8 text-gray-400">No orders received yet.</p>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
