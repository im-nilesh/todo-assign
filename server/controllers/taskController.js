import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find().sort({ updatedAt: -1 });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Could not create task" });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { updatedAt, ...updates } = req.body;
  const task = await Task.findById(id);
  if (new Date(updatedAt) < task.updatedAt) {
    return res
      .status(409)
      .json({ error: "Conflict detected. Task was updated by another user." });
  }
  updates.updatedAt = new Date();
  const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
  logAction(
    "update",
    req.user?.name || "Someone",
    `Updated task "${updatedTask.title}"`
  );
  res.json(updatedTask);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

export const getLogs = async (req, res) => {
  res.json(global.actionLog?.slice(0, 20) || []);
};
