import React, { useState } from "react";
import { addTaskToProject } from "../../api/projectService";
import { Box, TextField, Button } from "@mui/material";

const TaskForm = ({ projectId, onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTaskToProject(projectId, { title, description });
      setTitle("");
      setDescription("");
      onTaskAdded();
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ mt: 2 }}
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Add Task
      </Button>
    </Box>
  );
};

export default TaskForm;
