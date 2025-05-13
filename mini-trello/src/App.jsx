// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Page imports
import Register from "./pages/Register";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import TasksPage from "./pages/TasksPage"; // Renamed to match usage
import Dashboard from "./pages/Dashboard";

// Component imports
import TaskBoard from "./components/Tasks/TaskBoard";
import { AuthProvider, AuthContext } from "./auth/AuthContext";

// Private route component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <Projects />
              </PrivateRoute>
            }
          />

          <Route
            path="/tasks/:projectId"
            element={
              <PrivateRoute>
                <TasksPage /> {/* Fixed from Tasks to TasksPage */}
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard /> {/* Fixed from Home to Dashboard */}
              </PrivateRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskBoard />
              </PrivateRoute>
            }
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
