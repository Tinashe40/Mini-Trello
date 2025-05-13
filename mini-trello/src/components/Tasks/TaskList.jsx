import React from "react";
import {
  Box,
  List,
  ListItem,
  IconButton,
  Typography,
  CircularProgress,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useTasks from "../../hooks/useTasks";

const TaskList = ({ projectId }) => {
  const { tasks, deleteTask, loading } = useTasks(projectId);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Task List
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length > 0 ? (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                  <DeleteIcon />
                </IconButton>
              }
              sx={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <ListItemText
                primary={task.title}
                secondary={task.description || null}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No tasks found.
        </Typography>
      )}
    </Box>
  );
};

export default TaskList;
