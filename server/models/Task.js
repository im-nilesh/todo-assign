import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    description: String,
    assignedTo: String,
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    priority: Number,
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt
  }
);

export default mongoose.model("Task", taskSchema);
