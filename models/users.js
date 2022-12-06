const mongoose = require("mongoose");

/** Schema */
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    min: 3,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
});

const User = mongoose.model("User", usersSchema);
module.exports = User;
