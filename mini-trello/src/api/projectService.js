import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8082/api/projects",
});

// Attach token to requests
API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ====== Project Endpoints ======
export const getProjects = () => API.get("/");
export const getProjectById = (id) => API.get(`/${id}`);
export const getUserProjects = (userId) => API.get(`/user/${userId}`);
export const createProject = (projectData) => API.post("/", projectData);
export const deleteProject = (id) => API.delete(`/${id}`);
export const updateProjectStatus = (id, status) => 
  API.patch(`/${id}/status?status=${status}`);

export default API;