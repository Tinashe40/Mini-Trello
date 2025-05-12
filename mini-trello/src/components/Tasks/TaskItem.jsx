import React from "react";
import { Paper, Typography } from "@mui/material";

const TaskItem = ({ task, provided, snapshot }) => {
  return (
    <Paper
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: snapshot.isDragging ? "primary.light" : "background.paper",
      }}
      elevation={snapshot.isDragging ? 6 : 2}
    >
      <Typography variant="subtitle1">{task.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {task.description}
      </Typography>
    </Paper>
  );
};

export default TaskItem;
