import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    fetchFarmers();
  }, []);
  const [selectedFarmer,
setSelectedFarmer] =
useState(null);

const [farmerProducts,
setFarmerProducts] =
useState([]);

  const fetchFarmers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8050/api/admin/farmers"
      );

      setFarmers(res.data.farmers || []);
    } catch (error) {
      console.log(error);
    }
  };
const viewFarmer = async (id) => {
  try {

    console.log("Farmer ID =", id);

    const res = await axios.get(
      `http://localhost:8050/api/admin/farmer/${id}`
    );

    console.log("API RESPONSE =", res.data);

    setSelectedFarmer(res.data.farmer);

    setFarmerProducts(
      res.data.products || []
    );
console.log("selected =", res.data.farmer);
  } catch (error) {

    console.log(
      "VIEW FARMER ERROR:",
      error
    );

  }
};
const freezeFarmer = async (id) => {

  await axios.put(
    `http://localhost:8050/api/admin/farmer/freeze/${id}`
  );

  fetchFarmers();
};

const deleteFarmer = async (id) => {

  if (
    !window.confirm(
      "Delete Farmer?"
    )
  )
    return;

  await axios.delete(
    `http://localhost:8050/api/admin/farmer/${id}`
  );

  fetchFarmers();
};
  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-3xl font-bold mb-5">
        All Farmers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

  <div className="bg-green-500 text-white p-5 rounded-2xl shadow-lg">
    <h3 className="text-xl">Total Farmers</h3>
    <p className="text-4xl font-bold">
      {farmers.length}
    </p>
  </div>

  <div className="bg-emerald-500 text-white p-5 rounded-2xl shadow-lg">
    <h3 className="text-xl">Active Farmers</h3>
    <p className="text-4xl font-bold">
      {farmers.filter(f => !f.isFrozen).length}
    </p>
  </div>

  <div className="bg-orange-500 text-white p-5 rounded-2xl shadow-lg">
    <h3 className="text-xl">Regular Farmers</h3>
    <p className="text-4xl font-bold">
      {farmers.length}
    </p>
  </div>

  <div className="bg-red-500 text-white p-5 rounded-2xl shadow-lg">
    <h3 className="text-xl">Frozen Farmers</h3>
    <p className="text-4xl font-bold">
      {farmers.filter(f => f.isFrozen).length}
    </p>
  </div>

</div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

  {farmers.map((farmer) => (

    <div
      key={farmer._id}
      className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl shadow-xl p-5"
    >

     <h2 className="text-xl font-bold">
  🌾 {farmer.firstname} {farmer.lastname}
</h2>

{/* STATUS BADGE */}
<span
  className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${
    farmer.isFrozen
      ? "bg-red-500"
      : "bg-green-500"
  }`}
>
  {farmer.isFrozen
    ? "Frozen"
    : "Active"}
</span>

<p className="mt-2">
  {farmer.email}
</p>

{/* FARMER TYPE */}
<div className="flex gap-2 mt-2">

  <span className="bg-green-600 text-white text-xs px-3 py-1 rounded">
    Farmer
  </span>

  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded">
    Seller
  </span>

</div>

<p className="mt-3">
  📞 {farmer.phone}
</p>

<p>
  📍 {farmer.address}
</p>

{/* ACTION BUTTONS */}
<div className="flex gap-2 mt-4">

  <button
    onClick={() => viewFarmer(farmer._id)}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    View
  </button>

 <button
 onClick={() =>
   freezeFarmer(farmer._id)
 }
 className="bg-yellow-500 text-white px-4 py-2 rounded"
>
 {farmer.isFrozen
   ? "Activate"
   : "Freeze"}
</button>

 <button
 onClick={() =>
   deleteFarmer(farmer._id)
 }
 className="bg-red-500 text-white px-4 py-2 rounded"
>
 Delete
</button>

</div>

    </div>

  ))}

</div>

{/* FARMER DETAILS POPUP */}
{selectedFarmer && (

<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

  <div className="bg-white w-[900px] rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">

    <div className="flex justify-between items-center mb-5">

      <h2 className="text-3xl font-bold text-green-700">
        🌾 Farmer Details
      </h2>

      <button
        onClick={() =>
          setSelectedFarmer(null)
        }
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>

    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">

      <p>
        <b>Name:</b>{" "}
        {selectedFarmer.firstname}
        {" "}
        {selectedFarmer.lastname}
      </p>

      <p>
        <b>Email:</b>{" "}
        {selectedFarmer.email}
      </p>

      <p>
        <b>Phone:</b>{" "}
        {selectedFarmer.phone}
      </p>

      <p>
        <b>Address:</b>{" "}
        {selectedFarmer.address}
      </p>

    </div>

    <hr className="my-4" />

    <h3 className="text-2xl font-bold mb-4">
      Submitted Products
    </h3>

    {farmerProducts.length === 0 ? (

      <p>No products found</p>

    ) : (

      farmerProducts.map((product) => (

        <div
          key={product._id}
          className="border rounded-lg p-4 mb-3 bg-slate-50"
        >

          <h4 className="font-bold text-lg">
            {product.productName}
          </h4>

          <p>
            Quantity:
            {" "}
            {product.quantity}
          </p>

          <p>
            Farmer Price:
            ₹{product.farmerPrice}
          </p>

          <p>
            Status:
            {" "}
            <span className="font-bold text-green-600">
              {product.status}
            </span>
          </p>

        </div>

      ))
    )}

  </div>

</div>

)}

</div>
  );
};

export default AdminFarmers;