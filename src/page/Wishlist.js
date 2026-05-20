import React from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  removeWishlist,
  addCartItem,
} from "../redux/productSlice";

const Wishlist = () => {

  const dispatch = useDispatch();

  const wishlist = useSelector(
    (state) => state.product.wishlist
  );

  return (
    <div className="p-5">

      <h2 className="text-3xl font-bold mb-5">
        Wishlist
      </h2>

      {wishlist.length === 0 ? (

        <p>No wishlist items</p>

      ) : (

        <div className="grid md:grid-cols-3 gap-5">

          {wishlist.map((item) => (

            <div
              key={item._id}
              className="bg-white shadow rounded p-4"
            >

              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover rounded"
              />

              <h3 className="text-xl font-bold mt-3">
                {item.name}
              </h3>

              <p className="text-red-500 font-bold">
                ₹ {item.price}
              </p>

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() =>
                    dispatch(addCartItem(item))
                  }
                  className="bg-yellow-500 px-4 py-2 rounded"
                >

                  Add Cart

                </button>

                <button
                  onClick={() =>
                    dispatch(
                      removeWishlist(item._id)
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >

                  Remove

                </button>

              </div>

            </div>
          ))}

        </div>

      )}

    </div>
  );
};

export default Wishlist;