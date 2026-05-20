import React,
{
  useState,
} from "react";

import axios
from "axios";

import { toast }
from "react-hot-toast";


const EditProfile = () => {

  const user =
  JSON.parse(
    localStorage.getItem("user")
  );

  const [data,
  setData] =
  useState({

    firstname:
    user?.firstname || "",

    email:
    user?.email || "",

    phone:
    user?.phone || "",

    address:
    user?.address || "",
  });

  const handleChange =
  (e) => {

    const {
      name,
      value,
    } = e.target;

    setData({

      ...data,

      [name]:
      value,
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================
const handleUpdate =
async () => {

  try {

    const res =
    await axios.put(

      `http://localhost:8050/api/user/update/${user._id}`,

      data
    );

    console.log(
      "UPDATE RESPONSE:",
      res.data
    );

    if (
      res.data.success
    ) {

      // UPDATE LOCAL STORAGE
      localStorage.setItem(

        "user",

        JSON.stringify(
          res.data.data
        )
      );

      // SUCCESS MESSAGE
      toast.success(
        res.data.message ||
        "Profile updated successfully"
      );

      // REDIRECT
      setTimeout(() => {

        window.location.href =
        "/profile";

      }, 1000);
    }

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Update failed"
    );
  }
};

  return (

    <div className="p-5 max-w-xl m-auto">

      <h2 className="text-3xl font-bold mb-5">
        Edit Profile
      </h2>

      <div className="flex flex-col gap-4">

        <input
          type="text"
          name="firstname"
          value={data.firstname}
          onChange={handleChange}
          placeholder="Name"
          className="border p-3 rounded"
        />

        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-3 rounded"
        />

        <input
          type="text"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-3 rounded"
        />

        <textarea
          name="address"
          value={data.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-3 rounded"
        />

        <button
          onClick={handleUpdate}
          className="bg-green-500 text-white py-3 rounded"
        >

          Update Profile

        </button>

      </div>

    </div>
  );
};

export default
EditProfile;