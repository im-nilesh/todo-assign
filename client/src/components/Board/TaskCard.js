import React, { useRef } from "react";

const TaskCard = ({ task, onUpdate, smartAssign, draggable }) => {
  const cardRef = useRef();

  const move = (newStatus) => onUpdate({ ...task, status: newStatus });
  const assignSmart = () => onUpdate({ ...task, assignedTo: smartAssign() });

  // Animation: Card "flip" on drag
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task._id);
    cardRef.current.classList.add("dragging");
  };
  const handleDragEnd = () => {
    cardRef.current.classList.remove("dragging");
  };

  return (
    <div
      className={`task-card`}
      ref={cardRef}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <h4 className="task-title">{task.title}</h4>
      <p className="task-meta">{task.description}</p>
      <p>
        <strong>Assigned to:</strong> {task.assignedTo || "Unassigned"}
      </p>
      <button onClick={assignSmart}>Smart Assign</button>
      <div className="task-actions">
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
