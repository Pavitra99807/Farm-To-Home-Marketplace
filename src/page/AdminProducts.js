import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const AdminProducts = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
const [editingProduct, setEditingProduct] =
  useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // GET PRODUCTS
  // =========================
 const fetchProducts = async () => {

  try {

    setLoading(true);

    const res = await axios.get(
      "http://localhost:8050/api/product/all"
    );

    console.log(
      "PRODUCT RESPONSE:",
      res.data
    );

    if (res.data.success) {

      setProducts(
        res.data.data || []
      );

    } else {

      setProducts([]);
    }

  } catch (error) {

    console.log(
      "FETCH ERROR:",
      error
    );

    alert(
      "Failed to load products"
    );

  } finally {

    setLoading(false);
  }
};

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:8050/api/product/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product deleted successfully");

      fetchProducts();

    } catch (error) {

      console.log("DELETE ERROR:", error);

      alert("Delete failed");

    }
  };

  return (
    <div className="p-5 max-w-6xl m-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">

        <h2 className="text-3xl font-bold">
          Admin Products
        </h2>

        <Link to="/newproduct">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + Add Product
          </button>
        </Link>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-blue-600">
          Loading products...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && products.length === 0 && (
        <p>No products found</p>
      )}
      {/* EDIT PRODUCT */}
{editingProduct && (

  <div className="bg-white shadow rounded-xl p-5 mb-5">

    <h2 className="text-2xl font-bold mb-4">

      Edit Product

    </h2>

    <input
      type="text"
      value={editingProduct.name}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          name: e.target.value,
        })
      }
      placeholder="Product Name"
      className="border p-2 w-full mb-3 rounded"
    />

    <input
      type="number"
      value={editingProduct.price}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          price: e.target.value,
        })
      }
      placeholder="Price"
      className="border p-2 w-full mb-3 rounded"
    />

    <input
      type="text"
      value={editingProduct.category}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          category: e.target.value,
        })
      }
      placeholder="Category"
      className="border p-2 w-full mb-3 rounded"
    />

    <input
      type="text"
      value={editingProduct.image}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          image: e.target.value,
        })
      }
      placeholder="Image URL"
      className="border p-2 w-full mb-3 rounded"
    />

    <textarea
      value={editingProduct.description}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          description: e.target.value,
        })
      }
      placeholder="Description"
      className="border p-2 w-full mb-3 rounded"
    />

    <button
      onClick={async () => {

        try {

          await axios.put(
            `http://localhost:8050/api/product/update/${editingProduct._id}`,
            editingProduct
          );

          alert(
            "Product updated"
          );

          setEditingProduct(null);

          fetchProducts();

        } catch (error) {

          console.log(error);
        }
      }}
      className="bg-green-500 text-white px-5 py-2 rounded"
    >

      Save Changes

    </button>

  </div>

)}

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {products.map((p) => (

          <div
            key={p._id}
            className="bg-white shadow rounded p-4"
          >

            <img
              src={
                p.image ||
                "https://via.placeholder.com/300"
              }
              alt={p.name}
              className="w-full h-48 object-cover rounded"
            />

            <div className="mt-3">

              <p className="font-bold text-xl">
                {p.name}
              </p>

              <p className="text-red-500 font-bold mt-1">
                ₹ {p.price}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {p.category}
              </p>

              <p className="text-sm mt-2 line-clamp-2">
                {p.description}
              </p>

            </div>

            {/* BUTTONS */}
            <div className="flex gap-2 mt-4">

              <Link to={`/admin/edit-product/${p._id}`}>
 <button
  onClick={() =>
    setEditingProduct(p)
  }
  className="bg-blue-500 text-white px-3 py-1 rounded"
>

  Edit

</button>
</Link>

              <button
                onClick={() => deleteProduct(p._id)}
                className="bg-red-500 text-white px-3 py-2 rounded w-full"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminProducts;