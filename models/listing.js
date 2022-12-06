const mongoose = require("mongoose");

/** Schema */
const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  comments: [
    {
      body: String,
      commented_date: { type: Date, default: Date.now },
      commented_by: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
