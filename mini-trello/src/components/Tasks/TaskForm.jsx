import React, { useState } from "react";
import { addTaskToProject } from "../../api/taskService"; 
import { Box, TextField, Button, Typography } from "@mui/material";

const TaskForm = ({ projectId, onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Task title is required.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      await addTaskToProject(projectId, { title, description });
      setTitle("");
      setDescription("");
      if (onTaskAdded) onTaskAdded();
    } catch (error) {
      console.error("Failed to add task:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add New Task
      </Typography>

      <TextField
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        error={!!errorMsg && !title.trim()}
        helperText={!!errorMsg && !title.trim() ? errorMsg : ""}
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

      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Task"}
      </Button>
    </Box>
  );
};

export default TaskForm;
