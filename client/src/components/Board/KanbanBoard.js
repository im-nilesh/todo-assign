// KanbanBoard.jsx
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import io from "socket.io-client";
import ActivityLog from "../LogPanel/ActivityLog";
import AddTaskForm from "./AddTaskForm";
import TaskCard from "./TaskCard";

const socket = io(process.env.REACT_APP_API_URL);

const KanbanBoard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    API.get("/api/tasks").then((res) => setTasks(res.data));
    API.get("/api/tasks/logs").then((res) => setLogs(res.data));

    socket.on("tasks", (data) => setTasks(data));
    socket.on("log", (log) => setLogs((prev) => [log, ...prev.slice(0, 19)]));

    return () => {
      socket.off("tasks");
      socket.off("log");
    };
  }, []);

  const updateTask = (updatedTask) => {
    socket.emit("update-task", {
      ...updatedTask,
      user: user.name,
      updatedAt: new Date(),
    });
  };

  const handleAddTask = (task) => {
    socket.emit("create-task", {
      ...task,
      user: user.name,
      status: "Todo",
      updatedAt: new Date(),
    });
  };

  const deleteTask = (task) => {
    socket.emit("delete-task", {
      id: task._id,
      user: user.name,
    });
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

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const movedTask = tasks.find((t) => t._id === draggableId);
    if (movedTask) {
      updateTask({ ...movedTask, status: destination.droppableId });
    }
  };

  const statuses = ["Todo", "In Progress", "Done"];

  return (
    <div className="board-container">
      <button className="add-task-fab" onClick={() => setShowAdd(true)}>
        +
      </button>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AddTaskForm
              onAdd={(task) => {
                handleAddTask(task);
                setShowAdd(false);
              }}
            />
            <button
              className="close-modal-btn"
              onClick={() => setShowAdd(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="kanban-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h3>{status}</h3>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable
                        draggableId={task._id}
                        index={index}
                        key={task._id}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              boxShadow: snapshot.isDragging
                                ? "0 2px 12px rgba(0,0,0,0.3)"
                                : "none",
                              background: "white",
                              marginBottom: "8px",
                              borderRadius: "8px",
                            }}
                          >
                            <TaskCard
                              task={task}
                              onUpdate={updateTask}
                              onDelete={deleteTask}
                              smartAssign={smartAssign}
                              draggable={true}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <ActivityLog logs={logs} />
    </div>
  );
};

export default KanbanBoard;
