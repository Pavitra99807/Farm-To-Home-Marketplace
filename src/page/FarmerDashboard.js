import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getKarnatakaMandiPrices } from "../services/mandiService";

import {
  FaMicrophone,
  FaCloudUploadAlt,
  FaRupeeSign,
  FaSeedling,
  FaChartLine,
} from "react-icons/fa";
import farmerDashboardVideo from "../assest/farmer-dashboard-bg.mp4";
import { calculateLogistics } from "../services/logisticsService";
import locationData from "../data/locationData";

const API_BASE = "http://localhost:8050";

const emptyForm = {
  productName: "",
  category: "vegetable",
  image: "",
  quantity: "",
  unit: "Quintal",
  marketPrice: "",
  farmerPrice: "",
  description: "",
};
const WAREHOUSE = {
  lat: 12.9237,
  lng: 77.4987,
};
const districtCoordinates = {
  Mysuru: {
    lat: 12.2958,
    lng: 76.6394,
  },

  Mandya: {
    lat: 12.5223,
    lng: 76.8975,
  },

  Ramanagara: {
    lat: 12.7219,
    lng: 77.2815,
  },

  BengaluruUrban: {
    lat: 12.9716,
    lng: 77.5946,
  },
};
const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return Math.round(R * c);
};

const FarmerDashboard = () => {
 const navigate = useNavigate();
  const user = useSelector((state) => state.user);
const { t, i18n } = useTranslation();


const [descriptionListening, setDescriptionListening] =
useState(false);
  
  const [products, setProducts] = useState([]);
  
 const [weather,setWeather] =
useState(null);


const [showWeather,
setShowWeather] =
useState(false);

const [forecast, setForecast] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [marketPrices, setMarketPrices] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
 
  const [logisticsData, setLogisticsData] = useState(null);
  const [activeTab, setActiveTab] = useState("vegetables");
const [selectedState, setSelectedState] = useState("");
const [selectedDistrict, setSelectedDistrict] = useState("");
const [selectedHobli, setSelectedHobli] = useState("");
const [villageName, setVillageName] = useState("");

const [deliveryOption, setDeliveryOption] =
  useState("company");

const [distance, setDistance] = useState(0);

const [logisticsCost, setLogisticsCost] =
  useState(0);

  console.log("FORM PRODUCT =", form.productName);
console.log("MARKET PRICES =", marketPrices);
 const selectedMarket = useMemo(() => {
  const productName = form.productName.trim().toLowerCase();


  return mandiPrices.find(
    (item) =>
      item.commodity?.toLowerCase() === productName
  );
}, [form.productName, mandiPrices]);

  
  useEffect(() => {
  if (!selectedDistrict) return;

  const districtData =
    districtCoordinates[
      selectedDistrict
    ];

  const km =
    calculateDistance(
      districtData.lat,
      districtData.lng,
      WAREHOUSE.lat,
      WAREHOUSE.lng
    );

  setDistance(km);

  if (
    deliveryOption ===
    "company"
  ) {
    setLogisticsCost(
      km * 8
    );
  } else {
    setLogisticsCost(0);
  }
}, [
  selectedDistrict,
  deliveryOption
]);
useEffect(() => {
  if (!selectedMarket || !form.quantity) return;

  const qty = Number(form.quantity);

 const mandiRate = Number(
  (
    selectedMarket.price ||
    selectedMarket.avgPrice ||
    0
  )
    .toString()
    .replace(/[^\d]/g, "")
);

  let totalAmount = 0;

  if (form.unit === "Quintal") {
    totalAmount = qty * mandiRate;
  } else {
    totalAmount = qty * (mandiRate / 100);
  }

  setForm((prev) => ({
    ...prev,
    marketPrice: mandiRate,
    farmerPrice: totalAmount.toFixed(0),
  }));
}, [form.quantity, form.unit, selectedMarket]);
const vegetables = [
  "Tomato",
  "Onion",
  "Potato",
  "Carrot",
  "Beans",
  "Ladies Finger",
  "Brinjal",
  "Cabbage",
  "Cauliflower",
  "Capsicum",
  "Knool Khol",
  "Sesamum(Sesame,Gingelly,Til)"
];
const fruits = [
  "Banana",
  "Mango",
  "Orange",
  "Papaya",
  "Grapes",
  "Pomegranate"
];

const grains = [
  "Ragi",
  "Wheat",
  "Groundnut",
  "Sunflower",
  "Maize",
  "Jowar(Sorghum)",
  "Bajra(Pearl Millet/Cumbu)",
  "Arecanut(Betelnut/Supari)"
];
useEffect(() => {
  if (!form.productName) return;

  const veg = vegetables.includes(form.productName);
  const fruit = fruits.includes(form.productName);
  const grain = grains.includes(form.productName);

  if (veg) {
    setForm(prev => ({
      ...prev,
      category: "vegetable"
    }));
  } else if (fruit) {
    setForm(prev => ({
      ...prev,
      category: "fruit"
    }));
  } else if (grain) {
    setForm(prev => ({
      ...prev,
      category: "grain"
    }));
  }

}, [form.productName]);
const states =
  Object.keys(locationData);

const districts =
  selectedState
    ? Object.keys(
        locationData[selectedState]
      )
    : [];

const hoblis =
  selectedState &&
  selectedDistrict
    ? locationData[selectedState][selectedDistrict]
    : [];
const vegetablePrices = [
  ...new Map(
    mandiPrices
      .filter(item => vegetables.includes(item.commodity))
      .map(item => [item.commodity.toLowerCase(), item])
  ).values(),
];

const fruitPrices = [
  ...new Map(
    mandiPrices
      .filter(item => fruits.includes(item.commodity))
      .map(item => [item.commodity.toLowerCase(), item])
  ).values(),
];

const grainPrices = [
  ...new Map(
    mandiPrices
      .filter(item => grains.includes(item.commodity))
      .map(item => [item.commodity.toLowerCase(), item])
  ).values(),
];
const kannadaNames = {
  // Vegetables
  Tomato: "ಟೊಮ್ಯಾಟೊ",
  Onion: "ಈರುಳ್ಳಿ",
  Potato: "ಆಲೂಗಡ್ಡೆ",
  Carrot: "ಕ್ಯಾರೆಟ್",
  Beans: "ಬೀನ್ಸ್",
  "Ladies Finger": "ಬೆಂಡೆಕಾಯಿ",
  Brinjal: "ಬದನೆಕಾಯಿ",
  Cabbage: "ಎಲೆಕೋಸು",
  Cauliflower: "ಹೂಕೋಸು",
  Capsicum: "ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ",

  // Fruits
  Banana: "ಬಾಳೆಹಣ್ಣು",
  Mango: "ಮಾವು",
  Orange: "ಕಿತ್ತಳೆ",
  Papaya: "ಪಪ್ಪಾಯಿ",
  Grapes: "ದ್ರಾಕ್ಷಿ",
  Pomegranate: "ದಾಳಿಂಬೆ",

  // Grains
  Ragi: "ರಾಗಿ",
  Wheat: "ಗೋಧಿ",
  Groundnut: "ಕಡಲೆಕಾಯಿ",
  Sunflower: "ಸೂರ್ಯಕಾಂತಿ",
  Maize: "ಮೆಕ್ಕೆಜೋಳ",
  "Arecanut(Betelnut/Supari)": "ಅಡಿಕೆ",
  "Bajra(Pearl Millet/Cumbu)": "ಸಜ್ಜೆ",
   "Jowar(Sorghum)": "ಜೋಳ",
  "Bajra(Pearl Millet/Cumbu)": "ಸಜ್ಜೆ",
  
  
  
};
const kannadaMarket = {
  Yeshwanthpur: "ಯಶವಂತಪುರ",
  Nanjangud: "ನಂಜನಗೂಡು",
  Gundlupet: "ಗುಂಡ್ಲುಪೇಟೆ",
  Ramanagara: "ರಾಮನಗರ",
  Malur: "ಮಾಲೂರು",
  Honnali: "ಹೊನ್ನಾಳಿ",
  Shikaripura: "ಶಿಕಾರಿಪುರ",
  Lingasugur: "ಲಿಂಗಸುಗೂರು",
  Ballari: "ಬಳ್ಳಾರಿ",
  Theerthahalli: "ತೀರ್ಥಹಳ್ಳಿ"
};

const kannadaDistrict = {
  "Bangalore Urban": "ಬೆಂಗಳೂರು ನಗರ",
  Mysuru: "ಮೈಸೂರು",
  Shivamogga: "ಶಿವಮೊಗ್ಗ",
  Davangere: "ದಾವಣಗೆರೆ",
  Chamarajanagar: "ಚಾಮರಾಜನಗರ",
  Kolar: "ಕೋಲಾರ",
  Raichur: "ರಾಯಚೂರು",
  Ballary: "ಬಳ್ಳಾರಿ",
  Bellary: "ಬಳ್ಳಾರಿ",
  "Bangalore Urban": "ಬೆಂಗಳೂರು ನಗರ",
  Chamarajanagar: "ಚಾಮರಾಜನಗರ"
};


  const generateDescription =
(product) => {

  return `Fresh ${product} directly harvested from Karnataka farms. High quality farm product supplied by local farmers.`;
};
const getPriceSuggestion =
(farmerPrice, marketPrice) => {

  if (

    Number(farmerPrice)

    >

    Number(marketPrice) + 10

  ) {

    return "🔴 Price is higher than market trend";
  }

  if (

    Number(farmerPrice)

    <

    Number(marketPrice) - 5

  ) {

    return "🟡 Price is very low";
  }

  return "🟢 Competitive market price";
};
const speakKannada =
(text) => {

  window.speechSynthesis.cancel();

  const speech =
  new SpeechSynthesisUtterance(
    text
  );

  const voices =
  window.speechSynthesis.getVoices();

  console.log(voices);

  // TRY TO FIND FEMALE / BETTER VOICE
  const kannadaVoice =

    voices.find((voice) =>

      voice.name
        .toLowerCase()
        .includes("female")

      &&

      voice.lang.includes("hi-IN")
    )

    ||

    voices.find((voice) =>

      voice.lang.includes("hi-IN")
    )

    ||

    voices.find((voice) =>

      voice.lang.includes("hi-IN")
    );

  if (kannadaVoice) {

    speech.voice =
    kannadaVoice;
  }

  speech.lang = "hi-IN";

  speech.volume = 1;

  // SLOWER = MORE NATURAL
  speech.rate = 0.9;

  // SLIGHTLY SOFTER FEMALE EFFECT
  speech.pitch = 1.15;


window.speechSynthesis.speak(
  speech
);
speech.onend = () => {

  setListening(false);
};
};
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const token = user.token || localStorage.getItem("token");



  

  const fetchDashboardData = useCallback(async () => {
    try {
      const [marketRes, productRes] = await Promise.all([
        axios.get(`${API_BASE}/api/farmer-products/market-prices`),
        axios.get(`${API_BASE}/api/farmer-products/my-products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setMarketPrices(marketRes.data.data || []);
      setProducts(productRes.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load farmer dashboard");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, token]);

  useEffect(() => {
    if (selectedMarket) {
      setForm((prev) => ({
        ...prev,
        marketPrice: selectedMarket.avgPrice,
        category: selectedMarket.category,
      }));
    }
  }, [selectedMarket]);

 const handleChange = (e) => {

  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  // AUTO MARKET PRICE FETCH
  if (name === "productName") {

    const selected =
    marketPrices.find((item) => {

      return (

        item.crop
          .toLowerCase()

          ===

          value
          .toLowerCase()

        ||

        item.kannadaName
          ===
        value.trim()
      );
    });

    if (selected) {

      setForm((prev) => ({

        ...prev,

        productName:
        value,

        marketPrice:
        selected.price,

        category:
        selected.category,
      }));
    }
  }
};

 const handleImageUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setForm((prev) => ({
      ...prev,
      image: reader.result,
    }));
  };

  reader.readAsDataURL(file);
};
 const loadMandiPrices = async () => {
  try {
    const data = await getKarnatakaMandiPrices();

    console.log("MANDI DATA =", data);

    setMandiPrices(data || []);
  } catch (err) {
    console.log("MANDI ERROR =", err);
  }
};

useEffect(() => {
  loadMandiPrices();
}, []);

  const startKannadaVoice = () => {
    window.speechSynthesis.resume();

    window.speechSynthesis.getVoices();
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser");
      return;
    }
  

    const recognition = new SpeechRecognition();
    recognition.lang = "kn-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      toast.error("Voice input failed. Please try again.");
    };
recognition.onresult = (event) => {

  const transcript =
  event.results[0][0].transcript;

  const matchedProduct =
  marketPrices.find((item) => {

    return (

      item.kannadaName
        ===
      transcript.trim()

      ||

      item.crop
        .toLowerCase()

        ===

      transcript
        .toLowerCase()
    );
  });

  // =========================
  // PRODUCT FOUND
  // =========================
  if (matchedProduct) {

    setForm((prev) => ({

      ...prev,

      productName:
      matchedProduct.crop,

      category:
      matchedProduct.category,

      marketPrice:
      matchedProduct.price,

      description:
      generateDescription(
        matchedProduct.crop
      ),
    }));

    // AI KANNADA SPEECH
    const speechText =

`ನಮಸ್ಕಾರ ರೈತರೆ.
${matchedProduct.crop} ಉತ್ಪನ್ನವು ${matchedProduct.mandi} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಲಭ್ಯವಿದೆ.
ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ${matchedProduct.price} ರೂಪಾಯಿ ಪ್ರತಿ ${matchedProduct.unit}.
ನೀವು ಉತ್ತಮ ಲಾಭಕ್ಕಾಗಿ ${matchedProduct.price + 5} ರೂಪಾಯಿ ವರೆಗೆ ಮಾರಾಟ ಮಾಡಬಹುದು.`;

   speakKannada(
  speechText
);

    toast.success(
      "Product found in Karnataka mandi"
    );

  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================
  else {

    // RANDOM AI PRICE ESTIMATE
    const estimatedPrice =
    Math.floor(
      Math.random() * 80
    ) + 20;

    setForm((prev) => ({

      ...prev,

      productName:
      transcript,

      marketPrice:
      estimatedPrice,

      description:

`${transcript} fresh farm product supplied directly from local Karnataka farmers.`,
    }));

    // AI SPEAK FOR UNKNOWN PRODUCT
    const unknownSpeech =

`ಕ್ಷಮಿಸಿ ರೈತರೆ.
ಈ ಉತ್ಪನ್ನವು ಕರ್ನಾಟಕ ಮಾರುಕಟ್ಟೆ ಪಟ್ಟಿಯಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.
ಆದರೆ ನಮ್ಮ ಅಂದಾಜಿನ ಪ್ರಕಾರ ಈ ಉತ್ಪನ್ನದ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಸುಮಾರು ${estimatedPrice} ರೂಪಾಯಿ ಇರಬಹುದು.
ನೀವು ಈ ಉತ್ಪನ್ನವನ್ನು ಮಾರಾಟಕ್ಕೆ ಸೇರಿಸಬಹುದು.`;

  speakKannada(
  unknownSpeech
);

    toast.error(
      "Product not found in mandi list"
    );
  }
};

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login as a farmer");
      return;
    }

    console.log("SUBMIT FORM =", form);
    if (!form.productName || !form.quantity || !form.farmerPrice) {
      toast.error("Please complete product name, quantity and farmer price");
      return;
    }

    try {
      setLoading(true);

    await axios.post(
  `${API_BASE}/api/farmer-products/submit`,
  {
    ...form,
    state:
  selectedState,

district:
  selectedDistrict,

hobli:
  selectedHobli,

village:
  villageName,

deliveryOption,

distanceToWarehouse:
  distance,

logisticsCost:
  logisticsCost,

    

    marketPrice: Number(form.marketPrice),
    quantity: Number(form.quantity),
    farmerPrice: Number(form.farmerPrice),
  },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product submitted for admin approval");
      setForm(emptyForm);
      fetchDashboardData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };
const startDescriptionVoice = () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang =
    i18n.language === "kn"
      ? "kn-IN"
      : "en-IN";

  recognition.onstart = () =>
    setDescriptionListening(true);

  recognition.onend = () =>
    setDescriptionListening(false);

  recognition.onresult = (event) => {

    const text =
      event.results[0][0].transcript;

    setForm((prev) => ({
      ...prev,
      description: text,
    }));
  };

  recognition.start();
};
const getWeather = async () => {

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      try {

        const res = await axios.post(
          "http://localhost:8050/api/weather/current",
          {
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,
          }
        );

        if (res.data.success) {

          setWeather(
            res.data.data
          );

          setShowWeather(true);
        }

      } catch (error) {

        console.log(error);

        alert("Weather fetch failed");
      }
    }

  );
};
const getForecast = async () => {

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      try {

        const res = await axios.post(
          "http://localhost:8050/api/weather/forecast",
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        );
console.log("FORECAST =", res.data);
        if (res.data.success) {

          setForecast(res.data.data);

        }

      } catch (error) {

        console.log(error);

      }

    }

  );

};


  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 p-4 md:p-6">
   

      <div className="fixed inset-0 bg-gradient-to-r from-slate-950/78 via-slate-950/48 to-slate-950/12" />

      <div className="relative min-h-screen">
     <div className="space-y-6 w-full">
        <section className="w-full bg-white/90 dark:bg-slate-900/88 backdrop-blur border border-white/30 dark:border-slate-700 rounded-lg p-5">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              {t("welcome")}
            </p>
           <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
  {user.firstname || "Farmer"} - {t("farmerDashboard")}
</h1>


            <p className="text-slate-500 mt-1">
              Rural-first selling with market intelligence, Kannada voice input,
              and admin verified trust.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className="px-4 py-2 rounded border bg-white/90 dark:bg-slate-800"
            >
              English
            </button>
            <button
              onClick={() => i18n.changeLanguage("kn")}
              className="px-4 py-2 rounded border bg-white/90 dark:bg-slate-800"
            >
              ಕನ್ನಡ
            </button>
          </div>
        </section>
         
     <video
 className="w-full h-[550px] object-cover rounded-xl"
        src={farmerDashboardVideo}
        autoPlay
        muted
        loop
        playsInline
      />
        <div className="bg-white rounded-lg p-4 shadow-xl">
  
</div>
  
        <div className="bg-white rounded-lg p-5 shadow-xl">

 <h2 className="text-2xl font-bold mb-4">
  {i18n.language === "kn"
    ? "ನೇರ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು"
    : "Live Market Prices"}
</h2>


<div className="flex gap-3 mb-5">
  <button
    onClick={() => setActiveTab("vegetables")}
    className={`px-4 py-2 rounded-lg ${
      activeTab === "vegetables"
        ? "bg-green-600 text-white"
        : "bg-gray-200"
    }`}
  >
    🥬 {i18n.language === "kn" ? "ತರಕಾರಿಗಳು" : "Vegetables"}
  </button>

  <button
    onClick={() => setActiveTab("fruits")}
    className={`px-4 py-2 rounded-lg ${
      activeTab === "fruits"
        ? "bg-orange-500 text-white"
        : "bg-gray-200"
    }`}
  >
    🍎 {i18n.language === "kn" ? "ಹಣ್ಣುಗಳು" : "Fruits"}
  </button>

  <button
    onClick={() => setActiveTab("grains")}
    className={`px-4 py-2 rounded-lg ${
      activeTab === "grains"
        ? "bg-yellow-500 text-white"
        : "bg-gray-200"
    }`}
  >
    🌾 {i18n.language === "kn" ? "ಧಾನ್ಯಗಳು" : "Grains"}
  </button>
</div>
{activeTab === "vegetables" && (
  <div className="flex gap-4 overflow-x-auto pb-3">
    {vegetablePrices.map((item,index) => (
      <div
        key={index}
        className="min-w-[280px] bg-green-50 p-4 rounded-lg border"
      >
       <h5>
{i18n.language === "kn"
 ? (kannadaNames[item.commodity] || item.commodity)
 : item.commodity}
</h5>
        <p className="text-green-700 font-bold">
         {item.avgPrice.includes("Rs")
 ? `${item.avgPrice} / Quintal`
 : `₹ ${item.avgPrice} / Quintal`}
        </p>

     <p>
{i18n.language === "kn"
 ? (kannadaMarket[item.market] || item.market)
 : item.market}
</p>
      <p>
{i18n.language === "kn"
 ? (kannadaDistrict[item.district] || item.district)
 : item.district}
</p>
      </div>
    ))}
  </div>
)}

{activeTab === "fruits" && (
  <div className="flex gap-4 overflow-x-auto pb-3">
    {fruitPrices.map((item,index) => (
      <div
        key={index}
        className="min-w-[280px] bg-orange-50 p-4 rounded-lg border"
      >
        <h4 className="font-bold">
          {i18n.language === "kn"
            ? kannadaNames[item.commodity] || item.commodity
            : item.commodity}
        </h4>

        <p className="text-orange-700 font-bold">
         ₹ {item.avgPrice} / Quintal
        </p>

        <p>
{i18n.language === "kn"
 ? (kannadaMarket[item.market] || item.market)
 : item.market}
</p>

<p>
{i18n.language === "kn"
 ? (kannadaDistrict[item.district] || item.district)
 : item.district}
</p>
      </div>
    ))}
  </div>
)}

{activeTab === "grains" && (
  <div className="flex gap-4 overflow-x-auto pb-3">
    {grainPrices.map((item,index) => (
      <div
        key={index}
        className="min-w-[280px] bg-yellow-50 p-4 rounded-lg border"
      >
        <h4 className="font-bold">
          {i18n.language === "kn"
            ? kannadaNames[item.commodity] || item.commodity
            : item.commodity}
        </h4>

        <p className="text-yellow-700 font-bold">
         ₹ {item.avgPrice} / Quintal
        </p>

       <p>
{i18n.language === "kn"
 ? (kannadaMarket[item.market] || item.market)
 : item.market}
</p>

<p>
{i18n.language === "kn"
 ? (kannadaDistrict[item.district] || item.district)
 : item.district}
</p>
      </div>
    ))}
  </div>
)}

</div>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {marketPrices.map((item) => (
            <div
              key={item.crop}
             className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-700 text-sm">
  {i18n.language === "kn"
    ? (kannadaMarket[item.mandi] || item.mandi)
    : item.mandi}
</p>
                  <h2 className="text-xl font-bold">
  {i18n.language === "kn"
    ? (kannadaNames[item.crop] || item.crop)
    : item.crop}
</h2>
                  <p className="text-sm text-slate-700">{item.kannadaName}</p>
                </div>
                <FaChartLine className="text-emerald-600 text-2xl" />
              </div>
              <p className="mt-4 text-3xl font-bold text-emerald-700">
                ₹{item.price}/{item.unit}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-white/30 dark:border-slate-700 rounded-lg p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaCloudUploadAlt className="text-emerald-600" />
                {t("uploadProduct")}
              </h2>
              <button
                type="button"
                onClick={startKannadaVoice}
                className={`px-3 py-2 rounded text-white flex items-center gap-2 ${
                  listening ? "bg-red-500" : "bg-emerald-600"
                }`}
              >
                <FaMicrophone />
                {listening ? t("listening") : t("startVoice")}
              </button>
            </div>

          <select
  name="productName"
  value={form.productName}
  onChange={(e) => {
  const product = e.target.value;

  let category = "";

  if (vegetables.includes(product))
    category = "vegetable";

  else if (fruits.includes(product))
    category = "fruit";

  else if (grains.includes(product))
    category = "grain";

  setForm(prev => ({
    ...prev,
    productName: product,
    category
  }));
}}
  className="w-full border p-3 rounded"
>
  <option value="">Select Product</option>

  {mandiPrices.map((item,index) => (
    <option
      key={index}
      value={item.commodity}
    >
      {item.commodity}
    </option>
  ))}
</select>

<datalist id="market-products">

  {marketPrices.map((item) => (

    <option
      key={item.crop}
      value={item.crop}
    >

      {item.kannadaName}

    </option>
  ))}

</datalist>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder={t("category")}
                className="w-full border rounded p-3 bg-slate-50 dark:bg-slate-800"
              />
             <div className="grid grid-cols-2 gap-3">
  <input
    name="quantity"
    type="number"
    value={form.quantity}
    onChange={handleChange}
    placeholder="Quantity"
    className="w-full border rounded p-3"
  />

  <select
    name="unit"
    value={form.unit || "Quintal"}
    onChange={handleChange}
    className="w-full border rounded p-3"
  >
    <option value="Quintal">Quintal</option>
    <option value="Kg">Kg</option>
  </select>
</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
  type="number"
  name="marketPrice"
  value={form.marketPrice}
  readOnly
  placeholder="Market Rate (₹ / Quintal)"
/>
<p className="text-green-600 text-sm mt-1">
  Current Market Rate:
₹{selectedMarket?.price || selectedMarket?.avgPrice || 0}
/Quintal
</p>

<input
  type="number"
  name="farmerPrice"
  value={form.farmerPrice}
  readOnly
  placeholder="Total Amount"
/>
            </div>
            {selectedMarket && (

  <div className="bg-blue-50 border border-blue-200 rounded p-3">

    <p className="font-semibold text-blue-700">

      Karnataka Mandi:
      {selectedMarket.mandi}

    </p>

    <p className="text-blue-600">

      Live Market Price:
      ₹{selectedMarket.price}/
      {selectedMarket.unit}

    </p>

  </div>
)}

           {form.farmerPrice &&
form.marketPrice && (
              <div
                className={`rounded p-3 text-sm font-semibold ${
                  getPriceSuggestion(
  form.farmerPrice,
  form.marketPrice
).includes("🔴")
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                <FaRupeeSign className="inline mr-1" />
                <p className="mt-2">

  Farmer Price:
  ₹{form.farmerPrice}

</p>

<p>

  Market Price:
  ₹{form.marketPrice}

</p>
               {getPriceSuggestion(

  form.farmerPrice,

  form.marketPrice
)}
              </div>
            )}

            <div>
  <div className="flex justify-between mb-2">
<h5>
📍 Farmer Location
</h5>

<select
  value={selectedState}
  onChange={(e) =>
    setSelectedState(
      e.target.value
    )
  }
>
  <option>
    Select State
  </option>

  {states.map((state) => (
    <option
      key={state}
      value={state}
    >
      {state}
    </option>
  ))}
</select>

<select
  value={selectedDistrict}
  onChange={(e) =>
    setSelectedDistrict(
      e.target.value
    )
  }
>
  <option>
    Select District
  </option>

  {districts.map(
    (district) => (
      <option
        key={district}
        value={district}
      >
        {district}
      </option>
    )
  )}
</select>

<select
  value={selectedHobli}
  onChange={(e) =>
    setSelectedHobli(
      e.target.value
    )
  }
>
  <option>
    Select Hobli
  </option>

  {hoblis.map((hobli) => (
    <option
      key={hobli}
      value={hobli}
    >
      {hobli}
    </option>
  ))}
</select>

<input
  type="text"
  placeholder="Village Name"
  value={villageName}
  onChange={(e) =>
    setVillageName(
      e.target.value
    )
  }
/>

<select
  value={deliveryOption}
  onChange={(e) =>
    setDeliveryOption(
      e.target.value
    )
  }
>
  <option value="company">
    Company Pickup
  </option>

  <option value="farmer">
    Farmer Direct Delivery
  </option>
</select>
    <label className="font-semibold">
      Description
    </label>

    <button
      type="button"
      onClick={startDescriptionVoice}
      className="bg-blue-600 text-white px-3 py-1 rounded"
    >
      🎤
      {descriptionListening
        ? " Listening..."
        : " Voice"}
    </button>

  </div>

  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    rows="4"
    className="w-full border rounded p-3"
    placeholder="Describe your product..."
  />
</div>
{/* Logistics Details */}



<input
  type="file"
  onChange={handleImageUpload}
/>
<div
  className="
  bg-green-50
  p-4
  rounded
  mt-3
"
>
  <h5>
    🚚 Logistics
  </h5>

  <p>
    Warehouse:
    RV College
  </p>

  <p>
    Distance:
    {distance} KM
  </p>

  <p>
    Delivery Mode:
    {deliveryOption}
  </p>

  <p>
    Logistics Cost:
    ₹{logisticsCost}
  </p>
</div>
<button
  type="submit"
  disabled={loading}
  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4"
>
  {loading ? "Submitting..." : "Submit For Approval"}
</button>
          </form>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-white/30 dark:border-slate-700 rounded-lg p-5 overflow-x-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaSeedling className="text-emerald-600" />
              {t("submittedProducts")}
            </h2>
            {/* Smart Tools Section */}




            <table className="w-full text-left min-w-[720px]">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-3">
                  Image
                     </th>
                  <th className="p-3">{t("productName")}</th>
                  <th className="p-3">{t("quantity")}</th>
                  <th className="p-3">{t("marketPrice")}</th>
                  <th className="p-3">{t("farmerPrice")}</th>
                  <th className="p-3">{t("approvalStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="p-3">

  <img
    src={product.image}
    alt={product.productName}
    className="w-16 h-16 object-cover rounded"
  />

</td>
                    <td className="p-3 font-semibold">{product.productName}</td>
                    <td className="p-3">{product.quantity}</td>
                    <td className="p-3">₹{product.marketPrice}</td>
                    <td className="p-3">₹{product.farmerPrice}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : product.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <p className="text-center text-slate-500 py-8">
                No farmer submissions yet.
              </p>
            )}
            <div className="bg-white rounded-lg p-5 shadow-xl mt-6">
  <h2 className="text-xl font-bold mb-4">
    🌾 Farmer Smart Tools
  </h2>
{showWeather && weather && (

<div className="bg-white p-5 rounded shadow mt-4">

<h3 className="font-bold text-xl mb-3">
🌦 Current Weather
</h3>

<p>
🌡 Temperature:
{weather.temperature}°C
</p>

<p>
🤒 Feels Like:
{weather.feelsLike}°C
</p>

<p>
💧 Humidity:
{weather.humidity}%
</p>

<p>
💨 Wind Speed:
{weather.windSpeed} m/s
</p>

<p>
☁ Cloudiness:
{weather.cloudiness}%
</p>

<p>
🌧 Rain Chance:
{weather.rainProbability}%
</p>

<p>
🌤 Condition:
{weather.description}
</p>

</div>

)}
{
forecast.length > 0 && (

<div className="bg-white mt-4 p-5 rounded shadow">

<h3 className="font-bold text-xl mb-3">
📅 5 Day Forecast
</h3>

{
forecast.slice(0,5).map((day,index)=>(
<div
key={index}
className="border-b py-2"
>

<p>
🌡 {day.temperature}°C
</p>

<p>
💧 {day.humidity}%
</p>

<p>
🌧 {day.rainProbability}%
</p>

<p>
{day.description}
</p>

</div>
))
}

</div>

)}
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

    <button className="bg-green-600 text-white p-3 rounded">
      🚚 Logistics
    </button>

   <button
  onClick={getWeather}
  className="bg-blue-600 text-white p-3 rounded"
>
  🌦 Weather
</button>

    <button className="bg-yellow-500 text-white p-3 rounded">
      📈 Price Prediction
    </button>

   <button
  onClick={getForecast}
  className="bg-purple-600 text-white p-3 rounded"
>
🌱 Forecast
</button>

    <button className="bg-cyan-600 text-white p-3 rounded">
      📍 Tracking
    </button>

  </div>
</div>
   </div>
       
        </section>
      </div>

     
      </div>
      
    </div>
    
  );
};

export default FarmerDashboard;
