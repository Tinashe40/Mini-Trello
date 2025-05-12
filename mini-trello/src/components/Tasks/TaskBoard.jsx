import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography } from "@mui/material";

const initialColumns = {
  todo: {
    name: "To Do",
    tasks: [{ id: "1", content: "Set up backend" }]
  },
  inProgress: {
    name: "In Progress",
    tasks: [{ id: "2", content: "Design dashboard" }]
  },
  done: {
    name: "Done",
    tasks: [{ id: "3", content: "Create login page" }]
  }
};

const TaskBoard = () => {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const [movedTask] = sourceCol.tasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.tasks.splice(destination.index, 0, movedTask);
      setColumns({ ...columns, [source.droppableId]: sourceCol });
    } else {
      destCol.tasks.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        {Object.entries(columns).map(([colId, colData]) => (
          <Droppable droppableId={colId} key={colId}>
            {(provided) => (
              <Paper
                elevation={3}
                sx={{ width: 300, minHeight: 400, p: 2, backgroundColor: "#f4f4f4" }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <Typography variant="h6" gutterBottom>
                  {colData.name}
                </Typography>
                {colData.tasks.map((task, index) => (
                  <Draggable draggableId={task.id} index={index} key={task.id}>
                    {(provided, snapshot) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          p: 1,
                          mb: 1,
                          backgroundColor: snapshot.isDragging ? "#cce7ff" : "#fff",
                          border: "1px solid #ccc"
                        }}
                      >
                        {task.content}
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default TaskBoard;
