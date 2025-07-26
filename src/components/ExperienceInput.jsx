import React from 'react';
import { TextField, Button, Box, Typography } from "@mui/material";

const ExperienceInput = ({ experience, setExperience }) => {
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    setExperience(newExperience); // Update experience array
  };

  const handleAddExperience = () => {
    setExperience([
      ...experience,
      { company: '', location: '', role: '', responsibilities: '' }, // Add empty experience object
    ]);
  };

  const handleRemoveExperience = (index) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience); // Remove experience at index
  };

  return (
    <Box sx={{ marginTop: "20px" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
        Work Experience
      </Typography>

      {(experience && Array.isArray(experience) && experience.length > 0) ? (
        experience.map((exp, index) => (
          <Box key={index} sx={{ marginBottom: "15px" }}>
            <TextField
              label="Company"
              name="company"
              value={exp.company || ''}
              onChange={(e) => handleChange(e, index)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              name="location"
              value={exp.location || ''}
              onChange={(e) => handleChange(e, index)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Role"
              name="role"
              value={exp.role || ''}
              onChange={(e) => handleChange(e, index)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Responsibilities"
              name="responsibilities"
              value={exp.responsibilities || ''}
              onChange={(e) => handleChange(e, index)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveExperience(index)}
              sx={{ marginTop: "10px" }}
            >
              Remove
            </Button>
          </Box>
        ))
      ) : (
        <Typography variant="body2">No experience provided.</Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddExperience}
        sx={{ marginTop: "20px" }}
      >
        Add Experience
      </Button>
    </Box>
  );
};

export default ExperienceInput;
