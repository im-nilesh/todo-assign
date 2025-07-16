import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error("Fetch tasks error:", err.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// ✅ GET activity logs (if using global.actionLog)
router.get("/logs", (req, res) => {
  res.json(global.actionLog || []);
});

// ✅ Smart assign route
router.post("/smart-assign/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const users = await User.find({}, "name");
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found in database" });
    }

    const userTaskCounts = await Promise.all(
      users.map(async (user) => {
        const count = await Task.countDocuments({ assignedTo: user.name });
        return { name: user.name, count };
      })
    );

    const userWithLeastTasks = userTaskCounts.reduce((min, curr) =>
      curr.count < min.count ? curr : min
    );

    task.assignedTo = userWithLeastTasks.name;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Smart assign error:", err.message);
    res.status(500).json({ message: "Smart assign failed" });
  }
});

export default router;
