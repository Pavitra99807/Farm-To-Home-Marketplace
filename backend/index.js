const express = require("express");
require("dotenv").config();
require("express-async-errors");
const mandiRoutes = require("./Routes/mandiRoutes");
const cors = require("cors");

const connectDB = require("./utils/db");

const app = express();

app.use(cors());

// IMPORTANT FIX
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ROUTES
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const farmerProductRoutes = require("./Routes/farmerProductRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const contactRoutes = require("./Routes/contactRoutes");
const logisticsRoutes = require("./Routes/logisticsRoutes");
const walletRoutes = require("./Routes/walletRoutes");
const weatherRoutes = require("./Routes/weatherRoutes");
const priceRoutes = require("./Routes/priceRoutes");
const trackingRoutes = require("./Routes/trackingRoutes");
const deliveryRoutes = require("./Routes/deliveryRoutes");
const ratingRoutes = require("./Routes/ratingRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const demandRoutes = require("./Routes/demandRoutes");
const adminRoutes = require("./Routes/adminRoutes");

// API ROUTES
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/farmer-products", farmerProductRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/logistics", logisticsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/demand", demandRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/admin", adminRoutes);
// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Server running");
});

// SERVER START
const start = async () => {
  try {
    await connectDB();

    app.listen(8050, "0.0.0.0", () => {
      console.log("Server running on port 8050");
    });

  } catch (err) {
    console.log(err);
  }
};

start();
