// hooks/useTasks.js
import { useEffect, useState, useCallback } from "react";
import { getProjectTasks, deleteTaskFromProject } from "../api/projectService";

const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjectTasks(projectId);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const deleteTask = async (taskId) => {
    await deleteTaskFromProject(projectId, taskId);
    fetchTasks(); // refresh
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, deleteTask, loading, reload: fetchTasks };
};

export default useTasks;
