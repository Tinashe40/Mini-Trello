import axios from "axios";

// Axios instance for project-related API calls
const API = axios.create({
  baseURL: "http://localhost:8082/api/projects",
});

// Optional: Attach Bearer token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//
// ====== Project Endpoints ======
//

/**
 * Fetch all projects
 */
export const getProjects = () => API.get("/");

/**
 * Create a new project
 * @param {Object} projectData
 */
export const createProject = (projectData) => API.post("/", projectData);

/**
 * Delete a project by ID
 * @param {string} id
 */
export const deleteProject = (id) => API.delete(`/${id}`);

/**
 * Update an existing project
 * @param {string} id
 * @param {Object} projectData
 */
export const updateProject = (id, projectData) =>
  API.put(`/${id}`, projectData);

/**
 * Get a specific project by ID
 * @param {string} id
 */
export const getProjectById = (id) => API.get(`/${id}`);
//
// Export the configured axios instance in case it's needed elsewhere
//
export default API;
