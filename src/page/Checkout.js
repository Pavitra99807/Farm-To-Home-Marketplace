import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Checkout = () => {

  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.product.cartItem || []
  );

  const totalPrice = cartItems.reduce(
    (acc, curr) => acc + curr.total,
    0
  );

  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    fullname: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleOnChange = (e) => {

    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PLACE ORDER (DUMMY PAYMENT)
  // =========================
  const handlePlaceOrder = async () => {

    const {
      fullname,
      address,
      city,
      pincode,
      phone,
    } = userData;

    // VALIDATION
    if (
      !fullname ||
      !address ||
      !city ||
      !pincode ||
      !phone
    ) {

      toast.error("Please fill all delivery details");

      return;
    }

    // EMPTY CART
    if (cartItems.length === 0) {

      toast.error("Cart is empty");

      return;
    }

    try {

      setLoading(true);

      // SAVE PHONE
      localStorage.setItem("phone", phone);

      // ORDER DATA
    const user =
  JSON.parse(
    localStorage.getItem("user")
  );

const orderData = {

  customerName:
    fullname,

  email:
    user?.email,

  address,

  city,

  pincode,

  phone,

  items:
    cartItems,

  totalAmount:
    totalPrice,

  paymentStatus:
    "Paid",

  orderStatus:
    "Processing",
};

      // SAVE ORDER
      const res = await axios.post(
        "http://localhost:8050/api/order/create",
        orderData
      );

      console.log("ORDER RESPONSE:", res.data);

     if (res.data.success) {

toast.success(
  "Order placed successfully"
);

  // CLEAR CART STORAGE
  localStorage.removeItem("cart");

  // REDIRECT
  navigate("/my-orders");
}

    } catch (error) {

      console.log("ORDER ERROR:", error);

      toast.error(
  "Failed to place order"
);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="p-4 max-w-5xl m-auto min-h-screen">

      <h2 className="text-3xl font-bold mb-6">
        Checkout
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        {/* LEFT SIDE */}
        <div className="bg-white p-5 rounded shadow">

          <h3 className="text-2xl font-bold mb-5">
            Delivery Details
          </h3>

          <input
            name="fullname"
            value={userData.fullname}
            onChange={handleOnChange}
            placeholder="Full Name"
            className="w-full border p-3 mb-3 rounded"
          />

          <textarea
            name="address"
            value={userData.address}
            onChange={handleOnChange}
            placeholder="Address"
            className="w-full border p-3 mb-3 rounded"
            rows={4}
          />

          <input
            name="city"
            value={userData.city}
            onChange={handleOnChange}
            placeholder="City"
            className="w-full border p-3 mb-3 rounded"
          />

          <input
            name="pincode"
            value={userData.pincode}
            onChange={handleOnChange}
            placeholder="Pincode"
            className="w-full border p-3 mb-3 rounded"
          />

          <input
            name="phone"
            value={userData.phone}
            onChange={handleOnChange}
            placeholder="Phone Number"
            className="w-full border p-3 rounded"
          />

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-5 rounded shadow">

          <h3 className="text-2xl font-bold mb-5">
            Order Summary
          </h3>

          {cartItems.map((item) => (

            <div
              key={item._id}
              className="flex justify-between items-center border-b pb-3 mb-3"
            >

              <div className="flex gap-3 items-center">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div>

                  <p className="font-bold">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty : {item.qty}
                  </p>

                </div>

              </div>

              <p className="font-bold">
                ₹ {item.total}
              </p>

            </div>
          ))}

          {/* TOTAL */}
          <h2 className="text-3xl font-bold mt-6">
            Total : ₹ {totalPrice}
          </h2>

          {/* BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded mt-6 text-lg font-bold"
          >

            {loading
              ? "Placing Order..."
              : "Place Order"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
