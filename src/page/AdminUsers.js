import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8050/api/admin/users"
      );

      setUsers(res.data.users || []);
    } catch (error) {
      console.log(error);
    }
  };
  const freezeUser = async (id) => {
  try {

    await axios.put(
      `http://localhost:8050/api/admin/freeze-user/${id}`
    );

    fetchUsers();

  } catch (error) {

    console.log(error);

  }
};

const deleteUser = async (id) => {

  if (
    !window.confirm(
      "Delete this user?"
    )
  )
    return;

  try {

    await axios.delete(
      `http://localhost:8050/api/admin/delete-user/${id}`
    );

    fetchUsers();

  } catch (error) {

    console.log(error);

  }
};

return (
  <div className="p-6">

    <h2 className="text-4xl font-bold mb-6">
      👥 User Management
    </h2>
    <div className="grid md:grid-cols-4 gap-4 mb-8">

  <div className="bg-blue-500 text-white p-5 rounded-2xl shadow">
    <h3>Total Users</h3>
    <p className="text-3xl font-bold">
      {users.length}
    </p>
  </div>

  <div className="bg-green-500 text-white p-5 rounded-2xl shadow">
    <h3>Active Users</h3>
    <p className="text-3xl font-bold">
      {
        users.filter(
          (u) => !u.isFrozen
        ).length
      }
    </p>
  </div>

  <div className="bg-red-500 text-white p-5 rounded-2xl shadow">
    <h3>Frozen Users</h3>
    <p className="text-3xl font-bold">
      {
        users.filter(
          (u) => u.isFrozen
        ).length
      }
    </p>
  </div>

  <div className="bg-purple-500 text-white p-5 rounded-2xl shadow">
    <h3>Platform Members</h3>
    <p className="text-3xl font-bold">
      {users.length}
    </p>
  </div>

</div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

      {users.map((user) => (

        <div
          key={user._id}
          className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-3xl shadow-xl p-5 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-blue-200"
        >

          <div className="flex items-center gap-4">

            <img
              src={
                user.image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
              className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-lg"
            />

            <div>

              <h3 className="text-xl font-bold">
                {user.firstname}
              </h3>
<div className="mt-1">
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold ${
      user.isFrozen
        ? "bg-red-500 text-white"
        : "bg-green-500 text-white"
    }`}
  >
    {user.isFrozen ? "Frozen" : "Active"}
  </span>
</div>
              <p className="text-gray-500">
                {user.email}
              </p>
<div className="flex gap-2 mt-2">

  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
    Customer
  </span>

  <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">
    Orders
  </span>

</div>
            </div>

          </div>

          <div className="mt-4">

            <p>
              📞 {user.phone}
            </p>

            <p>
              📍 {user.address}
            </p>

          </div>

          <div className="flex gap-2 mt-5">

            <button
              onClick={() =>
                setSelectedUser(user)
              }
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-xl shadow"
            >
              View
            </button>

            <button
              onClick={() =>
                freezeUser(user._id)
              }
              className={`px-3 py-2 rounded text-white ${
                user.isFrozen
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            >
              {user.isFrozen
                ? "Unfreeze"
                : "Freeze"}
            </button>

            <button
              onClick={() =>
                deleteUser(user._id)
              }
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-xl shadow"
            >
              Delete
            </button>

          </div>

        </div>
      ))}
    </div>

    {selectedUser && (

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

        <div className="bg-white p-6 rounded-xl w-[600px]">

          <h2 className="text-3xl font-bold mb-4">

            User Details

          </h2>

          <div className="space-y-2">

            <p>
              <b>Name:</b>{" "}
              {selectedUser.firstname}
              {" "}
              {selectedUser.lastname}
            </p>

            <p>
              <b>Email:</b>{" "}
              {selectedUser.email}
            </p>

            <p>
              <b>Phone:</b>{" "}
              {selectedUser.phone}
            </p>

            <p>
              <b>Address:</b>{" "}
              {selectedUser.address}
            </p>

            <p>
              <b>Role:</b>{" "}
              {selectedUser.role}
            </p>

            <p>
              <b>Created:</b>{" "}
              {new Date(
                selectedUser.createdAt
              ).toLocaleDateString()}
            </p>

          </div>

          <button
            onClick={() =>
              setSelectedUser(null)
            }
            className="mt-5 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>

        </div>

      </div>
    )}

  </div>
);
};

export default AdminUsers;