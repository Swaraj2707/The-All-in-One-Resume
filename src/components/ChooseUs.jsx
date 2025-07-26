import React from "react";
import { Box, Typography, Grid, Paper, Slide, Button } from "@mui/material";
import { CheckCircleOutline, Security, TrendingUp, Build, Lightbulb } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function ChooseUs({ dynamicNavigation, user }) {
  const features = [
    {
      icon: <TrendingUp fontSize="large" sx={{ color: "#FFD700" }} />, 
      title: "ATS Optimized Resumes",
      description: "Our resumes are designed to pass Applicant Tracking Systems (ATS), ensuring higher visibility to recruiters.",
    },
    {
      icon: <CheckCircleOutline fontSize="large" sx={{ color: "#00FF00" }} />, 
      title: "Unlimited Downloads",
      description: "Download unlimited resumes at minimal cost without any restrictions or hidden fees.",
    },
    {
      icon: <Build fontSize="large" sx={{ color: "#00FFFF" }} />, 
      title: "Easy & User-Friendly",
      description: "Create resumes effortlessly with our simple form-based approach—no design skills needed!",
    },
    {
      icon: <Lightbulb fontSize="large" sx={{ color: "#FFA500" }} />, 
      title: "Future-Ready: AI Integration",
      description: "AI-powered resume suggestions and multiple new templates are planned based on user feedback.",
    },
    {
      icon: <Security fontSize="large" sx={{ color: "#FF4500" }} />, 
      title: "Your Privacy Matters",
      description: "We don’t store personal data in our database. Your information stays safe in your browser’s local storage.",
    },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #000428, #004e92)",
        color: "white",
        textAlign: "center",
        px: 3,
        py: 5,
        position: "relative",
        overflow: "hidden",
        boxSizing: 'border-box'
      }}
    >
      <motion.div animate={{ opacity: [0, 1], y: [-20, 0] }} transition={{ duration: 1 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #ffffff, #00bfff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)"
          }}
        >
          Why Choose Us?
        </Typography>
      </motion.div>

      <Typography variant="h6" sx={{ maxWidth: 800, opacity: 0.8, mb: 4 }}>
        We provide a seamless and efficient way to create professional resumes while ensuring your data remains private.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Slide direction="up" in timeout={index * 300 + 500}>
              <motion.div
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.4)" }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
                    transition: "transform 0.3s",
                    color: "black",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{  mt: 1 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Slide>
          </Grid>
        ))}
      </Grid>

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
      
              <style>
                {`
          @keyframes glowPulse {
            0% { box-shadow: 0px 4px 15px rgba(0, 80, 200, 0.5); }
            100% { box-shadow: 0px 8px 25px rgba(0, 120, 255, 0.8); }
          }
        `}
        </style>

      <Typography variant="body2" sx={{ mt: 4, opacity: 0.8, maxWidth: 600 }}>
        This is just the beginning! 🚀 More resume templates and AI-powered improvements will be added based on user feedback.
      </Typography>

      <Box sx={{ textAlign: "center", backgroundColor: "#001f3f", py: 2, color: "white", width: '100%', position: 'absolute', bottom: '0px' }}>
        <Typography variant="body2">
          Need help? <a href="mailto:support@digitalresumebuilder.com" style={{ color: "#00BFFF" }}>Contact Support (support@digitalresumebuilder.com)</a>
        </Typography>
      </Box>
    </Box>
  );
}
