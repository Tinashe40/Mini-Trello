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
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { 
  getUserProjects, 
  createProject, 
  deleteProject,
  updateProjectStatus
} from "../api/projectService";
import { AuthContext } from "../auth/AuthContext";
import { ProjectStatus } from "../enums"; // Create this enum file

const Projects = () => {
  const { user } = React.useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    description: "",
    status: ProjectStatus.ACTIVE // Default status
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(ProjectStatus.ACTIVE);

  const fetchProjects = async () => {
    try {
      if (user && user.id) {
        const res = await getUserProjects(user.id);
        setProjects(res.data);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleOpenDialog = () => {
    setForm({ 
      name: "", 
      description: "",
      status: ProjectStatus.ACTIVE
    });
    setDialogOpen(true);
  };

  const handleOpenStatusDialog = (project) => {
    setSelectedProject(project);
    setSelectedStatus(project.status);
    setStatusDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setStatusDialogOpen(false);
    setSelectedProject(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await createProject(form);
      handleCloseDialog();
      fetchProjects();
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      if (selectedProject) {
        await updateProjectStatus(
          selectedProject.id, 
          selectedStatus
        );
        handleCloseDialog();
        fetchProjects();
      }
    } catch (err) {
      console.error("Error updating status:", err);
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
        {user?.role === "ADMIN" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            New Project
          </Button>
        )}
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
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Status: {project.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small"
                  onClick={() => handleOpenStatusDialog(project)}
                >
                  Update Status
                </Button>
                
                {user?.role === "ADMIN" && (
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(project.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Project Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>New Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              label="Status"
              onChange={handleChange}
            >
              {Object.values(ProjectStatus).map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Update Project Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {Object.values(ProjectStatus).map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;