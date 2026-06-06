import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { State, City } from "country-state-city";
import { toast } from "react-hot-toast";
import {
  FaChartLine,
  FaCloudSun,
  FaMapMarkedAlt,
  FaRoute,
  FaSeedling,
  FaSearchLocation,
} from "react-icons/fa";
import { calculateLogistics } from "../services/logisticsService";

const API_BASE = "http://localhost:8050";

const defaultLocation = {
  state: "IN-KA",
  district: "",
  hobli: "",
  village: "",

  farmerLat: "",
  farmerLng: "",

 customerLat: "12.9716",
customerLng: "77.5946",

  deliveryOption: "self-delivery",

  latitude: "12.95",
  longitude: "77.50",

  cropType: "tomato",
  cropName: "tomato",

  orderId: "",
};

const tabs = [
  { id: "logistics", label: "Logistics", icon: <FaRoute /> },
  { id: "weather", label: "Weather", icon: <FaCloudSun /> },
  { id: "prices", label: "Prices", icon: <FaChartLine /> },
  { id: "demand", label: "Demand", icon: <FaSeedling /> },
  { id: "tracking", label: "Tracking", icon: <FaSearchLocation /> },
];

const Metric = ({ label, value, accent = "text-emerald-700" }) => (
  <div className="border rounded bg-white p-4">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="border border-dashed rounded bg-slate-50 p-5 text-slate-500">
    {text}
  </div>
);

const SmartAgriTools = () => {
  const [activeTab, setActiveTab] = useState("logistics");
  const [form, setForm] = useState(defaultLocation);
  const [loading, setLoading] = useState("");
  const [logistics, setLogistics] = useState(null);
  const [warehouse, setWarehouse] = useState(null);
  const [weather, setWeather] = useState(null);
  const [price, setPrice] = useState(null);
  const [demand, setDemand] = useState(null);
  const [tracking, setTracking] = useState(null);
  const states = State.getStatesOfCountry("IN");

const districts = form.state
  ? City.getCitiesOfState("IN", form.state)
  : [];

  const numberPayload = useMemo(
    () => ({
      farmerLat: Number(form.farmerLat),
      farmerLng: Number(form.farmerLng),
      customerLat: Number(form.customerLat),
      customerLng: Number(form.customerLng),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    }),
    [form]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 const fetchCoordinates = async () => {
  try {
    const location =
      `${form.village}, ${form.hobli}, ${form.district}, India`;

    console.log(location);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        location
      )}&format=json&limit=1`
    );

    const data = await response.json();

    console.log(data);

    if (data.length > 0) {
      setForm((prev) => ({
        ...prev,
        farmerLat: data[0].lat,
        farmerLng: data[0].lon,
      }));

      alert("Coordinates detected");
    } else {
      alert("Location not found");
    }
  } catch (error) {
    console.error(error);
  }
};

  const runRequest = useCallback(async (key, request, onSuccess) => {
    try {
      setLoading(key);
      const response = await request();
      onSuccess(response.data.data);
      toast.success("Data loaded");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Unable to load data");
    } finally {
      setLoading("");
    }
  }, []);

  const calculateLogistics = useCallback(() => {
    runRequest(
      "logistics",
      () =>
        axios.post(`${API_BASE}/api/logistics/calculate-total`, {
          farmerLat: numberPayload.farmerLat,
          farmerLng: numberPayload.farmerLng,
          customerLat: numberPayload.customerLat,
          customerLng: numberPayload.customerLng,
          deliveryOption: form.deliveryOption,
        }),
      setLogistics
    );
  }, [
    numberPayload.customerLat,
    numberPayload.customerLng,
    numberPayload.farmerLat,
    numberPayload.farmerLng,
    runRequest,
  ]);

  const loadWeather = () => {
    runRequest(
      "weather",
      () =>
        axios.post(`${API_BASE}/api/weather/advisory`, {
          latitude: numberPayload.latitude,
          longitude: numberPayload.longitude,
          cropType: form.cropType,
        }),
      setWeather
    );
  };

  const loadPrices = () => {
    runRequest(
      "prices",
      () =>
        axios.get(
          `${API_BASE}/api/price/recommendation/${encodeURIComponent(
            form.cropName
          )}`
        ),
      setPrice
    );
  };

  const loadDemand = () => {
    runRequest(
      "demand",
      () => axios.get(`${API_BASE}/api/demand/forecast?days=7`),
      setDemand
    );
  };

  const loadTracking = () => {
    if (!form.orderId.trim()) {
      toast.error("Enter an order id first");
      return;
    }

    runRequest(
      "tracking",
      () =>
        axios.get(
          `${API_BASE}/api/tracking/${encodeURIComponent(form.orderId.trim())}`
        ),
      setTracking
    );
  };

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/logistics/warehouse-location`)
      .then((response) => setWarehouse(response.data.data))
      .catch((error) => console.log(error));
  }, []);

  const renderLogistics = () => (
    <div className="grid lg:grid-cols-[360px_1fr] gap-5">
      <div className="bg-white border rounded p-5 space-y-3">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <FaMapMarkedAlt className="text-emerald-600" />
          Route Cost Calculator
        </h2>
       <select
  name="state"
  value={form.state}
  onChange={handleChange}
  className="w-full border rounded p-3"
>
  <option value="">Select State</option>
  {states.map((s) => (
    <option key={s.isoCode} value={s.isoCode}>
      {s.name}
    </option>
  ))}
</select>

<select
  name="district"
  value={form.district}
  onChange={handleChange}
  className="w-full border rounded p-3"
>
  <option value="">Select District</option>

  {districts.map((d) => (
    <option key={d.name} value={d.name}>
      {d.name}
    </option>
  ))}
</select>

<input
  name="hobli"
  value={form.hobli}
  onChange={handleChange}
  placeholder="Enter Hobli"
  className="w-full border rounded p-3"
/>

<input
  name="village"
  value={form.village}
  onChange={handleChange}
  placeholder="Enter Village"
  className="w-full border rounded p-3"
/>

<select
  name="deliveryOption"
  value={form.deliveryOption}
  onChange={handleChange}
  className="w-full border rounded p-3"
>
  <option value="self-delivery">
    Self Delivery
  </option>

  <option value="company-pickup">
    Company Pickup
  </option>
</select>

<input
  name="farmerLat"
  value={form.farmerLat}
  onChange={handleChange}
  placeholder="Farmer Latitude"
  className="w-full border rounded p-3"
/>

<input
  name="farmerLng"
  value={form.farmerLng}
  onChange={handleChange}
  placeholder="Farmer Longitude"
  className="w-full border rounded p-3"
/>

<input
  name="customerLat"
  value={form.customerLat}
  onChange={handleChange}
  placeholder="Customer Latitude"
  className="w-full border rounded p-3"
/>

<input
  name="customerLng"
  value={form.customerLng}
  onChange={handleChange}
  placeholder="Customer Longitude"
  className="w-full border rounded p-3"
/>
<button
  onClick={fetchCoordinates}
  className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
>
  Detect Village Coordinates
</button>
        <button
          onClick={calculateLogistics}
          disabled={loading === "logistics"}
          className="w-full bg-emerald-600 text-white py-3 rounded font-semibold disabled:opacity-60"
        >
          {loading === "logistics" ? "Calculating..." : "Calculate"}
        </button>
      </div>

      <div className="space-y-5">
        {warehouse && (
          <div className="bg-white border rounded p-5">
            <p className="text-sm text-slate-500">Warehouse</p>
            <h3 className="text-xl font-bold">{warehouse.name}</h3>
            <p className="text-slate-600">
              {warehouse.city}, {warehouse.state}
            </p>
          </div>
        )}
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
  <h3 className="font-bold text-green-700 text-lg">
    Farmer Delivery Information
  </h3>

  {form.deliveryOption === "self-delivery" ? (
    <p className="text-green-700 mt-2">
      Farmer will deliver products directly to the
      RVCE Kengeri warehouse.
      Pickup Charge = ₹0
    </p>
  ) : (
    <p className="text-orange-700 mt-2">
      Company vehicle will collect products from
      farmer location.
      Pickup charges will be applied based on distance.
    </p>
  )}
</div>
        {logistics ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Metric label="Pickup Distance" value={`${logistics.pickupDistance || logistics.farmerDistance || 0} km`} />
            <Metric label="Delivery Distance" value={`${logistics.deliveryDistance || logistics.customerDistance || 0} km`} />
            <Metric label="Pickup Charge" value={`₹${logistics.pickupCharge || 0}`} />
            <Metric label="Total Cost" value={`₹${logistics.totalCharge || logistics.totalCost || 0}`} accent="text-blue-700" />
          </div>
        ) : (
          <EmptyState text="Run the calculator to see route cost." />
        )}
      </div>
    </div>
  );

  const renderWeather = () => (
    <div className="grid lg:grid-cols-[360px_1fr] gap-5">
      <div className="bg-white border rounded p-5 space-y-3">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <FaCloudSun className="text-amber-500" />
          Farm Weather Advisory
        </h2>
        {["latitude", "longitude", "cropType"].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full border rounded p-3"
            placeholder={field}
          />
        ))}
        <button
          onClick={loadWeather}
          disabled={loading === "weather"}
          className="w-full bg-amber-500 text-white py-3 rounded font-semibold disabled:opacity-60"
        >
          {loading === "weather" ? "Loading..." : "Get Advisory"}
        </button>
      </div>

      {weather ? (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Metric label="Weather Score" value={`${weather.weatherScore || 0}/100`} />
            <Metric label="Best Harvest" value={weather.bestHarvestTime ? "Yes" : "Wait"} />
            <Metric label="Best Selling" value={weather.bestSellingTime ? "Yes" : "Wait"} />
          </div>
          <div className="bg-white border rounded p-5">
            <h3 className="font-bold text-lg mb-3">Advice</h3>
            <div className="space-y-2">
              {(weather.advices || []).map((item, index) => (
                <p key={index} className="border rounded p-3 bg-slate-50">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState text="Enter farm coordinates to see weather based guidance." />
      )}
    </div>
  );

  const renderPrices = () => (
    <div className="grid lg:grid-cols-[360px_1fr] gap-5">
      <div className="bg-white border rounded p-5 space-y-3">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <FaChartLine className="text-blue-600" />
          Price Intelligence
        </h2>
        <input
          name="cropName"
          value={form.cropName}
          onChange={handleChange}
          className="w-full border rounded p-3"
          placeholder="Crop name"
        />
        <button
          onClick={loadPrices}
          disabled={loading === "prices"}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold disabled:opacity-60"
        >
          {loading === "prices" ? "Checking..." : "Check Price"}
        </button>
      </div>

      {price && !price.error ? (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Metric label="Current Price" value={`₹${price.currentPrice || 0}`} />
            <Metric label="Tomorrow" value={`₹${price.predictions?.tomorrow || 0}`} />
            <Metric label="Confidence" value={price.confidence || "N/A"} />
          </div>
          <div className="bg-white border rounded p-5">
            <p className="text-sm text-slate-500">Recommendation</p>
            <h3 className="text-2xl font-bold mt-1">{price.recommendation}</h3>
            <p className="text-slate-600 mt-2">
              Trend: {price.trend} | Change: {price.changePercent || 0}%
            </p>
          </div>
        </div>
      ) : (
        <EmptyState
          text={
            price?.error ||
            "Add price history data from backend/admin, then check predictions here."
          }
        />
      )}
    </div>
  );

  const renderDemand = () => {
    const groups = demand?.predictions || {};
    const rows = [
      ["High Demand", groups.highDemand || []],
      ["Medium Demand", groups.mediumDemand || []],
      ["Low Demand", groups.lowDemand || []],
    ];

    return (
      <div className="space-y-5">
        <div className="bg-white border rounded p-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <h2 className="font-bold text-xl flex items-center gap-2">
              <FaSeedling className="text-emerald-600" />
              Demand Forecast
            </h2>
            <p className="text-slate-500">
              Uses recent order data to group crop categories by expected demand.
            </p>
          </div>
          <button
            onClick={loadDemand}
            disabled={loading === "demand"}
            className="sm:ml-auto bg-emerald-600 text-white px-5 py-3 rounded font-semibold disabled:opacity-60"
          >
            {loading === "demand" ? "Loading..." : "Load Forecast"}
          </button>
        </div>

        {demand ? (
          <div className="grid lg:grid-cols-3 gap-4">
            {rows.map(([title, items]) => (
              <div key={title} className="bg-white border rounded p-5">
                <h3 className="font-bold text-lg mb-3">{title}</h3>
                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.category} className="border rounded p-3">
                        <p className="font-semibold">{item.category}</p>
                        <p className="text-sm text-slate-500">
                          Sales {Math.round(item.sales || 0)} | Forecast{" "}
                          {Math.round(item.forecast || 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No data yet.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="Load forecast after you have some completed orders." />
        )}
      </div>
    );
  };

  const renderTracking = () => (
    <div className="grid lg:grid-cols-[360px_1fr] gap-5">
      <div className="bg-white border rounded p-5 space-y-3">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <FaSearchLocation className="text-purple-600" />
          Order Tracking
        </h2>
        <input
          name="orderId"
          value={form.orderId}
          onChange={handleChange}
          className="w-full border rounded p-3"
          placeholder="Mongo order id"
        />
        <button
          onClick={loadTracking}
          disabled={loading === "tracking"}
          className="w-full bg-purple-600 text-white py-3 rounded font-semibold disabled:opacity-60"
        >
          {loading === "tracking" ? "Searching..." : "Track Order"}
        </button>
      </div>

      {tracking ? (
        <div className="bg-white border rounded p-5">
          <p className="text-sm text-slate-500">Order</p>
          <h3 className="font-bold text-xl break-all">{tracking.orderId}</h3>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Metric label="Tracking Status" value={tracking.trackingStatus || "Pending"} />
            <Metric label="Warehouse Status" value={tracking.warehouseStatus || "Pending"} />
          </div>
          <h4 className="font-bold mt-5 mb-2">Timeline</h4>
          {(tracking.timeline || []).length > 0 ? (
            <div className="space-y-2">
              {tracking.timeline.map((item, index) => (
                <div key={index} className="border rounded p-3">
                  <p className="font-semibold">{item.status}</p>
                  <p className="text-sm text-slate-500">
                    {item.location || "No location"} | {item.notes || "No notes"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No timeline updates yet.</p>
          )}
        </div>
      ) : (
        <EmptyState text="Paste an order id from My Orders to see tracking." />
      )}
    </div>
  );

  const content = {
    logistics: renderLogistics,
    weather: renderWeather,
    prices: renderPrices,
    demand: renderDemand,
    tracking: renderTracking,
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <section className="bg-white border rounded p-5">
          <p className="text-sm font-semibold text-emerald-700">
            Farmer and customer tools
          </p>
          <h1 className="text-3xl font-bold mt-1">Smart Agri Tools</h1>
          <p className="text-slate-500 mt-2">
            Test logistics, weather guidance, price prediction, demand forecast,
            and order tracking from one screen.
          </p>
        </section>

        <div className="bg-white border rounded p-2 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {content[activeTab]()}
      </div>
    </div>
  );
};

export default SmartAgriTools;
