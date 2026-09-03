import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/user/activation`, {
            activation_token,
          })
          .then((res) => {
            setSuccess(true);
          })
          .catch((err) => {
            setError(true);
          });
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">
      {error && (
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Activation Failed</h2>
          <p className="text-gray-600 mb-4">Your activation token is expired or invalid!</p>
          <Link
            to="/sign-up"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Register Again
          </Link>
        </div>
      )}
      {success && (
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-green-200">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
          <p className="text-gray-600 mb-4">Your account has been created successfully!</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Proceed to Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActivationPage;
