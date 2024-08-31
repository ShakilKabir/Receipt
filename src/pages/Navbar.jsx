// src/pages/Navbar.js
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  userRole,
  setUserRole,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Receipt Generator
        </Typography>
        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={() => navigate("/")}>
              Home
            </Button>
            {userRole === "admin" && (
              <Button color="inherit" onClick={() => navigate("/admin")}>
                Admin
              </Button>
            )}
            <Button color="inherit" onClick={() => navigate("/history")}>
              History
            </Button>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
