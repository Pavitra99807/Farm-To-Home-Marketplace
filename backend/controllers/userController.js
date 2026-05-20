const bcrypt = require("bcryptjs");
const User = require("../Models/userModel");
const OTP =
require("../Models/otpModel");

const otpGenerator =
require("otp-generator");

const sendMail =
require("../utils/sendMail");
const sendOTP =
async (req, res) => {

  try {

    const { email } =
    req.body;

    const otp =
    otpGenerator.generate(

      6,

      {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      }
    );

    await OTP.create({

      email,

      otp,
    });

    await sendMail(
      email,
      otp
    );

    return res.status(200).json({

      success: true,

      message:
      "OTP sent successfully",
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
//Verify OTP//
const verifyOTP =
async (req, res) => {

  try {

    const {
      email,
      otp,
    } = req.body;

    const validOTP =
    await OTP.findOne({

      email,

      otp,
    });

    if (!validOTP) {

      return res.status(400).json({

        success: false,

        message:
        "Invalid OTP",
      });
    }

    return res.status(200).json({

      success: true,

      message:
      "OTP verified",
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
// SIGNUP
const signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      address,
      phone,
      image,
      role,
    } = req.body;

    if (!firstname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = new User({
      firstname,
      lastname,
      username,
      email,
      password,
      address,
      phone,
      image,
      role: role === "farmer" ? "farmer" : "user",
    });

    await user.save();

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.REACT_APP_ADMIN_EMAIL ||
      "admin@gmail.com";
    const effectiveRole =
      user.email === adminEmail ? "admin" : user.role;
    const token = user.createJWT();

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        image: user.image,
        role: effectiveRole,
        token,
      },
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during signup",
      error: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res.status(400).json({
        success: false,
        message:
          "User not found",
      });
    }

    // PASSWORD CHECK
  const isPasswordCorrect =
  await bcrypt.compare(
    password,
    user.password
  );

    if (!isPasswordCorrect) {

  return res.status(400).json({
    success: false,
    message: "Invalid password",
  });
}

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.REACT_APP_ADMIN_EMAIL ||
      "admin@gmail.com";
    const effectiveRole =
      user.email === adminEmail ? "admin" : user.role;
    const token = user.createJWT();

    return res.status(200).json({

      success: true,

      message:
        "Login successful",

      data: {

        _id: user._id,

        firstname:
          user.firstname,

        lastname:
          user.lastname,

        username:
          user.username,

        email:
          user.email,

        image:
          user.image,

        role:
          effectiveRole,

        token,
      },
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};
const updateUser =
async (req, res) => {

  try {
    console.log(req.body);
   

    const { id } =
    req.params;

    const updatedUser =
    await User.findByIdAndUpdate(

      id,

      req.body,

      {
        new: true,
      }
    );
 console.log(updatedUser);
    return res.status(200).json({

      success: true,

      message:
      "Profile updated successfully",

      data:
      updatedUser,
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

  signup,

  login,

  updateUser,

  sendOTP,

  verifyOTP,
};
