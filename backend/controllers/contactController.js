const Contact =
require(
  "../Models/contactModel"
);

// =========================
// SEND MESSAGE
// =========================
const sendMessage =
async (req, res) => {

  try {

    console.log(req.body);

    const contact =
    new Contact({

      name:
      req.body.name,

      email:
      req.body.email,

      subject:
      req.body.subject,

      message:
      req.body.message,
    });

    await contact.save();

    console.log(
      "CONTACT SAVED"
    );

    return res.status(201).json({

      success: true,

      message:
      "Message sent successfully",

      data: contact,
    });

  } catch (error) {

    console.log(
      "CONTACT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};
// =========================
// GET ALL MESSAGES
// =========================
const getMessages =
async (req, res) => {

  try {

    const data =
    await Contact.find({});

    return res.status(200).json({

      success: true,

      data,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};

// =========================
// GET USER MESSAGES
// =========================
const getUserMessages =
async (req, res) => {

  try {

    const { email } =
    req.params;

    const data =
    await Contact.find({
      email,
    });

    return res.status(200).json({

      success: true,

      data,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};

// =========================
// ADMIN REPLY
// =========================
const replyMessage =
async (req, res) => {

  try {

    const { id } =
    req.params;

    const updated =
    await Contact.findByIdAndUpdate(

      id,

      {
        adminReply:
        req.body.reply,

        replyStatus:
        "Replied",
      },

      {
        new: true,
      }
    );

    return res.status(200).json({

      success: true,

      message:
      "Reply sent successfully",

      data: updated,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};

module.exports = {

  sendMessage,

  getMessages,

  getUserMessages,

  replyMessage,
};