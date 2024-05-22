const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const bodyParser = require("body-parser");
const qrcode = require("qrcode");
const cookieParser = require(`cookie-parser`);
const User = require("./models/User"); // Require the User model
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose
  .connect("mongodb://localhost:27017/manish", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
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
  res.render("signup");
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

    data.password = hashedPassword;
    await User.create(data);

    // Generate QR Code with labels
    const qrData = `email: ${data.email}\ncontact: ${data.contact}\nlocation: ${data.location}`;
    qrcode.toDataURL(qrData, (err, qrCodeUrl) => {
      if (err) {
        console.error("Error while generating QR Code:", err);
        return res.status(500).send("Error while generating QR Code");
      }
      res.redirect("/login");
    });
  } catch (error) {
    console.error("Error while signing up:", error);
    res.status(500).send("Error while signing up");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send("Email not found");
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordMatch) {
      // set a cookie with user's email
      res.cookie(`userEmail`, req.body.email);
      // redirect to home page
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
    const userEmail = req.cookies.userEmail; // retrieve user's email from cookies
    if (!userEmail) {
      return res.status(404).send("email not found");
    }
    const userData = await User.findOne({ email: userEmail });
    if (!userData) {
      return res.status(404).send("user not found");
    }
    // generate QR code with labels
    const qrData = `email: ${userData.email}\ncontact: ${userData.contact}\nlocation: ${userData.location}`;
    qrcode.toDataURL(qrData, (err, qrCodeUrl) => {
      if (err) {
        console.error("Error while generating QR code:", err);
        return res.status(500).send("Error while generating QR code");
      }
      // render the home template with user data and qr code
      res.render("home", { userData: userData, qrImage: qrCodeUrl });
    });
  } catch (error) {
    console.error("Error while generating QR code:", error);
    res.status(500).send("Error while generating QR code and user data");
  }
});
// add route for handling login page
app.get("/login", (req, res) => {
  res.render("login");
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
});
