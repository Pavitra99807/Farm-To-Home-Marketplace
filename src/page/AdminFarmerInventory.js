import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFarmerInventory = () => {

  const [products, setProducts] = useState([]);
  const [sellingPrices, setSellingPrices] = useState({});
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8050/api/farmer-products/admin/inventory",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProducts(res.data.data);

    } catch (err) {
      console.log(err);
    }
  };

const moveToStore = async (id) => {

  const sellingPrice = sellingPrices[id];

  if (!sellingPrice) {
    alert("Enter selling price");
    return;
  }

  try {

    const token =
      localStorage.getItem("token");

    await axios.post(
      `http://localhost:8050/api/farmer-products/admin/${id}/move-store`,
      {
        sellingPrice
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Moved Successfully");

    fetchProducts();

  } catch (err) {

    console.log(err);

    alert("Failed");
  }
};

  return (
    <div className="container mt-4">

      <h2>Farmer Inventory</h2>

     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

{products.map((item)=>(

<div
 key={item._id}
 className="bg-white rounded-xl shadow-lg p-5 border border-gray-200"
>

<img
 src={
   item.image
     ? item.image
     : "https://via.placeholder.com/300"
 }
 alt={item.productName}
 className="w-full h-48 object-cover rounded-lg mb-4"
/>

<h3 className="text-xl font-bold">
 {item.productName}
</h3>

<div className="mt-3 space-y-2">

<p>
 Quantity:
 <span className="font-semibold">
  {item.quantity}
 </span>
</p>

<p>
 Market Price:
 <span className="text-blue-600 font-bold">
  ₹{item.marketPrice}
 </span>
</p>

<p>
 Farmer Price:
 <span className="text-green-600 font-bold">
  ₹{item.farmerPrice}
 </span>
</p>

</div>

<input
 type="number"
 placeholder="Selling Price"
 value={sellingPrices[item._id] || ""}
 onChange={(e) =>
   setSellingPrices({
     ...sellingPrices,
     [item._id]: e.target.value
   })
 }
 className="w-full border p-2 rounded mt-4"
/>

<button
 onClick={() => moveToStore(item._id)}
 className="w-full bg-emerald-600 text-white py-2 rounded-lg mt-3"
>
 Move To Store
</button>

</div>

))}

</div>

    </div>
  );
};

export default AdminFarmerInventory;