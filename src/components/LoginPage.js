import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Grow,
} from "@mui/material";
import { Visibility, VisibilityOff, ErrorOutline } from "@mui/icons-material";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const LoginPage = ({ dynamicNavigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      dynamicNavigation("/file-upload");
    } catch (err) {
      const rawMessage = err.message
        .replace(/auth\//g, "") // Remove "auth/"
        .replace(/Firebase\s*:\s*/i, "") // Remove "Firebase: " if present
        .replace(/\bError\b/i, "") // Remove standalone "Error"
        .replace(/[\(\).:]/g, "") // Remove parentheses, dots, colons
        .replace(/-/g, " ") // Replace hyphens with spaces
        .trim();

      // Capitalize each word properly
      const formattedMessage = rawMessage
        .split(/\s+/) // Ensure proper word splitting
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize each word
        .join(" "); // Convert array back to string

      setError(`Error - ${formattedMessage}`);

      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      dynamicNavigation("/file-upload");
    } catch (err) {
      setError(err.message);
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    }
  };

  return (
    <> 
    <Box
      sx={{
        width:'100vw',
        boxSizing: "border-box",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle, #1e3c72 0%, #2a5298 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white",
        textAlign: "center",
        padding: 2,
      }}
    >
      <Grow in={showError}>
        <Alert
          severity="error"
          icon={<ErrorOutline fontSize="large" />}
          sx={{
            position: "absolute",
            top: 20,
            width: "auto",
            maxWidth: 500,
            padding: 2,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "#fff",
            fontWeight: "bold",
            animation: "shake 0.5s",
            backdropFilter: "blur(10px)",
          }}
        >
          {error}
        </Alert>
      </Grow>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {isSignup ? "Create an Account" : "Welcome Back!"}
      </Typography>
      <Box
        sx={{
          width: "350px",
          backgroundColor: "white",
          padding: 4,
          borderRadius: "16px",
          boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.4)",
          transform: "scale(1)",
          transition: "transform 0.3s ease-in-out",
          ":hover": { transform: "scale(1.05)" },
        }}
      >
        <TextField
          placeholder="Email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2, borderRadius: "8px" }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          sx={{ mb: 2, borderRadius: "8px" }}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAuth}
          sx={{
            borderRadius: "20px",
            padding: "12px 30px",
            mb: 2,
            fontSize: "16px",
          }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleGoogleLogin}
          sx={{
            borderRadius: "20px",
            padding: "12px 30px",
            mb: 2,
            fontSize: "16px",
          }}
        >
          Sign in with Google
        </Button>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            cursor: "pointer",
            textDecoration: "underline",
            color: "#1e3c72",
          }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "New user? Sign up"}
        </Typography>
      </Box>
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: "#001f3f",
          py: 3,
          color: "white",
          width: "100vw",
          position: "absolute",
          bottom: "0px",
        }}
      >
        <Typography variant="body2">
          Need help?{" "}
          <a
            href="mailto:support@digitalresumebuilder.com"
            style={{ color: "#00BFFF" }}
          >
            Contact Support (support@digitalresumebuilder.com)
          </a>
        </Typography>
      </Box>
    </Box>
    </>
  );
};

export default LoginPage;
