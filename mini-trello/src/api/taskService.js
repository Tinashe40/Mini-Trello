import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8083/api/tasks",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export const getProjectTasks = async (projectId) => {
  try {
    const response = await API.get(`/${projectId}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
