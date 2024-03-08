// users.js

const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/telegram");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: {
    type: String,
    default: "https://plus.unsplash.com/premium_photo-1697232652942-5b43191a4015?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8fA%3D%3D"
  },
  socketId: String,
  friends: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user"
  }],
  // Define 'post' as an array property
  posts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "post"
  }]
});

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);
