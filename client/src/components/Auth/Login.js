import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error
    try {
      const res = await API.post("/api/auth/login", { email, password });
      login({ ...res.data.user, token: res.data.token });
      navigate("/kanban");
    } catch (err) {
      setError("Invalid credentials"); // Show error message
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      <p>
        Don't have an account?{" "}
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </p>
    </form>
  );
};

export default Login;
