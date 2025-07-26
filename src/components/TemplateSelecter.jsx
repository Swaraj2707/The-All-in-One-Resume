import { useNavigate } from "react-router-dom";
import templates from "../data/templates";
import { Button, Box, Typography, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
const TemplateSelector = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState([true, ...Array(templates.length - 1).fill(false)]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleTemplateSelection = (id, index) => {
    const newSelectedTemplate = Array(templates.length).fill(false);
    newSelectedTemplate[index] = true;
    setSelectedTemplate(newSelectedTemplate);
    navigate(`/digital-resume/${id}`);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "center",
         //width: "100%",
          padding: "20px",
          borderBottom: "2px solid #ddd",
          position: "relative",
        }}
      >
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h4"
            sx={{
              background: "#3f51b5",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Select Your Resume Template
          </Typography>
        </Box>
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            marginRight: "20px",
            backgroundColor: "#3f51b5",
            color: "white",
            '&:hover': { backgroundColor: "#1e88e5" },
            padding: "8px",
            borderRadius: "50%",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 36 }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
          onClick={handleLogout}
          sx={{
            fontWeight: "bold",
            color: "#d32f2f",
          }}
        >
          <LogoutIcon sx={{ marginRight: "8px" }} /> Logout
        </MenuItem>
        </Menu>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          margin: "20px 0",
          width: "100%",
        }}
      >
        {templates.map((template, index) => (
          <Button key={template.id} sx={selectedTemplate[index] ? { border: "2px solid blue" } : {}}>
            <img
              height={70}
              width={70}
              src={template.thumbnail}
              alt={template.name}
              className="template-thumbnail"
              onClick={() => handleTemplateSelection(template.id, index)}
              style={{
                cursor: "pointer",
                borderRadius: "8px",
                transition: "0.3s",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              }}
            />
          </Button>
        ))}
      </Box>
    </>
  );
};

export default TemplateSelector;
