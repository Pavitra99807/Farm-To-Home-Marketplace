import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import ErrorPage from "./page/ErrorPage";
import Home from "./page/Home";
import Menu from "./page/Menu";
import About from "./page/About";
import Contact from "./page/Contact";
import Login from "./page/login";
import Newproduct from "./page/Newproduct";
import Signup from "./page/Signup";
import Cart from "./page/Cart";
import Dashboard from "./page/Dashboard";
import ProductDetails from "./page/ProductDetails";
import Checkout from "./page/Checkout";

import { store } from "./redux/index";
import { Provider } from "react-redux";
import MyOrders from "./page/MyOrders";
import EditProduct from "./page/EditProduct";
import Wishlist from "./page/Wishlist";
import Profile from "./page/Profile";
import AdminPanel from "./page/AdminPanel";
import {
  Toaster,
} from "react-hot-toast";
import AdminMessages from "./page/AdminMessages";
import MyMessages
from "./page/MyMessages";
import EditProfile
from "./page/EditProfile";
import "./i18n";
import FarmerDashboard from "./page/FarmerDashboard";
import SmartAgriTools from "./page/SmartAgriTools";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "menu/:filterby", element: <Menu /> },
      { path: "product/:id", element: <ProductDetails /> },

      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },

      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      { path: "dashboard", element: <Dashboard /> },
      { path: "farmer", element: <FarmerDashboard /> },
      { path: "smart-tools", element: <SmartAgriTools /> },
      { path: "my-orders", element: <MyOrders /> },

     { path: "admin", element: <AdminPanel /> },
     

      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },

      { path: "newproduct", element: <Newproduct /> },
      { path: "wishlist", element: <Wishlist /> },
{ path: "profile", element: <Profile /> },
{ path: "my-messages", 
  element: <MyMessages />}, 

{ path: "admin-messages",
    element: <AdminMessages />}, 

      {
  path: "admin/edit-product/:id",
  element: <EditProduct />,
},
{ path:"/edit-profile", 
  element:<EditProfile />}, 

    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster
  position="top-right"
/>
  </Provider>
);
