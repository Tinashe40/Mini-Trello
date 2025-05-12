import { useEffect } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8082/api/projects", // ada
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await API.get("/123/tasks"); // projectId = 123
      const tasks = response.data;

      // Group tasks by status
      const grouped = {
        todo: { name: "To Do", tasks: [] },
        inProgress: { name: "In Progress", tasks: [] },
        done: { name: "Done", tasks: [] }
      };

      tasks.forEach(task => {
        grouped[task.status].tasks.push({ id: task.id.toString(), content: task.title });
      });

      setColumns(grouped);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  fetchTasks();
}, []);
export const getProjectTasks = async (projectId) => {
  try {
    const response = await API.get(`/${projectId}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};