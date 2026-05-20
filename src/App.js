import React, {
  useEffect,
  useState,
} from "react";

import {
  Outlet,
  useLocation,
} from "react-router-dom";

import Header from "./component/Header";

import axios from "axios";

import {
  useDispatch,
} from "react-redux";

import {
  setDataProduct,
} from "./redux/productSlice";
import AdminMessages
from "./page/AdminMessages";
import MyMessages
from "./page/MyMessages";
import EditProfile
from "./page/EditProfile";
import { Toaster }
from "react-hot-toast";

const App = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const isHomePage =
    location.pathname === "/";

  // DARK MODE
  const [darkMode, setDarkMode] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "darkMode"
        )
      ) || false
    );

  // APPLY DARK MODE
  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add(
        "dark"
      );

    } else {

      document.documentElement.classList.remove(
        "dark"
      );
    }

    localStorage.setItem(
      "darkMode",
      JSON.stringify(darkMode)
    );

  }, [darkMode]);

  // FETCH PRODUCTS
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await axios.get(
          "http://localhost:8050/api/product/all"
        );

        dispatch(
          setDataProduct(
            res.data.data || []
          )
        );

      } catch (error) {

        console.log(
          "PRODUCT FETCH ERROR:",
          error
        );
      }
    };

    fetchProducts();

  }, [dispatch]);

  return (

    <div className="dark:bg-slate-900 dark:text-white min-h-screen">

      <Header />

      <div className={isHomePage ? "" : "pt-16"}>

        <Outlet />

      </div>

    </div>
  );
};

export default App;
