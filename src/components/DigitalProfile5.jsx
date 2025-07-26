import React, { useRef, useState } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import { jsPDF } from "jspdf";
import EducationDetails from "../FormComponents/EducationDetails";
const DigitalProfile5 = ({ formData, dynamicNavigation, handleSubmit }) => {
  const {
    name,
    email,
    number,
    summary,
    skills,
    experience,
    workIds,
    role,
    softSkills,
    educationDetails,
    certification,
    itSkills,
    personalDetails,
  } = formData;
  const resumeRef = useRef();
  const [image, setImage] = useState("/static/images/avatar/1.jpg");
  const handleDownload = async () => {
    const pdf = new jsPDF("p", "px", "a4");

    const element = resumeRef.current;
    if (!element) return;

    // Hide links temporarily
    element.querySelectorAll("a").forEach((link) => {
      link.style.visibility = "hidden";
    });

    // Capture element size dynamically
    const originalWidth = element.scrollWidth;
    const originalHeight = element.scrollHeight;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const scaleFactor = pageWidth / originalWidth;

    await pdf.html(element, {
      callback: function (doc) {
        setTimeout(() => {
          const links = element.querySelectorAll("a");
          const parentRect = element.getBoundingClientRect();
          links.forEach((link) => {
            const text = link.textContent || "";
            const href = link.href;
            const rect = link.getBoundingClientRect();

            let x = (rect.left - parentRect.left) * scaleFactor;
            let y = (rect.top - parentRect.top) * scaleFactor + 18.5;

            // 🔹 Fix multi-page positioning
            let pageNumber = Math.floor(y / pageHeight) + 1;

            // ✅ Force links onto the first page if y is within range
            if (y < pageHeight) {
              pageNumber = 1;
            }

            let adjustedY = y % pageHeight; // Reset y per page

            if (pageNumber > 1) {
              while (doc.internal.pages.length < pageNumber) {
                doc.addPage();
              }
              doc.setPage(pageNumber);
            } else {
              doc.setPage(1);
            }

            console.log(
              `Adding Link: ${text} on Page ${pageNumber} at (${x}, ${adjustedY})`
            );
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 255);
            doc.textWithLink(text, x, adjustedY, { url: href });
          });

          doc.save("Resume.pdf");
        }, 500);
      },

      html2canvas: {
        scale: scaleFactor, // Fixes zoom issue
        useCORS: true,
        logging: false,
        dpi: 96,
        width: originalWidth,
        height: originalHeight,
      },
      margin: [10, 0, 20, 0], // Margins for top, left, bottom, right
      autoPaging: true, // Ensures multi-page support
    });

    // Restore links after rendering
    setTimeout(() => {
      element.querySelectorAll("a").forEach((link) => {
        link.style.visibility = "visible";
      });
      dynamicNavigation("/thank-you");
    }, 1000);
  };

  return (
    <>
      <Box
        ref={resumeRef}
        id="resume-container"
        sx={{
          padding: "0px 20px 20px 20px",
          maxWidth: "800px",
          margin: "auto",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header Section */}
        <Box>
          <Box
            sx={{
              textAlign: "center",
              backgroundColor: "#BDC9AD",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              borderRadius: "12px",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {name || "Your Name"}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {role || "Your Role"}
              </Typography>
            </Box>
            <Box paddingTop={"5px"}>
              <Box>
                <Typography variant="body1">
                  {number || "Your Phone"}
                  {" | "}

                  {email || "Your Email"}
                </Typography>
              </Box>
              <Typography>
                {Boolean(workIds.length)
                  ? workIds.map((work, index) => (
                      <a
                        key={index}
                        href={work.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginRight: "5px",
                        }}
                      >
                        {work.label || "Untitled"}
                      </a>
                    ))
                  : "Add your work Id's to showcase your expertise"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Profile Summary */}
        <Box sx={{ p: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="#5F6D3D">
              Professional Summary
            </Typography>
            {summary ? (
              summary.split("\n").map((value, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    breakInside: "avoid", // Prevents breaking within this line
                    pageBreakInside: "avoid",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {value
                    .split(/(#.*?#)/)
                    .map((part, i) =>
                      part.startsWith("#") && part.endsWith("#") ? (
                        <strong key={i}>{part.replace(/#/g, "")}</strong>
                      ) : (
                        part
                      )
                    )}
                </Typography>
              ))
            ) : (
              <Typography variant="body1">
                Write a compelling profile summary about yourself. Highlight
                your skills, achievements, and professional background in a
                crisp manner.
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Experience Section */}

          <Typography
            variant="h6"
            fontWeight="bold"
            color="#5F6D3D"
            sx={{
              breakInside: "avoid", // Prevents breaking within this line
              pageBreakInside: "avoid",
            }}
          >
            Work Experience
          </Typography>
          {experience && experience.length > 0 ? (
            experience.map((exp, index) => (
              <Box key={index}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#5F6D3D"
                  sx={{
                    breakInside: "avoid", // Prevents breaking within this line
                    pageBreakInside: "avoid",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {index + 1}. {exp.company || "Your Company"} (
                  {exp.location || "Location"})
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: "italic",
                    breakInside: "avoid", // Prevents breaking within this line
                    pageBreakInside: "avoid",
                  }}
                >
                  {exp.role || "Your Role"} | {exp.fromDate || "Start Date"} -{" "}
                  {exp.current ? "Present" : exp.toDate || "End Date"}
                </Typography>

                {/* Display responsibilities with individual line protection */}
                {exp.responsibilities ? (
                  exp.responsibilities.split("\n").map((line, index) => (
                    <Typography
                      key={index}
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        breakInside: "avoid",
                        pageBreakInside: "avoid",
                      }}
                    >
                      {line
                        .split(/(#.*?#)/)
                        .map((part, i) =>
                          part.startsWith("#") && part.endsWith("#") ? (
                            <strong key={i}>{part.replace(/#/g, "")}</strong>
                          ) : (
                            part
                          )
                        )}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body1">
                    Mention your responsibilities, achievements, and
                    contributions in this role.
                  </Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body1">
              Add your work experience to showcase your professional journey.
            </Typography>
          )}

          <Divider />

          {/* IT Skills */}

          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#5F6D3D"
              sx={{
                breakInside: "avoid", // Prevents breaking within this line
                pageBreakInside: "avoid",
              }}
            >
              IT Skills
            </Typography>
            {itSkills ? (
              itSkills.split("\n").map((line, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    breakInside: "avoid",
                    pageBreakInside: "avoid",
                  }}
                >
                  {line
                    .split(/(#.*?#)/)
                    .map((part, i) =>
                      part.startsWith("#") && part.endsWith("#") ? (
                        <strong key={i}>{part.replace(/#/g, "")}</strong>
                      ) : (
                        part
                      )
                    )}
                </Typography>
              ))
            ) : (
              <Typography variant="body1">
                Mention your IT skills like programming languages, technologies,
                tools, etc.
              </Typography>
            )}
          </Box>

          <Divider />
          {/* certification Section */}
          {certification && (
            <>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#5F6D3D"
                  sx={{
                    breakInside: "avoid", // Prevents breaking within this line
                    pageBreakInside: "avoid",
                  }}
                >
                  Certifications
                </Typography>
                {certification.split("\n").map((line, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-wrap",
                      breakInside: "avoid",
                      pageBreakInside: "avoid",
                    }}
                  >
                    {line
                      .split(/(#.*?#)/)
                      .map((part, i) =>
                        part.startsWith("#") && part.endsWith("#") ? (
                          <strong key={i}>{part.replace(/#/g, "")}</strong>
                        ) : (
                          part
                        )
                      )}
                  </Typography>
                ))}
              </Box>
            </>
          )}

          {/* <Divider /> */}
          {/* Education Section */}
          <EducationDetails
            educationDetails={educationDetails}
            color="#5F6D3D"
            dividerHeight={false}
          />

          {/* Personal Details */}
          {personalDetails && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#5F6D3D"
                  sx={{
                    breakInside: "avoid", // Prevents breaking within this line
                    pageBreakInside: "avoid",
                  }}
                >
                  Personal Details
                </Typography>
                {personalDetails.split("\n").map((line, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-wrap",
                      breakInside: "avoid",
                      pageBreakInside: "avoid",
                    }}
                  >
                    {line
                      .split(/(#.*?#)/)
                      .map((part, i) =>
                        part.startsWith("#") && part.endsWith("#") ? (
                          <strong key={i}>{part.replace(/#/g, "")}</strong>
                        ) : (
                          part
                        )
                      )}
                  </Typography>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
      {/* Buttons */}
      <Box
        sx={{
          padding: "40px",
          maxWidth: "800px",
          margin: "auto",

          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => dynamicNavigation("/form")}
          sx={{
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default DigitalProfile5;
