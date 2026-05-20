import { createSlice } from "@reduxjs/toolkit";
console.log("USER SLICE LOADED");


let storedUser = {};

try {

  const userData =
    localStorage.getItem("user");

  console.log(
    "USER DATA:",
    userData
  );

  if (
    userData &&
    userData !== "undefined"
  ) {

    storedUser =
      JSON.parse(userData);
  }

} catch (error) {

  console.log(
    "PARSE ERROR:",
    error
  );

  storedUser = {};
}

// SAFE LOCAL STORAGE USER


const initialState = {

  _id:
    storedUser._id || "",

  firstname:
    storedUser.firstname || "",

  lastname:
    storedUser.lastname || "",

  username:
    storedUser.username || "",

  email:
    storedUser.email || "",

  image:
    storedUser.image || "",

  role:
    storedUser.role || "user",

  token:
    storedUser.token || "",
};

const userSlice = createSlice({

  name: "user",

  initialState,

  reducers: {

    loginRedux: (
      state,
      action
    ) => {

      state._id =
        action.payload._id;

      state.firstname =
        action.payload.firstname;

      state.lastname =
        action.payload.lastname;

      state.username =
        action.payload.username;

      state.email =
        action.payload.email;

      state.image =
        action.payload.image;

      state.role =
        action.payload.role || "user";

      state.token =
        action.payload.token;

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(
          action.payload
        )
      );
    },

    logoutRedux: (
      state
    ) => {

      state._id = "";

      state.firstname = "";

      state.lastname = "";

      state.username = "";

      state.email = "";

      state.image = "";

      state.role = "user";

      state.token = "";

      localStorage.removeItem(
        "user"
      );
    },
  },
});

export const {

  loginRedux,

  logoutRedux,

} = userSlice.actions;

export default userSlice.reducer;
