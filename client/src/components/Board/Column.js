import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ status, tasks, allTasks = [], onUpdate, smartAssign }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("taskId");

    const draggedTask = allTasks.find((t) => String(t._id) === id);
    if (!draggedTask || draggedTask.status === status) return;

    onUpdate({
      ...draggedTask,
      status,
      user: draggedTask.assignedTo || "Unassigned",
      updatedAt: new Date(),
    });
  };

  return (
    <div
      className="kanban-column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h3>{status}</h3>
      {tasks.length === 0 && <p style={{ color: "#888" }}>No tasks</p>}
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          smartAssign={smartAssign}
          draggable
        />
      ))}
    </div>
  );
};

export default Column;
