import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    toast.success("Product deleted successfully!");
    window.location.reload();
  };

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-100 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-left text-sm uppercase">
              <th className="py-3 px-4 border-b">Product ID</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Price</th>
              <th className="py-3 px-4 border-b">Stock</th>
              <th className="py-3 px-4 border-b">Sold</th>
              <th className="py-3 px-4 border-b">Preview</th>
              <th className="py-3 px-4 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="py-3 px-4 font-mono">{item._id.slice(0, 10)}...</td>
                  <td className="py-3 px-4 font-medium max-w-[200px] truncate">{item.name}</td>
                  <td className="py-3 px-4 font-semibold font-Roboto">${item.discountPrice}</td>
                  <td className="py-3 px-4">{item.stock}</td>
                  <td className="py-3 px-4">{item.sold_out || 0}</td>
                  <td className="py-3 px-4">
                    <Link to={`/product/${item._id}`}>
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
        {(!products || products.length === 0) && (
          <p className="text-center py-8 text-gray-400">No products uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
