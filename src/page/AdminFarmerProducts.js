import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaCheck, FaTimes, FaUserTie } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setDataProduct } from "../redux/productSlice";

const API_BASE = "http://localhost:8050";

const AdminFarmerProducts = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/api/farmer-products/admin/all${
          statusFilter ? `?status=${statusFilter}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load farmer requests");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API_BASE}/api/farmer-products/admin/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Product ${status}`);

      if (status === "approved") {
        const productRes = await axios.get(`${API_BASE}/api/product/all`);
        dispatch(setDataProduct(productRes.data.data || []));
      }

      fetchRequests();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">Farmer Product Verification</h2>
          <p className="text-slate-500">
            Review farmer details, mandi price, requested price and image before
            publishing to the customer catalog.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-3 bg-white"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {loading && <p className="text-blue-600">Loading farmer requests...</p>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {requests.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-5">
              <img
                src={item.image || "https://via.placeholder.com/400"}
                alt={item.productName}
                className="md:col-span-2 w-full h-64 md:h-full object-cover"
              />

              <div className="md:col-span-3 p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold">{item.productName}</h3>
                    <p className="text-slate-500">{item.category}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-xs text-slate-500">Market</p>
                    <p className="font-bold">₹{item.marketPrice}</p>
                  </div>
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-xs text-slate-500">Farmer</p>
                    <p className="font-bold">₹{item.farmerPrice}</p>
                  </div>
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-xs text-slate-500">Qty</p>
                    <p className="font-bold">{item.quantity}</p>
                  </div>
                </div>

                <div className="border rounded p-3">
                  <p className="font-semibold flex items-center gap-2">
                    <FaUserTie className="text-emerald-600" />
                    {item.farmerName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.farmerId?.email}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.farmerId?.phone}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.farmerId?.address}
                  </p>
                </div>

                <p className="text-sm text-slate-600">{item.description}</p>

                {item.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(item._id, "approved")}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded flex items-center justify-center gap-2"
                    >
                      <FaCheck />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(item._id, "rejected")}
                      className="flex-1 bg-red-500 text-white py-2 rounded flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && requests.length === 0 && (
        <div className="bg-white border rounded-lg p-8 text-center text-slate-500">
          No farmer product requests found.
        </div>
      )}
    </div>
  );
};

export default AdminFarmerProducts;
