import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import KnowMore from "./KnowMore";
import { motion } from "framer-motion"; // Animation Library

const HomePage = ({ dynamicNavigation }) => {
  const [user, setUser] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Circular Parallax Effect
  // useEffect(() => {
  //   const handleMouseMove = (event) => {
  //     const x = (event.clientX / window.innerWidth - 0.5) * 10;
  //     const y = (event.clientY / window.innerHeight - 0.5) * 10;
  //     setMousePos({ x, y });
  //   };

  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);
  const scrollToNextSection = () => {
    document
      .getElementById("resume-section")
      ?.scrollIntoView({ behavior: "smooth" });
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
          color: "white",
          textAlign: "center",
          overflowX: "hidden",
          width: "100vw",
        }}
      >
        {/* Background Animation */}
        <style>
          {`
  @keyframes twinkle {
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
  }

  @keyframes starRise {
    0% { transform: translateY(100vh); opacity: 0.5; }
    100% { transform: translateY(-5vh); opacity: 1; }
  }
@keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }

          @keyframes fadeInOut {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
 .stars {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #000428, #004e92, #00c6ff);
  animation: gradientMove 10s infinite alternate ease-in-out;
  z-index: -1;
  overflow: hidden;
}

@keyframes gradientMove {
  0% { background-position: left; }
  100% { background-position: right; }
}
@keyframes glowPulse {
      0% { box-shadow: 0px 4px 15px rgba(0, 80, 200, 0.5); }
      100% { box-shadow: 0px 8px 25px rgba(0, 120, 255, 0.8); }
    }


  .star {
    position: absolute;
    width: 3px;
    height: 3px;
    background: white;
    border-radius: 50%;
    animation: starRise 10s linear infinite, twinkle 5s infinite alternate;
  }

  .glow-text {
    text-shadow: none; /* No hover glow */
  }

  .cta-button {
    transition: transform 0.3s ease-out;
  }

  .cta-button:hover {
    transform: scale(1.1);
  }

  .scroll-hint {
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.8;
    animation: fadeInOut 2s infinite;
  }

  .scroll-arrow {
    font-size: 2rem;
    cursor: pointer;
    animation: bounce 1.5s infinite;
  }
  `}
        </style>

        {/* Slow Moving Circular Stars */}
        <div className="stars">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}vh`,
                left: `${Math.random() * 100}vw`,
                animationDuration: `${Math.random() * 10 + 8}s`,
              }}
            />
          ))}
        </div>

        {/* Text & CTA */}
        <Typography variant="h2" fontWeight="bold" mb={3} className="glow-text">
          Welcome to Digital Resume Builder
        </Typography>
        <Typography variant="h6" mb={2} className="glow-text">
          Create stunning resumes with ease and sophistication.
        </Typography>

        {/* Inspirational Quote */}
        <Typography
          variant="h5"
          fontStyle="italic"
          fontWeight="light"
          sx={{
            opacity: 0.8,
            mt: 2,
            animation: "twinkle 10s infinite alternate",
          }}
        >
          Shine like the stars, build your future with us.
        </Typography>
        <motion.div
          animate={{ y: [10, 0, 10] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Button
            variant="contained"
            onClick={() => dynamicNavigation(user ? "/file-upload" : "/login")}
            sx={{
              mt: 5,
              borderRadius: "50px",
              padding: "14px 40px",
              fontSize: "18px",
              fontWeight: "bold",
              textTransform: "none",
              position: "relative",
              background: "linear-gradient(90deg, #002244, #0055aa)",
              color: "white",
              boxShadow: "0px 6px 20px rgba(0, 80, 200, 0.5)",
              transition: "all 0.3s ease-in-out",
              animation: "glowPulse 2.5s infinite alternate",
              "&:hover": {
                background: "linear-gradient(90deg, #003366, #0077cc)",
                boxShadow: "0px 10px 35px rgba(0, 120, 255, 0.8)",
                transform: "translateY(-3px) scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.95)",
                boxShadow: "0px 4px 15px rgba(0, 100, 255, 0.8)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-4px",
                left: "-4px",
                right: "-4px",
                bottom: "-4px",
                borderRadius: "50px",
                background:
                  "linear-gradient(45deg, rgba(0, 50, 150, 0.5), rgba(0, 100, 255, 0.5))",
                zIndex: -1,
                filter: "blur(8px)",
                transition: "opacity 0.4s ease-in-out",
                opacity: 0.7,
              },
              "&:hover::before": {
                opacity: 1,
                filter: "blur(12px)",
              },
            }}
          >
            Create Your Resume Now 🚀
          </Button>
        </motion.div>

        <Box sx={{ position: "absolute", bottom: "40px" }}>
          {/* <Typography className="scroll-hint">
          Need help? Scroll down for details and support email
          </Typography> */}
          <Typography
            className="scroll-arrow"
            onClick={scrollToNextSection}
            sx={{ marginTop: "-10px" }}
          >
            ↓
          </Typography>
        </Box>
      </Box>
      <Box id="resume-section">
        <KnowMore dynamicNavigation={dynamicNavigation} user={user} />
      </Box>
    </>
  );
};

export default HomePage;
