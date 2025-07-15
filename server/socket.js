import Task from "./models/Task.js";

let actionLog = [];
global.actionLog = actionLog;

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🧠 Socket connected:", socket.id);

    socket.on("update-task", async (updatedTask) => {
      const task = await Task.findByIdAndUpdate(updatedTask._id, updatedTask, {
        new: true,
      });

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
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

export default setupSocket;
