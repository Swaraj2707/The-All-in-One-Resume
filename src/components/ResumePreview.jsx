import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cashfreepayment from "./Cashfreepayment";
import ResumePreviewImg from '../data/Images/ResumePreviewImg.png';

const ResumePreview = () => {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists() && docSnap.data().paymentStatus === "success") {
          console.log("✅ Payment Verified:", docSnap.data().paymentStatus);
          setPaid(true);
          setLoading(false);

          // Avoid redundant navigation
          if (window.location.pathname !== "/digital-resume/1") {
            navigate("/digital-resume/1");
          }
        } else {
          console.log("❌ Payment not found.");
          setLoading(false);
          setPaid(false);
        }
      } catch (error) {
        console.error("❌ Error retrieving payment status:", error);
        setLoading(false);
        setPaid(false);
      }
    });

    return () => unsubscribe(); // Cleanup auth listener
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" position="relative">
      {/* Resume Preview */}
      <Box
        sx={{
          width: "75%",
          height: "100%",
          borderRadius: "8px",
          border: "2px solid #ccc",
          overflow: "hidden",
          position: "relative",
          filter: paid ? "none" : "blur(5px)",
          opacity: paid ? 1 : 0.8,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <img src={ResumePreviewImg} alt="Resume Preview"  />
      </Box>

      {/* Payment Button (only if not paid) */}
      {!paid && (
        <Box
          position="absolute"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <Cashfreepayment onPaymentSuccess={() => setPaid(true)} />
        </Box>
      )}
    </Box>
  );
};

export default ResumePreview;
