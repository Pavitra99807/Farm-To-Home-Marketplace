const marketPrices = [

  {
    crop: "Tomato",
    kannadaName: "ಟೊಮೇಟೊ",
    category: "vegetable",
    unit: "kg",
    mandi: "Bengaluru APMC",
    price: 25,
  },

  {
    crop: "Onion",
    kannadaName: "ಈರುಳ್ಳಿ",
    category: "vegetable",
    unit: "kg",
    mandi: "Yeshwanthpur Mandi",
    price: 32,
  },

  {
    crop: "Potato",
    kannadaName: "ಆಲೂಗಡ್ಡೆ",
    category: "vegetable",
    unit: "kg",
    mandi: "Mysuru Mandi",
    price: 18,
  },

  {
    crop: "Carrot",
    kannadaName: "ಕ್ಯಾರೆಟ್",
    category: "vegetable",
    unit: "kg",
    mandi: "Kolar Market",
    price: 42,
  },

  {
    crop: "Banana",
    kannadaName: "ಬಾಳೆಹಣ್ಣು",
    category: "fruits",
    unit: "dozen",
    mandi: "Mandya Market",
    price: 48,
  },

  // =========================
  // NEW CROPS
  // =========================

  {
    crop: "Rice",
    kannadaName: "ಅಕ್ಕಿ",
    category: "grain",
    unit: "kg",
    mandi: "Raichur Market",
    price: 55,
  },

  {
    crop: "Ragi",
    kannadaName: "ರಾಗಿ",
    category: "grain",
    unit: "kg",
    mandi: "Tumakuru Market",
    price: 38,
  },

  {
    crop: "Maize",
    kannadaName: "ಮಕ್ಕಿ",
    category: "grain",
    unit: "kg",
    mandi: "Davanagere Market",
    price: 30,
  },

  {
    crop: "Groundnut",
    kannadaName: "ಕಡಲೆಕಾಯಿ",
    category: "oilseed",
    unit: "kg",
    mandi: "Ballari Market",
    price: 72,
  },

  {
    crop: "Sugarcane",
    kannadaName: "ಕಬ್ಬು",
    category: "crop",
    unit: "kg",
    mandi: "Mandya Sugar Market",
    price: 40,
  },

  {
    crop: "Coconut",
    kannadaName: "ತೆಂಗಿನಕಾಯಿ",
    category: "fruits",
    unit: "piece",
    mandi: "Tiptur Market",
    price: 35,
  },

  {
    crop: "Beans",
    kannadaName: "ಬೀನ್ಸ್",
    category: "vegetable",
    unit: "kg",
    mandi: "Hassan Market",
    price: 60,
  },

  {
    crop: "Chilli",
    kannadaName: "ಮೆಣಸಿನಕಾಯಿ",
    category: "spice",
    unit: "kg",
    mandi: "Byadgi Market",
    price: 120,
  },

  {
    crop: "Turmeric",
    kannadaName: "ಅರಿಶಿನ",
    category: "spice",
    unit: "kg",
    mandi: "Belagavi Market",
    price: 95,
  },

  {
    crop: "Mango",
    kannadaName: "ಮಾವು",
    category: "fruits",
    unit: "kg",
    mandi: "Kolar Fruit Market",
    price: 80,
  },

  {
    crop: "Grapes",
    kannadaName: "ದ್ರಾಕ್ಷಿ",
    category: "fruits",
    unit: "kg",
    mandi: "Vijayapura Market",
    price: 90,
  },

  {
    crop: "Pomegranate",
    kannadaName: "ದಾಳಿಂಬೆ",
    category: "fruits",
    unit: "kg",
    mandi: "Bagalkot Market",
    price: 110,
  },

  {
    crop: "Cabbage",
    kannadaName: "ಕೋಸು",
    category: "vegetable",
    unit: "kg",
    mandi: "Mysuru Market",
    price: 22,
  },

  {
    crop: "Cauliflower",
    kannadaName: "ಹೂಕೋಸು",
    category: "vegetable",
    unit: "piece",
    mandi: "Kolar Market",
    price: 28,
  },

  {
    crop: "Brinjal",
    kannadaName: "ಬದನೆಕಾಯಿ",
    category: "vegetable",
    unit: "kg",
    mandi: "Hubballi Market",
    price: 34,
  },

  {
    crop: "Drumstick",
    kannadaName: "ನುಗ್ಗೆಕಾಯಿ",
    category: "vegetable",
    unit: "kg",
    mandi: "Shivamogga Market",
    price: 65,
  },

  {
    crop: "Coriander",
    kannadaName: "ಕೊತ್ತಂಬರಿ",
    category: "leafy",
    unit: "bunch",
    mandi: "Bengaluru Market",
    price: 15,
  },

  {
    crop: "Spinach",
    kannadaName: "ಪಾಲಕ್ ಸೊಪ್ಪು",
    category: "leafy",
    unit: "bunch",
    mandi: "Mysuru Market",
    price: 12,
  },

];

const getMarketPrices = () =>
marketPrices;

const findMarketPrice =
(productName = "") => {

  const normalizedName =
  productName
    .trim()
    .toLowerCase();

  return marketPrices.find(
    (item) => {

      return (

        item.crop
          .toLowerCase()

          ===

          normalizedName

        ||

        item.kannadaName
          ===
        productName.trim()
      );
    }
  );
};

module.exports = {

  getMarketPrices,

  findMarketPrice,
};