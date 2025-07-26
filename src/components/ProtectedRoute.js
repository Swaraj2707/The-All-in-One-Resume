import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ResumeLoader from "./ResumeLoader";
const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsPaid(false);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setIsPaid(userSnap.data().paymentStatus === "success");
        } else {
          setIsPaid(false);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setIsPaid(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Redirect immediately if no user
  if (!loading && !user) return <Navigate to="/login" replace />;

  // Redirect non-paid users trying to access "/digital-resume/:id"
  if (!loading && !isPaid && location.pathname.startsWith("/digital-resume")) {
    return <Navigate to="/resume-preview" replace />;
  }

  // Show loading only if it's genuinely still fetching
  if (loading) return <ResumeLoader/>

  return <Outlet />;
};

export default ProtectedRoute;
