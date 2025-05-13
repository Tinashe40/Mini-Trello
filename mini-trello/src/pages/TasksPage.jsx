import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import TaskForm from "../components/Tasks/TaskForm";
import TaskList from "../components/Tasks/TaskList";
import TaskBoard from "../components/Tasks/TaskBoard";

const TasksPage = () => {
  const { id: projectId } = useParams();
  const [reloadFlag, setReloadFlag] = React.useState(false);
  const reloadTasks = () => setReloadFlag((prev) => !prev);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tasks for Project #{projectId}
      </Typography>
      <TaskForm projectId={projectId} onTaskAdded={reloadTasks} />
      <TaskList projectId={projectId} key={reloadFlag} />
      <TaskBoard projectId={projectId} key={reloadFlag} />
    </Container>
  );
};

export default TasksPage;
