import React, {
  useEffect,
  useState,
} from "react";

import axios
from "axios";

const MyMessages = () => {

  const user =
  JSON.parse(
    localStorage.getItem("user")
  );

  const email =
  user?.email;

  const [messages,
  setMessages] =
  useState([]);

  // =========================
  // FETCH USER MESSAGES
  // =========================
  const fetchMessages =
  async () => {

    try {

      const res =
      await axios.get(
        `http://localhost:8050/api/contact/user/${email}`
      );

      setMessages(
        res.data.data
      );

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchMessages();

  }, []);

  return (

    <div className="p-5 min-h-screen bg-slate-100">

      <h2 className="text-3xl font-bold mb-6">
        My Support Messages
      </h2>

      <div className="flex flex-col gap-5">

        {messages.map((item) => (

          <div
            key={item._id}
            className="bg-white shadow rounded p-5"
          >

            {/* SUBJECT */}
            <p className="font-bold text-lg">
              Subject :
              {" "}
              {item.subject}
            </p>

            {/* USER MESSAGE */}
            <div className="mt-4">

              <p className="font-semibold">
                Your Message
              </p>

              <p className="text-gray-700 mt-1">
                {item.message}
              </p>

            </div>

            {/* STATUS */}
            <div className="mt-4">

              <span className="font-bold">
                Reply Status :
              </span>

              {" "}

              <span className={`${
                item.replyStatus ===
                "Replied"

                ? "text-green-600"

                : "text-red-500"
              }`}>

                {item.replyStatus}

              </span>

            </div>

            {/* ADMIN REPLY */}
            {item.adminReply && (

              <div className="bg-green-100 p-4 rounded mt-5">

                <p className="font-bold text-green-700">
                  Admin Reply
                </p>

                <p className="mt-2">
                  {item.adminReply}
                </p>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
};

export default
MyMessages;