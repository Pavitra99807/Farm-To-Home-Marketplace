import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useSelector,
} from "react-redux";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  FaBoxOpen,
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaRupeeSign,
} from "react-icons/fa";


const AdminDashboard = () => {

  // ORDERS STATE
  const [orders, setOrders] =
    useState([]);

  // REDUX DATA
  const products = useSelector(
    (state) =>
      state.product.productList
  );

  const wishlist = useSelector(
    (state) =>
      state.product.wishlist
  );

  const reviews = useSelector(
    (state) =>
      state.product.reviews
  );

  // FETCH ORDERS
  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8050/api/order/all"
      );

      setOrders(
        res.data.data || []
      );

    } catch (error) {

      console.log(
        "FETCH ORDER ERROR:",
        error
      );
    }
  };

  // REVENUE
  const revenue = orders.reduce(
    (acc, curr) =>
      acc + curr.totalAmount,
    0
  );
  const analyticsData = [

  {
    name: "Products",
    value: products.length,
  },

  {
    name: "Orders",
    value: orders.length,
  },

  {
    name: "Wishlist",
    value: wishlist.length,
  },

  {
    name: "Reviews",
    value: reviews.length,
  },

];

  // DASHBOARD DATA
  const dashboardCards = [

    {
      title: "Total Products",
      value: products.length,
      icon: <FaBoxOpen />,
      color: "bg-blue-500",
    },

    {
      title: "Total Orders",
      value: orders.length,
      icon: <FaShoppingCart />,
      color: "bg-green-500",
    },

    {
      title: "Wishlist Items",
      value: wishlist.length,
      icon: <FaHeart />,
      color: "bg-pink-500",
    },

    {
      title: "Total Reviews",
      value: reviews.length,
      icon: <FaStar />,
      color: "bg-yellow-500",
    },

    {
      title: "Revenue",
      value: `₹ ${revenue}`,
      icon: <FaRupeeSign />,
      color: "bg-purple-500",
    },

  ];

  return (

    <div className="p-5 bg-slate-100 min-h-screen">

      <h2 className="text-4xl font-bold mb-8">

        Admin Dashboard

      </h2>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">

        {dashboardCards.map(
          (card, index) => (

            <div
              key={index}
              className={`${card.color} text-white rounded-2xl shadow-lg p-6`}
            >

              <div className="text-4xl mb-4">

                {card.icon}

              </div>

              <h3 className="text-xl font-bold">

                {card.title}

              </h3>

              <p className="text-3xl mt-3 font-bold">

                {card.value}

              </p>

            </div>
          )
        )}

      </div>

      {/* QUICK INFO */}
      <div className="bg-white rounded-2xl shadow mt-10 p-6">

        <h3 className="text-2xl font-bold mb-4">

          Quick Insights

        </h3>

        <div className="space-y-3 text-lg">

          <p>

            📦 Products available:
            {" "}
            <b>{products.length}</b>

          </p>

          <p>

            🛒 Orders placed:
            {" "}
            <b>{orders.length}</b>

          </p>

          <p>

            ❤️ Wishlist products:
            {" "}
            <b>{wishlist.length}</b>

          </p>

          <p>

            ⭐ Customer reviews:
            {" "}
            <b>{reviews.length}</b>

          </p>

          <p>

            💰 Total revenue:
            {" "}
            <b>₹ {revenue}</b>

          </p>

        </div>

      </div>
      {/* ANALYTICS CHARTS */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

  {/* BAR CHART */}
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">

    <h2 className="text-2xl font-bold mb-5">

      Platform Analytics

    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <BarChart
        data={analyticsData}
      >

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="value"
          fill="#3b82f6"
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

  {/* PIE CHART */}
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">

    <h2 className="text-2xl font-bold mb-5">

      Store Insights

    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <PieChart>

        <Pie
          data={analyticsData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >

          <Cell fill="#3b82f6" />
          <Cell fill="#22c55e" />
          <Cell fill="#ec4899" />
          <Cell fill="#facc15" />

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>

    </div>
  );
};

export default AdminDashboard;