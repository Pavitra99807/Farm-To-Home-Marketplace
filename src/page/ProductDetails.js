import React, { useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  addCartItem,
  addWishlist,
  removeWishlist,
  addReview,
} from "../redux/productSlice";

import { toast } from "react-hot-toast";

import {
  FaHeart,
  FaRegHeart,
  FaStar,
} from "react-icons/fa";

const ProductDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // REVIEW STATES
  const [rating, setRating] =
    useState(0);

  const [reviewText, setReviewText] =
    useState("");

  // REDUX DATA
  const productData = useSelector(
    (state) => state.product.productList
  );

  const wishlist = useSelector(
    (state) => state.product.wishlist
  );

  const reviews = useSelector(
    (state) => state.product.reviews
  );

  // FIND PRODUCT
  const product = productData?.find(
  (el) =>
    String(el._id) === String(id)
);

  // PRODUCT NOT FOUND
  if (!product) {

    return (
      <div className="p-5 text-center text-xl">

        Product not found

      </div>
    );
  }

  // WISHLIST CHECK
  const isWishlist = wishlist.some(
    (item) =>
      item._id === product._id
  );

  // PRODUCT REVIEWS
  const productReviews =
    reviews.filter(
      (item) =>
        item.productId === product._id
    );

  // AVERAGE RATING
  const averageRating =
    productReviews.length > 0
      ? (
          productReviews.reduce(
            (acc, curr) =>
              acc + curr.rating,
            0
          ) / productReviews.length
        ).toFixed(1)
      : 0;

  // RELATED PRODUCTS
  const relatedProducts =
    productData.filter(
      (item) =>
        item.category ===
          product.category &&
        item._id !== product._id
    );

  // ADD CART
  const handleAddCart = () => {

    dispatch(
      addCartItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
      })
    );

    toast.success(
      "Added to cart"
    );
  };

  // BUY NOW
  const handleBuyNow = () => {

    handleAddCart();

    navigate("/cart");
  };

  // WISHLIST TOGGLE
  const handleWishlist = (e) => {

    e.stopPropagation();

    if (isWishlist) {

      dispatch(
        removeWishlist(
          product._id
        )
      );

      toast.success(
        "Removed from wishlist"
      );

    } else {

      dispatch(
        addWishlist(product)
      );

      toast.success(
        "Added to wishlist"
      );
    }
  };

  // REVIEW SUBMIT
  const handleReviewSubmit = () => {

    if (!rating || !reviewText) {

      toast.error(
        "Please add rating and review"
      );

      return;
    }

    dispatch(
      addReview({
        productId: product._id,
        rating,
        reviewText,
        user:
          localStorage.getItem(
            "phone"
          ) || "Anonymous",
      })
    );

    toast.success(
      "Review added"
    );

    setRating(0);

    setReviewText("");
  };

  return (

    <div className="p-4 md:p-8 bg-slate-100 min-h-screen">

      {/* MAIN SECTION */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-5 grid md:grid-cols-2 gap-8">

        {/* IMAGE */}
        <div className="bg-slate-100 rounded-xl p-3 flex justify-center items-center relative">

          {/* HEART */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 text-3xl z-10"
          >

            {isWishlist ? (

              <FaHeart className="text-red-500" />

            ) : (

              <FaRegHeart className="text-white drop-shadow-lg" />

            )}

          </button>

          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-[450px] object-contain rounded"
          />

        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">

          <p className="text-green-600 font-semibold capitalize">

            {product.category}

          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-2">

            {product.name}

          </h2>

          {/* RATING */}
          <div className="flex items-center gap-3 mt-4">

            <div className="flex text-yellow-500">

              {[1, 2, 3, 4, 5].map((star) => (

                <FaStar
                  key={star}
                  className={
                    star <= averageRating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                />

              ))}

            </div>

            <p className="font-bold">

              {averageRating} / 5

            </p>

          </div>

          <p className="text-3xl font-bold text-red-500 mt-5">

            ₹ {product.price}

          </p>

          <p className="text-slate-700 mt-6 leading-relaxed text-lg">

            {product.description}

          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">

            <button
              onClick={handleAddCart}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold text-lg"
            >

              Add To Cart

            </button>

            <button
              onClick={handleBuyNow}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg"
            >

              Buy Now

            </button>

          </div>

        </div>

      </div>

      {/* REVIEWS */}
      <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">

        <h2 className="text-3xl font-bold mb-5">

          Customer Reviews

        </h2>

        {/* REVIEW FORM */}
        <div className="mb-8">

          <h3 className="text-xl font-bold mb-3">

            Write Review

          </h3>

          {/* STARS */}
          <div className="flex gap-2 text-3xl mb-4">

            {[1, 2, 3, 4, 5].map((star) => (

              <FaStar
                key={star}
                onClick={() =>
                  setRating(star)
                }
                className={
                  star <= rating
                    ? "text-yellow-500 cursor-pointer"
                    : "text-gray-300 cursor-pointer"
                }
              />

            ))}

          </div>

          {/* TEXTAREA */}
          <textarea
            value={reviewText}
            onChange={(e) =>
              setReviewText(
                e.target.value
              )
            }
            placeholder="Write your review..."
            className="w-full border rounded-lg p-3 outline-none"
            rows="4"
          />

          <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg mt-4"
          >

            Submit Review

          </button>

        </div>

        {/* REVIEW LIST */}
        <div className="space-y-4">

          {productReviews.length > 0 ? (

            productReviews.map(
              (review, index) => (

                <div
                  key={index}
                  className="border p-4 rounded-lg"
                >

                  <div className="flex text-yellow-500 mb-2">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <FaStar
                        key={star}
                        className={
                          star <= review.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      />

                    ))}

                  </div>

                  <p className="font-bold">

                    {review.user}

                  </p>

                  <p className="text-gray-700 mt-2">

                    {review.reviewText}

                  </p>

                </div>
              )
            )

          ) : (

            <p>No reviews yet</p>

          )}

        </div>

      </div>

      {/* RELATED PRODUCTS */}
      <div className="max-w-6xl mx-auto mt-10">

        <h2 className="text-3xl font-bold mb-5">

          Related Products

        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {relatedProducts
            .slice(0, 4)
            .map((item) => {

              const relatedWishlist =
                wishlist.some(
                  (w) =>
                    w._id === item._id
                );

              return (

                <div
                  key={item._id}
                  onClick={() =>
                    navigate(
                      `/product/${item._id}`
                    )
                  }
                  className="bg-white rounded-xl shadow p-3 cursor-pointer hover:scale-105 duration-300 relative"
                >

                  {/* HEART */}
                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      if (
                        relatedWishlist
                      ) {

                        dispatch(
                          removeWishlist(
                            item._id
                          )
                        );

                      } else {

                        dispatch(
                          addWishlist(item)
                        );
                      }
                    }}
                    className="absolute top-4 right-4 text-2xl z-10"
                  >

                    {relatedWishlist ? (

                      <FaHeart className="text-red-500" />

                    ) : (

                      <FaRegHeart className="text-white drop-shadow-lg" />

                    )}

                  </button>

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-full object-cover rounded"
                  />

                  <h3 className="font-bold mt-3">

                    {item.name}

                  </h3>

                  <p className="text-red-500 font-bold">

                    ₹ {item.price}

                  </p>

                </div>
              );
            })}

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;