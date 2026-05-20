import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FaMicrophone,
  FaCloudUploadAlt,
  FaRupeeSign,
  FaSeedling,
  FaChartLine,
} from "react-icons/fa";
import farmerDashboardVideo from "../assest/farmer-dashboard-bg.mp4";

const API_BASE = "http://localhost:8050";

const emptyForm = {
  productName: "",
  category: "vegetable",
  image: "",
  quantity: "",
  marketPrice: "",
  farmerPrice: "",
  description: "",
};

const FarmerDashboard = () => {
  const user = useSelector((state) => state.user);
  const { t, i18n } = useTranslation();
  const [marketPrices, setMarketPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
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

  const selectedMarket = useMemo(() => {
    const productName = form.productName.trim().toLowerCase();

    return marketPrices.find((item) => {
      return (
        item.crop.toLowerCase() === productName ||
        item.kannadaName === form.productName.trim()
      );
    });
  }, [form.productName, marketPrices]);

  

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
        marketPrice: selectedMarket.price,
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
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

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
          marketPrice: Number(form.marketPrice || selectedMarket?.price || 0),
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 p-4 md:p-6">
      <video
        className="fixed inset-0 h-full w-full object-cover"
        src={farmerDashboardVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="fixed inset-0 bg-gradient-to-r from-slate-950/78 via-slate-950/48 to-slate-950/12" />

      <div className="relative min-h-screen grid grid-cols-1 xl:grid-cols-[minmax(0,760px)_1fr] gap-6">
      <div className="space-y-6 max-w-[760px]">
        <section className="bg-white/90 dark:bg-slate-900/88 backdrop-blur border border-white/30 dark:border-slate-700 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
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

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {marketPrices.map((item) => (
            <div
              key={item.crop}
             className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-700 text-sm">{item.mandi}</p>
                  <h2 className="text-xl font-bold">{item.crop}</h2>
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

        <section className="grid grid-cols-1 gap-6">
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

           <input
  list="market-products"
  name="productName"
  value={form.productName}
  onChange={handleChange}
  placeholder={t("productName")}
  className="w-full border rounded p-3 bg-slate-50 dark:bg-slate-800"
/>

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
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                placeholder={t("quantity")}
                className="w-full border rounded p-3 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="marketPrice"
                type="number"
                value={form.marketPrice}
                onChange={handleChange}
                placeholder={t("marketPrice")}
                className="w-full border rounded p-3 bg-slate-50 dark:bg-slate-800"
              />
              <input
                name="farmerPrice"
                type="number"
                value={form.farmerPrice}
                onChange={handleChange}
                placeholder={t("farmerPrice")}
                className="w-full border rounded p-3 bg-slate-50 dark:bg-slate-800"
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

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t("description")}
              rows="4"
              className="w-full border rounded p-3 bg-slate-50 dark:bg-slate-800"
            />

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="w-full h-44 object-cover rounded border"
              />
            )}

            <button
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded font-semibold disabled:opacity-60"
            >
              {loading ? "Submitting..." : t("submitForApproval")}
            </button>
          </form>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-white/30 dark:border-slate-700 rounded-lg p-5 overflow-x-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaSeedling className="text-emerald-600" />
              {t("submittedProducts")}
            </h2>

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
          </div>
        </section>
      </div>

      <div className="hidden xl:flex min-h-screen items-end justify-center pb-10">
        <div className="max-w-md rounded-lg border border-white/20 bg-white/10 p-5 text-white backdrop-blur-sm shadow-xl">
          <p className="text-sm font-semibold text-emerald-200">
            AI Smart Agriculture
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Video preview stays visible while farmers work.
          </h2>
          <p className="mt-3 text-white/80">
            The dashboard tools remain on the left, and the cinematic farm
            background stays open on the right side.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
