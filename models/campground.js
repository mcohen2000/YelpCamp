const mongoose = require("mongoose");
const Review = require("./review");

const campgroundSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

campgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp){
    await Review.deleteMany({ _id: { $in: camp.reviews }})
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
