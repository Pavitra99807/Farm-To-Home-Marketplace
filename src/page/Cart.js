import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  deleteCartItem,
  increaseQty,
  decreaseQty,
} from "../redux/productSlice";

const Cart = () => {

  const navigate = useNavigate();

  const productCartItem = useSelector(
    (state) => state.product.cartItem
  );

  const dispatch = useDispatch();

  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + curr.total,
    0
  );

  return (
    <div className="p-4">

      <h2 className="text-3xl font-bold mb-5">
        Shopping Cart
      </h2>

      {productCartItem.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <div className="flex flex-col gap-4">

          {productCartItem.map((el) => {
            return (
              <div
                key={el._id}
                className="bg-white p-4 rounded shadow flex gap-4 items-center"
              >

                <img
                  src={el.image}
                  alt={el.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">

                  <h3 className="text-xl font-bold">
                    {el.name}
                  </h3>

                  <p className="text-gray-500">
                    {el.category}
                  </p>

                  <p className="text-red-500 font-bold mt-2">
                    ₹ {el.price}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-3">

                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        dispatch(decreaseQty({ id: el._id }))
                      }
                    >
                      -
                    </button>

                    <span className="text-lg font-bold">
                      {el.qty}
                    </span>

                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        dispatch(increaseQty({ id: el._id }))
                      }
                    >
                      +
                    </button>

                  </div>

                  <p className="mt-3 font-bold">
                    Total : ₹ {el.total}
                  </p>

                </div>

                <button
                  className="bg-black text-white px-4 py-2 rounded"
                  onClick={() =>
                    dispatch(deleteCartItem({ id: el._id }))
                  }
                >
                  Remove
                </button>

              </div>
            );
          })}

          {/* Grand Total */}
          <div className="bg-white p-5 rounded shadow mt-5">

            <h2 className="text-2xl font-bold">
              Grand Total : ₹ {totalPrice}
            </h2>

            <button
              onClick={() => navigate("/checkout")}
              className="bg-yellow-500 px-5 py-3 rounded mt-4 text-lg font-bold"
            >
              Proceed To Checkout
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;