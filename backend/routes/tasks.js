
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// GET /api/tasks - Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Fetch tasks failed:", error.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// POST /api/tasks - Create a task
router.post("/", async (req, res) => {
  try {
    const title =
      typeof req.body.title === "string" ? req.body.title.trim() : "";

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({ title });
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task failed:", error.message);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// PATCH /api/tasks/:id - Update a task
router.patch("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const updates = {};

    if (typeof req.body.title === "string") {
      const title = req.body.title.trim();

      if (!title) {
        return res.status(400).json({
          message: "Task title cannot be empty",
        });
      }

      updates.title = title;
    }

    if (typeof req.body.completed === "boolean") {
      updates.completed = req.body.completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide a valid title or completed value",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Update task failed:", error.message);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", task });
  } catch (error) {
    console.error("Delete task failed:", error.message);
    res.status(500).json({ message: "Failed to delete task" });
  }
});
module.exports = router;