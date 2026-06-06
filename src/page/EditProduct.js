import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";


const EditProduct = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    description: "",
  });

  // FETCH PRODUCT
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const res = await axios.get(
          `http://localhost:8050/api/product/${id}`
        );

        const product =
          res.data.data;

        setData({

          name:
            product.name || "",

          category:
            product.category || "",

          price:
            product.price || "",

          description:
            product.description || "",

          image:
            product.image || "",
        });

      } catch (error) {

        console.log(error);
      }
    };

    fetchProduct();

  }, [id]);


  // CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // IMAGE
  const handleImage = (e) => {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {

      setData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
  };

  // UPDATE
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.put(
        `http://localhost:8050/api/product/update/${id}`,
        data
      );

     toast.success(
  "Product updated successfully"
);

     navigate("/admin");

    } catch (error) {

      console.log(error);

      toast.error(
  "Failed to update product"
);

    }
  };

  return (
    <div className="p-5">

      <form
        onSubmit={handleSubmit}
        className="max-w-md m-auto bg-white p-5 rounded shadow"
      >

        <h2 className="text-2xl font-bold mb-5">
          Edit Product
        </h2>

        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 mb-3"
        />

        <input
          type="text"
          name="category"
          value={data.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border p-2 mb-3"
        />

        <input
          type="number"
          name="price"
          value={data.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 mb-3"
        />

        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 mb-3"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mb-3"
        />

        <img
          src={data.image}
          alt="preview"
          className="w-full h-52 object-cover rounded mb-4"
        />

        <button
          className="bg-blue-500 text-white w-full py-3 rounded"
        >
          Update Product
        </button>

      </form>

    </div>
  );
};

export default EditProduct;
