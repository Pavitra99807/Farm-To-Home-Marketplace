const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

// CREATE
router.post(
  "/create",
  createProduct
);

// GET ALL
router.get(
  "/all",
  getAllProducts
);

// GET SINGLE
router.get(
  "/:id",
  getSingleProduct
);

// UPDATE
router.put(
  "/update/:id",
  updateProduct
);

// DELETE
router.delete(
  "/delete/:id",
  deleteProduct
);

module.exports = router;