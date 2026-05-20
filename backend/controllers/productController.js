const Product = require("../Models/productModel");
const FarmerProduct = require("../Models/farmerProductModel");

const publishApprovedFarmerProducts = async () => {
  const approvedFarmerProducts = await FarmerProduct.find({
    status: "approved",
  });

  for (const farmerProduct of approvedFarmerProducts) {
    const existingProduct = farmerProduct.approvedProductId
      ? await Product.findById(farmerProduct.approvedProductId)
      : await Product.findOne({
          farmerProductId: farmerProduct._id,
        });

    if (existingProduct) {
      if (!farmerProduct.approvedProductId) {
        farmerProduct.approvedProductId = existingProduct._id;
        await farmerProduct.save();
      }

      continue;
    }

    const product = await Product.create({
      name: farmerProduct.productName,
      price: farmerProduct.farmerPrice,
      image: farmerProduct.image,
      category: farmerProduct.category,
      description: farmerProduct.description,
      stock: farmerProduct.quantity,
      sellerType: "farmer",
      farmerProductId: farmerProduct._id,
      farmerId: farmerProduct.farmerId,
      farmerName: farmerProduct.farmerName,
    });

    farmerProduct.approvedProductId = product._id;
    await farmerProduct.save();
  }
};

// ==========================
// CREATE PRODUCT
// ==========================
const createProduct = async (
  req,
  res
) => {

  try {

    const data =
      await Product.create(
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Product uploaded successfully",
      data,
    });

  } catch (error) {

    console.log(
      "UPLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ==========================
// GET ALL PRODUCTS
// ==========================
const getAllProducts = async (
  req,
  res
) => {

  try {

    await publishApprovedFarmerProducts();

    const data =
      await Product.find({});

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    console.log(
      "GET PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ==========================
// GET SINGLE PRODUCT
// ==========================
const getSingleProduct =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const product =
        await Product.findById(
          id
        );

      return res.status(200).json({
        success: true,
        data: product,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ==========================
// DELETE PRODUCT
// ==========================
const deleteProduct = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    await Product.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ==========================
// UPDATE PRODUCT
// ==========================
const updateProduct = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const updated =
      await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );

    return res.status(200).json({
      success: true,
      data: updated,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

module.exports = {

  createProduct,

  getAllProducts,

  getSingleProduct,

  deleteProduct,

  updateProduct,
};
