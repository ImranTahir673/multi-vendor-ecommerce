import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";

const AllOrders = () => {
  const dispatch = useDispatch();
  const { adminOrders } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Marketplace Orders</h2>
      <div className="w-full bg-white rounded shadow-sm overflow-x-auto p-4">
        <table className="min-w-full bg-white border border-gray-100 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-left text-sm uppercase">
              <th className="py-3 px-4 border-b">Order ID</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Items</th>
              <th className="py-3 px-4 border-b">Total</th>
              <th className="py-3 px-4 border-b">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {adminOrders &&
              adminOrders.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="py-3 px-4 font-mono">{item._id}</td>
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
          <p className="text-center py-8 text-gray-400">No platform orders placed yet.</p>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
