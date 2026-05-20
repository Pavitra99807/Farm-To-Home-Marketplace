import React from "react";

import { Link } from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  addCartItem,
  addWishlist,
  removeWishlist,
} from "../redux/productSlice";

import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const CardFeature = ({
  id,
  name,
  category,
  price,
  image,
}) => {

  const dispatch = useDispatch();

  const wishlist = useSelector(
    (state) => state.product.wishlist
  );

  // CHECK WISHLIST
  const isWishlist = wishlist.some(
    (item) => item._id === id
  );

  // TOGGLE WISHLIST
  const handleWishlist = (e) => {

    e.preventDefault();

    const product = {
      _id: id,
      image,
      name,
      category,
      price,
    };

    if (isWishlist) {

      dispatch(removeWishlist(id));

    } else {

      dispatch(addWishlist(product));
    }
  };

  const handleAddCart = (e) => {
    e.preventDefault();

    dispatch(
      addCartItem({
        _id: id,
        image,
        name,
        category,
        price,
      })
    );

    toast.success("Added to cart");
  };

  return (

    <div className="w-full min-w-[280px] max-w-[280px] bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-2xl overflow-hidden relative duration-300">

      {/* HEART */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 text-2xl"
      >

        {isWishlist ? (

          <FaHeart className="text-red-500" />

        ) : (

          <FaRegHeart className="text-white drop-shadow-lg" />

        )}

      </button>

      <Link to={`/product/${id}`}>

        {/* IMAGE */}
        <div className="h-48 overflow-hidden bg-slate-200 dark:bg-slate-700 flex justify-center items-center">

          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover hover:scale-110 duration-300"
          />

        </div>

        {/* DETAILS */}
        <div className="p-3">

          <h3 className="font-bold text-lg dark:text-white">

            {name}

          </h3>

          <p className="text-slate-500 dark:text-slate-300 capitalize">

            {category}

          </p>

          <p className="text-red-500 font-bold text-lg mt-2">

            ₹ {price}

          </p>

          <button
            onClick={handleAddCart}
            className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded flex items-center justify-center gap-2"
          >

            <FaShoppingCart />

            Add to Cart

          </button>

        </div>

      </Link>

    </div>
  );
};

export default CardFeature;
