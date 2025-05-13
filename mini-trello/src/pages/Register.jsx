import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Divider,
} from "@mui/material";
import { register } from "../api/userService";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Register = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER"
  });

  const [error, setError] = useState("");
  const { isAuthenticated, login: doLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(data);
      doLogin(res.data.token); // Auto-login after successful registration
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please check your details or try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create an Account
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
            fullWidth
            margin="normal"
            required
            value={data.username}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={data.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={data.password}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={data.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" align="center">
          Already have an account?
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          component={Link}
          to="/login"
          sx={{ mt: 1 }}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Register;
