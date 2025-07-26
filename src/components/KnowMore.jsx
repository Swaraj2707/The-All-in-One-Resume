import React, { useEffect, useState, useRef } from "react";
import { Grid, Box, Typography } from "@mui/material";
import Lottie from "lottie-react";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import typingAnimation from "../data/typingAnimation.json";
import templates from "../data/templates";
import ChooseUs from "./ChooseUs";

export default function KnowMore({dynamicNavigation,user}) {
  const [isHovered, setIsHovered] = useState(false);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = imageContainerRef.current;
    if (!scrollContainer || isHovered) return;

    let scrollSpeed = 1;
    let scrollInterval = setInterval(() => {
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight
      ) {
        scrollContainer.scrollTop = 0;
      } else {
        scrollContainer.scrollBy({ top: scrollSpeed, behavior: "smooth" });
      }
    }, 50);

    return () => clearInterval(scrollInterval);
  }, [isHovered]);
  const scrollToNextSection = () => {
    document.getElementById("choose-us")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Box sx={{background: "linear-gradient(135deg, #000428, #004e92)",}}>
      <Grid
        container
        spacing={2}
        sx={{
          padding: "40px",
          
          position: "relative",
          color: "white",
          
        }}
      >
        {/* Left Section */}
        <Grid item xs={8}>
          <Grid
            container
            spacing={2}
            sx={{ p: 2, height: "100%", width: "100%" }}
          >
            {/* Header Section */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                fontWeight="bold"
                mb={2}
                sx={{
                  background: "linear-gradient(to right, #ff8c00, #ffffff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                📄 Create Your Perfect Resume
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(to right, #ff8c00, #ffffff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ✨ How to Highlight Text?
              </Typography>
            </Grid>

            {/* Help Section */}

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  width: "70%",
                  height: "80%",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                  marginTop: "-150px",
                }}
              >
                <Lottie
                  animationData={typingAnimation}
                  style={{ width: "100%", height: "100%" }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: "20%",
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "black",
                    transition: "height 0.3s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "10px",
                    cursor: "pointer",
                    "&:hover": {
                      height: "max(30%, 60%)",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    #
                    <ReactTyped
                      strings={[
                        "Enclose text within # to emphasize it in bold.",
                      ]}
                      typeSpeed={100}
                      backSpeed={50}
                      loop
                    />
                    #
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", marginBottom: "24px" }}
                  >
                    ↓
                  </Typography>
                  <Box px={6}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Enclose words or sentences within #...# in Profile
                      Summary, Responsibilities, Skills, Personal Details, and
                      Certificates to highlight them in bold.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Section (Resume Templates) */}
        <Grid item xs={12} md={3} sx={{ height: "100vh" }}>
          <Box
            sx={{
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              borderRadius: "15px",
              padding: "20px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              boxShadow: "0px 8px 20px rgba(255, 255, 255, 0.2)",
              textAlign: "center",
            }}
            ref={imageContainerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "white", marginBottom: "10px" }}
            >
              Resume Templates
            </Typography>

            {templates.map((src, index) => (
              <motion.div
                key={index}
                style={{ margin: "20px 0" }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0px 0px 15px rgba(255,255,255,0.5)",
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.img
                  src={src.thumbnail}
                  alt={`Template ${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.2)",
                    cursor: "pointer",
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Grid>

        {/* Scroll Animation */}
        <Grid
          item
          xs={12}
          sx={{
            position: "absolute",
            bottom: "100px",
            width: "100%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Box sx={{ position: "absolute", bottom: "0px" , display:'flex',flexDirection:'column',alignItems:'center', marginLeft:'-30px'}}>
                    <Typography className="scroll-arrow" onClick={scrollToNextSection} sx={{marginTop:'-10px'}}>
                      ↓
                    </Typography>
                  </Box>
        </Grid>
      </Grid>
      <Box id="choose-us">
        <ChooseUs dynamicNavigation={dynamicNavigation} user={user}/>
      </Box>
    </Box>
  );
}
