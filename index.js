const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/users");
const Listing = require("./models/listing");
const { urlEncoded } = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const bodyParser = require("body-parser");

/** Connect to mongoose */
mongoose
  .connect("mongodb://localhost:27017/srbnb")
  .then(() => console.log("Connection open"))
  .catch((err) => console.log("Error occured ", err));

// set view template
app.set("view engine", "ejs");
// Set view
app.set("views", path.join(__dirname, "/views"));
// Set public
app.use(express.static(path.join(__dirname, "/public")));
// Set method override
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
/** Set session (Yes, I studied express session to apply in this project, as I am not satisfied with the isLogged in approach hehe...)
 * Reference: https://codeforgeek.com/manage-session-using-node-js-express-4/
 */
app.use(
  session({ secret: "secretsession", saveUninitialized: true, resave: true })
);
// Set body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Global Variable
 */
let warningData = { type: "", message: "" };
let pageTitle = "";

/**
 * Page Stat code
 * 1 = Successfully Created
 * 2 = Username does not exist
 * 3 = Incorrect password
 */

/** Get stat parameter from User signup and Login */
const pageStat = (req, res, next) => {
  const query = req.query;
  if (query.stat == 1) {
    warningData.type = "success";
    warningData.message = "<b>SUCCESS!</b> You may now login";
  } else if (query.stat == 2) {
    warningData.type = "warning";
    warningData.message =
      "<b>WARNING!</b> Invalid Username or Password. Please try again.";
  }
  next();
};

// Home page
app.get("/", async (req, res) => {
  pageTitle = "Home";
  const isLoggedUser = req.session.username;
  const listData = await Listing.find({});
  console.log(listData);
  res.render("index", { pageTitle, isLoggedUser, listData });
});
// Add List page
app.get("/listing/add", (req, res) => {
  pageTitle = "Add Listing";
  const isLoggedUser = req.session.username;
  const data = "";
  if (isLoggedUser) {
    // Get user data
    res.render("listing/listing_update", { pageTitle, isLoggedUser, data });
  } else {
    // If not logged in, redirect to home
    res.redirect("/");
  }
});
// Edit List page
app.get("/listing/edit/:id", async (req, res) => {
  pageTitle = "Edit Listing";
  const { id } = req.params;
  const data = await Listing.findById(id);
  console.log(data);
  const isLoggedUser = req.session.username;
  if (isLoggedUser) {
    // Get user data
    res.render("listing/listing_update", { pageTitle, isLoggedUser, data });
  } else {
    // If not logged in, redirect to home
    res.redirect("/");
  }
});
// Edit Listing Save
app.put("/listing/edit/:id", async (req, res) => {
  const { id } = req.params;
  const updateListing = await Listing.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/listing/view/${id}`);
});
// Delete Listing
app.delete("/listing/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deleteListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});
// Add Comments to Listing
app.post("/listing/comments/add/:id", async (req, res) => {
  const { id } = req.params;
  const updateComment = await Listing.findByIdAndUpdate(id, {
    $push: { comments: req.body },
  });
  res.redirect(`/listing/view/${id}`);
});
// View List Page By Product
app.get("/listing/view/:id", async (req, res) => {
  pageTitle = "View Listing";
  const { id } = req.params;
  const data = await Listing.findById(id);
  const isLoggedUser = req.session.username;
  res.render("listing/listing_view", { pageTitle, isLoggedUser, data });
});
// View List Page
app.get("/listing", async (req, res) => {
  pageTitle = "View All Listing";
  const isLoggedUser = req.session.username;
  const list_data = await Listing.find({ author: isLoggedUser });
  if (isLoggedUser) {
    // Get user data
    res.render("listing", { pageTitle, isLoggedUser, list_data });
  } else {
    // If not logged in, redirect to home
    res.redirect("/");
  }
});
// Add List page Check
app.post("/listing/add", async (req, res) => {
  const listing = new Listing(req.body);
  await listing.save();
  res.redirect(`/listing/view/${listing._id}`);
});
// Admin page
app.get("/admin", async (req, res) => {
  pageTitle = "Admin";
  const isLoggedUser = req.session.username;
  if (isLoggedUser) {
    // Get user data
    const userData = await User.findOne({ username: isLoggedUser });
    res.render("admin", { pageTitle, isLoggedUser, userData });
  } else {
    // If not logged in, redirect to home
    res.redirect("/");
  }
});
// Signup page
app.get("/signup", (req, res) => {
  pageTitle = "Sign Up";
  const isLoggedUser = req.session.username;
  const query = req.query;
  res.render("signup", { pageTitle, query, isLoggedUser });
});
// Submit registration
app.post("/user/add", async (req, res) => {
  const newUser = User(req.body);
  const { username, email, name } = req.body;
  const checkIfExist = await User.find({ username });
  if (checkIfExist.length) {
    // Show error
    res.redirect(
      `/signup?username=${username}&name=${name}&email=${email}&err=uexist`
    );
  } else {
    // Save user
    await newUser.save();
    res.redirect("/login?stat=1");
  }
});

// Verify login
app.post("/login/check", async (req, res) => {
  const { loginUsername, loginPassword } = req.body;
  const checkUser = await User.find({
    username: loginUsername,
    password: loginPassword,
  });
  if (!checkUser.length) {
    res.redirect("/login?stat=2");
  } else {
    // Set the session
    req.session.username = checkUser[0].username;
    res.redirect("/admin");
  }
});

// Login page
app.get("/login", pageStat, (req, res) => {
  pageTitle = "Login";
  const query = req.query;
  const isLoggedUser = req.session.username;
  res.render("Login", { pageTitle, warningData, query, isLoggedUser });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// Error 404
app.use((req, res) => {
  res.status(404).send("Invalid page");
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
