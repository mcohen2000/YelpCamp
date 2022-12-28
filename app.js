const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected!");
});

const app = express();
const path = require("path");

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const campgroundsRouter = require("./routes/campgrounds");
app.use("/campgrounds", campgroundsRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.use((req, res) => {
  res.status(404).send("<h1>Error: 404</h1><h2>We can't seem to find the page you're looking for.</h2>")
})
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
