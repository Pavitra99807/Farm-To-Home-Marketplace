import React, { useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { toast } from "react-hot-toast";

const Newproduct = () => {
  const [data, setData] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    description: "",
  });

  const API_BASE = "http://localhost:8050";

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // IMAGE UPLOAD
  const handleUploadImage = (e) => {
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

  // SAVE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API_BASE}/api/product/uploadProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      console.log("PRODUCT RESPONSE:", result);

      if (!res.ok) {
        toast.error(result.message || "Upload failed");
        return;
      }

      toast.success("Product uploaded successfully");

      // RESET FORM
      setData({
        name: "",
        category: "",
        image: "",
        price: "",
        description: "",
      });

    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="p-5">
      <form
        className="m-auto w-full max-w-md shadow flex flex-col p-3 bg-white rounded"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Name</label>

        <input
          type="text"
          name="name"
          className="bg-slate-200 p-2 my-1 rounded"
          onChange={handleOnChange}
          value={data.name}
          required
        />

        <label htmlFor="category">Category</label>

        <select
          className="bg-slate-200 p-2 my-1 rounded"
          id="category"
          name="category"
          onChange={handleOnChange}
          value={data.category}
          required
        >
          <option value="">Select Category</option>
          <option value="sandwich">Sandwich</option>
          <option value="vegetable">Vegetable</option>
          <option value="rice">Rice</option>
          <option value="fruits">Fruits</option>
          <option value="pizza">Pizza</option>
        </select>

        <label htmlFor="image" className="mt-2">
          Image

          <div className="h-40 w-full bg-slate-200 rounded flex items-center justify-center cursor-pointer overflow-hidden">

            {data.image ? (
              <img
                src={data.image}
                className="h-full w-full object-cover"
                alt="preview"
              />
            ) : (
              <span className="text-5xl text-slate-500">
                <BsCloudUpload />
              </span>
            )}

            <input
              type="file"
              accept="image/*"
              id="image"
              onChange={handleUploadImage}
              className="hidden"
            />
          </div>
        </label>

        <label htmlFor="price" className="my-1">
          Price
        </label>

        <input
          type="number"
          className="bg-slate-200 p-2 my-1 rounded"
          name="price"
          onChange={handleOnChange}
          value={data.price}
          required
        />

        <label htmlFor="description">Description</label>

        <textarea
          rows={5}
          value={data.description}
          className="bg-slate-200 p-2 my-2 resize-none rounded"
          name="description"
          onChange={handleOnChange}
          required
        ></textarea>

        <button className="bg-red-500 hover:bg-red-600 text-white text-lg font-medium my-2 py-2 rounded">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default Newproduct;