import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupons(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [seller]);

  const handleDelete = async (id) => {
    axios
      .delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success("Coupon code deleted successfully!");
        setCoupons(coupons.filter((i) => i._id !== id));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProduct: selectedProducts,
          value,
          shopId: seller._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Coupon code created successfully!");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to create coupon");
      });
  };

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white p-4 rounded-lg shadow-sm">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Discount Coupons</h2>
        <div
          className={`${styles.button} !w-max !h-[45px] px-4 !rounded-[5px] mr-3 bg-blue-600 hover:bg-blue-700`}
          onClick={() => setOpen(true)}
        >
          <span className="text-white font-medium">Create Coupon Code</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-100 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-left text-sm uppercase">
              <th className="py-3 px-4 border-b">Coupon ID</th>
              <th className="py-3 px-4 border-b">Code Name</th>
              <th className="py-3 px-4 border-b">Discount</th>
              <th className="py-3 px-4 border-b">Min Amount</th>
              <th className="py-3 px-4 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {coupons &&
              coupons.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="py-3 px-4 font-mono">{item._id.slice(0, 10)}...</td>
                  <td className="py-3 px-4 font-bold tracking-wider uppercase text-indigo-600">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 font-semibold">{item.value} %</td>
                  <td className="py-3 px-4 font-Roboto">
                    {item.minAmount ? "$" + item.minAmount : "-"}
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
        {(!coupons || coupons.length === 0) && (
          <p className="text-center py-8 text-gray-400">No discount coupons created yet.</p>
        )}
      </div>

      {open && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-6 overflow-y-auto">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h5 className="text-[30px] font-Poppins text-center">
              Create Coupon Code
            </h5>
            {/* create coupon form */}
            <form onSubmit={handleSubmit}>
              <br />
              <div>
                <label className="pb-2 font-medium text-sm">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase font-mono"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter coupon code (e.g. FLASH20)..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2 font-medium text-sm">
                  Discount Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="value"
                  value={value}
                  required
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter discount percentage (e.g. 15)..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2 font-medium text-sm">Min Order Amount</label>
                <input
                  type="number"
                  name="value"
                  value={minAmount}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="Enter minimum cart amount..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2 font-medium text-sm">Max Order Amount</label>
                <input
                  type="number"
                  name="value"
                  value={maxAmount}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="Enter maximum cart amount..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2 font-medium text-sm">Selected Product</label>
                <select
                  className="w-full mt-2 border h-[35px] rounded-[5px]"
                  value={selectedProducts}
                  onChange={(e) => setSelectedProducts(e.target.value)}
                >
                  <option value="Choose your selected products">
                    Apply to all products
                  </option>
                  {products &&
                    products.map((i) => (
                      <option value={i.name} key={i.name}>
                        {i.name}
                      </option>
                    ))}
                </select>
              </div>
              <br />
              <div>
                <input
                  type="submit"
                  value="Create Coupon"
                  className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[40px] border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white rounded-[5px] font-medium"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCoupons;
