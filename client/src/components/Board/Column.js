import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ status, tasks, onUpdate, onDelete, smartAssign }) => (
  <div className="kanban-column">
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

export default Column;
