import { Box, Typography, Grid, Divider } from "@mui/material";

export default function EducationDetails({
  educationDetails,
  color,
  divider,
  size,
  dividerHeight,
  dividerColor,
}) {
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        color={color || "textPrimary"}
        sx={{
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        Education Details
      </Typography>

      {divider && (
        <Divider
          sx={{
            height: dividerHeight || "0.5px",
            backgroundColor: dividerColor || "white",
            marginBottom: "2px",
          }}
        />
      )}

      {educationDetails.length > 0 ? (
        size === 4 ? (
          // Grid layout for size=4 (3-line format)
          <Grid container spacing={2}>
            {educationDetails.map((edu, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                      breakInside: "avoid",
                      pageBreakInside: "avoid",
                    }}
                  >
                    {edu.degree} | {edu.startYear} - {edu.endYear}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      breakInside: "avoid",
                      pageBreakInside: "avoid",
                    }}
                  >
                    {edu.school} {edu.percentage ? `- ${edu.percentage}` : ""}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Default single-line format
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {educationDetails.map((edu, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                  fontWeight: 500,
                }}
              >
                {edu.degree} | {edu.school} | {edu.startYear} - {edu.endYear}
                {edu.percentage ? ` | ${edu.percentage}` : ""}
              </Typography>
            ))}
          </Box>
        )
      ) : (
        <Typography variant="body1">
          Mention your educational qualifications in a crisp manner.
        </Typography>
      )}
    </Box>
  );
}
