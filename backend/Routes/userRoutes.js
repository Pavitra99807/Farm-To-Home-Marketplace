const express =
require("express");

const router =
express.Router();

const {

  signup,

  login,

  updateUser,

  sendOTP,

  verifyOTP,

} = require(
  "../controllers/userController"
);
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// SIGNUP
router.post(
  "/signup",
  signup
);

// LOGIN
router.post(
  "/login",
  login
);

// UPDATE USER
router.put(
  "/update/:id",
  updateUser
);
router.post(
  "/send-otp",
  sendOTP
);

router.post(
  "/verify-otp",
  verifyOTP
);
router.get("/all-users", getAllUsers);

module.exports =
router;