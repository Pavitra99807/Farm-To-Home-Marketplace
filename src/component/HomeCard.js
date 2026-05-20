import React from "react";

import { Link } from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  addWishlist,
  removeWishlist,
} from "../redux/productSlice";

import {
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

const HomeCard = ({
  id,
  image,
  name,
  category,
  price,
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

  return (
    <div className="w-full min-w-[250px] max-w-[250px] bg-white hover:shadow-lg rounded-xl overflow-hidden relative">

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

        <div className="h-40 overflow-hidden">

          <img
            src={
              image ||
              "https://via.placeholder.com/300"
            }
            alt="product"
            className="w-full h-full object-cover hover:scale-110 duration-300"
          />

        </div>

        <div className="p-3">

          <h3 className="font-bold text-lg">
            {name}
          </h3>

          <p className="text-slate-500 capitalize">
            {category}
          </p>

          <p className="text-red-500 font-bold text-lg mt-2">
            ₹ {price}
          </p>

        </div>

      </Link>

    </div>
  );
};

export default HomeCard;