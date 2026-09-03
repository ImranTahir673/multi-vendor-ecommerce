import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipCode] = useState(seller && seller.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error.response?.data?.message || "Failed to update avatar");
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop information updated successfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to update shop");
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-8">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5 bg-white p-8 rounded-lg shadow-sm">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={
                avatar
                  ? avatar
                  : `${seller?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/869/869636.png"}`
              }
              alt=""
              className="w-[180px] h-[180px] rounded-full object-cover border-[5px] border-[#3853db]"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image" className="cursor-pointer">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* shop info form */}
        <form onSubmit={updateHandler} className="flex flex-col items-center mt-6">
          <div className="w-[100%] 800px:w-[50%] mt-3">
            <label className="block pb-2 font-medium text-sm">Shop Name</label>
            <input
              type="text"
              placeholder={seller?.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-3">
            <label className="block pb-2 font-medium text-sm">Shop Description</label>
            <textarea
              rows={4}
              placeholder={
                seller?.description
                  ? seller.description
                  : "Enter your shop business description..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${styles.input} !w-[95%] !h-auto py-2 mb-4 800px:mb-0`}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-3">
            <label className="block pb-2 font-medium text-sm">Shop Address</label>
            <input
              type="text"
              placeholder={seller?.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-3">
            <label className="block pb-2 font-medium text-sm">Phone Number</label>
            <input
              type="number"
              placeholder={seller?.phoneNumber}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-3">
            <label className="block pb-2 font-medium text-sm">Zip Code</label>
            <input
              type="number"
              placeholder={seller?.zipCode}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-5">
            <input
              type="submit"
              value="Update Shop Profile"
              className={`${styles.button} !w-[95%] !bg-[#3853db] hover:bg-[#2c42b8] text-white font-medium`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
