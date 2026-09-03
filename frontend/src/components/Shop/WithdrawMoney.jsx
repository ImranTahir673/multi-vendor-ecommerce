import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };

    setPaymentMethod(false);

    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        {
          withdrawMethod,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw method added successfully!");
        dispatch(loadSeller());
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to add method");
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully!");
        dispatch(loadSeller());
      });
  };

  const error = () => {
    toast.error("You do not have enough balance to withdraw!");
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error("You can not withdraw this amount! Minimum is $50.");
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("Withdraw request placed successfully!");
          setOpen(false);
          dispatch(loadSeller());
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Withdraw request failed");
        });
    }
  };

  const availableBalance = seller?.availableBalance ? seller?.availableBalance.toFixed(2) : 0;

  return (
    <div className="w-full h-[90vh] p-8">
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col shadow-sm">
        <h5 className="text-[20px] pb-4">
          Available Balance: <strong className="font-Roboto text-emerald-600 text-[24px]">${availableBalance}</strong>
        </h5>
        <div
          className={`${styles.button} text-white !h-[42px] !rounded !bg-[#3853db] hover:bg-[#2c42b8]`}
          onClick={() => (availableBalance < 50 ? error() : setOpen(true))}
        >
          Request Withdrawal
        </div>
      </div>
      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
          <div
            className={`w-[95%] 800px:w-[50%] bg-white shadow rounded ${
              paymentMethod ? "h-[85vh] overflow-y-scroll" : "h-[unset]"
            } min-h-[40vh] p-5`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => setOpen(false) || setPaymentMethod(false)}
                className="cursor-pointer"
              />
            </div>
            {seller && seller?.withdrawMethod ? (
              <div>
                <h3 className="text-[22px] font-Poppins text-center font-[600]">
                  Available Payout Method:
                </h3>
                <div className="800px:flex justify-between items-center bg-gray-50 p-4 rounded mt-4">
                  <div>
                    <h5>
                      Bank: <strong>{seller?.withdrawMethod?.bankName}</strong>
                    </h5>
                    <h5>
                      Account Number:{" "}
                      {"*".repeat(
                        seller?.withdrawMethod?.bankAccountNumber.length - 4
                      ) +
                        seller?.withdrawMethod?.bankAccountNumber.slice(-4)}
                    </h5>
                    <h5>
                      Holder: <strong>{seller?.withdrawMethod?.bankHolderName}</strong>
                    </h5>
                  </div>
                  <div className="radio">
                    <AiOutlineDelete
                      size={25}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => deleteHandler()}
                    />
                  </div>
                </div>
                <br />
                <h4>Available Balance: ${availableBalance}</h4>
                <br />
                <div className="800px:flex w-full items-center">
                  <input
                    type="number"
                    placeholder="Amount (min $50)..."
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="800px:w-[100px] w-[full] border 800px:mr-3 p-1 rounded font-medium"
                  />
                  <div
                    className={`${styles.button} !h-[42px] text-white bg-emerald-600 hover:bg-emerald-700`}
                    onClick={withdrawHandler}
                  >
                    Confirm Payout
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[18px] pt-2">
                  No payment withdrawal methods found!
                </p>
                <div className="w-full flex items-center">
                  <div
                    className={`${styles.button} text-[#fff] text-[18px] mt-4`}
                    onClick={() => setPaymentMethod(true)}
                  >
                    Add Bank Method
                  </div>
                </div>
              </div>
            )}

            {paymentMethod && (
              <div>
                <h3 className="text-[22px] font-Poppins text-center font-[600]">
                  Add New Bank Account
                </h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      placeholder="Enter Bank Name..."
                      className={`${styles.input} mt-1`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Bank Country</label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      placeholder="Enter Bank Country..."
                      className={`${styles.input} mt-1`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Swift / BIC Code</label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      placeholder="Enter Swift Code..."
                      className={`${styles.input} mt-1`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Account Number / IBAN</label>
                    <input
                      type="number"
                      required
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      placeholder="Enter Account Number..."
                      className={`${styles.input} mt-1`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Account Holder Name</label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      placeholder="Enter Account Holder Name..."
                      className={`${styles.input} mt-1`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Bank Address</label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      placeholder="Enter Bank Branch Address..."
                      className={`${styles.input} mt-1`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`${styles.button} text-white !w-full !bg-[#3853db] hover:bg-[#2c42b8] mt-4`}
                  >
                    Save Method
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
