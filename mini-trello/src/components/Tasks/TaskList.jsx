import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  IconButton,
  Typography,
  CircularProgress,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useTasks from "../../hooks/useTasks";
import API from "../../api/taskService";

const statusOptions = ["Pending", "In Progress", "Completed"];

const TaskList = ({ projectId }) => {
  const { tasks, deleteTask, updateTask, reload, loading } = useTasks(projectId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "Pending" });
  const [filter, setFilter] = useState("All");

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleEditOpen = (task) => {
    setSelectedTask({ ...task });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedTask(null);
  };

  const handleEditSave = async () => {
    try {
      await updateTask(selectedTask.id, selectedTask);
      handleEditClose();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async () => {
    try {
      await API.post(`/${projectId}/tasks`, newTask);
      setNewTask({ title: "", description: "", status: "Pending" });
      reload();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Task List
      </Typography>

      {/* Filter Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={filter}
          onChange={(_, newValue) => setFilter(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {["All", ...statusOptions].map((status) => (
            <Tab key={status} label={status} value={status} />
          ))}
        </Tabs>
      </Paper>

      {/* Task Creation Form */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
          maxWidth: 500,
        }}
      >
        <Typography variant="subtitle1">Add New Task</Typography>
        <TextField
          label="Title"
          name="title"
          value={newTask.title}
          onChange={handleNewTaskChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={newTask.description}
          onChange={handleNewTaskChange}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label="Status"
          name="status"
          value={newTask.status}
          onChange={handleNewTaskChange}
          select
          fullWidth
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleCreateTask}>
          Create Task
        </Button>
      </Box>

      {/* Task List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredTasks.length > 0 ? (
        <List>
          {filteredTasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <>
                  <IconButton onClick={() => handleEditOpen(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
              sx={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <ListItemText
                primary={
                  <>
                    {task.title}{" "}
                    <Chip
                      label={task.status}
                      size="small"
                      color={
                        task.status === "Completed"
                          ? "success"
                          : task.status === "In Progress"
                          ? "info"
                          : "warning"
                      }
                      sx={{ ml: 1 }}
                    />
                  </>
                }
                secondary={task.description}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No tasks match this filter.
        </Typography>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            value={selectedTask?.title || ""}
            onChange={handleFieldChange}
          />
          <TextField
            margin="dense"
            name="status"
            label="Status"
            select
            fullWidth
            value={selectedTask?.status || "Pending"}
            onChange={handleFieldChange}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;
