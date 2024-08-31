// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axiosConfig";
import { TextField, Button, Box, Typography, Paper, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LoginPage = ({ setIsAuthenticated, setUserRole }) => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("/auth/login", loginData); // Adjust URL based on your API structure
        const { token } = response.data;

        // Log the received token
        console.log("Received token:", token);

        // Store the token in localStorage
        localStorage.setItem("token", token);

        // Decode token to get the user role
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("User Role:", payload.role); // Log the user role
        setUserRole(payload.role); // Set the user role in state
        setIsAuthenticated(true);

        toast.success("Login successful!");
        navigate("/"); // Redirect to the home page
    } catch (error) {
        toast.error("Invalid username or password");
    }
};

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f4f4"
    >
      <Paper elevation={3} sx={{ padding: "30px", maxWidth: "400px", width: "100%" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={loginData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={loginData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
