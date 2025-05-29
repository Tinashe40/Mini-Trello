import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/userService";
import { AuthContext } from "../auth/AuthContext";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER"
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!userData.username || !userData.email || !userData.password) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await register(userData);
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
      setError(err.response?.data?.message || "Registration failed. Please check your details.");
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
            Create Account
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Get started with our platform
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
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
            value={userData.username}
            onChange={handleChange}
            autoFocus
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={userData.email}
            onChange={handleChange}
          />
          
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            required
            value={userData.password}
            onChange={handleChange}
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
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Account Type</InputLabel>
            <Select
              name="role"
              value={userData.role}
              label="Account Type"
              onChange={handleChange}
            >
              <MenuItem value="USER">Regular User</MenuItem>
              <MenuItem value="ADMIN">Administrator</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, py: 1.5 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="textSecondary">OR</Typography>
        </Divider>

        <Box textAlign="center">
          <Typography variant="body2" sx={{ mb: 1 }}>
            Already have an account?
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            component={Link}
            to="/login"
            disabled={isSubmitting}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
      
      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          By creating an account, you agree to our 
          <Button component={Link} to="/terms" size="small">
            Terms of Service
          </Button> and 
          <Button component={Link} to="/privacy" size="small">
            Privacy Policy
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;