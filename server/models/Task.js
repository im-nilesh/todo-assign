import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    assignedTo: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    priority: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true, // includes createdAt and updatedAt
    versionKey: false, // optional: disable __v version key from MongoDB
  }
);

export default mongoose.model("Task", taskSchema);
