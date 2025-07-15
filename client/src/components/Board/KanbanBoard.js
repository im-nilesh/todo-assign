import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import io from "socket.io-client";
import Column from "./Column";
import ActivityLog from "../LogPanel/ActivityLog";

const socket = io(process.env.REACT_APP_API_URL);

const KanbanBoard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get("/api/tasks").then((res) => setTasks(res.data));
    API.get("/api/tasks/logs").then((res) => setLogs(res.data));

    socket.on("tasks", setTasks);
    socket.on("log", (log) => {
      setLogs((prev) => [log, ...prev.slice(0, 19)]);
    });

    return () => socket.disconnect();
  }, []);

  const updateTask = (updatedTask) => {
    socket.emit("update-task", { ...updatedTask, user: user.name });
  };

  const smartAssign = () => {
    const userCounts = {};
    tasks.forEach((t) => {
      if (t.assignedTo)
        userCounts[t.assignedTo] = (userCounts[t.assignedTo] || 0) + 1;
    });

    const leastUser = Object.entries(userCounts).sort(
      (a, b) => a[1] - b[1]
    )[0]?.[0];
    return leastUser || user.name;
  };

  return (
    <div className="board-container">
      {["Todo", "In Progress", "Done"].map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          onUpdate={updateTask}
          smartAssign={smartAssign}
        />
      ))}
      <ActivityLog logs={logs} />
    </div>
  );
};

export default KanbanBoard;
