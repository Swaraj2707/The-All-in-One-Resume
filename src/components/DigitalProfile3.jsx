import React, { useRef, useState } from "react";
import { Box, Typography, Grid, Divider, Button, Avatar } from "@mui/material";
import html2pdf from "html2pdf.js";
import { jsPDF } from "jspdf";
import EducationDetails from "../FormComponents/EducationDetails";
const DigitalProfile = ({ formData, dynamicNavigation, handleSubmit }) => {
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
  const [image, setImage] = useState("");
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
            let y = (rect.top - parentRect.top) * scaleFactor + 28.5;

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
      margin: [20, 0, 30, 0], // Margins for top, left, bottom, right
      autoPaging: true,
    });

    // Restore links after rendering
    setTimeout(() => {
      element.querySelectorAll("a").forEach((link) => {
        link.style.visibility = "visible";
      });
      dynamicNavigation("/thank-you");
    }, 1000);
  };

  const handleAvatarClick = () => {
    document.getElementById("avatar-upload").click(); // ✅ Triggers file input click
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // ✅ Updates Avatar with new image
    }
  };
  return (
    <>
      <Box
        ref={resumeRef}
        sx={{
          padding: "10px 40px",
          maxWidth: "800px",
          margin: "auto",
          backgroundColor: "#fdfdfd",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            marginBottom: "10px",
            backgroundColor: "aliceblue",
            position: "relative",
          }}
        >
          <Box sx={{ margin: "10px 20px", zIndex: 1 }}>
            <Avatar
              alt="User Avatar"
              src={image || "/fallback-image.png"} // ✅ Uses state to update image
              sx={{ width: 114, height: 114, cursor: "pointer" }} // ✅ Ensures it's clickable
              onClick={handleAvatarClick}
            />
            <input
              type="file"
              id="avatar-upload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </Box>
          <Box
            sx={{
              textAlign: "center",
              position: "absolute",
              width: "100%",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#3f51b5" }}
            >
              {name || "Your Name"}
            </Typography>
            <Typography variant="h6" sx={{ color: "#757575" }}>
              {role || "Your Role"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#757575" }}>
              {number || "Your Phone"} | {email || "Your Email"} |
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
                      {" " + work.label || "Untitled"}
                    </a>
                  ))
                : "Add your work Id's to showcase your expertise"}
            </Typography>
          </Box>
        </Box>

        <Divider
          sx={{
            marginBottom: "10px",
            height: "0.5px",
            backgroundColor: "#3f51b5",
          }}
        />

        {/* Profile Summary */}
        <Box sx={{ marginBottom: "10px" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#3f51b5", marginBottom: "10px" }}
          >
            Professional Summary
          </Typography>
          {summary ? (
            summary.split("\n").map((value, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: "#424242",
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
            <Typography variant="body2" sx={{ color: "#424242" }}>
              Write a compelling profile summary about yourself. Highlight your
              skills, achievements, and professional background in a crisp
              manner.
            </Typography>
          )}
        </Box>

        <Divider
          sx={{
            marginBottom: "10px",
            height: "0.5px",
            backgroundColor: "#3f51b5",
          }}
        />

        {/* Skills Section */}
        <Box sx={{ marginBottom: "10px" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              marginBottom: "10px",
              breakInside: "avoid", // Prevents breaking within this line
              pageBreakInside: "avoid",
            }}
          >
            Skill Set
          </Typography>
          <Grid container spacing={2}>
            {skills && skills.length > 0 ? (
              skills.map((skill, index) => (
                <Grid item xs={4} key={index}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#424242",
                      breakInside: "avoid", // Prevents breaking within this line
                      pageBreakInside: "avoid",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {skill}
                  </Typography>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#424242",
                    breakInside: "avoid", // Prevents breaking within this line
                    pageBreakInside: "avoid",
                  }}
                >
                  Add your skills to showcase your expertise
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider
          sx={{
            marginBottom: "10px",
            height: "0.5px",
            backgroundColor: "#3f51b5",
          }}
        />

        <Box sx={{ marginBottom: "10px" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              marginBottom: "10px",
              breakInside: "avoid", // Prevents breaking within this line
              pageBreakInside: "avoid",
            }}
          >
            Soft Skills
          </Typography>
          <Grid container spacing={2}>
            {softSkills && softSkills.length > 0 ? (
              softSkills.map((softSkill, index) => (
                <Grid item xs={4} key={index}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#424242",
                      breakInside: "avoid", // Prevents breaking within this line
                      pageBreakInside: "avoid",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {softSkill}
                  </Typography>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: "#424242" }}>
                  Add your soft skills to showcase your expertise
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider
          sx={{
            marginBottom: "10px",
            height: "0.5px",
            backgroundColor: "#3f51b5",
          }}
        />
        {/* Experience Section */}

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#3f51b5",
            marginBottom: "10px",
            breakInside: "avoid", // Prevents breaking within this line
            pageBreakInside: "avoid",
          }}
        >
          Work Experience
        </Typography>
        {experience && experience.length > 0 ? (
          experience.map((exp, index) => (
            <Box key={index} sx={{ marginBottom: "20px" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#424242",
                  breakInside: "avoid", // Prevents breaking within this line
                  pageBreakInside: "avoid",
                  whiteSpace: "pre-wrap",
                }}
              >
                {index + 1}. {exp.company || "Your Company"} (
                {exp.location || "Location"})
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  color: "#757575",
                  marginBottom: "10px",
                  breakInside: "avoid", // Prevents breaking within this line
                  pageBreakInside: "avoid",
                }}
              >
                {exp.role || "Your Role"} | {exp.fromDate || "Start Date"} -{" "}
                {exp.current ? "Present" : exp.toDate || "End Date"}
              </Typography>

              {/* Display responsibilities with individual line protection */}
              {exp.responsibilities ? (
                <Box>
                  {exp.responsibilities.split("\n").map((responsibility, i) => {
                    return (
                      <Typography
                        key={i}
                        variant="body2"
                        sx={{
                          display: "block",
                          breakInside: "avoid", // Prevents breaking within this line
                          pageBreakInside: "avoid",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {responsibility
                          .split(/(#.*?#)/)
                          .map((part, i) =>
                            part.startsWith("#") && part.endsWith("#") ? (
                              <strong key={i}>{part.replace(/#/g, "")}</strong>
                            ) : (
                              part
                            )
                          )}
                      </Typography>
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "#424242" }}>
                  Mention your responsibilities, achievements, and contributions
                  in this role.
                </Typography>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: "#424242" }}>
            Add your work experience to showcase your professional journey.
          </Typography>
        )}

        <Divider
          sx={{
            marginTop: "30px",
            marginBottom: "10px",
            height: "0.5px",
            backgroundColor: "#3f51b5",
          }}
        />
        {/* Education Section */}
        <Box sx={{ marginBottom: "10px" }}>
          <EducationDetails
            educationDetails={educationDetails}
            color="#3f51b5"
          />
        </Box>
        {certification && (
          <Divider
            sx={{
              marginBottom: "10px",
              height: "0.5px",
              backgroundColor: "#3f51b5",
            }}
          />
        )}
        {/* certification Section */}
        {certification && (
          <Box sx={{ marginBottom: "10px" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#3f51b5",
                marginBottom: "10px",
                breakInside: "avoid", // Prevents breaking within this line
                pageBreakInside: "avoid",
              }}
            >
              Certifications
            </Typography>

            {certification.split("\n").map((value, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: "#424242",
                  whiteSpace: "pre-wrap",
                  breakInside: "avoid", // Prevents breaking within this line
                  pageBreakInside: "avoid",
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
            ))}
          </Box>
        )}

        <Divider
          sx={{
            marginBottom: "10px",
            height: "0.5px",
            backgroundColor: "#3f51b5",
          }}
        />
        {/* IT Skills */}

        <Box sx={{ marginBottom: "10px" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              marginBottom: "10px",
              breakInside: "avoid", // Prevents breaking within this line
              pageBreakInside: "avoid",
            }}
          >
            IT Skills
          </Typography>
          {itSkills ? (
            itSkills.split("\n").map((value, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: "#424242",
                  whiteSpace: "pre-wrap",
                  breakInside: "avoid", // Prevents breaking within this line
                  pageBreakInside: "avoid",
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
            <Typography variant="body2" sx={{ color: "#424242" }}>
              Mention your IT skills like programming languages,technologies,
              tools, etc.
            </Typography>
          )}
        </Box>
        {personalDetails && (
          <Divider
            sx={{
              marginBottom: "10px",
              height: "0.5px",
              backgroundColor: "#3f51b5",
            }}
          />
        )}
        {/* Personal Details */}
        {personalDetails && (
          <Box sx={{ marginBottom: "10px" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#3f51b5",
                marginBottom: "10px",
                breakInside: "avoid", // Prevents breaking within this line
                pageBreakInside: "avoid",
              }}
            >
              Personal Details
            </Typography>

            {personalDetails.split("\n").map((value, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: "#424242",
                  whiteSpace: "pre-wrap",
                  breakInside: "avoid", // Prevents breaking within this line
                  pageBreakInside: "avoid",
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
            ))}
          </Box>
        )}
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

export default DigitalProfile;
