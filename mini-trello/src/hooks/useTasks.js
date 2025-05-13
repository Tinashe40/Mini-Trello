import { useState, useEffect, useCallback } from "react";
import { getProjectTasks } from "../api/taskService";
import API from "../api/taskService"; // Default API instance for generic requests
import { deleteTaskFromProject } from "../api/taskService"; 

/**
 * Custom hook for managing tasks within a specific project.
 * @param {string|number} projectId - The ID of the project whose tasks are being managed.
 */
const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches all tasks for the given project.
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjectTasks(projectId);
      setTasks(data);
    } catch (error) {
      console.error(`[useTasks] Failed to fetch tasks for project ${projectId}:`, error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Updates a task with new data.
   * @param {string|number} taskId - ID of the task to update
   * @param {Object} updatedData - Fields to update
   */
  const updateTask = async (taskId, updatedData) => {
    try {
      await API.put(`/${projectId}/tasks/${taskId}`, updatedData);
      await fetchTasks(); // Refresh after update
    } catch (error) {
      console.error(`[useTasks] Error updating task ${taskId}:`, error);
      throw error;
    }
  };

  /**
   * Deletes a task and refreshes the task list.
   * @param {string|number} taskId - ID of the task to delete
   */
  const deleteTask = async (taskId) => {
    try {
      await deleteTaskFromProject(projectId, taskId);
      await fetchTasks();
    } catch (error) {
      console.error(`[useTasks] Error deleting task ${taskId}:`, error);
      throw error;
    }
  };
  /**
   * Creates a new task in the project.
   * @param {Object} taskData - Data for the new task
   */
  const createTask = async (taskData) => {
    try {
      await API.post(`/${projectId}/tasks`, taskData);
      await fetchTasks(); // Refresh after creation
    } catch (error) {
      console.error(`[useTasks] Error creating task:`, error);
      throw error;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    deleteTask,
    updateTask,
    createTask,
    reload: fetchTasks,
  };
};

export default useTasks;
