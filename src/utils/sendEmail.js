// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mannuarya2002@gmail.com", // replace with your email
      pass: "whrb cqwb rsep cgyq", // replace with your email password
    },
  });

  const mailOptions = {
    from: "mannuarya2002@gmail.com", // replace with your email
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
