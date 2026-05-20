import React from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaStar,
} from "react-icons/fa";

import {
  removeReview,
} from "../redux/productSlice";

const AdminReviews = () => {

  const dispatch = useDispatch();

  const reviews = useSelector(
    (state) => state.product.reviews
  );

  return (

    <div className="p-5 max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold mb-5">

        Admin Reviews Panel

      </h2>

      {reviews.length === 0 ? (

        <p>No reviews found</p>

      ) : (

        <div className="space-y-4">

          {reviews.map(
            (review, index) => (

              <div
                key={index}
                className="bg-white shadow rounded-lg p-5"
              >

                {/* USER */}
                <p className="font-bold text-lg">

                  User: {review.user}

                </p>

                {/* PRODUCT */}
                <p className="text-gray-600">

                  Product ID:
                  {review.productId}

                </p>

                {/* STARS */}
                <div className="flex gap-1 text-yellow-500 my-2">

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

                {/* REVIEW */}
                <p className="text-gray-700">

                  {review.reviewText}

                </p>

                {/* DELETE */}
                <button
                  onClick={() =>
                    dispatch(
                      removeReview(index)
                    )
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4"
                >

                  Delete Review

                </button>

              </div>
            )
          )}

        </div>

      )}

    </div>
  );
};

export default AdminReviews;