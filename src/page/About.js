import React from "react";
import cowsImage from "../images/cows.png";
import fruitsImage from "../images/fruits.png";
import vegetablesImage from "../images/vegetables.png";
import farmerImage from "../images/farmer.png";
const About = () => {
return (
  <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">

 {/* Hero Section */}

<section className="max-w-7xl mx-auto py-20 px-6">

  {/* Main Heading */}

  <div className="text-center mb-16">

    <h1 className="text-7xl font-extrabold text-green-700 mb-4">
      🌱 Fresh Farm To Home
    </h1>

    <p className="text-2xl text-slate-600">
      Directly Connecting Farmers & Customers
    </p>

  </div>

  {/* Description + Image */}

  <div className="grid md:grid-cols-2 gap-16 items-center">

    <div>

      <h2 className="text-4xl font-bold text-green-700 mb-6">
        Freshness Delivered Everyday
      </h2>

      <p className="text-xl text-gray-700 leading-relaxed">

        Our platform connects local farmers directly with consumers,
        ensuring fresh vegetables, fruits and agricultural products
        reach homes without unnecessary middlemen.

        <br /><br />

        We empower farmers with technology while helping customers
        purchase trusted, high-quality produce at fair prices.

      </p>

    </div>

    <div>

      <img
        src={cowsImage}
        alt="Farm"
        className="rounded-3xl shadow-2xl hover:scale-105 transition duration-500 w-full"
      />

    </div>

  </div>

</section>

    {/* Fruits Section */}
    <section className="max-w-7xl mx-auto py-20 px-6">

      <div className="grid md:grid-cols-2 gap-10 items-center">

       <img
  src={fruitsImage}
  alt="Fruits"
  className="rounded-3xl shadow-xl hover:scale-105 transition duration-500"
/>

        <div>

          <h2 className="text-5xl font-bold text-red-500 mb-4">
            🍓 Fresh Fruits
          </h2>

          <p className="text-lg text-gray-700">
            Freshly harvested fruits from trusted farms delivered
            directly to your doorstep.
          </p>

        </div>

      </div>

    </section>

    {/* Vegetables */}
    <section className="max-w-7xl mx-auto py-20 px-6">

      <div className="grid md:grid-cols-2 gap-10 items-center">

        <div>

          <h2 className="text-5xl font-bold text-green-600 mb-4">
            🥬 Organic Vegetables
          </h2>

          <p className="text-lg text-gray-700">
            Browse a wide range of quality vegetables approved by
            administrators and supplied by verified farmers.
          </p>

        </div>
<img
  src={vegetablesImage}
  alt="Vegetables"
  className="rounded-3xl shadow-xl hover:scale-105 transition duration-500"
/>

      </div>

    </section>

    {/* Farmers */}
    <section className="max-w-7xl mx-auto py-20 px-6">

      <div className="grid md:grid-cols-2 gap-10 items-center">

       <img
  src={farmerImage}
  alt="Farmer"
  className="rounded-3xl shadow-xl hover:scale-105 transition duration-500"
/>

        <div>

          <h2 className="text-5xl font-bold text-emerald-700 mb-4">
            👨‍🌾 Empowering Farmers
          </h2>

          <p className="text-lg text-gray-700">
            Farmers can upload products, track inventory, receive
            approvals, and connect directly with customers.Fresh From to Home is a visionary agritech e-commerce platform dedicated to transforming the agricultural supply chain by connecting local farmers directly with urban consumers and businesses. By eliminating predatory middlemen, the platform provides farmers with the digital infrastructure needed to dictate their own fair prices, access transparent marketplace data, and secure instant payments directly to their bank accounts. Integrated with localized micro-logistics and multi-language support, Fresh From to Home removes traditional barriers to market entry, transforming rural growers into independent digital entrepreneurs while delivering fresh, fully traceable produce to city centers.
          </p>

        </div>

      </div>

    </section>

    {/* Statistics */}
    <section className="max-w-7xl mx-auto py-20 px-6">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <div className="bg-green-600 text-white p-8 rounded-3xl text-center">
          <h2 className="text-5xl font-bold">500+</h2>
          <p>Farmers</p>
        </div>

        <div className="bg-blue-600 text-white p-8 rounded-3xl text-center">
          <h2 className="text-5xl font-bold">2000+</h2>
          <p>Customers</p>
        </div>

        <div className="bg-orange-500 text-white p-8 rounded-3xl text-center">
          <h2 className="text-5xl font-bold">1000+</h2>
          <p>Orders</p>
        </div>

        <div className="bg-purple-600 text-white p-8 rounded-3xl text-center">
          <h2 className="text-5xl font-bold">98%</h2>
          <p>Satisfaction</p>
        </div>

      </div>

    </section>

  </div>
);
};

export default About;