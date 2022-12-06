const mongoose = require("mongoose");
const User = require("./models/users");
const Listing = require("./models/listing");

mongoose
  .connect("mongodb://localhost:27017/srbnb")
  .then(() => console.log("Connection open"))
  .catch((err) => console.log("Error occured ", err));

/** User Initialize data */
const seedUser = {
  name: "First User",
  email: "admin@srbnb.com",
  username: "admin",
  password: "admin",
};

/** List Initialize Data */
const seedListing = [
  {
    name: "Villa Levantar Tagaytay Thermal Pool",
    price: 100000,
    description:
      "Sharing our newly built 415 sqm modern tropical villa that is equipped with a thermal pool to enjoy swimming while enjoying the cold breeze of Tagaytay.",
    address: "Tagaytay City, Cavite, Philippines",
    author: "admin",
    comments: [
      {
        body: "First comment",
        commented_by: "admin",
      },
      {
        body: "Second comment",
        commented_by: "admin",
      },
      {
        body: "Third comment",
        commented_by: "admin",
      },
    ],
  },
  {
    name: "Treehouse de Valentine",
    price: 50000,
    description:
      "Nature and rustic luxury in one self-contained space best describes Treehouse de Valentine. Unconventional for the right reasons, this dream house is the perfect nest away from the hustle and bustle of Cebu City. ",
    address: "Balamban, Central Visayas, Philippines",
    author: "admin",
    comments: [
      {
        body: "Blah blah blahh",
        commented_by: "admin",
      },
      {
        body: "Yada yada yadahhhh",
        commented_by: "admin",
      },
      {
        body: "Hello there! This is my comment!",
        commented_by: "admin",
      },
    ],
  },
  {
    name: "Pine Needle Treehouse at Tudor in the Pines",
    price: 30000,
    description:
      "Hidden amidst the dense foliage of Baguio City’s pinewood forest, Tudor in the Pines is a remarkable estate in the Philippines compromising of seven (7) unique residences within a gated property, accommodating a maximum of 30 guests. ",
    address: "Baguio, Cordillera Administrative Region, Philippines",
    author: "admin",
    comments: [
      {
        body: "What's up!?",
        commented_by: "admin",
      },
      {
        body: "This is working!",
        commented_by: "admin",
      },
      {
        body: "Try adding comments!",
        commented_by: "admin",
      },
    ],
  },
];

/** Create user */
User.create(seedUser)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

/** Create Listing */
Listing.create(seedListing)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
