import React, { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  Avatar,
  List,
  ListItem,
} from "@mui/material";
import html2pdf from "html2pdf.js";
import EducationDetails from "../FormComponents/EducationDetails";
const DigitalProfile2 = ({ formData, dynamicNavigation, handleSubmit }) => {
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
            let y = (rect.top - parentRect.top) * scaleFactor + 33.5;

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
            doc.setTextColor('#60A5FA');
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
      margin: [20, 0, 20, 0], // Margins for top, left, bottom, right
      //autoPaging: true,
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
          //padding: "20px 40px",
          maxWidth: "800px",
          margin: "auto",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            margin:'10px 40px 20px 40px',
            //backgroundColor:'#1E3A8A'
          }}
        >
          <Box pr={2}>
            <Avatar
              alt="User Avatar"
              src={image || "/fallback-image.png"} // ✅ Uses state to update image
              sx={{
                width: 130,
                height: 130,
                cursor: "pointer",
                borderRadius: "0px",
              }} // ✅ Ensures it's clickable
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
          <Box sx={{backgroundColor:'#1E3A8A' ,flex:1 , padding :'16px'}}>
            <Typography
              variant="h4"
              color="#FFD700"
              sx={{ fontWeight: "bold",}}
              
            >
              {name || "Your Name"}
            </Typography>
            <Typography variant="h6" color="#FFD700">
              {role || "Your Role"}
            </Typography>
            <Typography variant="body2" color="#FFD700">
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
                        color:'#60A5FA'
                      }}
                    >
                      {" " + work.label || "Untitled"}
                    </a>
                  ))
                : "Add your work Id's to showcase your expertise"}
            </Typography>
          </Box>
        </Box>
        <Grid container>
          <Grid
            item
            xs={4}
            sx={{
              padding: "0px 20px 20px 40px",
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="textPrimary">
              CONTACT
            </Typography>
            <Divider
              sx={{
                height: "0.5px",
                backgroundColor: "#60A5FA",
                marginBottom: "2px",
              }}
            />
            <Typography variant="body2" color="textPrimary">
              {email || "Your Email"}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              {number || "Your Phone"}
            </Typography>
            {/* Education Section */}
            <Box sx={{ marginBottom: "10px" }}>
              <EducationDetails
                educationDetails={educationDetails}
                divider={true}
                size={4}
                dividerColor="#60A5FA"
                
              />
            </Box>
            {/* Skills Section */}
            <Box sx={{ marginBottom: "10px" }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="textPrimary"
                pt="10px"
              >
                IT SKILLS
              </Typography>
              <Divider
                sx={{
                  height: "0.5px",
                  backgroundColor: "#60A5FA",
                  marginBottom: "2px",
                }}
              />
              <Grid container>
                {skills && skills.length > 0 ? (
                  <Grid item xs={12}>
                    <List sx={{ padding: 0 }}>
                      {" "}
                      {/* Removed padding */}
                      {skills.map((skill, index) => (
                        <ListItem key={index} sx={{ padding: "0" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              breakInside: "avoid", // Prevents breaking within this line
                              pageBreakInside: "avoid",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {skill
                              .split(/(#.*?#)/)
                              .map((part, i) =>
                                part.startsWith("#") && part.endsWith("#") ? (
                                  <strong key={i}>
                                    {part.replace(/#/g, "")}
                                  </strong>
                                ) : (
                                  part
                                )
                              )}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{
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

            {/* Soft Skills */}
            <Box sx={{ marginBottom: "10px" }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="textPrimary"
                sx={{ marginTop: "20px" }} // Replaced pt with marginTop for better spacing
              >
                OTHER SKILLS
              </Typography>
              <Divider
                sx={{
                  height: "0.5px",
                  backgroundColor: "#60A5FA",
                  marginBottom: "2px",
                }}
              />
              <Grid container>
                {softSkills && softSkills.length > 0 ? (
                  <Grid item xs={12}>
                    <List sx={{ padding: 0 }}>
                      {" "}
                      {/* Removed padding */}
                      {softSkills.map((softSkill, index) => (
                        <ListItem key={index} sx={{ padding: 0 }}>
                          {" "}
                          {/* Removed padding */}
                          <Typography
                            variant="body2"
                            sx={{
                              breakInside: "avoid", // Prevents breaking within this line
                              pageBreakInside: "avoid",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {softSkill}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: "#424242" }}>
                      Add your soft skills to showcase your expertise
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
            {/* {certification} */}
            {certification && (
              <Box sx={{ marginBottom: "10px" }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="textPrimary"
                  sx={{ marginTop: "20px" }} // Replaced pt with marginTop for better spacing
                >
                  CERTIFICATES
                </Typography>
                <Divider
                  sx={{
                    height: "0.5px",
                    backgroundColor: "#60A5FA",
                    marginBottom: "2px",
                  }}
                />
                <Grid container>
                  {certification && (
                    <Grid item xs={12}>
                      <List sx={{ padding: 0 }}>
                        {certification.split("\n").map((certificate, index) => (
                          <ListItem key={index} sx={{ padding: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                breakInside: "avoid", // Prevents breaking within this line
                                pageBreakInside: "avoid",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {certificate
                                .split(/(#.*?#)/)
                                .map((part, i) =>
                                  part.startsWith("#") && part.endsWith("#") ? (
                                    <strong key={i}>
                                      {part.replace(/#/g, "")}
                                    </strong>
                                  ) : (
                                    part
                                  )
                                )}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            
          </Grid>
          <Grid item xs={8} sx={{ padding: "0px 40px 20px 20px" }}>
            {/* Profile Summary */}
            <Box sx={{ marginBottom: "10px" }}>
              <Typography variant="h6" fontWeight="bold" color="textPrimary">
                PROFILE SUMMARY
              </Typography>
              <Divider
                sx={{
                  height: "0.5px",
                  backgroundColor: "#60A5FA",
                  marginBottom: "2px",
                }}
              />
              {summary ? (
                summary.split("\n").map((value, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      color: "textPrimary",
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
                  Write a compelling profile summary about yourself. Highlight
                  your skills, achievements, and professional background in a
                  crisp manner.
                </Typography>
              )}
            </Box>
            {/* Experience Section */}

            <Typography variant="h6" fontWeight="bold" color="textPrimary">
              WORK EXPERIENCE
            </Typography>
            <Divider
              sx={{
                height: "0.5px",
                backgroundColor: "#60A5FA",
                marginBottom: "2px",
              }}
            />
            {experience && experience.length > 0 ? (
              experience.map((exp, index) => (
                <Box key={index} sx={{ marginBottom: "20px" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",

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
                    color="textSecondary"
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
                      {exp.responsibilities
                        .split("\n")
                        .map((responsibility, i) => {
                          return (
                            <Typography
                              key={i}
                              color="textPrimary"
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
                                    <strong key={i}>
                                      {part.replace(/#/g, "")}
                                    </strong>
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
                      Mention your responsibilities, achievements, and
                      contributions in this role.
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "#424242" }}>
                Add your work experience to showcase your professional journey.
              </Typography>
            )}
          </Grid>
        </Grid>
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
          variant="contained"
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

export default DigitalProfile2;
