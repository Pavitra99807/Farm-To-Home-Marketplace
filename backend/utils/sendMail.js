const nodemailer =
require("nodemailer");

const sendMail =
async (email, otp) => {

  try {

    const transporter =
    nodemailer.createTransport({

      service: "gmail",

      auth: {

        user:
        "YOUR_GMAIL@gmail.com",

        pass:
        "YOUR_APP_PASSWORD",
      },
    });

    await transporter.sendMail({

      from:
      "YOUR_GMAIL@gmail.com",

      to: email,

      subject:
      "OTP Verification",

      html: `

        <h2>Your OTP:</h2>

        <h1>${otp}</h1>

      `,
    });

    console.log(
      "OTP Sent"
    );

  } catch (error) {

    console.log(error);
  }
};

module.exports =
sendMail;