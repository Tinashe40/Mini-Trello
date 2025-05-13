import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography } from "@mui/material";
import { getProjectTasks } from "../../api/taskService";

const TaskBoard = ({ projectId }) => {
  const [columns, setColumns] = useState({
    todo: { name: "To Do", tasks: [] },
    inProgress: { name: "In Progress", tasks: [] },
    done: { name: "Done", tasks: [] }
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getProjectTasks(projectId);
        const grouped = {
          todo: { name: "To Do", tasks: [] },
          inProgress: { name: "In Progress", tasks: [] },
          done: { name: "Done", tasks: [] }
        };

        tasks.forEach((task) => {
          grouped[task.status].tasks.push({
            id: task.id.toString(),
            content: task.title
          });
        });

        setColumns(grouped);
      } catch (error) {
        console.error("Failed to load tasks for board", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const [movedTask] = sourceCol.tasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.tasks.splice(destination.index, 0, movedTask);
    } else {
      destCol.tasks.splice(destination.index, 0, movedTask);
    }

    setColumns({ ...columns });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        {Object.entries(columns).map(([colId, colData]) => (
          <Droppable droppableId={colId} key={colId}>
            {(provided, snapshot) => (
              <Paper
                elevation={3}
                sx={{
                  width: 300,
                  minHeight: 400,
                  p: 2,
                  backgroundColor: snapshot.isDraggingOver ? "#f0f0f0" : "#fafafa"
                }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Typography variant="h6">{colData.name}</Typography>
                {colData.tasks.map((task, index) => (
                  <Draggable draggableId={task.id} index={index} key={task.id}>
                    {(provided, snapshot) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: snapshot.isDragging ? "primary.light" : "white",
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
