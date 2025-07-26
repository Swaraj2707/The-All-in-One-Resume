import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Work";

const messages = [
  "Crafting your career story...",
  "Tailoring your professional journey...",
  "Powering up your profile...",
  "Preparing something awesome...",
  "Shaping your success path..."
];

const ResumeLoader = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{
          backgroundColor: "white",
          borderRadius: "50%",
          padding: "16px",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
        }}
      >
        <WorkIcon sx={{ fontSize: 48, color: "#1e3c72" }} />
      </motion.div>

      <Typography
        variant="h6"
        color="white"
        mt={4}
        fontWeight="bold"
        sx={{ fontFamily: "Poppins, sans-serif", textAlign: "center", maxWidth: 300 }}
      >
        {message}
      </Typography>

      <CircularProgress sx={{ color: "white", mt: 3 }} />
    </Box>
  );
};

export default ResumeLoader;
