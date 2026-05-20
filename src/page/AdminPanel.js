import React, {
  useState,
} from "react";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlus,
  FaStar,
  FaShoppingCart,
  FaSeedling,
} from "react-icons/fa";

import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AddProduct from "./AddProduct";
import AdminReviews from "./AdminReviews";
import AdminOrders from "./AdminOrders";
import AdminFarmerProducts from "./AdminFarmerProducts";

const AdminPanel = () => {

  const [activeTab, setActiveTab] =
    useState("dashboard");

  // RENDER CONTENT
  const renderContent = () => {

    switch (activeTab) {

      case "dashboard":
        return <AdminDashboard />;

      case "products":
        return <AdminProducts />;

      case "add-product":
        return <AddProduct />;

      case "reviews":
        return <AdminReviews />;

      case "orders":
        return <AdminOrders />;

      case "farmer-products":
        return <AdminFarmerProducts />;

      default:
        return <AdminDashboard />;
    }
  };

  return (

    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <div className="w-72 bg-white shadow-lg p-5">

        <h2 className="text-3xl font-bold mb-8">

          Admin Panel

        </h2>

        <div className="space-y-3">

          {/* DASHBOARD */}
          <button
            onClick={() =>
              setActiveTab("dashboard")
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold ${
              activeTab === "dashboard"
                ? "bg-blue-500 text-white"
                : "bg-slate-100"
            }`}
          >

            <FaTachometerAlt />

            Dashboard

          </button>

          {/* PRODUCTS */}
          <button
            onClick={() =>
              setActiveTab("products")
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold ${
              activeTab === "products"
                ? "bg-green-500 text-white"
                : "bg-slate-100"
            }`}
          >

            <FaBoxOpen />

            Products

          </button>

          {/* ADD PRODUCT */}
          <button
            onClick={() =>
              setActiveTab("add-product")
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold ${
              activeTab === "add-product"
                ? "bg-purple-500 text-white"
                : "bg-slate-100"
            }`}
          >

            <FaPlus />

            Add Product

          </button>

          {/* REVIEWS */}
          <button
            onClick={() =>
              setActiveTab("reviews")
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold ${
              activeTab === "reviews"
                ? "bg-yellow-500 text-white"
                : "bg-slate-100"
            }`}
          >

            <FaStar />

            Reviews

          </button>

          {/* ORDERS */}
          <button
            onClick={() =>
              setActiveTab("orders")
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold ${
              activeTab === "orders"
                ? "bg-red-500 text-white"
                : "bg-slate-100"
            }`}
          >

            <FaShoppingCart />

            Orders

          </button>

          <button
            onClick={() =>
              setActiveTab("farmer-products")
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold ${
              activeTab === "farmer-products"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100"
            }`}
          >

            <FaSeedling />

            Farmer Requests

          </button>

        </div>

      </div>

      {/* CONTENT */}
      <div className="flex-1 p-5 overflow-auto">

        {renderContent()}

      </div>

    </div>
  );
};

export default AdminPanel;
