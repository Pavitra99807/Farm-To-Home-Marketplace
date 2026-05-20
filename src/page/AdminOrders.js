import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

const AdminOrders = () => {

  const [orders, setOrders] =
    useState([]);

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

      console.log(error);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await axios.put(
        `http://localhost:8050/api/order/status/${id}`,
        { status }
      );

      fetchOrders();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="p-5">

      <h2 className="text-3xl font-bold mb-6">

        Orders Management

      </h2>

      {orders.length === 0 ? (

        <p>No orders found</p>

      ) : (

        <div className="space-y-5">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white shadow rounded-xl p-5"
            >

              {/* TOP */}
              <div className="flex flex-col md:flex-row justify-between gap-4">

                <div>

                  <p className="font-bold text-xl">

                    {order.customerName}

                  </p>

                  <p className="text-gray-600">

                    📍 {order.city}

                  </p>

                  <p className="text-gray-600">

                    📞 {order.phone}

                  </p>

                </div>

                <div>

                  <p className="text-2xl font-bold text-green-600">

                    ₹ {order.totalAmount}

                  </p>

                </div>

              </div>

              {/* ITEMS */}
              <div className="mt-5">

                <h3 className="font-bold mb-3">

                  Order Items

                </h3>

                <div className="space-y-2">

                  {order.items?.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="flex justify-between bg-slate-100 p-3 rounded"
                      >

                        <p>

                          {item.name}

                        </p>

                        <p>

                          Qty:
                          {" "}
                          {item.qty}

                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* STATUS */}
              <div className="mt-5 flex flex-col md:flex-row justify-between items-center gap-4">

                <div>

                  <span className="font-bold">

                    Status:
                    {" "}

                  </span>

                  <span className="text-blue-600 font-bold">

                    {order.orderStatus}

                  </span>

                </div>

                {/* UPDATE */}
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                  className="border p-2 rounded-lg"
                >

                  <option>
                    Processing
                  </option>

                  <option>
                    Shipped
                  </option>

                  <option>
                    Delivered
                  </option>

                </select>

              </div>

            </div>
          ))}

        </div>

      )}

    </div>
  );
};

export default AdminOrders;