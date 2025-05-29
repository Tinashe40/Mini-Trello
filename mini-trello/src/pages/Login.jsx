import {
  Alert,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
  Box,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/userService";
import { AuthContext } from "../auth/AuthContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [credentials, setCredentials] = useState({ 
    usernameOrEmail: "", 
    password: "" 
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await login(credentials);
      contextLogin(
        {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        },
        {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role
        }
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight="600" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Sign in to continue to your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username or Email"
            name="usernameOrEmail"
            value={credentials.usernameOrEmail}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            autoFocus
          />
          
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Box mt={2} textAlign="right">
            <Button 
              component={Link} 
              to="/forgot-password" 
              variant="text" 
              size="small"
            >
              Forgot Password?
            </Button>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, py: 1.5 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="textSecondary">OR</Typography>
        </Divider>

        <Box textAlign="center">
          <Typography variant="body2" sx={{ mb: 1 }}>
            Don't have an account?
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            component={Link}
            to="/register"
            disabled={isSubmitting}
          >
            Create Account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;