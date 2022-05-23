const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: "Enter the user's name"
  },
  // xp: {
  //   type: Number,
  //   required: true
  // },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  vkID: {
    type: String
  }
})

module.exports = {
  UserSchema
}