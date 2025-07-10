const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      rnam: ["owner ", "manager", "member"],
      default: "owner",
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
