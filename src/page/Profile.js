import React from "react";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  HiOutlineUserCircle,
} from "react-icons/hi";

import {
  FaHeart,
  FaShoppingBag,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  logoutRedux,
} from "../redux/userSlice";

import { toast } from "react-hot-toast";

import {
  Link,
} from "react-router-dom";
import axios from "axios";

import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
const navigate = useNavigate();
  const dispatch = useDispatch();

  // USER DATA
  const userData = useSelector(
    (state) => state.user
  );

  // WISHLIST
  const wishlist = useSelector(
    (state) => state.product.wishlist
  );
  useEffect(() => {

  const fetchOrders =
  async () => {

    try {

      const user =
      JSON.parse(
        localStorage.getItem("user")
      );

      const res =
      await axios.get(

        `http://localhost:8050/api/order/user/${user.email}`
      );

      setOrders(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);
    }
  };

  fetchOrders();

}, []);

  // ORDERS
  const [orders,
setOrders] =
useState([]);

  // LOGOUT
 const handleLogout = () => {

  localStorage.clear();

  toast.success("Logout successfully");

  navigate("/");
};

  return (

    <div className="min-h-screen bg-slate-100 p-5">

      <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl overflow-hidden">

        {/* TOP */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-40 flex justify-center items-center">

          <div className="bg-white rounded-full p-3 shadow-lg">

            {userData.image ? (

              <img
                src={userData.image}
                alt="profile"
                className="w-28 h-28 rounded-full object-cover"
              />

            ) : (

              <HiOutlineUserCircle className="text-8xl text-slate-600" />

            )}

          </div>

        </div>

        {/* INFO */}
        <div className="p-8 text-center">

          <h2 className="text-4xl font-bold">

            {userData.firstname || "User"}

          </h2>

          <p className="text-gray-600 mt-2 text-lg">

            {userData.email}

          </p>

          <p className="text-gray-600">

            📞 {userData.phone || "No phone"}

          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-8">

          {/* ORDERS */}
          <Link
            to={"/my-orders"}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-6 shadow transition duration-300"
          >

            <FaShoppingBag className="text-4xl mb-4" />

            <h3 className="text-xl font-bold">

              Orders

            </h3>

            <p className="text-3xl font-bold mt-3">

              {orders.length}

            </p>

          </Link>

          {/* WISHLIST */}
          <Link
            to={"/wishlist"}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl p-6 shadow transition duration-300"
          >

            <FaHeart className="text-4xl mb-4" />

            <h3 className="text-xl font-bold">

              Wishlist

            </h3>

            <p className="text-3xl font-bold mt-3">

              {wishlist.length}

            </p>

          </Link>

          {/* ACCOUNT */}
          <Link
            to={"/edit-profile"}
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-6 shadow transition duration-300"
          >

            <HiOutlineUserCircle className="text-4xl mb-4" />

            <h3 className="text-xl font-bold">

              Account

            </h3>

            <p className="text-lg mt-3">

              Edit Profile

            </p>

          </Link>

        </div>

        {/* ACTIONS */}
        <div className="p-8 flex justify-center">

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl flex items-center gap-3 text-lg font-bold"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>

    </div>
  );
};

export default Profile;