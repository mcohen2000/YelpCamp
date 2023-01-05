const { cloudinary } = require("../cloudinary");
const fetch = require("node-fetch");
const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  // loadMap();
  res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new.ejs");
};

module.exports.createCampground = async (req, res, next) => {
  const newCampground = new Campground(req.body.campground);
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCampground.author = req.user._id;
  const convetedStr = newCampground.location.replace(/\s/g, "+");
  const geoData = await fetch(
    `https://geocode.maps.co/search?q=${convetedStr}`
  );
  const data = await geoData.json();
  newCampground.coordinates = [data[0].lat, data[0].lon];
  await newCampground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show.ejs", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit.ejs", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this campground!");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  const convetedStr = req.body.campground.location.replace(/\s/g, "+");
  const geoData = await fetch(
    `https://geocode.maps.co/search?q=${convetedStr}`
  );
  const data = await geoData.json();
  camp.coordinates = await [data[0].lat, data[0].lon];
  camp.images.push(...imgs);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await camp.save();
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  if (deletedCampground.images) {
    for (let img of deletedCampground.images) {
      if (img.filename.includes("YelpCamp/")) {
        await cloudinary.uploader.destroy(img.filename);
      }
    }
  }
  req.flash("success", "Successfully deleted campground!");
  res.redirect(`/campgrounds`);
};
