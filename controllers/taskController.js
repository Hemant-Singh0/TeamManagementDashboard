const Task = require("../models/task");
const bcrypt = require("bcryptjs");

// Create a new Task
exports.createTask = async (req, res) => {
  try {
    const { task, assignTask } = req.body;
    const newTask = new Task({
      task,
      assignTask,
      status: "",
    });

    await newTask.save();
    await newTask.populate("assignTask", "name email role");

    res
      .status(200)
      .json({ message: "Task created successfully", Task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignTask", "name email role");

    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching Tasks", error: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    await updatedTask.populate("assignTask", "name email role");

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res
      .status(200)
      .json({ message: "Task updated successfully", Task: updatedTask });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating Task", error: err.message });
  }
};

// Soft Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting Task", error: err.message });
  }
};
