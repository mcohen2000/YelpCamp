const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const campgroundsRouter = require("./routes/campgrounds");
app.use("/campgrounds", campgroundsRouter);

app.get("/", (req, res) => {
  res.render("home");
});
// app.get("/campgrounds", async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index.ejs", { campgrounds });
// });

// app.get("/campgrounds/new", (req, res) => {
//   res.render("campgrounds/new.ejs");
// });
// app.post("/campgrounds/", async (req, res) => {
//   const newCampground = new Campground(req.body.campground);
//   await newCampground.save();
//   res.redirect(`/campgrounds/${newCampground._id}`);
// });
// app.get("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   const campground = await Campground.findById(id);
//   res.render("campgrounds/show.ejs", { campground });
// });
// app.get("/campgrounds/:id/edit", async (req, res) => {
//   const { id } = req.params;
//   const campground = await Campground.findById(id);
//   res.render("campgrounds/edit.ejs", { campground });
// });
// app.patch("/campgrounds/:id/", async (req, res) => {
//   const { id } = req.params;
//   const campground = await Campground.findByIdAndUpdate(
//     id,
//     { ...req.body.campground }
//   );
//   res.redirect(`/campgrounds/${campground._id}`);
// });
// app.delete("/campgrounds/:id/", async (req, res) => {
//   const { id } = req.params;
//   const deletedCampground = await Campground.findByIdAndDelete(id);
//   res.redirect(`/campgrounds`);
// });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
