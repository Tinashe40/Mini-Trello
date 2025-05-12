import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8082/api/projects",
});

// Add auth token if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProjects = () => API.get("/");
export const createProject = (projectData) => API.post("/", projectData);
export const deleteProject = (id) => API.delete(`/${id}`);
export const updateProject = (id, projectData) => API.put(`/${id}`, projectData);
export const getProjectById = (id) => API.get(`/${id}`);
export const getProjectTasks = (id) => API.get(`/${id}/tasks`);
export const addTaskToProject = (projectId, taskData) =>
  API.post(`/${projectId}/tasks`, taskData);
export const updateTaskInProject = (projectId, taskId, taskData) =>
  API.put(`/${projectId}/tasks/${taskId}`, taskData);
export const deleteTaskFromProject = (projectId, taskId) =>
  API.delete(`/${projectId}/tasks/${taskId}`);