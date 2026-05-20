import React, {
  useState,
} from "react";

import axios from "axios";

import { toast }
from "react-hot-toast";

const Contact = () => {

  const [formData,
  setFormData] =
  useState({

    name: "",

    email: "",

    subject: "",

    message: "",
  });

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange =
  (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({

        ...prev,

        [name]: value,
      })
    );
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
const handleSubmit =
async (e) => {

  e.preventDefault();

  try {

    const user =
    JSON.parse(
      localStorage.getItem("user")
    );

    const res =
    await axios.post(
      "http://localhost:8050/api/contact/send",

      {

        ...formData,

        email:
        user?.email,
      }
    );

    console.log(res.data);

    if (
      res.data.success
    ) {

      toast.success(
        "Message sent successfully"
      );

      setFormData({

        name: "",

        email: "",

        subject: "",

        message: "",
      });
    }

  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to send message"
    );
  }
};

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">

      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg">

        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Contact Us
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 bg-slate-200 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 bg-slate-200 rounded"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="p-2 bg-slate-200 rounded"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="p-2 bg-slate-200 rounded"
          />

          <button
            type="submit"
            className="bg-red-500 text-white py-2 rounded font-bold"
          >

            Send Message

          </button>

        </form>

      </div>

    </div>
  );
};

export default Contact;