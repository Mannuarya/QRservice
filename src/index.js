const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const bodyParser = require("body-parser");
const qrcode = require("qrcode");
const cookieParser = require(`cookie-parser`);
const crypto = require("crypto");
const User = require("./models/User");
const nodemailer = require("nodemailer");
const sendEmail = require("./utils/sendEmail");
const { errorMonitor } = require("events");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose
  .connect(
    "mongodb+srv://mannuarya2002:manishmongo@cluster0.kquyzjn.mongodb.net/",
    {}
  )
  .then(() => {
    console.log("Database connected Successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup"); // pass an empty string initially
});




app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const isValidEmail = emailValidator.validate(email);

  if (!isValidEmail) {
    return res.status(400).send("Invalid email address");
  }

  const data = {
    name: req.body.name,
    email: email,
    password: req.body.password,
    contact: req.body.contact,
    location: req.body.location,
  };

  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.send("User already exists. Please choose a different email.");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    data.password = hashedPassword;
    data.verificationToken = verificationToken;

    await User.create(data);

    const verificationUrl = `http://localhost:5000/verify-email?token=${verificationToken}`;
    await sendEmail(
      data.email,
      "Email Verification",
      `Please verify your email by clicking the following link: ${verificationUrl}`
    );

    res.send(
      "Signup successful! Please check your email to verify your account."
    );
  } catch (error) {
    console.error("Error while signing up:", error);
    res.status(500).send("Error while signing up");
  }
});

app.get("/verify-email", async (req, res) => {
  const token = req.query.token;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid or expired verification token.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send("Email verified successfully! You can now log in.");
  } catch (error) {
    console.error("Error while verifying email:", error);
    res.status(500).send("Error while verifying email");
  }
});


app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send("Email not found");
    }

    if (!user.isVerified) {
      return res.send(
        "Email not verified. Please check your email to verify your account."
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordMatch) {
      res.cookie(`userEmail`, req.body.email);
      res.redirect("/home");
    } else {
      res.send("Incorrect password");
    }
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).send("Error while logging in");
  }
});


app.get("/home", async (req, res) => {
  try {
    const userEmail = req.cookies.userEmail;
    if (!userEmail) {
      return res.status(404).send("Email not found");
    }
    const userData = await User.findOne({ email: userEmail });
    if (!userData) {
      return res.status(404).send("User not found");
    }

    const qrData = `email: ${userData.email}\ncontact: ${userData.contact}\nlocation: ${userData.location}`;
    qrcode.toDataURL(qrData, (err, qrCodeUrl) => {
      if (err) {
        console.error("Error while generating QR code:", err);
        return res.status(500).send("Error while generating QR code");
      }

      res.render("home", { userData: userData, qrImage: qrCodeUrl });
    });
  } catch (error) {
    console.error("Error while generating QR code:", error);
    res.status(500).send("Error while generating QR code and user data");
  }
});



// Add this new endpoint to fetch user details
app.get("/api/user-details", async (req, res) => {
  try {
    const userEmail = req.cookies.userEmail;
    if (!userEmail) {
      return res.status(404).send("Email not found");
    }
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send("Error fetching user details");
  }
});


app.get("/login", (req, res) => {
  res.render("login");
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
});
