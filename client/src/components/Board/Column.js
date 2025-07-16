import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ status, tasks, onUpdate, smartAssign }) => {
  const handleDrop = (e) => {
    const id = e.dataTransfer.getData("taskId");
    onUpdate({ ...tasks.find((t) => t._id === id), status });
  };

  return (
    <div
      className="kanban-column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h3>{status}</h3>
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
