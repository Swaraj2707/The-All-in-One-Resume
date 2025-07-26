import React from 'react';
import { TextField, Button, Box } from "@mui/material";

const SkillsInput = ({ skills, setSkills }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    setSkills(value ? value.split(",") : []); // Update the skills array
  };

  return (
    <Box>
      <TextField
        label="Skills"
        value={skills ? skills.join(", ") : ""} // Ensure skills is an array
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setSkills([])} // Clear skills
        sx={{ marginTop: "10px" }}
      >
        Clear Skills
      </Button>
    </Box>
  );
};

export default SkillsInput;
