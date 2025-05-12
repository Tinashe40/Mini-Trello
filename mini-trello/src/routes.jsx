import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import PrivateRoute from "./auth/PrivateRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/"
      element={<PrivateRoute><Dashboard /></PrivateRoute>}
    />
    <Route
      path="/projects"
      element={<PrivateRoute><Projects /></PrivateRoute>}
    />
    <Route
      path="/tasks/:projectId"
      element={<PrivateRoute><Tasks /></PrivateRoute>}
    />
  </Routes>
);

export default AppRoutes;
