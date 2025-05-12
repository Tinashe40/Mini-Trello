import React, { useState, useEffect } from "react";
import { 
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectService";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenDialog = (project = null) => {
    if (project) {
      setForm({ name: project.name, description: project.description });
      setEditMode(true);
      setSelectedProjectId(project.id);
    } else {
      setForm({ name: "", description: "" });
      setEditMode(false);
      setSelectedProjectId(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm({ name: "", description: "" });
    setEditMode(false);
    setSelectedProjectId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await updateProject(selectedProjectId, form);
      } else {
        await createProject(form);
      }
      handleCloseDialog();
      fetchProjects();
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleOpenDialog(project)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(project.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Project Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{editMode ? "Edit Project" : "New Project"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;
