import React, { useEffect, useState } from "react";
import { getProjectTasks, deleteTaskFromProject } from "../../api/projectService";
import { Box, List, ListItem, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await getProjectTasks(projectId);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };

  const handleDelete = async (taskId) => {
    await deleteTaskFromProject(projectId, taskId);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2 }}>Tasks</Typography>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            {task.title}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;
