import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../redux/actions/event";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";

const AllEvents = () => {
  const dispatch = useDispatch();
  const { allEvents } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Promotional Events</h2>
      <div className="w-full bg-white rounded shadow-sm overflow-x-auto p-4">
        <table className="min-w-full bg-white border border-gray-100 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-left text-sm uppercase">
              <th className="py-3 px-4 border-b">Event ID</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Price</th>
              <th className="py-3 px-4 border-b">Stock</th>
              <th className="py-3 px-4 border-b">Sold</th>
              <th className="py-3 px-4 border-b">Preview</th>
            </tr>
          </thead>
          <tbody>
            {allEvents &&
              allEvents.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="py-3 px-4 font-mono">{item._id.slice(0, 10)}...</td>
                  <td className="py-3 px-4 font-medium max-w-[200px] truncate">{item.name}</td>
                  <td className="py-3 px-4 font-semibold font-Roboto">${item.discountPrice}</td>
                  <td className="py-3 px-4">{item.stock}</td>
                  <td className="py-3 px-4">{item.sold_out || 0}</td>
                  <td className="py-3 px-4">
                    <Link to={`/product/${item._id}?isEvent=true`}>
                      <button className="text-blue-600 hover:text-blue-800">
                        <AiOutlineEye size={20} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(!allEvents || allEvents.length === 0) && (
          <p className="text-center py-8 text-gray-400">No events active.</p>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
