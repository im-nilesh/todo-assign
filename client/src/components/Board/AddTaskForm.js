import React, { useState, useEffect } from "react";
import API from "../../utils/api"; // Adjust path if needed

const AddTaskForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: 1,
    assignedTo: "",
    status: "Todo",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users from the backend
    const fetchUsers = async () => {
      try {
        const res = await API.get("/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({ ...form, updatedAt: new Date() });
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

      {/* Dropdown of users from database */}
      <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
        <option value="">Assign to (optional)</option>
        {users.map((user) => (
          <option key={user._id} value={user.name}>
            {user.name}
          </option>
        ))}
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
