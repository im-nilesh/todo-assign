import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getLogs,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/logs", getLogs);

export default router;
