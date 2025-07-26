import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import KnowMore from "./KnowMore";
import { motion } from "framer-motion";

// Import Google Font
import "@fontsource/orbitron"; // Modern futuristic font

const HomePage = ({ dynamicNavigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const scrollToNextSection = () => {
    document.getElementById("resume-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: "#020617", // Deep dark blue
          textAlign: "center",
          color: "white",
        }}
      >
        {/* Styles */}
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap');

          @keyframes glowPulse {
            0%, 100% { text-shadow: 0px 0px 20px #0070ff, 0px 0px 40px #002366; }
            50% { text-shadow: 0px 0px 30px #00aaff, 0px 0px 50px #0057b7; }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }

          .glow-text {
            font-family: 'Orbitron', sans-serif;
            font-size: 4.5rem;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            background: linear-gradient(90deg, #00aaff, #0070ff, #003ecb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0px 0px 30px rgba(0, 112, 255, 1), 0px 0px 50px rgba(0, 87, 183, 0.9);
            animation: glowPulse 2s infinite alternate;
          }

          .subtext {
            font-size: 1.5rem;
            font-weight: 400;
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(90deg, #0070ff, #003ecb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0px 0px 20px rgba(0, 112, 255, 0.8);
            opacity: 0.9;
          }

          .cta-button {
            transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
          }

          .cta-button:hover {
            transform: scale(1.1);
            box-shadow: 0px 0px 30px rgba(0, 87, 183, 1);
          }

          .scroll-hint {
            font-size: 1.2rem;
            opacity: 0.8;
            text-shadow: 0px 0px 15px rgba(0, 87, 183, 0.8);
            animation: glowPulse 2s infinite alternate;
          }

          .scroll-arrow {
            font-size: 2rem;
            cursor: pointer;
            animation: bounce 1.5s infinite;
            color: #0070ff;
            text-shadow: 0px 0px 15px rgba(0, 112, 255, 1);
          }
        `}
        </style>

        {/* Heading */}
        <Typography variant="h2" className="glow-text" mb={3}>
          Welcome to Digital Resume Builder
        </Typography>

        {/* Subheading */}
        <Typography variant="h6" className="subtext" mb={2}>
          Create stunning resumes with ease and sophistication.
        </Typography>

        {/* CTA Button */}
        <motion.div animate={{ y: [10, 0, 10] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Button
            variant="contained"
            onClick={() => dynamicNavigation(user ? "/form" : "/login")}
            sx={{
              mt: 5,
              borderRadius: "50px",
              padding: "12px 30px",
              fontSize: "18px",
              fontWeight: "bold",
              fontFamily: "Poppins, sans-serif",
              background: "linear-gradient(135deg, #0057b7, #002366)", // Darker Blue Gradient
              color: "white",
              boxShadow: "0px 4px 25px rgba(0, 87, 183, 1)", // Stronger Glow
              "&:hover": {
                background: "linear-gradient(135deg, #002366, #0057b7)", // Reverse Gradient
                boxShadow: "0px 6px 35px rgba(0, 87, 183, 1)", // Stronger Glow
              },
            }}
            className="cta-button"
          >
            Create Your Resume Now 🚀
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <Box sx={{ position: "absolute", bottom: "20px" }}>
          <Typography className="scroll-hint">Scroll down to learn more</Typography>
          <Typography className="scroll-arrow" onClick={scrollToNextSection}>
            ↓
          </Typography>
        </Box>
      </Box>

      {/* Next Section */}
      <Box id="resume-section">
        <KnowMore dynamicNavigation={dynamicNavigation} user={user} />
      </Box>
    </>
  );
};

export default HomePage;
