import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert
} from "@mui/material";
import { login } from "../api/userService";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login: doLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(data);
      doLogin(res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 4, border: "1px solid #ccc", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>

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
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
