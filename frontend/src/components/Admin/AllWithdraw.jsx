import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
      });
  }, []);

  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.sellerId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to update withdraw request");
      });
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Seller Payout Withdraw Requests</h2>
      <div className="w-full bg-white rounded shadow-sm overflow-x-auto p-4">
        <table className="min-w-full bg-white border border-gray-100 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-left text-sm uppercase">
              <th className="py-3 px-4 border-b">Withdraw ID</th>
              <th className="py-3 px-4 border-b">Shop Name</th>
              <th className="py-3 px-4 border-b">Amount</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Date</th>
              <th className="py-3 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="py-3 px-4 font-mono">{item._id.slice(0, 10)}...</td>
                  <td className="py-3 px-4 font-medium">{item.seller.name}</td>
                  <td className="py-3 px-4 font-semibold font-Roboto text-emerald-600">
                    ${item.amount}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Succeed"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{item.createdAt.slice(0, 10)}</td>
                  <td className="py-3 px-4">
                    {item.status !== "Succeed" && (
                      <button
                        onClick={() =>
                          setOpen(true) ||
                          setWithdrawData({
                            id: item._id,
                            sellerId: item.seller._id,
                          })
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <BsPencil size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(!data || data.length === 0) && (
          <p className="text-center py-8 text-gray-400">No withdraw requests pending.</p>
        )}
      </div>

      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#0003] z-[9999] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[40%] bg-white shadow rounded p-6">
            <div className="w-full flex justify-end">
              <RxCross1 size={25} onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>
            <h1 className="text-[25px] font-Poppins text-center font-[600]">
              Update Withdraw Status
            </h1>
            <br />
            <select
              name=""
              id=""
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-full border h-[40px] rounded px-2 font-medium"
            >
              <option value={withdrawStatus}>Succeed</option>
            </select>
            <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-6 text-[18px] !w-full !bg-[#3853db] hover:bg-[#2c42b8]`}
              onClick={handleSubmit}
            >
              Approve Payout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
