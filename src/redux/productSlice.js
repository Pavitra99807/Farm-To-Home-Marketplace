import { createSlice } from "@reduxjs/toolkit";

// =========================
// SAFE USER
// =========================
const getUser = () => {

  try {

    const userData =
      localStorage.getItem("user");

    return userData &&
      userData !== "undefined"
      ? JSON.parse(userData)
      : {};

  } catch {

    return {};
  }
};

// =========================
// SAFE STORAGE GET
// =========================
const getStorageData = (
  key
) => {

  try {

    const data =
      localStorage.getItem(key);

    return data &&
      data !== "undefined"
      ? JSON.parse(data)
      : [];

  } catch {

    return [];
  }
};

const user = getUser();

// =========================
// INITIAL STATE
// =========================
const initialState = {

  cartItem:
    getStorageData(
      `cartItem_${
        user?.email || "guest"
      }`
    ),

  wishlist:
    getStorageData(
      `wishlist_${
        user?.email || "guest"
      }`
    ),

  reviews:
    getStorageData(
      "reviews"
    ),

  productList: [],

  status: null,
};

// =========================
// SAVE CART
// =========================
const getStorageEmail = () => {
  const user = getUser();

  return user?.email || "guest";
};

const saveCartToLocalStorage =
(cartItems, email = getStorageEmail()) => {

  try {

    const optimizedCart =
    cartItems.map((item) => ({

      _id: item._id,

      name: item.name,

      category: item.category,

      price: item.price,

      qty: item.qty,

      image:
        item.image &&
        item.image.length > 500

        ? ""

        : item.image,
    }));

    localStorage.setItem(

      `cartItem_${email}`,

      JSON.stringify(
        optimizedCart
      )
    );

  } catch (error) {

    console.log(
      "CART STORAGE ERROR:",
      error
    );
  }
};

// =========================
// SAVE WISHLIST
// =========================
const saveWishlistToLocalStorage =
(wishlist, email = getStorageEmail()) => {

  try {

    const optimizedWishlist =
    wishlist.map((item) => ({

      _id: item._id,

      name: item.name,

      category: item.category,

      price: item.price,

      image:
        item.image &&
        item.image.length > 500

        ? ""

        : item.image,
    }));

    localStorage.setItem(

      `wishlist_${email}`,

      JSON.stringify(
        optimizedWishlist
      )
    );

  } catch (error) {

    console.log(
      "WISHLIST STORAGE ERROR:",
      error
    );
  }
};

// =========================
// SAVE REVIEWS
// =========================
const saveReviewsToLocalStorage = (
  reviews
) => {

  localStorage.setItem(
    "reviews",
    JSON.stringify(reviews)
  );
};

// =========================
// SLICE
// =========================
const productSlice = createSlice({

  name: "products",

  initialState,

  reducers: {

    // =========================
    // ADD CART
    // =========================
    addCartItem: (
      state,
      action
    ) => {

      const existingItemIndex =
        state.cartItem.findIndex(
          (item) =>
            item._id ===
            action.payload._id
        );

      if (
        existingItemIndex !== -1
      ) {

        state.cartItem[
          existingItemIndex
        ].qty++;

        state.cartItem[
          existingItemIndex
        ].total =
          state.cartItem[
            existingItemIndex
          ].qty *
          state.cartItem[
            existingItemIndex
          ].price;

      } else {

       const product = {

  _id:
    action.payload._id,

  name:
    action.payload.name,

  category:
    action.payload.category,

  price:
    action.payload.price,

  image:
    action.payload.image,

  qty: 1,
  total:
    action.payload.price,
};

state.cartItem.push(product);
      }

      saveCartToLocalStorage(
        state.cartItem
      );
    },

    // =========================
    // DELETE CART ITEM
    // =========================
    deleteCartItem: (
      state,
      action
    ) => {

      state.cartItem =
        state.cartItem.filter(
          (item) =>
            item._id !==
            action.payload.id
        );

      saveCartToLocalStorage(
        state.cartItem
      );
    },

    // =========================
    // INCREASE QTY
    // =========================
    increaseQty: (
      state,
      action
    ) => {

      const existingItem =
        state.cartItem.find(
          (item) =>
            item._id ===
            action.payload.id
        );

      if (existingItem) {

        existingItem.qty++;

        existingItem.total =
          existingItem.qty *
          existingItem.price;
      }

      saveCartToLocalStorage(
        state.cartItem
      );
    },

    // =========================
    // DECREASE QTY
    // =========================
    decreaseQty: (
      state,
      action
    ) => {

      const existingItem =
        state.cartItem.find(
          (item) =>
            item._id ===
            action.payload.id
        );

      if (
        existingItem &&
        existingItem.qty > 1
      ) {

        existingItem.qty--;

        existingItem.total =
          existingItem.qty *
          existingItem.price;
      }

      saveCartToLocalStorage(
        state.cartItem
      );
    },

    // =========================
    // PRODUCT DATA
    // =========================
    setDataProduct: (
      state,
      action
    ) => {

      state.productList =
        action.payload;
    },

    // =========================
    // ADD WISHLIST
    // =========================
    addWishlist: (
      state,
      action
    ) => {

      const exists =
        state.wishlist.find(
          (item) =>
            item._id ===
            action.payload._id
        );

      if (!exists) {

        state.wishlist.push(
          action.payload
        );

        saveWishlistToLocalStorage(
          state.wishlist
        );
      }
    },

    // =========================
    // REMOVE WISHLIST
    // =========================
    removeWishlist: (
      state,
      action
    ) => {

      state.wishlist =
        state.wishlist.filter(
          (item) =>
            item._id !==
            action.payload
        );

      saveWishlistToLocalStorage(
        state.wishlist
      );
    },

    // =========================
    // LOAD USER DATA
    // =========================
    loadUserData: (
      state
    ) => {

      const user = getUser();

      state.cartItem =
        getStorageData(
          `cartItem_${
            user?.email ||
            "guest"
          }`
        );

      state.wishlist =
        getStorageData(
          `wishlist_${
            user?.email ||
            "guest"
          }`
        );
    },

    // =========================
    // ADD REVIEW
    // =========================
    addReview: (
      state,
      action
    ) => {

      state.reviews.push(
        action.payload
      );

      saveReviewsToLocalStorage(
        state.reviews
      );
    },

    // =========================
    // REMOVE REVIEW
    // =========================
    removeReview: (
      state,
      action
    ) => {

      state.reviews.splice(
        action.payload,
        1
      );

      saveReviewsToLocalStorage(
        state.reviews
      );
    },
  },
});

// =========================
// EXPORTS
// =========================
export const {

  addCartItem,

  deleteCartItem,

  increaseQty,

  decreaseQty,

  setDataProduct,

  addWishlist,

  removeWishlist,

  addReview,

  removeReview,

  loadUserData,

} = productSlice.actions;

export default productSlice.reducer;
