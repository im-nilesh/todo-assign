import React, { useState } from "react";

const AddTaskForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: 1,
    assignedTo: "",
    status: "Todo",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd(form);
    setForm({
      title: "",
      description: "",
      priority: 1,
      assignedTo: "",
      status: "Todo",
    });
  };

  return (
    <form className="task-create-form" onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="priority"
        type="number"
        min={1}
        max={5}
        placeholder="Priority"
        value={form.priority}
        onChange={handleChange}
      />
      <input
        name="assignedTo"
        placeholder="Assign to (optional)"
        value={form.assignedTo}
        onChange={handleChange}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
