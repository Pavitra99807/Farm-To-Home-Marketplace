import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddProduct = () => {
  const [data, setData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8050/api/product/create",
        data
      );

      console.log(res.data);
      toast.success(
  "Product added successfully"
);

      setData({
        name: "",
        category: "",
        price: "",
        description: "",
        image: "",
      });

    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(
  "Failed to add product"
);
    }
  };

  return (
    <div className="p-5 max-w-xl m-auto bg-white shadow">

      <h2 className="text-2xl font-bold mb-4">
        Add Product
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-2"
        />

        <input
          type="text"
          name="category"
          value={data.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2"
        />

        <input
          type="number"
          name="price"
          value={data.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2"
        />

        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2"
        />

        {data.image && (
          <img
            src={data.image}
            alt="preview"
            className="h-32 object-cover"
          />
        )}

        <button
          type="submit"
          className="bg-green-600 text-white py-2"
        >
          Add Product
        </button>

      </form>
    </div>
  );
};

export default AddProduct;