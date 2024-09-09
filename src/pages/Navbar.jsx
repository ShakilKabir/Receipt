import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse"; // For mobile dropdown collapse
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  userRole,
  setUserRole,
}) {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false); // For mobile contact dropdown

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/login");
    setDrawerOpen(false); // Close drawer after logout
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleContactToggle = () => {
    setContactOpen((prev) => !prev); // Toggle contact dropdown on mobile
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false); // Close drawer after navigation
  };

  const renderMenuItems = () => {
    if (isAuthenticated) {
      return (
        <>
          <ListItem button onClick={() => handleNavigate("/generate")}>
            <ListItemText primary="Generate" />
          </ListItem>
          {userRole === "admin" && (
            <ListItem button onClick={() => handleNavigate("/admin")}>
              <ListItemText primary="Admin" />
            </ListItem>
          )}
          <ListItem button onClick={() => handleNavigate("/history")}>
            <ListItemText primary="History" />
          </ListItem>
          <ListItem button onClick={handleContactToggle}>
            <ListItemText primary="Contact" />
          </ListItem>
          <Collapse in={contactOpen} timeout="auto" unmountOnExit>
            <Box sx={{ pl: 4 }}>
              <Button
                startIcon={<TelegramIcon />}
                href="https://t.me/IDTemaplate"
                target="_blank"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                Telegram
              </Button>
              <Button
                startIcon={<WhatsAppIcon />}
                href="https://wa.me/+13473435837"
                target="_blank"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                WhatsApp
              </Button>
              <Button
                startIcon={<EmailIcon />}
                href="mailto:idtemplate.psd@gmail.com"
                target="_blank"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                Mail
              </Button>
            </Box>
          </Collapse>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      );
    } else {
      return (
        <>
          <ListItem button onClick={() => handleNavigate("/login")}>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button onClick={handleContactToggle}>
            <ListItemText primary="Contact" />
          </ListItem>
          <Collapse in={contactOpen} timeout="auto" unmountOnExit>
            <Box sx={{ pl: 4 }}>
              <Button
                startIcon={<TelegramIcon />}
                href="https://t.me/IDTemaplate"
                target="_blank"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                Telegram
              </Button>
              <Button
                startIcon={<WhatsAppIcon />}
                href="https://wa.me/+13473435837"
                target="_blank"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                WhatsApp
              </Button>
              <Button
                startIcon={<EmailIcon />}
                href="mailto:idtemplate.psd@gmail.com"
                target="_blank"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                Mail
              </Button>
            </Box>
          </Collapse>
          <ListItem button onClick={() => handleNavigate("/generate")}>
            <ListItemText primary="Generate" />
          </ListItem>
        </>
      );
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <List>
                {renderMenuItems()}
              </List>
            </Drawer>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                textAlign: "center", // Center it for mobile
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              Receipt Generator
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                textAlign: "left", // Align left for desktop
                minWidth: "auto",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
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
                    </Box>
                  )}
                </Box>
                <Button color="inherit" onClick={() => navigate("/generate")}>
                  Generate
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
