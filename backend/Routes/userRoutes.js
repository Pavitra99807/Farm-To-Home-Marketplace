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

module.exports =
router;