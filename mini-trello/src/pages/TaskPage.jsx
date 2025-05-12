import React from "react";
import { useParams } from "react-router-dom";
import TaskList from "../components/Tasks/TaskList";
import TaskForm from "../components/Tasks/TaskForm";
import { Container, Typography } from "@mui/material";

const TasksPage = () => {
  const { id: projectId } = useParams(); 

  const [reloadFlag, setReloadFlag] = React.useState(false);
  const reloadTasks = () => setReloadFlag((prev) => !prev);

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3 }}>
        Tasks for Project #{projectId}
      </Typography>
      <TaskForm projectId={projectId} onTaskAdded={reloadTasks} />
      <TaskList projectId={projectId} key={reloadFlag} />
    </Container>
  );
};

export default TasksPage;
