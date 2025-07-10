const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    task: String,
    assignTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: String,
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

const Task = mongoose.model("task", taskSchema);
module.exports = Task;
