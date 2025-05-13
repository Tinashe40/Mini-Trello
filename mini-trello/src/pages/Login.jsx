import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { login } from "../api/userService";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login: doLogin, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(data);
      doLogin(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 10, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={data.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" align="center">
          Don't have an account?
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          component={Link}
          to="/register"
          sx={{ mt: 1 }}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
