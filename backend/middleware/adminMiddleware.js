const adminMiddleware = (req, res, next) => {
  try {
    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.REACT_APP_ADMIN_EMAIL ||
      "admin@gmail.com";

    if (
      !req.user ||
      (req.user.role !== "admin" && req.user.email !== adminEmail)
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = adminMiddleware;
