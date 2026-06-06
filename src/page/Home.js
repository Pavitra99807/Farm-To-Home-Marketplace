import React, {
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CardFeature from "../component/CardFeature";
import { GrPrevious, GrNext } from "react-icons/gr";
import heroImage from "../assest/agri-marketplace-hero.png";
import {
  FaLeaf,
  FaMicrophone,
  FaWhatsapp,
  FaInstagram,
  FaMobileAlt,
  FaTruck,
  FaShieldAlt,
  FaChartLine,
  FaMailBulk,
} from "react-icons/fa";

const Home = () => {
  const productData = useSelector(
    (state) => state.product.productList || []
  );

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const location = useLocation();
  const searchRowRef = useRef(null);

  const query =
    new URLSearchParams(location.search).get("q") || "";

  const categoryList = [
    "all",
    ...new Set(
      productData
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  const searchText = query || search;
  const filteredProducts = productData.filter((item) => {
    const matchesSearch =
      !searchText ||
      item.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      item.category
        ?.toLowerCase()
        .includes(searchText.toLowerCase());

    const matchesCategory =
      searchText ||
      activeCategory === "all" ||
      item.category?.toLowerCase() ===
        activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const groupedProducts = categoryList
    .filter((category) => category !== "all")
    .map((category) => ({
      category,
      products: productData.filter(
        (item) =>
          item.category?.toLowerCase() ===
          category.toLowerCase()
      ),
    }))
    .filter((group) => group.products.length > 0);

  const loadingArrayFeature = Array(8).fill(null);

  const scrollRow = (ref, direction) => {
    if (!ref.current) return;
    ref.current.scrollLeft += direction * 280;
  };

  const ProductRow = ({
    title,
    subtitle,
    products,
    rowRef,
  }) => {
    const localRef = useRef(null);
    const activeRef = rowRef || localRef;

    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold capitalize text-slate-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-slate-500 text-sm">
                {subtitle}
              </p>
            )}
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => scrollRow(activeRef, -1)}
              className="bg-white border p-2 rounded shadow-sm"
            >
              <GrPrevious />
            </button>

            <button
              onClick={() => scrollRow(activeRef, 1)}
              className="bg-white border p-2 rounded shadow-sm"
            >
              <GrNext />
            </button>
          </div>
        </div>

        <div
          className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4"
          ref={activeRef}
        >
          {products.length > 0
            ? products.map((el) => (
                <CardFeature
                  key={el._id}
                  id={el._id}
                  name={el?.name}
                  category={el?.category}
                  price={el?.price}
                  image={el?.image}
                />
              ))
            : loadingArrayFeature.map((_, index) => (
                <CardFeature
                  key={`${title}-${index}`}
                  loading="Loading..."
                />
              ))}
        </div>
      </div>
    );
  };

  const serviceItems = [
    {
      icon: <FaLeaf />,
      title: "Fresh Product",
      text: "Verified farm produce listed after admin approval.",
    },
    {
      icon: <FaChartLine />,
      title: "Real-time Market Prices",
      text: "Mock mandi data helps farmers choose better prices.",
    },
    {
      icon: <FaMicrophone />,
      title: "Kannada Voice Support",
      text: "Farmers can speak product names in Kannada.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Trusted Verification",
      text: "Admin moderation keeps the marketplace reliable.",
    },
    {
      icon: <FaTruck />,
      title: "Farm to Home",
      text: "A direct farmer-to-customer retail experience.",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <section
        className="relative min-h-[calc(100vh-4rem)] bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/25" />

        <div className="relative max-w-7xl mx-auto px-4 min-h-[calc(100vh-4rem)] flex items-end pb-8">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/farmer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded font-semibold shadow"
            >
              Farmer Dashboard
            </Link>

           

            <a
              href="#fresh-products"
              className="bg-white text-slate-900 px-5 py-3 rounded font-semibold shadow"
            >
              Shop Fresh Products
            </a>
          </div>
        </div>
      </section>

      <section
        id="fresh-products"
        className="max-w-7xl mx-auto px-4 py-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-7">
          <div>
            <h2 className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-white">
              Marketplace Products
            </h2>
            <p className="text-slate-500">
              Products are arranged category-wise for quick shopping.
            </p>
          </div>

          <div className="lg:ml-auto flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="border rounded px-3 py-2 bg-white dark:bg-slate-800 min-w-[240px]"
            />

            <div className="flex gap-2 overflow-x-auto max-w-full md:max-w-[420px] pb-1">
              {categoryList.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-2 rounded-full text-sm capitalize border whitespace-nowrap ${
                    activeCategory === category
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white dark:bg-slate-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {searchText && (
          <ProductRow
            title="Search Results"
            subtitle={`Showing matches for "${searchText}"`}
            products={filteredProducts}
            rowRef={searchRowRef}
          />
        )}

        {activeCategory !== "all" && !searchText ? (
          <ProductRow
            title={activeCategory}
            subtitle="Selected category"
            products={filteredProducts}
          />
        ) : (
          groupedProducts.map((group) => (
            <ProductRow
              key={group.category}
              title={group.category}
              subtitle={`Fresh ${group.category} products`}
              products={group.products}
            />
          ))
        )}
      </section>

      <section className="bg-white dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-stretch">
            <div className="border rounded-lg p-6 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                About Our Service
              </h2>
              <p className="mt-3 max-w-4xl text-slate-600 dark:text-slate-300">
                This application is designed as an AI-powered smart agricultural retail marketplace. Farmers can register, view mandi prices, submit products with voice-assisted Kannada input, and wait for admin verification. Customers see only approved products, making the buying experience cleaner and more trustworthy.
              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {serviceItems.map((item) => (
                  <div
                    key={item.title}
                    className="border rounded-lg p-4 bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <div className="text-emerald-700 text-2xl">
                      {item.icon}
                    </div>
                    <h3 className="font-bold mt-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          <aside className="bg-emerald-900 text-white rounded-lg p-6 h-full">
            <h2 className="text-2xl font-bold">
              Connect With Us
            </h2>
            <p className="mt-2 text-emerald-50">
              Get product updates, farmer listings, and delivery support through our social channels.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href="https://wa.me/919740848658"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded"
              >
                <FaWhatsapp />
                WhatsApp Support
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded"
              >
                <FaInstagram />
                Instagram Updates
              </a>

              <a
                href="/"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded"
              >
                <FaMobileAlt />
                Application Link
              </a>
                {/* Mail */}
  <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=formtohome1@gmail.com"
  target="_blank"
  rel="noreferrer"
  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded"
>
  <FaMailBulk />
  Mail Us
</a>
            </div>
          </aside>
          </div>
        </div>
      </section>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">
            No matching products found
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
