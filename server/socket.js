import Task from "./models/Task.js";

let actionLog = [];
global.actionLog = actionLog;

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🧠 Socket connected:", socket.id);

    // Update Task with conflict handling
    socket.on("update-task", async (updatedTask) => {
      try {
        const current = await Task.findById(updatedTask._id);

        if (!current) return;

        // Check for conflict
        const clientTime = new Date(updatedTask.updatedAt).getTime();
        const serverTime = new Date(current.updatedAt).getTime();

        if (clientTime < serverTime) {
          // Conflict detected
          socket.emit("conflict", {
            conflict: true,
            message: "Task was modified by another user.",
            serverTask: current,
            clientTask: updatedTask,
          });
          return;
        }

        // No conflict – proceed with update
        updatedTask.updatedAt = new Date();
        const task = await Task.findByIdAndUpdate(
          updatedTask._id,
          updatedTask,
          {
            new: true,
          }
        );

        const logEntry = {
          user: updatedTask.user || "Someone",
          title: task.title,
          action: "updated",
          timestamp: new Date(),
        };

        actionLog.unshift(logEntry);
        if (actionLog.length > 20) actionLog.pop();

        io.emit("tasks", await Task.find());
        io.emit("log", logEntry);
      } catch (err) {
        console.error("Update Task Error:", err.message);
      }
    });

    // Create Task
    socket.on("create-task", async (newTask) => {
      const task = await Task.create(newTask);
      const logEntry = {
        user: newTask.user || "Someone",
        title: task.title,
        action: "created",
        timestamp: new Date(),
      };
      actionLog.unshift(logEntry);
      if (actionLog.length > 20) actionLog.pop();
      io.emit("tasks", await Task.find());
      io.emit("log", logEntry);
    });

    // Delete Task
    socket.on("delete-task", async ({ id, user }) => {
      const task = await Task.findByIdAndDelete(id);
      const logEntry = {
        user: user || "Someone",
        title: task?.title || "Unknown",
        action: "deleted",
        timestamp: new Date(),
      };
      actionLog.unshift(logEntry);
      if (actionLog.length > 20) actionLog.pop();
      io.emit("tasks", await Task.find());
      io.emit("log", logEntry);
    });

    // Assign Task
    socket.on("assign-task", async ({ id, assignedTo, user }) => {
      const task = await Task.findByIdAndUpdate(
        id,
        { assignedTo },
        { new: true }
      );
      const logEntry = {
        user: user || "Someone",
        title: task.title,
        action: `assigned to ${assignedTo}`,
        timestamp: new Date(),
      };
      actionLog.unshift(logEntry);
      if (actionLog.length > 20) actionLog.pop();
      io.emit("tasks", await Task.find());
      io.emit("log", logEntry);
    });

    // Drag-Drop (Status Change)
    socket.on("move-task", async ({ id, status, user }) => {
      const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
      const logEntry = {
        user: user || "Someone",
        title: task.title,
        action: `moved to ${status}`,
        timestamp: new Date(),
      };
      actionLog.unshift(logEntry);
      if (actionLog.length > 20) actionLog.pop();
      io.emit("tasks", await Task.find());
      io.emit("log", logEntry);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

export default setupSocket;
