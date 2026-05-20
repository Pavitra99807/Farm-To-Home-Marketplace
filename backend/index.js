const express = require("express");
require("dotenv").config();
require("express-async-errors");

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

// 👉 PAYMENT ROUTES (ADD THIS)
const paymentRoutes = require("./Routes/paymentRoutes");
const contactRoutes =
  require(
    "./Routes/contactRoutes"
  );
  app.use(
  "/api/contact",
  contactRoutes
);
console.log("🔥 Payment route loaded"); 
// API ROUTES
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/farmer-products", farmerProductRoutes);

// 👉 PAYMENT API ROUTE
app.use("/api/payment", require("./Routes/paymentRoutes"));

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
