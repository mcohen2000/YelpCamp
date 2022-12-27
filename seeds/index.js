const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected!");
});
const randomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const newCampground = new Campground({
      title: `${randomArrayItem(descriptors)} ${randomArrayItem(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    });
    await newCampground.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
