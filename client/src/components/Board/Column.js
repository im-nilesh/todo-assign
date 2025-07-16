import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ status, tasks, onUpdate, onDelete, smartAssign }) => {
  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData("taskId");
    const originalStatus = e.dataTransfer.getData("taskStatus");

    if (originalStatus !== status) {
      onUpdate({ _id: taskId, status });
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div className="kanban-column" onDrop={handleDrop} onDragOver={allowDrop}>
      <h3>{status}</h3>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          smartAssign={smartAssign}
          draggable={true}
        />
      ))}
    </div>
  );
};

export default Column;
