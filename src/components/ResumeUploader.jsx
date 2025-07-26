import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import Mammoth from "mammoth";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { motion } from "framer-motion";
// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const ResumeUploader = ({ setFormData, dynamicNavigation }) => {
  const [resumeData, setResumeData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleFileUpload = async (event) => {
    setError("");
    setLoading(true);
    const file = event.target.files[0];

    if (!file) {
      setError("❌ No file selected.");
      setLoading(false);
      return;
    }

    try {
      const fileType = file.name.split(".").pop().toLowerCase();
      let extractedText = "";

      if (fileType === "pdf") {
        extractedText = await extractTextFromPDF(file);
      } else if (fileType === "docx") {
        extractedText = await extractTextFromDOCX(file);
      } else {
        setError("❌ Unsupported file format. Please upload a PDF or DOCX.");
        setLoading(false);
        return;
      }

      if (!extractedText.trim()) {
        setError("⚠️ No text extracted from the resume.");
        setLoading(false);
        return;
      }

      // Process the extracted text using OpenAI API
      const structuredData = await getProfessionalResumeData(extractedText);
      if (structuredData) {
        // Retrieve existing form data from localStorage
        const existingData = JSON.parse(localStorage.getItem("formData")) || {};

        // Merge only extracted fields, keeping existing ones unchanged
        const updatedData = { ...existingData };
        Object.keys(structuredData).forEach((key) => {
          if (structuredData[key] && structuredData[key] !== "Information not provided") {
            updatedData[key] = structuredData[key];
          }
        });

        setResumeData(updatedData);
        setFormData(updatedData)
        localStorage.setItem("formData", JSON.stringify(updatedData));
        dynamicNavigation("/form");
      } else {
        setError("Error processing the resume data.");
      }
    } catch (err) {
      setError("Error processing the file.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }

      return text;
    } catch (err) {
      console.error("PDF Extraction Error:", err);
      setError("❌ Error extracting text from PDF.");
      return "";
    }
  };

  const extractTextFromDOCX = async (file) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function () {
          try {
            const { value: text } = await Mammoth.extractRawText({ arrayBuffer: this.result });
            resolve(text.trim());
          } catch (error) {
            reject("Error extracting text from DOCX.");
          }
        };
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      setError("❌ Error reading the DOCX file.");
      return "";
    }
  };

  const getProfessionalResumeData = async (extractedText) => {
    const openAIKey = process.env.REACT_APP_AI;
  
    const messages = [
      {
        role: "system",
        content: `You are a highly skilled resume parser. 
        STRICT RULES:
        - DO NOT assume missing personal data (email, phone number, etc.).
        - If an email or phone number is missing, return **"Information not available"** instead of making one up.
        - Extract details **ONLY from the provided text**, never invent information.
        - If any field is missing, do not generate fake details; return **"Information not available"** instead.
        - Experience responsibility should have minimum 5 bullet points for all experience if require generate dynamically`
      },
      {
        role: "user",
  content: `Please enhance and professionalize the extracted content. Ensure a high-level job application structure while maintaining accuracy. 
  - **Do not generate or infer missing personal data** (phone number, email, etc.). If they are missing from the extracted data, set them as an **empty string ('')**.
  - Strictly follow the format below:
  
  please note strictly follow below format and replace extracted data with placeholder else put Information not available and convert IT Skill using below format tool used, programming langauage
  Output format:
  {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "number": "Information not provided",
      "summary": "Dynamic and results-oriented Front-End Developer with over 3 years of experience in delivering high-performance web applications.
       Expertise in React.js, HTML5, CSS, JavaScript, and Mainframe technologies. Proven track record of driving business outcomes through innovative web solutions and collaborative teamwork.
       Adept at requirement gathering, technical documentation, and creating seamless user experiences.",
      "educationDetails": [
          {
              "school": "XYZ University",
              "startYear": "2016",
              "endYear": "2020",
              "percentage": "85",
              "degree": "B.Tech"
          }
      ],
      "certification": "#AZ-900#\n#SC-900#\n#Core Java#\n#Mainframe#",
      "itSkills": "• #UI Languages#: React.js, HTML5, CSS, JavaScript\n
      • #Technical Language#: Mainframe, Core Java\n
      • #Programming Language#: COBOL\n
      • #Tools Used#: VSAM",
      "personalDetails": "• #Date of Birth#: 1st January 1998\n
      • #Languages Known#: English & Hindi\n
      • #Address#: 123 Fake Street, Sample City, Country",
      "skills": [
          "HTML5",
          "CSS",
          "JavaScript",
          "React.js"
      ],
      "experience": [
          {
              "company": "TechCorp",
              "location": "Sample City",
              "role": "System Engineer",
              "responsibilities": "• Spearheaded the development and support of high-performance React applications.\n
              • Collaborated with cross-functional teams to integrate Mainframe Technology and optimize processes.\n
              • Played a key role in requirement gathering, documentation, and UI design improvements.\n
              • Developed automated tests and contributed to UI/UX improvements.",
              "fromDate": "2025-03-01",
              "toDate": "2025-03-31",
              "current": true
          },
          {
              "company": "DevTech Solutions",
              "location": "Sample City",
              "role": "Developer",
              "responsibilities": "• Developed and supported React applications for enterprise clients.\n
              • Provided technical support for Mainframe Technology and created solutions to enhance performance.\n
              • Played an active role in gathering requirements, preparing design documents, and enhancing UI functionality.",
              "fromDate": "2025-01-15",
              "toDate": "2025-04-01",
              "current": false
          }
      ],
      "workIds": [],
      "role": "Front-End Developer",
      "softSkills": [
          "Excellent Communicator",
          "Team Player",
          "Collaborative",
          "Creative Problem-Solver",
          "Innovative",
          "Empathetic"
      ]
  }`
      },
      {
        role: "assistant",
        content: extractedText
      }
    ];
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 3000,
          temperature: 0
        })
      });
  
      const data = await response.json();
  
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const resumeContent = data.choices[0].message.content;
        const parsedData = JSON.parse(resumeContent);
  
        // Handle missing fields by explicitly setting them to "Information not provided"
        const updatedResumeFields = {
          name: parsedData.name || "Information not provided",
          email: parsedData.email || "Information not provided",
          number: "+91 ",
          summary: parsedData.summary || "Information not provided",
          educationDetails: parsedData.educationDetails || "Information not provided",
          certification: parsedData.certification || "Information not provided",
          itSkills: parsedData.itSkills || "Information not provided",
          personalDetails: parsedData.personalDetails || "Information not provided",
          skills: parsedData.skills || ["Information not provided"],
          experience: parsedData.experience || ["Information not provided"],
          workIds: parsedData.workIds || [],
          role: parsedData.role || "Information not provided",
          softSkills: parsedData.softSkills || ["Information not provided"]
        };
        return updatedResumeFields;
      } else {
        console.error("Error processing OpenAI response: Missing choices");
        return null;
      }
    } catch (err) {
      console.error("OpenAI API Error:", err);
      return null;
    }
  };
  
  const handleSkip = () => {
    dynamicNavigation("/form");
  };
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle, #1e3c72 0%, #2a5298 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: 380, // Slightly wider for a balanced look
            backgroundColor: "white",
            padding: 4,
            borderRadius: "16px",
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.4)",
            textAlign: "center",
          }}
        >
          {/* Disclaimer */}
          <Alert severity="info" sx={{ mb: 2, textAlign: "left" }}>
            <Typography variant="body2">
              If you choose to upload a file, it will be processed using OpenAI’s technology to extract key details.
            </Typography>
          </Alert>
  
          <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
            Upload Your Resume
          </Typography>
  
          {/* Error or Processing Message */}
          {(loading || error) && (
            <Box mt={2}>
              {loading && (
                <Typography color="blue">
                  <CircularProgress size={20} /> Processing file...
                </Typography>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}
            </Box>
          )}
  
          {/* Buttons in Different Lines */}
          <Box mt={3}>
            <label htmlFor="resume-upload">
              <input
                type="file"
                accept=".pdf, .docx"
                id="resume-upload"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <Button
                component="span"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderRadius: "20px",
                  padding: "12px 0",
                  fontSize: "16px",
                  transition: "all 0.3s",
                  ":hover": { transform: "scale(1.05)" },
                }}
              >
                Choose File
              </Button>
            </label>
          </Box>
  
          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleSkip}
              disabled={loading}
              startIcon={<SkipNextIcon />}
              sx={{
                borderRadius: "20px",
                backgroundColor: "white",
                color: "#1e3c72",
                border: "1px solid #1e3c72",
                padding: "12px 0",
                fontSize: "16px",
                transition: "all 0.3s",
                ":hover": {
                  backgroundColor: "#1e3c72",
                  color: "white",
                  transform: "scale(1.05)",
                },
              }}
            >
              Skip
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
  
  
};

export default ResumeUploader;
