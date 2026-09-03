import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSellers } from "../../redux/actions/sellers";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllSellers());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to delete seller");
      });
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Marketplace Sellers</h2>
      <div className="w-full bg-white rounded shadow-sm overflow-x-auto p-4">
        <table className="min-w-full bg-white border border-gray-100 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-left text-sm uppercase">
              <th className="py-3 px-4 border-b">Seller ID</th>
              <th className="py-3 px-4 border-b">Shop Name</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Address</th>
              <th className="py-3 px-4 border-b">Preview</th>
              <th className="py-3 px-4 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {sellers &&
              sellers.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="py-3 px-4 font-mono">{item._id.slice(0, 10)}...</td>
                  <td className="py-3 px-4 font-semibold">{item.name}</td>
                  <td className="py-3 px-4">{item.email}</td>
                  <td className="py-3 px-4 text-gray-600">{item.address}</td>
                  <td className="py-3 px-4">
                    <Link to={`/shop/preview/${item._id}`}>
                      <button className="text-blue-600 hover:text-blue-800">
                        <AiOutlineEye size={20} />
                      </button>
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSellers;
