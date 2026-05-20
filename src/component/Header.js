import React, { useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import { HiOutlineUserCircle } from "react-icons/hi";
import { BsCartFill } from "react-icons/bs";

import { useDispatch, useSelector } from "react-redux";

import { logoutRedux } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import {
  FaMoon,
  FaSun,
} from "react-icons/fa";
import {
  loadUserData,
} from "../redux/productSlice";
import {
  useTranslation,
} from "react-i18next";

const Header = () => {
  const location = useLocation();
  const isHomePage =
    location.pathname === "/";
  const navLinkClass = isHomePage
    ? "hover:text-emerald-200"
    : "text-slate-800 dark:text-white hover:text-emerald-700";
  const iconClass = isHomePage
    ? "text-white drop-shadow"
    : "text-slate-700 dark:text-white";
  const [darkMode, setDarkMode] =
  useState(
    JSON.parse(
      localStorage.getItem(
        "darkMode"
      )
    ) || false
  );
  const {
  i18n,
} = useTranslation();
  const toggleDarkMode = () => {

  const newMode =
    !darkMode;

  setDarkMode(newMode);

  localStorage.setItem(
    "darkMode",
    JSON.stringify(newMode)
  );

  if (newMode) {

    document.documentElement.classList.add(
      "dark"
    );

  } else {

    document.documentElement.classList.remove(
      "dark"
    );
  }
};

  const [showMenu, setShowMenu] = useState(false);

  const userData = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  const cartItemNumber = useSelector(
    (state) => state.product.cartItem
  );


  // SHOW MENU
  const handleShowMenu = () => {

    setShowMenu((prev) => !prev);
  };

  // LOGOUT
 const handleLogout = () => {

  dispatch(logoutRedux());

  dispatch(loadUserData());

  toast.success(
    "Logout successfully"
  );
};

  return (

    <header
      className={`fixed w-full h-16 px-2 md:px-5 z-50 ${
        isHomePage
          ? "bg-transparent text-white"
          : "bg-white dark:bg-slate-900 shadow-md"
      }`}
    >

      <div className="flex items-center h-full justify-between">

        <nav className={`gap-3 md:gap-6 text-sm md:text-lg hidden md:flex font-semibold ${isHomePage ? "drop-shadow" : ""}`}>

            <Link to={""} className={navLinkClass}>
              Home
            </Link>

            <Link to={"menu/63f0fdbb3bcc2f97fa53d25d"} className={navLinkClass}>
              Menu
            </Link>

            <Link to={"about"} className={navLinkClass}>
              About
            </Link>

            <Link to={"contact"} className={navLinkClass}>
              Contact
            </Link>

            {userData?.email && (
              <Link to={"profile"} className={navLinkClass}>
                Profile
              </Link>
            )}

          </nav>

<div className="hidden sm:flex gap-2 ml-auto mr-4">

  <button
    onClick={() =>
      i18n.changeLanguage("en")
    }
    className={`px-2 py-1 rounded border ${
      isHomePage
        ? "bg-white/15 hover:bg-white/25 border-white/30 text-white backdrop-blur"
        : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800"
    }`}
  >

    English

  </button>

  <button
    onClick={() =>
      i18n.changeLanguage("kn")
    }
    className={`px-2 py-1 rounded border ${
      isHomePage
        ? "bg-white/15 hover:bg-white/25 border-white/30 text-white backdrop-blur"
        : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800"
    }`}
  >

    ಕನ್ನಡ

  </button>

</div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 md:gap-7">

{/* DARK MODE */}
<button
  onClick={toggleDarkMode}
  className={`text-2xl ${iconClass}`}
>

  {darkMode ? (

    <FaSun />

  ) : (

    <FaMoon />

  )}

</button>

          {/* CART */}
          <div className={`text-2xl relative ${iconClass}`}>

            <Link to={"cart"}>

              <BsCartFill />

              <div className="absolute -top-1 -right-1 text-white bg-red-500 h-4 w-4 rounded-full text-sm text-center">

                {cartItemNumber.length}

              </div>

            </Link>

          </div>

          {/* USER */}
          <div className={`relative ${iconClass}`}>

            <div
              className="text-3xl cursor-pointer w-8 h-8 rounded-full overflow-hidden drop-shadow-md"
              onClick={handleShowMenu}
            >

              {userData.image ? (

                <img
                  src={userData.image}
                  className="h-full w-full"
                  alt="user"
                />

              ) : (

                <HiOutlineUserCircle />

              )}

            </div>

            {/* DROPDOWN */}
            {showMenu && (

              <div className="absolute right-0 top-10 bg-white text-slate-800 py-3 shadow-xl rounded-xl flex flex-col min-w-[220px] z-50 border drop-shadow-none">

                {/* USER INFO */}
                {userData?.email && (

                  <div className="px-4 pb-3 border-b">

                    <p className="font-bold text-lg">
                      {userData.firstName}
                    </p>

                    <p className="text-sm text-gray-500 break-all">
                      {userData.email}
                    </p>

                  </div>

                )}

              {/* ADMIN MENU */}
{userData?.role ===
"admin" ||
userData?.email === "admin@gmail.com" ? (

  <>

    <Link
      to={"/admin"}
      className="px-4 py-3 hover:bg-slate-100"
    >

      ⚙️ Admin Dashboard

    </Link>

 <Link
  to={"/admin-messages"}
  className="px-4 py-3 hover:bg-slate-100"
>

  📩 Customer Messages

</Link>

  </>

) : (

  <>

    {userData?.role === "farmer" && (

      <Link
        to={"/farmer"}
        className="px-4 py-3 hover:bg-slate-100"
      >

        🌾 Farmer Dashboard

      </Link>

    )}

    {/* PROFILE */}
    <Link
      to={"/profile"}
      className="px-4 py-3 hover:bg-slate-100"
    >

      👤 Profile

    </Link>

    {/* ORDERS */}
    <Link
      to={"/my-orders"}
      className="px-4 py-3 hover:bg-slate-100"
    >

      📦 My Orders

    </Link>

    {/* WISHLIST */}
    <Link
      to={"/wishlist"}
      className="px-4 py-3 hover:bg-slate-100"
    >

      ❤️ Wishlist

    </Link>
    <Link
  to={"/my-messages"}
  className="px-4 py-3 hover:bg-slate-100"
>

  💬 My Messages

</Link>

  </>

)}

{/* ADD PRODUCT */}
{userData.email === process.env.REACT_APP_ADMIN_EMAIL && (

  <Link
    to={"/newproduct"}
    className="px-4 py-3 hover:bg-slate-100"
  >

    ➕ Add Product

  </Link>

)}

                {/* LOGIN / LOGOUT */}
                {userData?.email ? (

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white mx-3 mt-3 py-2 rounded-lg"
                  >

                    Logout

                  </button>

                ) : (

                  <Link
                    to={"/login"}
                    className="px-4 py-3 hover:bg-slate-100"
                  >

                    🔐 Login

                  </Link>

                )}

                {/* MOBILE NAV */}
                <nav className="text-base flex flex-col md:hidden mt-2 border-t">

                  <Link
                    to={""}
                    className="px-4 py-2"
                  >
                    Home
                  </Link>

                  <Link
                    to={"menu/63f0fdbb3bcc2f97fa53d25d"}
                    className="px-4 py-2"
                  >
                    Menu
                  </Link>

                  <Link
                    to={"about"}
                    className="px-4 py-2"
                  >
                    About
                  </Link>

                  <Link
                    to={"contact"}
                    className="px-4 py-2"
                  >
                    Contact
                  </Link>

                </nav>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;
