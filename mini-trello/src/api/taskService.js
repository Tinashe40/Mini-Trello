import axios from "axios";

// Axios instance for task-related API calls
const API = axios.create({
  baseURL: "http://localhost:8083/api/tasks",
});

// Optional: Automatically attach Bearer token to each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch tasks associated with a specific project
 * @param {string} projectId - The ID of the project
 * @returns {Promise<Array>} List of tasks
 */
export const getProjectTasks = async (projectId) => {
  try {
    const response = await API.get(`/${projectId}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Delete a specific task from a project
 * @param {string} projectId - ID of the project
 * @param {string} taskId - ID of the task to be deleted
 */
export const deleteTaskFromProject = async (projectId, taskId) => {
  try {
    const response = await API.delete(`/${projectId}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
/**
 * Create a new task within a project
 * @param {string} projectId - ID of the project
 * @param {Object} taskData - Data for the new task
 */
export const createTaskInProject = async (projectId, taskData) => {
  try {
    const response = await API.post(`/${projectId}/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
  };
/**
 * Update an existing task within a project
 * @param {string} projectId - ID of the project
 * @param {string} taskId - ID of the task to be updated
 * @param {Object} taskData - Updated data for the task
 */
export const updateTaskInProject = async (projectId, taskId, taskData) => {
  try {
    const response = await API.put(`/${projectId}/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
/**
 * Fetch a specific task by its ID
 * @param {string} projectId - ID of the project
 * @param {string} taskId - ID of the task to be fetched
 */
export const getTaskById = async (projectId, taskId) => {
  try {
    const response = await API.get(`/${projectId}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

/**
 * Add a task to a specific project
 * @param {string} projectId
 * @param {Object} taskData
 */
export const addTaskToProject = (projectId, taskData) =>
  API.post(`/${projectId}/tasks`, taskData);

//
// Export the configured axios instance (optional)
//
export default API;
