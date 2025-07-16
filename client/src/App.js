import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import KanbanBoard from "./components/Board/KanbanBoard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./styles.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/kanban"
          element={
            <DndProvider backend={HTML5Backend}>
              <KanbanBoard />
            </DndProvider>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
