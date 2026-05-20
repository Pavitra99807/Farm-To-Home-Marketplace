import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="max-w-2xl bg-white shadow-md rounded-xl p-6">

        <h1 className="text-3xl font-bold text-red-500 mb-4">
          About Our App
        </h1>

        <p className="text-gray-700 mb-3">
          This is a full-stack MERN e-commerce application built using React,
          Redux, Node.js, Express, and MongoDB.
        </p>

        <p className="text-gray-700 mb-3">
          It includes features like product listing, cart system, user
          authentication, and order management.
        </p>

        <p className="text-gray-700">
          The goal of this project is to demonstrate a real-world scalable
          e-commerce architecture with modern web technologies.
        </p>

      </div>
    </div>
  );
};

export default About;