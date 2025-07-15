import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  description: String,
  assignedTo: String,
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
    default: "Todo",
  },
  priority: Number,
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Task", taskSchema);
