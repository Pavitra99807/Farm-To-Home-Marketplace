const mongoose =
require("mongoose");

const contactSchema =
new mongoose.Schema(

  {

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      required: true,
    },

    adminReply: {
      type: String,
      default: "",
    },

    replyStatus: {
      type: String,
      default: "Pending",
    },

  },

  {
    timestamps: true,
  }
);

module.exports =
mongoose.model(
  "Contact",
  contactSchema
);