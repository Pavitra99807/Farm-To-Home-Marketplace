import React, { useState, useEffect } from "react";
import axios from "axios";

const MyOrders = () => {

 const user =
  JSON.parse(
    localStorage.getItem("user")
  );

const userEmail =
  user?.email;

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {

  if (!userEmail) {

      alert("User not logged in");

      return;
    }

    try {

      setLoading(true);

      const res = await axios.get(
        `http://localhost:8050/api/order/user/${userEmail}`
      );

      console.log("MY ORDERS:", res.data);

      setOrders(res.data.data || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // AUTO LOAD
  // =========================
  useEffect(() => {
    fetchOrders();
  }, [userEmail]);

  return (
    <div className="p-5 max-w-5xl m-auto min-h-screen">

      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-6">
        My Orders
      </h2>

      {/* LOADING */}
      {loading && (
        <p className="text-blue-600">
          Loading orders...
        </p>
      )}

      {/* EMPTY */}
      {!loading && orders.length === 0 && (
        <div className="bg-white p-5 rounded shadow">

          <p className="text-lg">
            No orders found
          </p>

        </div>
      )}

      {/* ORDERS */}
      <div className="flex flex-col gap-5">

        {orders.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded shadow p-5"
          >

            {/* TOP */}
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-4">

              <div>

                <p className="font-bold text-lg">
                  {order.customerName}
                </p>

                <p className="text-gray-500">
                  {order.phone}
                </p>

                <p className="text-gray-500">
                  {order.city}
                </p>

              </div>

              <div className="mt-3 md:mt-0">

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                  {order.orderStatus}
                </span>

              </div>

            </div>

            {/* ITEMS */}
            <div className="flex flex-col gap-4">

              {order.items?.map((item, index) => (

                <div
                  key={index}
                  className="flex gap-4 border-b pb-4"
                >

                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/150"
                    }
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1">

                    <h3 className="text-xl font-bold">
                      {item.name}
                    </h3>

                    <p className="text-gray-500">
                      Quantity : {item.qty}
                    </p>

                    <p className="text-red-500 font-bold mt-1">
                      ₹ {item.total}
                    </p>

                  </div>

                </div>
              ))}

            </div>

            {/* FOOTER */}
            <div className="flex flex-col md:flex-row justify-between mt-5 gap-4">

              <div>

                <p className="font-bold">
                  Delivery Address
                </p>

                <p className="text-gray-600">
                  {order.address}
                </p>

              </div>

              <div>

                <p className="font-bold">
                  Payment Status
                </p>

                <p className="text-green-600">
                  {order.paymentStatus}
                </p>

              </div>

              <div>

                <p className="font-bold">
                  Total Amount
                </p>

                <p className="text-2xl text-red-500 font-bold">
                  ₹ {order.totalAmount}
                </p>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default MyOrders;