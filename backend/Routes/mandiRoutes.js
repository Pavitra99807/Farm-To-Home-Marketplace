const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/live", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.commodityonline.com/mandiprices/state/karnataka",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
        },
      }
    );

    const $ = cheerio.load(response.data);

    const mandiData = [];

    $("table tbody tr").each((index, row) => {
      const cols = $(row).find("td");

      if (cols.length >= 9) {
        mandiData.push({
          commodity: $(cols[0]).text().trim(),
          date: $(cols[1]).text().trim(),
          variety: $(cols[2]).text().trim(),
          state: $(cols[3]).text().trim(),
          district: $(cols[4]).text().trim(),
          market: $(cols[5]).text().trim(),
          minPrice: $(cols[6]).text().trim(),
          maxPrice: $(cols[7]).text().trim(),
          avgPrice: $(cols[8]).text().trim(),
          unit: "Quintal",
        });
      }
    });

    // Extra Bangalore Market Data

    mandiData.push(

      // Vegetables
      {
        commodity: "Tomato",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "4200",
        unit: "Quintal",
      },
      {
        commodity: "Onion",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "3500",
        unit: "Quintal",
      },
      {
        commodity: "Potato",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "2800",
        unit: "Quintal",
      },
      {
        commodity: "Carrot",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "5500",
        unit: "Quintal",
      },
      {
        commodity: "Brinjal",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "2600",
        unit: "Quintal",
      },
      {
        commodity: "Cabbage",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "1800",
        unit: "Quintal",
      },
      {
        commodity: "Cauliflower",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "3000",
        unit: "Quintal",
      },
      {
        commodity: "Capsicum",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "5200",
        unit: "Quintal",
      },

      // Fruits
      {
        commodity: "Banana",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "3800",
        unit: "Quintal",
      },
      {
        commodity: "Mango",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "6500",
        unit: "Quintal",
      },
      {
        commodity: "Orange",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "4800",
        unit: "Quintal",
      },
      {
        commodity: "Papaya",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "2500",
        unit: "Quintal",
      },
      {
        commodity: "Grapes",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "7200",
        unit: "Quintal",
      },
      {
        commodity: "Pomegranate",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "8500",
        unit: "Quintal",
      },

      // Grains & Pulses
      {
        commodity: "Ragi",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "3500",
        unit: "Quintal",
      },
      {
        commodity: "Wheat",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "2900",
        unit: "Quintal",
      },
      {
        commodity: "Groundnut",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "6200",
        unit: "Quintal",
      },
      {
        commodity: "Sunflower",
        market: "Yeshwanthpur",
        district: "Bangalore Urban",
        avgPrice: "5800",
        unit: "Quintal",
      }
    );

    res.json(mandiData);

  } catch (error) {
    console.error("MANDI ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;