import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import AnnouncementIcon from "@mui/icons-material/Announcement";

function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  userRole,
  setUserRole,
}) {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

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
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Receipt Generator
        </Typography>
        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={() => navigate("/generate")}>
              Generate
            </Button>
            {userRole === "admin" && (
              <Button color="inherit" onClick={() => navigate("/admin")}>
                Admin
              </Button>
            )}
            <Button color="inherit" onClick={() => navigate("/history")}>
              History
            </Button>
            <Box
              sx={{ position: "relative" }}
              onMouseEnter={() => setShowContact(true)}
              onMouseLeave={() => setShowContact(false)}
            >
              <Button color="inherit">Contact</Button>
              {showContact && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.paper",
                    p: 1,
                    borderRadius: 1,
                    boxShadow: 3,
                  }}
                >
                  <Button
                    startIcon={<TelegramIcon />}
                    href="https://t.me/IDTemaplate"
                    target="_blank"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Telegram
                  </Button>
                  <Button
                    startIcon={<WhatsAppIcon />}
                    href="https://wa.me/+13473435837"
                    target="_blank"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    startIcon={<EmailIcon />}
                    href="mailto:idtemplate.psd@gmail.com"
                    target="_blank"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Mail
                  </Button>
                  {/* <Button
                    startIcon={<AnnouncementIcon />}
                    href="#" // Replace with your news link
                    sx={{ justifyContent: "flex-start" }}
                  >
                    News
                  </Button> */}
                </Box>
              )}
            </Box>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate("/generate")}>
              Generate
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
