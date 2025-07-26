import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";

const CashfreePayment = () => {
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadSDK = async () => {
      try {
        const instance = await load({ mode: "production" });
        setCashfree(instance);
        console.log("✅ Cashfree SDK Loaded");
      } catch (error) {
        console.error("❌ Failed to load Cashfree SDK:", error);
      }
    };
    loadSDK();
  }, []);

  useEffect(() => {
    const updatePaymentStatus = async () => {
      const formDataString = localStorage.getItem("formData");
      const formData = JSON.parse(formDataString);
      let email = formData?.email || "null"
    
      if (!user || !paymentStatus) return;
      console.log("🔄 Updating Payment Status in Firestore");

      const userRef = doc(db, "users", user.uid);
      try {
        await setDoc(
          userRef,
          {
            paymentStatus: paymentStatus,
            paymentTimestamp: new Date(),
            emailId: email,
          },
          { merge: true }
        );
        console.log("✅ Payment Status Updated in Firestore");
      } catch (error) {
        console.error("❌ Error updating payment status:", error);
      }
    };

    updatePaymentStatus();
  }, [paymentStatus, user]);
  

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus(null);
    const orderID = `ORDER_${Date.now()}`;
    setCurrentOrderId(orderID);

    try {
      const res = await fetch(`${process.env.REACT_APP_PAYMENT_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderID,
          orderAmount: 129,
          customerName: user?.displayName || "Guest",
          customerEmail: user?.email || "guest@example.com",
          customerPhone: "9999999999",
        }),
      });

      if (!res.ok) throw new Error(`❌ Server responded with status ${res.status}`);
      const data = await res.json();

      if (!data.payment_session_id) throw new Error("❌ Missing session ID");
      if (!cashfree) throw new Error("❌ Cashfree not initialized");

      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal",
      });

      pollPaymentStatus(orderID);
    } catch (err) {
      console.error("❌ Payment failed:", err);
      setPaymentStatus("error");
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (orderID) => {
    let attempts = 0;
    const maxTries = 6;

    while (attempts < maxTries) {
      try {
        const res = await fetch(`${process.env.REACT_APP_PAYMENT_URL}/verify-payment/${orderID}`);
        const data = await res.json();

        if (data.status === "success") {
          setPaymentStatus("success");
          navigate(`/payment-success?order_id=${orderID}`);
          setLoading(false);
          return;
        } else if (data.status === "failed") {
          setPaymentStatus("failed");
          setLoading(false);
          return;
        } else if (data.error?.includes("No payment details")) {
          setPaymentStatus("error");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("❌ Error polling payment:", err);
      }

      attempts++;
      await new Promise((r) => setTimeout(r, 5000));
    }

    setPaymentStatus("pending");
    setLoading(false);
  };

  return (
    <Box textAlign="center" mt={4}>
      {loading ? (
        <>
          <CircularProgress color="inherit" />
          <Typography mt={2}>Processing payment, please wait...</Typography>
        </>
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold" color="white" mb={2}>
            Unlock Your Resume
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handlePayment}
            disabled={!cashfree || loading}
          >
            {paymentStatus === "failed" ? "Retry Payment" : "Proceed to Payment"}
          </Button>
        </>
      )}
  
      {paymentStatus === "success" && (
        <Typography mt={3} color="green">
          ✅ Payment Successful! Redirecting to your resume...
        </Typography>
      )}
      {paymentStatus === "failed" && (
        <Typography mt={3} color="red">
          ❌ Payment Failed. Please try again.
        </Typography>
      )}
      {paymentStatus === "pending" && (
        <Typography mt={3} color="orange">
          ⏳ Payment is pending. You will be redirected once confirmed.
        </Typography>
      )}
      {paymentStatus === "error" && (
        <Typography mt={3} color="orange">
          ⚠️ Something went wrong. Please contact support.
        </Typography>
      )}
    </Box>
  );
  
};

export default CashfreePayment;
