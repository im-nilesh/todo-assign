import Task from "./models/Task.js";

let actionLog = [];
global.actionLog = actionLog;

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🧠 Socket connected:", socket.id);

    // ✅ Update Task with conflict handling (used for drag-drop too)
    socket.on("update-task", async (updatedTask) => {
      try {
        const current = await Task.findById(updatedTask._id);
        if (!current) return;

        const clientTime = new Date(updatedTask.updatedAt).getTime();
        const serverTime = new Date(current.updatedAt).getTime();

        if (clientTime < serverTime) {
          socket.emit("conflict", {
            conflict: true,
            message: "Task was modified by another user.",
            serverTask: current,
            clientTask: updatedTask,
          });
          return;
        }

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
          action: `updated`,
          timestamp: new Date(),
        };

        actionLog.unshift(logEntry);
        if (actionLog.length > 20) actionLog.pop();

        io.emit("tasks", await Task.find()); // ✅ broadcast updated list
        io.emit("log", logEntry);
      } catch (err) {
        console.error("Update Task Error:", err.message);
      }
    });

    // ✅ Create Task
    socket.on("create-task", async (newTask) => {
      try {
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
      } catch (err) {
        console.error("Create Task Error:", err.message);
      }
    });

    // ✅ Delete Task
    socket.on("delete-task", async ({ id, user }) => {
      try {
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
      } catch (err) {
        console.error("Delete Task Error:", err.message);
      }
    });

    // ✅ Assign Task
    socket.on("assign-task", async ({ id, assignedTo, user }) => {
      try {
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
      } catch (err) {
        console.error("Assign Task Error:", err.message);
      }
    });

    // ✅ Drag-Drop (optional: keep this if you support separate move event)
    socket.on("move-task", async ({ id, status, user }) => {
      try {
        const task = await Task.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
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
      } catch (err) {
        console.error("Move Task Error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

export default setupSocket;
