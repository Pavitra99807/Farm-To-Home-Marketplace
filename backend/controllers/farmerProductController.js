const FarmerProduct =
require("../Models/farmerProductModel");

const Product =
require("../Models/productModel");

const User =
require("../Models/userModel");

const {

  getMarketPrices,

  findMarketPrice,

} = require(
  "../utils/marketPriceService"
);

// =========================
// GET ALL MARKET PRICES
// =========================
const getMarketPriceList =
async (req, res) => {

  try {

    return res.status(200).json({

      success: true,

      data:
      getMarketPrices(),
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};

// =========================
// SEARCH MARKET PRICE
// =========================
const searchMarketPrice =
async (req, res) => {

  try {

    const {
      productName,
    } = req.params;

    const marketData =
    findMarketPrice(
      productName
    );

    if (!marketData) {

      return res.status(404).json({

        success: false,

        message:
        "Market price not found",
      });
    }

    return res.status(200).json({

      success: true,

      data:
      marketData,
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};

// =========================
// SUBMIT FARMER PRODUCT
// =========================
const submitFarmerProduct =
async (req, res) => {

  try {

    const {

      productName,

      category,

      image,

      quantity,

      marketPrice,

      farmerPrice,

      description,

    } = req.body;

    // VALIDATION
    if (

      !productName ||

      !category ||

      !quantity ||

      !farmerPrice

    ) {

      return res.status(400).json({

        success: false,

        message:
        "Product name, category, quantity and farmer price are required",
      });
    }

    // CHECK FARMER
    const farmer =
    await User.findById(
      req.user.userId
    );

    if (

      !farmer ||

      farmer.role !== "farmer"

    ) {

      return res.status(403).json({

        success: false,

        message:
        "Only registered farmers can submit products",
      });
    }

    // AUTO MARKET PRICE FETCH
    const marketInfo =
    findMarketPrice(
      productName
    );

    // CREATE PRODUCT
    const product =
    await FarmerProduct.create({

      farmerId:
      farmer._id,

      farmerName:

        `${farmer.firstname || ""} ${farmer.lastname || ""}`

          .trim()

        ||

        farmer.username

        ||

        farmer.email,

      productName,

      category,

      image,

      quantity:
      Number(quantity),

      marketPrice:

        Number(

          marketInfo?.price

          ||

          marketPrice

          ||

          0
        ),

      marketName:

        marketInfo?.mandi

        ||

        "Karnataka Market",

      farmerPrice:
      Number(farmerPrice),

      description,

      status:
      "pending",
    });

    return res.status(201).json({

      success: true,

      message:
      "Product submitted for admin verification",

      data:
      product,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};

// =========================
// GET FARMER PRODUCTS
// =========================
const getMyFarmerProducts =
async (req, res) => {

  try {

    const products =
    await FarmerProduct.find({

      farmerId:
      req.user.userId,

    }).sort({

      createdAt: -1,
    });

    return res.status(200).json({

      success: true,

      data:
      products,
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};

// =========================
// ADMIN GET PRODUCTS
// =========================
const getAdminFarmerProducts =
async (req, res) => {

  try {

    const status =
    req.query.status;

    const query =
    status
      ? { status }
      : {};

    const products =
    await FarmerProduct.find(
      query
    )

    .populate(

      "farmerId",

      "firstname lastname username email phone address"
    )

    .sort({

      createdAt: -1,
    });

    return res.status(200).json({

      success: true,

      data:
      products,
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};

// =========================
// APPROVE / REJECT PRODUCT
// =========================
const updateFarmerProductStatus =
async (req, res) => {

  try {

    const { id } =
    req.params;

    const {

      status,

      adminRemark,

    } = req.body;

    // VALIDATION
    if (

      ![
        "approved",
        "rejected",
      ].includes(status)

    ) {

      return res.status(400).json({

        success: false,

        message:
        "Status must be approved or rejected",
      });
    }

    // FIND PRODUCT
    const farmerProduct =
    await FarmerProduct.findById(
      id
    );

    if (!farmerProduct) {

      return res.status(404).json({

        success: false,

        message:
        "Farmer product request not found",
      });
    }

    // UPDATE STATUS
    farmerProduct.status =
    status;

    farmerProduct.adminRemark =
    adminRemark || "";

    // APPROVED PRODUCT
    if (

      status === "approved"

      &&

      !farmerProduct.approvedProductId

    ) {

      const approvedProduct =
      await Product.create({

        name:
        farmerProduct.productName,

        price:
        farmerProduct.farmerPrice,

        image:
        farmerProduct.image,

        category:
        farmerProduct.category,

        description:
        farmerProduct.description,

        stock:
        farmerProduct.quantity,

        sellerType:
        "farmer",

        farmerProductId:
        farmerProduct._id,

        farmerId:
        farmerProduct.farmerId,

        farmerName:
        farmerProduct.farmerName,
      });

      farmerProduct.approvedProductId =
      approvedProduct._id;
    }

    await farmerProduct.save();

    return res.status(200).json({

      success: true,

      message:
      `Farmer product ${status}`,

      data:
      farmerProduct,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};

module.exports = {

  getMarketPriceList,

  searchMarketPrice,

  submitFarmerProduct,

  getMyFarmerProducts,

  getAdminFarmerProducts,

  updateFarmerProductStatus,
};