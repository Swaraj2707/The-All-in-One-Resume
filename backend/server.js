require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const { CASHFREE_APP_ID, CASHFREE_SECRET_KEY } = process.env;
const BASE_URL = "https://api.cashfree.com/pg"; // Change to production URL when deploying

// ✅ Create Payment Order
app.post("/create-order", async (req, res) => {
  try {
    const { orderId, orderAmount, customerName, customerEmail, customerPhone } = req.body;

    // Creating payment order using Cashfree API
    const sessionResponse = await axios.post(
      `${BASE_URL}/orders`,
      {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        order_meta: {
          return_url: "https://digitalresumebuilder.com/payment-success", // URL to redirect after payment
        },
        customer_details: {
          customer_id: customerPhone,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
      },
      {
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Order Created:", sessionResponse.data);
    res.json(sessionResponse.data);  // Send the response with session_id
  } catch (error) {
    console.error("❌ Cashfree API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment order creation failed", details: error.response?.data });
  }
});

// ✅ Verify Payment Status
app.get("/verify-payment/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetching the payment status using Cashfree API
    const response = await axios.get(`${BASE_URL}/orders/${orderId}/payments`, {
      headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
        "Content-Type": "application/json",
      },
    });

    // Log the entire response to verify structure
    console.log("✅ Payment Status Response:", response.data);

    // Extracting the payment status from the first object in the array
    const paymentData = response.data[0];  // Since the response is an array, access the first object

    if (paymentData) {
      const paymentStatus = paymentData.payment_status;

      // Respond based on the payment status
      if (paymentStatus === "SUCCESS") {
        res.json({
          status: "success",
          message: "Payment Successful",
          paymentDetails: paymentData,
        });
      } else if (paymentStatus === "FAILED") {
        res.json({
          status: "failed",
          message: "Payment Failed",
          paymentDetails: paymentData,
        });
      } else {
        res.json({
          status: "pending",
          message: "Payment Pending",
          paymentDetails: paymentData,
        });
      }
    } else {
      res.status(400).json({ error: "No payment details found for this order" });
    }
  } catch (error) {
    console.error("❌ Payment Verification Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to verify payment", details: error.response?.data });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
