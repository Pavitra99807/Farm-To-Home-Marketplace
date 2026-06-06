import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginSignupImage from "../assest/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-hot-toast";
import axios
from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    image: "",
    role: "user",
  });
 

  const navigate = useNavigate();
  const API_BASE = "http://localhost:8050";

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadProfileImage = (e) => {
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


//
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstname,
      email,
      password,
      confirmPassword,
    } = data;

    if (!firstname || !email || !password || !confirmPassword) {
      toast.error("Please fill required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // IMPORTANT: send only backend-required fields
      const payload = {
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        email: data.email,
        password: data.password,
        address: data.address,
        phone: data.phone,
        image: data.image,
        role: data.role,
      };

      const response = await fetch(
        `${API_BASE}/api/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      console.log("SIGNUP RESPONSE:", result);

      if (!response.ok) {
        toast.error(result.message || "Signup failed");
        return;
      }

      toast.success("Registration successful!");

      navigate("/login");

    } catch (error) {
      console.log(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-4">
      <div className="w-full max-w-sm bg-white m-auto flex flex-col p-4">

        {/* IMAGE UPLOAD */}
        <div className="w-20 h-20 overflow-hidden rounded-full m-auto relative">
          <img
            src={data.image || loginSignupImage}
            className="w-full h-full"
            alt="profile"
          />

          <label htmlFor="profileImage">
            <div className="absolute bottom-0 bg-slate-500 bg-opacity-50 w-full text-center cursor-pointer">
              <p className="text-sm text-white">Upload</p>
            </div>

            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleUploadProfileImage}
            />
          </label>
        </div>

        {/* FORM */}
        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>

          <input name="firstname" placeholder="First Name"
            className="bg-slate-200 p-2 my-1 rounded"
            onChange={handleOnChange} />

          <input name="lastname" placeholder="Last Name"
            className="bg-slate-200 p-2 my-1 rounded"
            onChange={handleOnChange} />

          <input name="username" placeholder="Username"
            className="bg-slate-200 p-2 my-1 rounded"
            onChange={handleOnChange} />

          <div className="grid grid-cols-2 gap-2 my-2">
            <label
              className={`border rounded p-2 cursor-pointer text-center ${
                data.role === "user"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="user"
                checked={data.role === "user"}
                onChange={handleOnChange}
                className="hidden"
              />
              Customer
            </label>

            <label
              className={`border rounded p-2 cursor-pointer text-center ${
                data.role === "farmer"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="farmer"
                checked={data.role === "farmer"}
                onChange={handleOnChange}
                className="hidden"
              />
              Farmer
            </label>
          </div>

       <input
  type="email"
  name="email"
  placeholder="Email"
  value={data.email}
  onChange={handleOnChange}
  className="bg-slate-200 p-2 my-1 rounded"
/>
  

          {/* PASSWORD */}
          <div className="flex bg-slate-200 p-2 rounded my-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full outline-none"
              onChange={handleOnChange}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex bg-slate-200 p-2 rounded my-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full outline-none"
              onChange={handleOnChange}
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>

          <input name="address" placeholder="Address"
            className="bg-slate-200 p-2 my-1 rounded"
            onChange={handleOnChange} />

          <input name="phone" placeholder="Phone"
            className="bg-slate-200 p-2 my-1 rounded"
            onChange={handleOnChange} />

          <button
            disabled={loading}
            className="bg-red-500 text-white p-2 rounded mt-3"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

        </form>

        <p className="text-sm mt-2">
          Already have account?{" "}
          <Link to="/login" className="text-red-500 underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
