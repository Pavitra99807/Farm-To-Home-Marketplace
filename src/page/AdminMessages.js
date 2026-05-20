import React, {
  useEffect,
  useState,
} from "react";

import axios
from "axios";

const AdminMessages = () => {

  const [messages,
  setMessages] =
  useState([]);

  const [reply,
  setReply] =
  useState("");

  // =========================
  // FETCH MESSAGES
  // =========================
  const fetchMessages =
  async () => {

    try {

      const res =
      await axios.get(
        "http://localhost:8050/api/contact/all"
      );

      setMessages(
        res.data.data
      );

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // SEND REPLY
  // =========================
  const handleReply =
  async (id) => {

    try {

      await axios.put(
        `http://localhost:8050/api/contact/reply/${id}`,
        {
          reply,
        }
      );

      alert(
        "Reply sent successfully"
      );

      setReply("");

      fetchMessages();

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
        Customer Messages
      </h2>

      <div className="flex flex-col gap-5">

        {messages.map((item) => (

          <div
            key={item._id}
            className="bg-white shadow rounded p-5"
          >

            {/* USER INFO */}
            <div className="mb-3">

              <h3 className="text-xl font-bold">
                {item.name}
              </h3>

              <p className="text-gray-500">
                {item.email}
              </p>

            </div>

            {/* SUBJECT */}
            <p className="font-semibold">
              Subject :
              {" "}
              {item.subject}
            </p>

            {/* USER MESSAGE */}
            <p className="mt-3 text-gray-700">
              {item.message}
            </p>

            {/* REPLY STATUS */}
            <p className="mt-3">
              <span className="font-bold">
                Status :
              </span>
              {" "}
              {item.replyStatus}
            </p>

            {/* ADMIN REPLY */}
            {item.adminReply && (

              <div className="bg-green-100 p-3 rounded mt-3">

                <p className="font-bold text-green-700">
                  Admin Reply
                </p>

                <p className="mt-1">
                  {item.adminReply}
                </p>

              </div>
            )}

            {/* REPLY BOX */}
            <textarea
              placeholder="Reply to user"
              value={reply}
              onChange={(e) =>
                setReply(e.target.value)
              }
              className="w-full border p-2 mt-4 rounded"
            />

            {/* BUTTON */}
            <button
              onClick={() =>
                handleReply(item._id)
              }
              className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
            >

              Send Reply

            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default
AdminMessages;