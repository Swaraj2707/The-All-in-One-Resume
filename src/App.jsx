import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import ResumeForm from "./components/ResumeForm";
import ThankYouPage from "./components/ThankYouPage";
import TemplateRender from "./components/TemplateRender";
import LoginPage from "./components/LoginPage";
import ConditionalLayout from "./components/ConditioanlLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import CashfreePayment from "./components/Cashfreepayment";
import ResumePreview from "./components/ResumePreview";
import "./index.css"
import ResumeUploader from "./components/ResumeUploader";
import ResumeLoader from "./components/ResumeLoader";
import PaymentSuccess from "./components/PaymentSuccess";
import ResumeBuilderForFreshers from "./components/ResumeBuilderForFreshers";
const App = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : {};
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();

  // Save formData to session storage on change
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // Authenticate User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  if (loading) return <ResumeLoader/>

  return (
    <ConditionalLayout>
      <Routes>
        <Route path="/" element={<HomePage dynamicNavigation={navigateTo} />} />
        <Route path="/blog/resume-builder-for-freshers" element={<ResumeBuilderForFreshers />} />
        {!user && <Route path="/login" element={<LoginPage dynamicNavigation={navigateTo} />} />}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
        <Route path="/file-upload" element={<ResumeUploader setFormData={setFormData} dynamicNavigation={navigateTo}/>} />
          <Route path="/form" element={<ResumeForm setFormData={setFormData} formData={formData} dynamicNavigation={navigateTo} />} />
          <Route path="/digital-resume/:id" element={<TemplateRender formData={formData} dynamicNavigation={navigateTo} />} />
          <Route path="/thank-you" element={<ThankYouPage dynamicNavigation={navigateTo} formData={formData} />} />
          <Route path="/resume-preview" element={<ResumePreview />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

        </Route>
      </Routes>
    </ConditionalLayout>
  );
};

export default App;
