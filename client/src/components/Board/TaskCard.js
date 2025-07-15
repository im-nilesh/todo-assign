import React from "react";

const TaskCard = ({ task, onUpdate, smartAssign }) => {
  const move = (newStatus) => onUpdate({ ...task, status: newStatus });
  const assignSmart = () => onUpdate({ ...task, assignedTo: smartAssign() });

  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p>
        <strong>Assigned to:</strong> {task.assignedTo || "Unassigned"}
      </p>
      <button onClick={assignSmart}>Smart Assign</button>
      <div className="actions">
        {task.status !== "Todo" && (
          <button onClick={() => move("Todo")}>← Todo</button>
        )}
        {task.status !== "In Progress" && (
          <button onClick={() => move("In Progress")}>↔ In Progress</button>
        )}
        {task.status !== "Done" && (
          <button onClick={() => move("Done")}>→ Done</button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
