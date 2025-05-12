import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";
import { Paper, Typography, Box } from "@mui/material";

const TaskColumn = ({ status, tasks }) => {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            p: 2,
            width: 300,
            minHeight: 500,
            backgroundColor: snapshot.isDraggingOver ? "grey.100" : "grey.50",
            mr: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>{status}</Typography>
          <Box>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                provided={provided.draggableProps ? {
                  ...provided.draggableProps,
                  draggableProps: { ...provided.draggableProps },
                } : {}}
                snapshot={{ isDragging: false }}
              />
            ))}
            {provided.placeholder}
          </Box>
        </Paper>
      )}
    </Droppable>
  );
};

export default TaskColumn;
