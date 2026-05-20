const Order = require("../Models/orderModel");

// =========================
// CREATE ORDER
// =========================
const createOrder = async (
  req,
  res
) => {

  try {

    const order =
      await Order.create(
        req.body
      );

    return res.status(201).json({

      success: true,

      data: order,
    });

  } catch (error) {

    console.log(
      "CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message,
    });

  }
};

// =========================
// GET ALL ORDERS
// =========================
const getAllOrders = async (
  req,
  res
) => {

  try {

    const data =
      await Order.find({});

    return res.status(200).json({

      success: true,

      data,
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
// GET USER ORDERS
// =========================
const getUserOrders = async (
  req,
  res
) => {

  try {

    // 🔥 EMAIL BASED
    const { email } =
      req.params;

    const data =
      await Order.find({
        email,
      });

    return res.status(200).json({

      success: true,

      data,
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
// UPDATE STATUS
// =========================
const updateOrderStatus =
  async (
    req,
    res
  ) => {

    try {

      const { id } =
        req.params;

      const updated =
        await Order.findByIdAndUpdate(
          id,
          {
            orderStatus:
              req.body.status,
          },
          {
            new: true,
          }
        );

      return res.status(200).json({

        success: true,

        data: updated,
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

  createOrder,

  getAllOrders,

  getUserOrders,

  updateOrderStatus,
};