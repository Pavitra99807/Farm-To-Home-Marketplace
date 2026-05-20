import React, { useState } from "react";
import loginSignupImage from "../assest/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginRedux } from "../redux/userSlice";
import {
  loadUserData,
} from "../redux/productSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_BASE = "http://localhost:8050";

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const { email, password } = data;

  if (!email || !password) {
    toast.error("Please enter all fields");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const dataRes = await response.json();

    console.log("LOGIN RESPONSE:", dataRes);

    if (!response.ok || !dataRes.success) {
      toast.error(dataRes.message || "Login failed");
      return;
    }

    // 🔥 SAVE TOKEN CORRECTLY
  // 🔥 SAVE TOKEN
if (dataRes.data?.token) {

  localStorage.setItem(
    "token",
    dataRes.data.token
  );
}

// 🔥 SAVE USER
if (dataRes.data) {

  localStorage.setItem(
    "user",
    JSON.stringify(
      dataRes.data
    )
  );
}

// 🔥 REDUX UPDATE
dispatch(
  loginRedux(
    dataRes.data
  )
);

dispatch(
  loadUserData()
);

    toast.success("Login successful");

    setTimeout(() => {
      if (dataRes.data?.role === "farmer") {
        navigate("/farmer");
      } else if (dataRes.data?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }, 500);

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

        <div className="w-20 overflow-hidden rounded-full m-auto">
          <img src={loginSignupImage} className="w-full" alt="login" />
        </div>

        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleOnChange}
            className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded"
          />

          <label>Password</label>
          <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleOnChange}
              className="w-full bg-slate-200 outline-none"
            />

            <span
              onClick={handleShowPassword}
              className="cursor-pointer text-xl"
            >
              {showPassword ? <BiShow /> : <BiHide />}
            </span>

          </div>

          <button
            disabled={loading}
            className={`bg-red-500 text-white py-1 rounded mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-sm mt-2">
          Don't have account?{" "}
          <Link to="/signup" className="text-red-500 underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
