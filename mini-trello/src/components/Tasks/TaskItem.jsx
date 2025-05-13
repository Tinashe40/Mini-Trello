// components/TaskItem.jsx
import React from "react";
import { Paper, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskItem = ({ task, provided, snapshot, onDelete }) => {
  return (
    <Paper
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: snapshot.isDragging ? "primary.light" : "background.paper",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
      elevation={snapshot.isDragging ? 6 : 2}
    >
      <Box>
        <Typography variant="subtitle1">{task.title}</Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
        )}
      </Box>
      {onDelete && (
        <IconButton onClick={() => onDelete(task.id)} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
};

export default TaskItem;
