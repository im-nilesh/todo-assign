import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Column from "./Column";
import ActivityLog from "../LogPanel/ActivityLog";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const socket = io(import.meta.env.VITE_API_URL);

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    socket.on("tasks", setTasks);
    socket.on("log", (log) => setLogs((prev) => [log, ...prev.slice(0, 19)]));
    axios.get("/api/tasks").then((res) => setTasks(res.data));
    axios.get("/api/logs").then((res) => setLogs(res.data));
  }, []);

  const handleUpdate = (updatedTask) => {
    socket.emit("update-task", updatedTask);
  };

  return (
    <div className="board-container">
      {["Todo", "In Progress", "Done"].map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasks}
          onUpdate={handleUpdate}
        />
      ))}
      <ActivityLog logs={logs} />
    </div>
  );
};

export default KanbanBoard;
