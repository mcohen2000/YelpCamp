const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");

const Campground = require("../models/campground")

router.use(methodOverride("_method"));

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
});

router.get("/new", (req, res) => {
  res.render("campgrounds/new.ejs");
});
router.post("/", async (req, res) => {
  const newCampground = new Campground(req.body.campground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show.ejs", { campground });
});
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit.ejs", { campground });
});
router.patch("/:id/", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});
router.delete("/:id/", async (req, res) => {
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`);
});

module.exports = router