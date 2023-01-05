const mongoose = require("mongoose");
const cities = require("./cities");
const imageCollections = require("./imageCollections");
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
    const randomPrice = Math.floor(Math.random() * 30) + 10;
    const newCampground = new Campground({
      author: "63b06c7ac5fe550f69fc8afe",
      title: `${randomArrayItem(descriptors)} ${randomArrayItem(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      coordinates: [cities[random1000].latitude, cities[random1000].longitude],
      images: [
        {
          url: `https://source.unsplash.com/collection/${randomArrayItem(imageCollections)}`,
          filename: `${randomArrayItem(imageCollections)}`,
        },
        {
          url: `https://source.unsplash.com/collection/483251`,
          filename: `${randomArrayItem(imageCollections)}`,
        },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      price: randomPrice,
    });
    await newCampground.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
