import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const galaxyGradients = [
  "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  "linear-gradient(135deg, #1e3c72, #2a5298)",
  "linear-gradient(135deg, #232526, #414345)",
  "linear-gradient(135deg, #141e30, #243b55)",
  "linear-gradient(135deg, #000428, #004e92)",
];

const ThankYouPage = ({ dynamicNavigation }) => {
  const [gradientIndex, setGradientIndex] = useState(0);
  const [hoverStyles, setHoverStyles] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % galaxyGradients.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (letterIndex) => {
    setHoverStyles((prevStyles) => ({
      ...prevStyles,
      [letterIndex]: {
        transform: "translate(0, 0) scale(1)",
        transition: "transform 1s ease-out",
        textShadow: "0px 0px 10px rgba(144, 202, 249, 0.8)",
        opacity: 1,
      },
    }));
  };

  const handleMouseMove = (letterIndex) => {
    setHoverStyles((prevStyles) => ({
      ...prevStyles,
      [letterIndex]: prevStyles[letterIndex]?.transform === "translate(0, 0) scale(1)"
        ? {
            transform: `translate(${Math.random() * 300 - 150}px, ${Math.random() * 300 - 150}px) scale(1.3)`,
            transition: "transform 1s ease-out",
            textShadow: "0px 0px 20px rgba(144, 202, 249, 1)",
            opacity: 0.8,
          }
        : {
            transform: "translate(0, 0) scale(1)",
            transition: "transform 1s ease-out",
            opacity: 1,
          },
    }));
  };

  const animatedText = (text) => {
    return text.split("").map((letter, index) => (
      <span
        key={index}
        style={{
          display: "inline-block",
          marginRight: letter === " " ? "10px" : "0px",
          cursor: "pointer",
          ...hoverStyles[index],
        }}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseMove={() => handleMouseMove(index)}
      >
        {letter}
      </span>
    ));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: galaxyGradients[gradientIndex],
        color: "white",
        textAlign: "center",
        padding: "20px",
        transition: "background 4s ease-in-out",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {[...Array(100)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: "2px",
            height: "2px",
            background: "white",
            borderRadius: "50%",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
          }}
        />
      ))}

      <CheckCircleOutlineIcon
        sx={{
          fontSize: "100px",
          color: "white",
          marginBottom: "20px",
        }}
      />

      <Typography variant="h3" fontWeight="bold" mb={3}>
        {animatedText("Thank You!")}
      </Typography>

      <Typography variant="h5" mb={2}>
        {animatedText("Your resume has been successfully created!")}
      </Typography>

      <Typography variant="h6" fontStyle="italic" fontWeight="bold" mb={4}>
        {animatedText("Success is not the destination, but the journey of continuous improvement.")}
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => dynamicNavigation("/")}
        sx={{
          background: "linear-gradient(135deg, #64b5f6, #1976d2)",
          color: "white",
          borderRadius: "20px",
          padding: "10px 30px",
          fontWeight: "bold",
          boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.6)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            background: "linear-gradient(135deg, #1976d2, #64b5f6)",
            transform: "scale(1.05)",
            boxShadow: "0px 6px 20px rgba(25, 118, 210, 0.9)",
          },
        }}
      >
        Go to Homepage
      </Button>

      <Typography
        variant="h6"
        fontStyle="italic"
        fontWeight="bold"
        sx={{
          position: "absolute",
          bottom: "70px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: 0.9,
          background: "rgba(0, 0, 0, 0.5)",
          padding: "10px 20px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        No matter how much your life got messed up, it only requires one refresh to start again.
      </Typography>

      <style>
        {`
          @keyframes twinkle {
            from { opacity: 0.5; transform: scale(1); }
            to { opacity: 1; transform: scale(1.4); }
          }
        `}
      </style>
    </Box>
  );
};

export default ThankYouPage;